import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import statusService from '../services/status.service';

const statusController = {
  // Get server health status
  getStatus: expressAsyncHandler(async (req: Request, res: Response) => {
    const status = await statusService.getStatus();

    // Return 503 if unhealthy, 200 if healthy
    const statusCode = status.status === 'healthy' ? 200 : 503;

    res.status(statusCode).json({
      success: status.status === 'healthy',
      message:
        status.status === 'healthy'
          ? 'Server is healthy'
          : 'Server is unhealthy',
      data: status,
    });
  }),

  // Simple ping endpoint
  ping: expressAsyncHandler(async (req: Request, res: Response) => {
    const pingData = await statusService.ping();

    res.status(200).json({
      success: true,
      message: 'Server is responding',
      data: pingData,
    });
  }),
};

export default statusController;
