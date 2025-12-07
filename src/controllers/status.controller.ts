import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import statusService from '../services/status.service';
import { HTTP_STATUS_CODES, MESSAGES } from '../constants';

const statusController = {
  // Get server health status
  getStatus: expressAsyncHandler(async (_req: Request, res: Response) => {
    const status = await statusService.getStatus();

    const statusCode =
      status.status === 'healthy'
        ? HTTP_STATUS_CODES.OK
        : HTTP_STATUS_CODES.SERVICE_UNAVAILABLE;

    res.status(statusCode).json({
      success: status.status === 'healthy',
      message:
        status.status === 'healthy'
          ? MESSAGES.SERVER_HEALTHY
          : MESSAGES.SERVER_UNHEALTHY,
      data: status,
    });
  }),

  // Simple ping endpoint
  ping: expressAsyncHandler(async (_req: Request, res: Response) => {
    const pingData = await statusService.ping();

    res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      message: MESSAGES.SERVER_RESPONDING,
      data: pingData,
    });
  }),
};

export default statusController;
