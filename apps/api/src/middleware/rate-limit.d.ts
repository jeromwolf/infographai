/**
 * Rate Limiting Middleware
 */
import { Request, Response, NextFunction } from 'express';
declare class RateLimiter {
    private store;
    private windowMs;
    private maxRequests;
    constructor(windowMs?: number, maxRequests?: number);
    private cleanup;
    middleware(): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    private getKey;
}
export declare const generalLimiter: RateLimiter;
export declare const authLimiter: RateLimiter;
export declare const apiLimiter: RateLimiter;
export declare const rateLimiter: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=rate-limit.d.ts.map