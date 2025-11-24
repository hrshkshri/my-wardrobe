import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export type RoleType = 'ADMIN' | 'MODERATOR' | 'STYLIST' | 'USER';

/**
 * Check if user has required role
 */
export const authorize = (...allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.userId) {
        throw new AppError('User not authenticated', 401);
      }

      const userRole = req.userRole as RoleType;

      if (!userRole || !allowedRoles.includes(userRole)) {
        logger.warn('Authorization failed - insufficient permissions', {
          userId: req.userId,
          userRole,
          requiredRoles: allowedRoles,
        });

        throw new AppError('Insufficient permissions', 403);
      }

      logger.debug('User authorized', { userId: req.userId, role: userRole });
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
      logger.error('Authorization check failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Authorization check failed',
      });
    }
  };
};

/**
 * Check if user owns the resource
 */
export const authorizeOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const resourceOwnerId = req.params.userId || req.params.id;

    if (req.userId !== resourceOwnerId && req.userRole !== 'ADMIN') {
      logger.warn('Authorization failed - not owner', {
        userId: req.userId,
        resourceOwnerId,
      });

      throw new AppError('You are not authorized to access this resource', 403);
    }

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
    logger.error('Owner authorization check failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Authorization check failed',
    });
  }
};

export default { authorize, authorizeOwner };
