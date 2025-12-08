import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import authService from '../services/auth.service';
import { createSuccessResponse } from '../dtos/response.dto';
import { HTTP_STATUS_CODES } from '../constants';

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
};

export default authController;
