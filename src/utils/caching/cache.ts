import Redis from 'ioredis';
import { logger } from '../logging/logger';
import { isCacheAvailable, safeCacheOperation } from './cacheGuard';
import { formatError } from '../errors/errorFormatter';

let redis: Redis | null = null;

/**
 * Initialize Redis connection
 * Configure REDIS_URL environment variable to enable
 */
export const initializeCache = async (): Promise<Redis | null> => {
  try {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

    if (redisUrl) {
      redis = new Redis(redisUrl);
    } else if (process.env.REDIS_ENABLED === 'true') {
      redis = new Redis({
        host: redisHost,
        port: redisPort,
      });
    } else {
      logger.warn('Redis not configured - caching disabled');
      return null;
    }

    redis.on('connect', () => {
      logger.info('Redis connected');
    });

    redis.on('error', (err) => {
      logger.error('Redis error', { error: err.message });
    });

    return redis;
  } catch (error) {
    logger.error('Failed to initialize Redis', {
      error: formatError(error),
    });
    throw error;
  }
};

/**
 * Get value from cache
 */
export const getCachedValue = async <T>(key: string): Promise<T | null> => {
  if (!isCacheAvailable(redis)) {
    return null;
  }

  return safeCacheOperation(
    async () => {
      const value = await redis!.get(key);
      return value ? (JSON.parse(value) as T) : null;
    },
    null,
    'get'
  );
};

/**
 * Set value in cache
 */
export const setCachedValue = async <T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<boolean> => {
  if (!isCacheAvailable(redis)) {
    return false;
  }

  return safeCacheOperation(
    async () => {
      await redis!.setex(key, ttl, JSON.stringify(value));
      return true;
    },
    false,
    'set'
  );
};

/**
 * Delete value from cache
 */
export const deleteCachedValue = async (key: string): Promise<boolean> => {
  if (!isCacheAvailable(redis)) {
    return false;
  }

  return safeCacheOperation(
    async () => {
      await redis!.del(key);
      return true;
    },
    false,
    'delete'
  );
};

/**
 * Clear all cache
 */
export const clearCache = async (): Promise<boolean> => {
  if (!isCacheAvailable(redis)) {
    return false;
  }

  return safeCacheOperation(
    async () => {
      await redis!.flushall();
      return true;
    },
    false,
    'clear'
  );
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): Redis | null => {
  return redis || null;
};

/**
 * Close Redis connection
 */
export const closeCache = async (): Promise<void> => {
  try {
    if (redis) {
      await redis.quit();
      logger.info('Redis connection closed');
    }
  } catch (error) {
    logger.error('Failed to close Redis connection', {
      error: formatError(error),
    });
  }
};

export default {
  initializeCache,
  getCachedValue,
  setCachedValue,
  deleteCachedValue,
  clearCache,
  getRedisClient,
  closeCache,
};
