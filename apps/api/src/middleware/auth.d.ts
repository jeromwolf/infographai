/**
 * Authentication Middleware
 */
import { Request, Response, NextFunction } from 'express';
interface JwtPayload {
    userId: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function generateToken(userId: string, email: string): string;
export declare function verifyToken(token: string): JwtPayload | null;
export {};
//# sourceMappingURL=auth.d.ts.map