import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { env } from '../config';
import { HTTP_STATUS_CODES, MESSAGES } from '../constants';
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
  let statusCode: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message: string = MESSAGES.INTERNAL_ERROR;

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
    const errorMessages = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    message = `${MESSAGES.VALIDATION_ERROR}: ${errorMessages.map((e) => `${e.field}: ${e.message}`).join(', ')}`;
  }

  // Handle Prisma errors
  else if (err instanceof PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      statusCode = HTTP_STATUS_CODES.CONFLICT;
      message = MESSAGES.DUPLICATE_ENTRY;
    }
    // Record not found
    else if (err.code === 'P2025') {
      statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      message = MESSAGES.NOT_FOUND;
    }
    // Foreign key constraint failed
    else if (err.code === 'P2003') {
      statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
      message = MESSAGES.INVALID_REFERENCE;
    }
  }

  // Handle Prisma validation errors
  else if (err instanceof PrismaClientValidationError) {
    statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
    message = MESSAGES.INVALID_DATA;
  }

  // Log error
  logger.error('Error occurred:', err);

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
