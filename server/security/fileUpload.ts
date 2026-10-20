import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB strict limit

export interface ValidatedFile {
  safeFilename: string;
  originalFilename: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  buffer: Buffer;
}

// Disallowed executable / script / active content extensions
const DISALLOWED_EXTENSIONS = new Set([
  'html', 'htm', 'xhtml', 'svg', 'xml',
  'js', 'mjs', 'cjs', 'ts', 'jsx', 'tsx',
  'php', 'phtml', 'php3', 'php4', 'php5',
  'py', 'pyc', 'pyw', 'rb', 'pl', 'cgi',
  'sh', 'bash', 'zsh', 'bat', 'cmd', 'ps1',
  'exe', 'dll', 'so', 'dylib', 'bin',
  'jar', 'war', 'ear', 'vbs', 'scr', 'msi',
  'htaccess', 'htpasswd', 'env', 'config'
]);

// Explicit allowlist of safe extensions
const ALLOWED_EXTENSIONS = new Map<string, string>([
  ['pdf', 'application/pdf'],
  ['png', 'image/png'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['webp', 'image/webp'],
  ['txt', 'text/plain'],
  ['csv', 'text/csv'],
  ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['zip', 'application/zip']
]);

/**
 * Check magic bytes signature against declared format.
 */
function verifyMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;

  switch (ext) {
    case 'pdf':
      // %PDF-
      return (
        buffer[0] === 0x25 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x44 &&
        buffer[3] === 0x46
      );

    case 'png':
      // 89 50 4E 47 0D 0A 1A 0A
      return (
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );

    case 'jpg':
    case 'jpeg':
      // FF D8 FF
      return (
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
      );

    case 'webp':
      // RIFF....WEBP
      return (
        buffer.length >= 12 &&
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
      );

    case 'docx':
    case 'zip':
      // PK.. (ZIP archive)
      return (
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
      );

    case 'txt':
    case 'csv': {
      // Text files must not contain null bytes or common binary markers
      for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
        if (buffer[i] === 0x00) return false;
      }
      return true;
    }

    default:
      return false;
  }
}

/**
 * Validate and safely decode base64 file data.
 */
export function validateUploadPayload(
  rawFileName: string,
  rawBase64Data: string
): { success: true; file: ValidatedFile } | { success: false; error: string; statusCode: number } {
  if (!rawBase64Data || typeof rawBase64Data !== 'string') {
    return { success: false, error: 'No file data received in payload.', statusCode: 400 };
  }

  // Sanitize filename and extract extension
  const sanitizedOriginal = path.basename((rawFileName || 'document.pdf').replace(/[\x00-\x1F\x7F]/g, ''));
  const ext = sanitizedOriginal.split('.').pop()?.toLowerCase() || '';

  if (!ext || DISALLOWED_EXTENSIONS.has(ext)) {
    return {
      success: false,
      error: `File format '.${ext}' is strictly prohibited for security reasons.`,
      statusCode: 400
    };
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      success: false,
      error: `Unsupported file type '.${ext}'. Supported formats: PDF, PNG, JPG, JPEG, WEBP, TXT, CSV, DOCX.`,
      statusCode: 400
    };
  }

  // Clean data URI header if present
  const base64Data = rawBase64Data.replace(/^data:[^;]+;base64,/, '').trim();
  
  // Basic base64 validation
  if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
    return { success: false, error: 'Malformed Base64 payload.', statusCode: 400 };
  }

  // Pre-check size to avoid decoding giant buffers
  const estimatedSize = Math.ceil((base64Data.length * 3) / 4);
  if (estimatedSize > MAX_FILE_SIZE_BYTES * 1.5) {
    return {
      success: false,
      error: `File payload exceeds maximum allowed size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
      statusCode: 413
    };
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
  } catch {
    return { success: false, error: 'Failed to decode base64 buffer.', statusCode: 400 };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `Decoded file size (${(buffer.length / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit.`,
      statusCode: 413
    };
  }

  if (buffer.length === 0) {
    return { success: false, error: 'Uploaded file is empty (0 bytes).', statusCode: 400 };
  }

  // Magic bytes inspection
  if (!verifyMagicBytes(buffer, ext)) {
    return {
      success: false,
      error: `File header signature does not match claimed file type '.${ext}'. Upload rejected.`,
      statusCode: 400
    };
  }

  const mimeType = ALLOWED_EXTENSIONS.get(ext) || 'application/octet-stream';
  // Generate random server-controlled filename to prevent collisions and path traversal
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  const safeFilename = `${Date.now()}-${randomSuffix}.${ext}`;

  return {
    success: true,
    file: {
      safeFilename,
      originalFilename: sanitizedOriginal,
      extension: ext,
      mimeType,
      sizeBytes: buffer.length,
      buffer
    }
  };
}
