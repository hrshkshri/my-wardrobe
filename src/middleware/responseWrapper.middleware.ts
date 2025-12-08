import { Request, Response, NextFunction } from 'express';

/**
 * Wraps res.json() to automatically inject traceId from request
 * Provides clean separation: controllers don't need to handle traceId
 */
export const responseWrapper = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    // If data has a structure that looks like our API response, inject traceId
    if (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      'message' in data
    ) {
      data.traceId = _req.id;
    }

    return originalJson(data);
  };

  next();
};

export default { responseWrapper };
