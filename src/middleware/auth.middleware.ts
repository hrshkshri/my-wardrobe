import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokens/jwt';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../constants';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const verifyAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Missing or invalid authorization header',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'Invalid or expired access token',
      HTTP_STATUS_CODES.UNAUTHORIZED
    );
  }
};
