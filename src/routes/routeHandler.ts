/**
 * Central route registration file
 * All routes are registered here to keep main app file clean
 */

import { Express } from 'express';
import { statusRoutes } from './index';
import { authRoutes } from './index';

export const setupRoutes = (app: Express) => {
  // ============================================
  // PUBLIC ROUTES (No authentication required)
  // ============================================

  // Status/Health check routes
  app.use('/api/status', statusRoutes);

  // Auth routes (register, login, etc.)
  app.use('/api/auth', authRoutes);

  // ============================================
  // ADD MORE ROUTES HERE
  // ============================================

  // User routes (PROTECTED)
  // app.use('/api/users', userRoutes);

  // Wardrobe routes (PROTECTED)
  // app.use('/api/wardrobes', wardrobeRoutes);

  // Outfit routes (PROTECTED)
  // app.use('/api/outfits', outfitRoutes);

  // Stylist routes (PROTECTED)
  // app.use('/api/stylists', stylistRoutes);

  // Styling request routes (PROTECTED)
  // app.use('/api/styling-requests', stylingRequestRoutes);

  // Payment routes (PROTECTED)
  // app.use('/api/payments', paymentRoutes);

  // Friends routes (PROTECTED)
  // app.use('/api/friends', friendRoutes);
};
