import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.middleware';
import { AppError } from './utils/AppError';
import { corsOptions } from './utils/corsOptions';
import { apiLimiter } from './utils/rateLimiter';
import { logger } from './utils/logger';
import statusRoutes from './routes/status.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to My Wardrobe API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/status', statusRoutes);

// Add your routes here
// Example: app.use('/api/users', userRoutes);

// 404 Handler - Must be after all routes
app.use((req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});

// Global Error Handler - Must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
