import fs from 'fs';
import path from 'path';

export const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Safely writes data to disk using an atomic write-then-rename strategy.
 * This guarantees the target file is never left in a partially written or corrupted state
 * if the process exits or crashes mid-write.
 */
export function atomicWriteJsonSync(filePath: string, data: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tmpPath = `${filePath}.tmp.${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const jsonContent = JSON.stringify(data, null, 2);

  try {
    fs.writeFileSync(tmpPath, jsonContent, 'utf-8');
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath); } catch {}
    }
    throw err;
  }
}

/**
 * Safely reads JSON from disk. Returns fallback if file does not exist or is invalid.
 */
export function safeReadJsonSync<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    if (!raw.trim()) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading database file at ${filePath}:`, err);
    return fallback;
  }
}
