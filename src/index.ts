import 'dotenv/config';
import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/errorHandler.middleware';
import { AppError } from './utils/errors/AppError';
import { corsOptions } from './utils/security/corsOptions';
import { apiLimiter } from './utils/rateLimit/rateLimiter';
import { logger } from './utils/logging/logger';
import { statusRoutes } from './routes';
import { setupSecurityMiddleware } from './middleware/security.middleware';
import {
  requestIdMiddleware,
  errorLoggingMiddleware,
} from './middleware/requestLogger.middleware';
import { env, swaggerSpec, swaggerUiOptions } from './config';
import { HTTP_STATUS_CODES } from './constants';
import { createSuccessResponse } from './dtos/response.dto';
import { initializeCache, closeCache } from './utils/caching/cache';

const app: Express = express();

// Apply security middleware first
setupSecurityMiddleware(app);

// Request compression
app.use(compression());

// Request ID middleware
app.use(requestIdMiddleware);

// Standard middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(apiLimiter);

// Swagger/OpenAPI documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

/**
 * @swagger
 * /:
 *   get:
 *     summary: API welcome endpoint
 *     description: Returns welcome message and API version
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to My Wardrobe API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
app.get('/', (_req: Request, res: Response) => {
  res
    .status(HTTP_STATUS_CODES.OK)
    .json(
      createSuccessResponse('Welcome to My Wardrobe API', { version: '1.0.0' })
    );
});

// API Routes
app.use('/api/status', statusRoutes);

// 404 Handler - Must be after all routes
app.use((req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(
    `Route ${req.originalUrl} not found`,
    HTTP_STATUS_CODES.NOT_FOUND
  );
});

// Error logging middleware
app.use(errorLoggingMiddleware);

// Global Error Handler - Must be last
app.use(errorHandler);

// Start server
const PORT = env.PORT;

const startServer = async () => {
  try {
    // Initialize Redis cache
    const cache = await initializeCache();
    if (cache) {
      logger.info('Cache system initialized successfully');
    } else {
      logger.warn('Running without Redis cache (disabled or unavailable)');
    }

    const server = app.listen(PORT, () => {
      logger.info(`Server started successfully`, {
        port: PORT,
        environment: env.NODE_ENV,
        nodeVersion: process.version,
      });
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });

    // Handle port already in use
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(
          `Port ${PORT} is already in use. Please stop the existing process or use a different port.`
        );
      } else {
        logger.error(`Server error: ${error.message}`);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      await closeCache();
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      await closeCache();
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

startServer();

export default app;
