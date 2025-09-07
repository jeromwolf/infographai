"use strict";
/**
 * Error Handling Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
class AppError extends Error {
    message;
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorHandler(err, req, res, _next) {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details = undefined;
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        details = err.message;
    }
    else if (err.name === 'PrismaClientKnownRequestError') {
        statusCode = 400;
        message = 'Database Error';
        // Handle specific Prisma errors
        const prismaErr = err;
        if (prismaErr.code === 'P2002') {
            message = 'Duplicate entry';
        }
        else if (prismaErr.code === 'P2025') {
            message = 'Record not found';
        }
    }
    // Log error
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        statusCode,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    // Send response
    res.status(statusCode).json({
        error: {
            message,
            details,
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack
            })
        }
    });
}
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
