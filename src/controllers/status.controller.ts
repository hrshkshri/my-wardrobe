import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import statusService from '../services/status.service';
import { HTTP_STATUS_CODES, MESSAGES } from '../constants';
import { createSuccessResponse } from '../dtos/response.dto';

const statusController = {
  // Get server health status
  getStatus: expressAsyncHandler(async (_req: Request, res: Response) => {
    const status = await statusService.getStatus();

    const statusCode =
      status.status === 'healthy'
        ? HTTP_STATUS_CODES.OK
        : HTTP_STATUS_CODES.SERVICE_UNAVAILABLE;

    const message =
      status.status === 'healthy'
        ? MESSAGES.SERVER_HEALTHY
        : MESSAGES.SERVER_UNHEALTHY;

    res.status(statusCode).json(createSuccessResponse(message, status));
  }),

  // Simple ping endpoint
  ping: expressAsyncHandler(async (_req: Request, res: Response) => {
    const pingData = await statusService.ping();

    res
      .status(HTTP_STATUS_CODES.OK)
      .json(createSuccessResponse(MESSAGES.SERVER_RESPONDING, pingData));
  }),
};

export default statusController;
