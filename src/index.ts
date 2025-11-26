import 'dotenv/config';
import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/errorHandler.middleware';
import { AppError } from './utils/AppError';
import { corsOptions } from './utils/corsOptions';
import { apiLimiter } from './utils/rateLimiter';
import { logger } from './utils/logger';
import statusRoutes from './routes/status.routes';
import { setupSecurityMiddleware } from './middleware/security.middleware';
import {
  requestIdMiddleware,
  errorLoggingMiddleware,
} from './middleware/requestLogger.middleware';
import { env, swaggerSpec } from './config';

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
app.get(
  '/api-docs',
  swaggerUi.setup(swaggerSpec, { customSiteTitle: 'My Wardrobe API' })
);

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
  res.status(200).json({
    success: true,
    message: 'Welcome to My Wardrobe API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/status', statusRoutes);

// 404 Handler - Must be after all routes
app.use((req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});

// Error logging middleware
app.use(errorLoggingMiddleware);

// Global Error Handler - Must be last
app.use(errorHandler);

// Start server
const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: env.NODE_ENV,
    nodeVersion: process.version,
  });
  logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
