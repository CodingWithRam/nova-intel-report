import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPngBuffer(width, height, isMaskable = false) {
  // RGBA buffer
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (isMaskable ? 0.38 : 0.44);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gradient background: indigo (#4f46e5) -> violet (#7c3aed) -> pink (#ec4899)
      const t = (x + y) / (width + height);
      let r = Math.round(79 + (236 - 79) * t);
      let g = Math.round(70 + (72 - 70) * t);
      let b = Math.round(229 + (153 - 229) * t);
      let a = 255;

      // Rounded corners for non-maskable icons
      if (!isMaskable) {
        const cornerR = width * 0.22;
        const inLeft = x < cornerR;
        const inRight = x > width - cornerR;
        const inTop = y < cornerR;
        const inBottom = y > height - cornerR;
        if ((inLeft || inRight) && (inTop || inBottom)) {
          const cornerCx = inLeft ? cornerR : width - cornerR;
          const cornerCy = inTop ? cornerR : height - cornerR;
          const cornerDist = Math.sqrt((x - cornerCx) ** 2 + (y - cornerCy) ** 2);
          if (cornerDist > cornerR) {
            a = 0;
          }
        }
      }

      // Compass / 4-point star in center (white)
      if (a > 0) {
        const starHalf = radius;
        // Check 4-pointed star curve: (abs(dx)/w)^0.5 + (abs(dy)/h)^0.5 <= 1 (astroid)
        const nx = Math.abs(dx) / (starHalf * 0.95);
        const ny = Math.abs(dy) / (starHalf * 0.95);
        if (nx ** 0.5 + ny ** 0.5 <= 1.0) {
          r = 255;
          g = 255;
          b = 255;
        } else if (dist < starHalf * 0.18) {
          // Inner core circle
          r = 79;
          g = 70;
          b = 229;
        } else if (Math.abs(dist - starHalf * 0.85) < 3) {
          // Thin orbital ring
          r = Math.min(255, r + 90);
          g = Math.min(255, g + 90);
          b = 255;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG structure
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // CRC32 table
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPngBuffer(192, 192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPngBuffer(512, 512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPngBuffer(512, 512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPngBuffer(180, 180, false));
console.log('Successfully generated PWA PNG icons!');
