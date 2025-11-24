import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema, ZodIssue } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Middleware to validate request data against a Zod schema
 * @param schema - Zod schema object with body, params, and/or query properties
 */
export const validate =
  (schema: ZodSchema) =>
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
        const errorMessages = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return next(
          new AppError(
            `Validation error: ${errorMessages.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(', ')}`,
            400
          )
        );
      }
      next(error);
    }
  };
