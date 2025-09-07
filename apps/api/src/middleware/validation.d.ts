/**
 * Request Validation Middleware
 */
import { Request, Response, NextFunction } from 'express';
export interface ValidationRule {
    field: string;
    type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'array' | 'object';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
}
export declare function validateRequest(rules: ValidationRule[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare const authValidation: {
    register: ValidationRule[];
    login: ValidationRule[];
};
export declare const projectValidation: {
    create: ValidationRule[];
};
export declare const videoValidation: {
    create: ValidationRule[];
};
//# sourceMappingURL=validation.d.ts.map