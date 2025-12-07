import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS_CODES, MESSAGES } from '../constants';
import { createErrorResponse } from '../dtos/response.dto';

export type RoleType = 'ADMIN' | 'MODERATOR' | 'STYLIST' | 'USER';

/**
 * Check if user has required role
 */
export const authorize = (...allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.userId) {
        throw new AppError(
          MESSAGES.USER_NOT_AUTHENTICATED,
          HTTP_STATUS_CODES.UNAUTHORIZED
        );
      }

      const userRole = req.userRole as RoleType;

      if (!userRole || !allowedRoles.includes(userRole)) {
        logger.warn('Authorization failed - insufficient permissions', {
          userId: req.userId,
          userRole,
          requiredRoles: allowedRoles,
        });

        throw new AppError(
          MESSAGES.INSUFFICIENT_PERMISSIONS,
          HTTP_STATUS_CODES.FORBIDDEN
        );
      }

      logger.debug('User authorized', { userId: req.userId, role: userRole });
      next();
    } catch (err) {
      if (err instanceof AppError) {
        res.status(err.statusCode).json(createErrorResponse(err.message));
        return;
      }

      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Authorization check failed', { error: error.message });
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.AUTHORIZATION_CHECK_FAILED));
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
      throw new AppError(
        MESSAGES.USER_NOT_AUTHENTICATED,
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const resourceOwnerId = req.params.userId || req.params.id;

    if (req.userId !== resourceOwnerId && req.userRole !== 'ADMIN') {
      logger.warn('Authorization failed - not owner', {
        userId: req.userId,
        resourceOwnerId,
      });

      throw new AppError(
        MESSAGES.RESOURCE_ACCESS_DENIED,
        HTTP_STATUS_CODES.FORBIDDEN
      );
    }

    next();
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json(createErrorResponse(err.message));
      return;
    }

    const error = err instanceof Error ? err : new Error(String(err));
    logger.error('Owner authorization check failed', { error: error.message });
    res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(MESSAGES.AUTHORIZATION_CHECK_FAILED));
  }
};

export default { authorize, authorizeOwner };
