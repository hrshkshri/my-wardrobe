/**
 * Utility for consistent error handling in middleware
 */

import { Response } from 'express';
import { AppError } from './AppError';
import { logger } from '../logging/logger';
import { createErrorResponse } from '../../dtos/response.dto';
import { formatError } from './errorFormatter';

/**
 * Handle errors consistently in middleware
 */
export const sendMiddlewareError = (
  err: unknown,
  res: Response,
  statusCode: number,
  message: string
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(createErrorResponse(err.message));
    return;
  }

  logger.error(message, { error: formatError(err) });
  res.status(statusCode).json(createErrorResponse(message));
};

export default {
  sendMiddlewareError,
};
