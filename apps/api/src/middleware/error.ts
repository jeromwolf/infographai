/**
 * Error Handling Middleware
 */

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.message;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database Error';
    
    // Handle specific Prisma errors
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      message = 'Duplicate entry';
    } else if (prismaErr.code === 'P2025') {
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

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}