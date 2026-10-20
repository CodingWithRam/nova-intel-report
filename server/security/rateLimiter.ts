import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * In-memory sliding-window token bucket rate limiter.
 */
export class RateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private max: number;
  private message: string;
  private keyGenerator: (req: Request) => string;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.message = options.message || 'Too many requests. Please try again later.';
    this.keyGenerator = options.keyGenerator || ((req: Request) => {
      // Respect X-Forwarded-For if available
      const forwarded = (req.headers['x-forwarded-for'] as string);
      const ip = forwarded ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || '127.0.0.1');
      return ip.replace('::ffff:', '');
    });

    // Cleanup stale records periodically
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.records.entries()) {
        if (now > record.resetAt) {
          this.records.delete(key);
        }
      }
    }, Math.max(30000, this.windowMs)).unref();
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.keyGenerator(req);
      const now = Date.now();
      let record = this.records.get(key);

      if (!record || now > record.resetAt) {
        record = { count: 1, resetAt: now + this.windowMs };
        this.records.set(key, record);
        res.setHeader('X-RateLimit-Limit', this.max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, this.max - 1));
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));
        return next();
      }

      record.count++;
      const remaining = Math.max(0, this.max - record.count);
      res.setHeader('X-RateLimit-Limit', this.max);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));

      if (record.count > this.max) {
        const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
        res.setHeader('Retry-After', retryAfterSeconds);
        return res.status(429).json({
          error: this.message,
          retryAfter: retryAfterSeconds
        });
      }

      next();
    };
  }

  reset(key: string) {
    this.records.delete(key);
  }
}

// 1. Strict Login & Register Rate Limit: 10 attempts per 10 minutes per IP
export const loginRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts. Please wait 10 minutes before retrying.'
});

// 2. Sensitive OTP Request Rate Limit: 5 requests per 10 minutes
export const otpRequestRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many OTP requests. Please wait a few minutes before requesting another code.'
});

// 3. OTP Verification Rate Limit: 8 verification attempts per 10 minutes
export const otpVerifyRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 8,
  message: 'Too many invalid OTP attempts. Please wait before attempting again.'
});

// 4. Password Reset Rate Limit: 5 requests per 15 minutes
export const passwordResetRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset attempts. Please wait before retrying.'
});

// 5. File Upload Rate Limit: 20 uploads per 15 minutes
export const fileUploadRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Upload quota exceeded for this interval. Please wait before uploading more files.'
});

// 6. Expensive AI Generation Rate Limit: 40 requests per minute
export const aiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: 40,
  message: 'AI compute rate limit reached. Please wait a few moments before sending more requests.'
});

// 7. Admin Mutation Rate Limit: 60 mutations per 5 minutes
export const adminMutationRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: 'Administrative request limit reached. Please try again shortly.'
});
