import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.middleware';
import { AppError } from './utils/AppError';
import statusRoutes from './routes/status.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req: Request, res: Response) => {
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
app.use((req: Request, res: Response, next: NextFunction) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});

// Global Error Handler - Must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
