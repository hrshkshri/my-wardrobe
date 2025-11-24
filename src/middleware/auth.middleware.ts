import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

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
      throw new AppError('Authorization header is missing', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Token is missing', 401);
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
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
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
