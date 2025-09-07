"use strict";
/**
 * Request Validation Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoValidation = exports.projectValidation = exports.authValidation = void 0;
exports.validateRequest = validateRequest;
const error_1 = require("./error");
function validateRequest(rules) {
    return (req, _res, next) => {
        const errors = [];
        for (const rule of rules) {
            const value = getNestedValue(req.body, rule.field);
            // Check required
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${rule.field} is required`);
                continue;
            }
            // Skip validation if not required and not provided
            if (!rule.required && (value === undefined || value === null)) {
                continue;
            }
            // Type validation
            if (rule.type) {
                if (!validateType(value, rule.type)) {
                    errors.push(`${rule.field} must be a ${rule.type}`);
                    continue;
                }
                // Additional validations based on type
                if (rule.type === 'string') {
                    if (rule.minLength && value.length < rule.minLength) {
                        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
                    }
                    if (rule.maxLength && value.length > rule.maxLength) {
                        errors.push(`${rule.field} must not exceed ${rule.maxLength} characters`);
                    }
                    if (rule.pattern && !rule.pattern.test(value)) {
                        errors.push(`${rule.field} has invalid format`);
                    }
                }
                if (rule.type === 'number') {
                    if (rule.min !== undefined && value < rule.min) {
                        errors.push(`${rule.field} must be at least ${rule.min}`);
                    }
                    if (rule.max !== undefined && value > rule.max) {
                        errors.push(`${rule.field} must not exceed ${rule.max}`);
                    }
                }
                if (rule.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errors.push(`${rule.field} must be a valid email`);
                    }
                }
                if (rule.type === 'url') {
                    try {
                        new URL(value);
                    }
                    catch {
                        errors.push(`${rule.field} must be a valid URL`);
                    }
                }
            }
            // Custom validation
            if (rule.custom) {
                const result = rule.custom(value);
                if (typeof result === 'string') {
                    errors.push(result);
                }
                else if (!result) {
                    errors.push(`${rule.field} validation failed`);
                }
            }
        }
        if (errors.length > 0) {
            return next(new error_1.AppError(errors.join(', '), 400));
        }
        next();
    };
}
function validateType(value, type) {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'array':
            return Array.isArray(value);
        case 'object':
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'email':
        case 'url':
            return typeof value === 'string';
        default:
            return false;
    }
}
function getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
        value = value?.[key];
        if (value === undefined)
            break;
    }
    return value;
}
// Common validation rules
exports.authValidation = {
    register: [
        { field: 'email', type: 'email', required: true },
        { field: 'password', type: 'string', required: true, minLength: 8 },
        { field: 'name', type: 'string', required: true, minLength: 2, maxLength: 100 }
    ],
    login: [
        { field: 'email', type: 'email', required: true },
        { field: 'password', type: 'string', required: true }
    ]
};
exports.projectValidation = {
    create: [
        { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 200 },
        { field: 'description', type: 'string', maxLength: 1000 },
        { field: 'topic', type: 'string', required: true }
    ]
};
exports.videoValidation = {
    create: [
        { field: 'projectId', type: 'string', required: true },
        { field: 'topic', type: 'string', required: true },
        { field: 'duration', type: 'number', min: 30, max: 600 },
        { field: 'targetAudience', type: 'string' }
    ]
};
