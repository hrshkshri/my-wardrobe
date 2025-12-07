/**
 * Factory function for creating rate limiters
 */

import rateLimit from 'express-rate-limit';
import { env } from '../../config';

interface RateLimiterConfig {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}

/**
 * Create a rate limiter with consistent configuration
 */
export const createLimiter = (config: RateLimiterConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: {
      success: false,
      message: config.message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: config.skipSuccessfulRequests || false,
    skip: () => env.NODE_ENV === 'development',
  });
};

export default {
  createLimiter,
};
