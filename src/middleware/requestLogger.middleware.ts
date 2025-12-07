import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { shouldIgnorePath } from './config';

// Extend Express Request to include requestId
declare global {
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}

/**
 * Request ID generation and context middleware
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = req.header('x-request-id') || uuidv4();
  req.id = requestId;
  req.startTime = Date.now();

  // Add request ID to response headers
  res.setHeader('x-request-id', requestId);

  // Only log if not in ignore list
  if (!shouldIgnorePath(req.path)) {
    logger.info(`[${requestId}] ${req.method} ${req.path}`);
  }

  // Capture the original send and json methods
  const originalSend = res.send;
  const originalJson = res.json;

  // Helper function to log response
  const logResponse = () => {
    const duration = Date.now() - req.startTime;
    if (!shouldIgnorePath(req.path)) {
      logger.info(`[${requestId}] ${res.statusCode} ${duration}ms`);
    }
  };

  // Override res.send to log response details
  res.send = function (data) {
    logResponse();
    return originalSend.call(this, data);
  };

  // Override res.json to log response details (IMPORTANT: most endpoints use this)
  res.json = function (data) {
    logResponse();
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Error logging middleware
 */
export const errorLoggingMiddleware = (
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const duration = req.startTime ? Date.now() - req.startTime : 0;

  // Only log if not in ignore list
  if (!shouldIgnorePath(req.path)) {
    logger.error(
      `[${req.id || 'unknown'}] ERROR: ${err.message} (${duration}ms)`
    );
  }

  next(err);
};

export default { requestIdMiddleware, errorLoggingMiddleware };
