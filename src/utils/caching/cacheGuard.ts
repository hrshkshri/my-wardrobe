/**
 * Guard utilities for cache operations
 */

import { logger } from '../logging/logger';

/**
 * Check if cache is available and log warning if not
 */
export const isCacheAvailable = (redis: any): boolean => {
  if (!redis) {
    logger.warn('Cache not configured or unavailable');
    return false;
  }
  return true;
};

/**
 * Safely execute cache operation with error handling
 */
export const safeCacheOperation = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.warn(`Cache ${operationName} failed`, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return fallbackValue;
  }
};

export default {
  isCacheAvailable,
  safeCacheOperation,
};
