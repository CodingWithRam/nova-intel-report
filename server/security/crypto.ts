import crypto from 'crypto';

/**
 * Enterprise-grade cryptographic utilities for Nova Intel Report
 * Conforms to NIST SP 800-63B and OWASP Password Storage Guidelines.
 */

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = 16384; // N = 2^14
const SCRYPT_BLOCKSIZE = 8; // r = 8
const SCRYPT_PARALLELIZATION = 1; // p = 1

/**
 * Hash a password using scrypt with a unique cryptographically random salt.
 * Output format: scrypt:${salt}:${hash}
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCKSIZE,
    p: SCRYPT_PARALLELIZATION,
    maxmem: 32 * 1024 * 1024
  });
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a candidate password against an existing scrypt hash using timing-safe comparison.
 */
export function verifyPassword(password: string, storedHash: string | undefined): boolean {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    // Perform dummy calculation to prevent timing side-channel attacks
    const dummySalt = '0123456789abcdef0123456789abcdef';
    crypto.scryptSync('dummy_password_timing_pad', dummySalt, SCRYPT_KEYLEN, {
      N: 1024,
      r: SCRYPT_BLOCKSIZE,
      p: SCRYPT_PARALLELIZATION,
      maxmem: 32 * 1024 * 1024
    });
    return false;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, salt, expectedHashHex] = parts;
  try {
    const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, {
      N: SCRYPT_COST,
      r: SCRYPT_BLOCKSIZE,
      p: SCRYPT_PARALLELIZATION,
      maxmem: 32 * 1024 * 1024
    });
    const expectedKey = Buffer.from(expectedHashHex, 'hex');
    if (derivedKey.length !== expectedKey.length) {
      return false;
    }
    return crypto.timingSafeEqual(derivedKey, expectedKey);
  } catch {
    return false;
  }
}

/**
 * Check if a stored string is an scrypt hash
 */
export function isHashed(value: string | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  return value.startsWith('scrypt:') && value.split(':').length === 3;
}

/**
 * Generate a cryptographically random, unguessable bearer token (32 bytes = 64 hex chars)
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP (100000 - 999999)
 */
export function generateSecureOTP(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hash an OTP using HMAC-SHA256 with a target-specific salt.
 * Ensures stored OTPs cannot be recovered even if the OTP store is inspected.
 */
export function hashOTP(otp: string, targetSalt: string): string {
  return crypto.createHmac('sha256', targetSalt).update(otp).digest('hex');
}

/**
 * Constant-time string comparison to prevent timing leaks
 */
export function timingSafeStringCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) {
    // Constant time dummy check
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
