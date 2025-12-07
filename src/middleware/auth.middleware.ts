import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS_CODES, MESSAGES } from '../constants';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      token?: string;
    }
  }
}

/**
 * Verify JWT token and attach user info to request
 * TODO: Implement JWT verification when authentication is added
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      throw new AppError(
        MESSAGES.AUTH_HEADER_MISSING,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(
        MESSAGES.TOKEN_MISSING,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, env.JWT_SECRET);
    // req.userId = decoded.userId;
    // req.userRole = decoded.role;
    // req.token = token;

    logger.debug('User authenticated', { userId: req.userId });
    next();
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }

    const error = err instanceof Error ? err : new Error(String(err));
    logger.error('Authentication failed', { error: error.message });
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH_FAILED,
    });
  }
};

/**
 * Optional authentication - continues even if token is missing
 */
export const authenticateOptional = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, env.JWT_SECRET);
    // req.userId = decoded.userId;
    // req.userRole = decoded.role;
    // req.token = token;

    next();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.warn('Optional authentication failed', { error: error.message });
    next();
  }
};

export default { authenticate, authenticateOptional };
