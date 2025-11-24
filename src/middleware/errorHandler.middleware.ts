import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    const errorMessages = err.issues.map((issue: ZodIssue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    message = `Validation error: ${errorMessages.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(', ')}`;
  }

  // Handle Prisma errors
  else if (err instanceof PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'A record with this value already exists';
    }
    // Record not found
    else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }
    // Foreign key constraint failed
    else if (err.code === 'P2003') {
      statusCode = 400;
      message = 'Invalid reference to related record';
    }
  }

  // Handle Prisma validation errors
  else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // Log error
  logger.error('Error occurred:', err);

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
