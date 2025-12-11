import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import authService from '../services/auth.service';
import { createSuccessResponse } from '../dtos/response.dto';
import { HTTP_STATUS_CODES } from '../constants';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/errors/AppError';
import { env } from '../config';

const authController = {
  register: expressAsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    // Set refreshToken in httpOnly cookie for XSS protection
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: env.COOKIE_DOMAIN || undefined,
    });

    res.status(HTTP_STATUS_CODES.CREATED).json(
      createSuccessResponse('Registration successful', {
        accessToken: result.accessToken,
        authAccount: result.authAccount,
      })
    );
  }),

  login: expressAsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    // Set refreshToken in httpOnly cookie for XSS protection
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: env.COOKIE_DOMAIN || undefined,
    });

    res.status(HTTP_STATUS_CODES.OK).json(
      createSuccessResponse('Login successful', {
        accessToken: result.accessToken,
        authAccount: result.authAccount,
      })
    );
  }),

  refresh: expressAsyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        'Refresh token not found',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const result = await authService.refresh({ refreshToken });

    res.status(HTTP_STATUS_CODES.OK).json(
      createSuccessResponse('Token refreshed', {
        accessToken: result.accessToken,
      })
    );
  }),

  logout: expressAsyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logout({ refreshToken });
    }

    // Clear the refreshToken cookie
    res.clearCookie('refreshToken', {
      path: '/',
      domain: env.COOKIE_DOMAIN || undefined,
    });

    res
      .status(HTTP_STATUS_CODES.OK)
      .json(createSuccessResponse('Logout successful', {}));
  }),

  getMe: expressAsyncHandler(async (req: AuthRequest, res: Response) => {
    res.status(HTTP_STATUS_CODES.OK).json(
      createSuccessResponse('User retrieved', {
        user: req.user,
      })
    );
  }),
};

export default authController;
