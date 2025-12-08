import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import authService from '../services/auth.service';
import { createSuccessResponse } from '../dtos/response.dto';
import { HTTP_STATUS_CODES } from '../constants';
import { AuthRequest } from '../middleware/auth.middleware';

const authController = {
  register: expressAsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    // TODO: Move refreshToken to HTTPOnly cookie for XSS protection (see: CORS setup needed)
    // res.cookie('refreshToken', result.refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });

    res.status(HTTP_STATUS_CODES.CREATED).json(
      createSuccessResponse('Registration successful', {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        authAccount: result.authAccount,
      })
    );
  }),

  login: expressAsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    // TODO: Move refreshToken to HTTPOnly cookie for XSS protection (see: CORS setup needed)
    // res.cookie('refreshToken', result.refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });

    res.status(HTTP_STATUS_CODES.OK).json(
      createSuccessResponse('Login successful', {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        authAccount: result.authAccount,
      })
    );
  }),

  refresh: expressAsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body);

    res.status(HTTP_STATUS_CODES.OK).json(
      createSuccessResponse('Token refreshed', {
        accessToken: result.accessToken,
      })
    );
  }),

  logout: expressAsyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.body);

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
