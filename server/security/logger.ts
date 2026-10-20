import { Request, Response, NextFunction } from 'express';

const SENSITIVE_KEYS = new Set([
  'password', 'newpassword', 'confirmpassword', 'adminpassword', 'coadminpassword',
  'pin', 'adminpin', 'otp', 'otpcode', 'token', 'sessiontoken', 'authorization',
  'base64data', 'imagedata', 'secret', 'apikey'
]);

/**
 * Deeply redact sensitive fields from objects before logging
 */
export function redactSensitiveData(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitiveData(item));
  }

  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      clean[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      clean[key] = redactSensitiveData(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Structured Security Logger
 */
export const logger = {
  info: (msg: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta ? redactSensitiveData(meta) : '');
  },
  warn: (msg: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta ? redactSensitiveData(meta) : '');
  },
  error: (msg: string, meta?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, meta ? redactSensitiveData(meta) : '');
  },
  audit: (action: string, details: string, meta?: any) => {
    console.log(`[AUDIT] ${new Date().toISOString()} - [${action.toUpperCase()}] ${details}`, meta ? redactSensitiveData(meta) : '');
  }
};

/**
 * Centralized API Error Handling Middleware
 * Prevents stack traces, filesystem paths, and environment secrets from leaking to clients.
 */
export function centralizedErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const correlationId = `err-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  logger.error(`Unhandled error [${correlationId}] on ${req.method} ${req.path}:`, {
    message: err.message,
    stack: err.stack,
    ip: req.ip
  });

  const statusCode = err.status || err.statusCode || 500;
  
  // Safe generic response for unexpected internal errors
  const clientMessage = statusCode >= 500
    ? 'An internal error occurred while processing your request. Please contact system support.'
    : (err.message || 'Request failed.');

  res.status(statusCode).json({
    error: clientMessage,
    correlationId
  });
}
