import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logging/logger';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES, MESSAGES } from '../constants';
import { extractToken } from '../utils/security/tokenExtractor';
import { sendMiddlewareError } from '../utils/errors/middlewareErrorHandler';
import { formatError } from '../utils/errors/errorFormatter';

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

    const token = extractToken(authHeader);

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
    sendMiddlewareError(
      err,
      res,
      HTTP_STATUS_CODES.UNAUTHORIZED,
      MESSAGES.AUTH_FAILED
    );
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

    const token = extractToken(authHeader);

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
    logger.warn('Optional authentication failed', { error: formatError(err) });
    next();
  }
};

export default { authenticate, authenticateOptional };
