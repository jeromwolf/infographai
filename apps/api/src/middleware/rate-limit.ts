/**
 * Rate Limiting Middleware
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up old entries periodically
    setInterval(() => this.cleanup(), windowMs);
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();

      if (!this.store[key] || this.store[key].resetTime < now) {
        this.store[key] = {
          count: 1,
          resetTime: now + this.windowMs
        };
        return next();
      }

      this.store[key].count++;

      if (this.store[key].count > this.maxRequests) {
        const retryAfter = Math.ceil((this.store[key].resetTime - now) / 1000);
        res.setHeader('Retry-After', retryAfter);
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', this.store[key].resetTime);

        return res.status(429).json({
          error: 'Too many requests',
          retryAfter
        });
      }

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', this.maxRequests - this.store[key].count);
      res.setHeader('X-RateLimit-Reset', this.store[key].resetTime);

      next();
    };
  }

  private getKey(req: Request): string {
    // Use user ID if authenticated, otherwise use IP
    if (req.user?.id) {
      return `user:${req.user.id}`;
    }
    return `ip:${req.ip}`;
  }
}

// Create different rate limiters for different endpoints
export const generalLimiter = new RateLimiter(60000, 100); // 100 requests per minute
export const authLimiter = new RateLimiter(900000, 5); // 5 attempts per 15 minutes
export const apiLimiter = new RateLimiter(60000, 60); // 60 requests per minute for API calls

export const rateLimiter = generalLimiter.middleware();