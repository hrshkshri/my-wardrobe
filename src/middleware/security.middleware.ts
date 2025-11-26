import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { Request, Response, NextFunction, Express } from 'express';
import { env } from '../config';

export const setupSecurityMiddleware = (app: Express): void => {
  // Helmet.js - HTTP security headers
  app.use(helmet());

  // Sanitize data against NoSQL Injection
  app.use(mongoSanitize());

  // Prevent caching of sensitive data
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('/auth') || req.path.includes('/secure')) {
      res.header(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      res.header('Pragma', 'no-cache');
      res.header('Expires', '0');
    }
    next();
  });

  // Disable powered by header
  app.disable('x-powered-by');

  // Request size limits
  app.use((req: Request, res: Response, next: NextFunction): void => {
    // Limit JSON payload to 1MB
    if (req.is('json')) {
      const contentLength = parseInt(req.header('content-length') || '0', 10);
      if (contentLength > 1024 * 1024) {
        res.status(413).json({
          success: false,
          message: 'Payload too large',
        });
        return;
      }
    }
    next();
  });

  // Validate content type
  app.use((req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.header('content-type');

    if (
      req.method !== 'GET' &&
      req.method !== 'HEAD' &&
      req.method !== 'DELETE'
    ) {
      if (!contentType || !contentType.includes('application/json')) {
        res.status(415).json({
          success: false,
          message:
            'Unsupported Media Type. Content-Type must be application/json',
        });
        return;
      }
    }

    next();
  });

  // HTTPS enforcement in production
  if (env.NODE_ENV === 'production') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(301, `https://${req.header('host')}${req.url}`);
      }
      next();
    });
  }
};

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim();
};

/**
 * Validate API key middleware
 */
export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    res.status(401).json({
      success: false,
      message: 'API key is required',
    });
    return;
  }

  // In production, validate against stored API keys
  if (env.NODE_ENV === 'production') {
    // TODO: Implement API key validation against database
    // const isValidKey = await validateApiKeyInDB(apiKey);
    // if (!isValidKey) {
    //   res.status(401).json({ success: false, message: 'Invalid API key' });
    //   return;
    // }
  }

  next();
};

export default { setupSecurityMiddleware, sanitizeInput, validateApiKey };
