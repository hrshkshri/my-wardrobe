import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import authService from '../services/auth.service';
import { createSuccessResponse } from '../dtos/response.dto';
import { HTTP_STATUS_CODES } from '../constants';

const authController = {
  register: expressAsyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    // TODO: Set refreshToken in HTTPOnly cookie

    res.status(HTTP_STATUS_CODES.CREATED).json(
      createSuccessResponse('Registration successful', {
        accessToken: result.accessToken,
        authAccount: result.authAccount,
      })
    );
  }),
};

export default authController;
