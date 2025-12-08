/**
 * Central route registration file
 * All routes are registered here to keep main app file clean
 */

import { Express } from 'express';
import { statusRoutes } from './index';
import { authRoutes } from './index';

export const setupRoutes = (app: Express) => {
  // Status/Health check routes
  app.use('/api/status', statusRoutes);

  // Auth routes (register, login, etc.)
  app.use('/api/auth', authRoutes);
};
