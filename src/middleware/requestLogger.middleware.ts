import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

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

  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.header('user-agent'),
  });

  // Capture the original send method
  const originalSend = res.send;

  // Override res.send to log response details
  res.send = function (data) {
    const duration = Date.now() - req.startTime;

    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Error logging middleware
 */
export const errorLoggingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const duration = Date.now() - req.startTime;

  logger.error('Request error', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    error: err.message,
    stack: err.stack,
  });

  next(err);
};

export default { requestIdMiddleware, errorLoggingMiddleware };
