import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../constants';

/**
 * Middleware to validate request data against a Zod schema
 * @param schema - Zod schema object with body, params, and/or query properties
 */
export const validate =
  (schema: ZodType) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return next(
          new AppError(
            `Validation error: ${errorMessages.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
            HTTP_STATUS_CODES.BAD_REQUEST
          )
        );
      }
      next(error);
    }
  };
