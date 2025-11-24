import { logger } from '../utils/logger';

const SENTRY_DSN = process.env.SENTRY_DSN;

/**
 * Initialize Sentry error tracking
 * To enable, set SENTRY_DSN environment variable
 */
export const initializeSentry = (): void => {
  if (!SENTRY_DSN) {
    logger.warn('Sentry DSN not configured, error tracking disabled');
    return;
  }

  logger.info('Sentry configured', {
    environment: process.env.NODE_ENV || 'development',
  });

  // TODO: Implement Sentry initialization when needed
  // import * as Sentry from '@sentry/node';
  // Sentry.init({ dsn: SENTRY_DSN, ... });
};

/**
 * Get Sentry middleware for Express (no-op if not configured)
 */
export const getSentryRequestHandler = () => {
  return (_req: any, _res: any, next: any) => next();
};

/**
 * Get Sentry error handler middleware (no-op if not configured)
 */
export const getSentryErrorHandler = () => {
  return (_err: any, _req: any, _res: any, next: any) => next();
};

/**
 * Capture exception in Sentry
 */
export const captureException = (
  error: Error,
  _context?: Record<string, unknown>
): void => {
  if (!SENTRY_DSN) {
    return;
  }
  // TODO: Implement exception capture
  logger.error('Uncaught exception', { error: error.message });
};

/**
 * Capture message in Sentry
 */
export const captureMessage = (
  message: string,
  _level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  _context?: Record<string, unknown>
): void => {
  if (!SENTRY_DSN) {
    return;
  }
  // TODO: Implement message capture
  logger.info(message);
};

export default {
  initializeSentry,
  getSentryRequestHandler,
  getSentryErrorHandler,
  captureException,
  captureMessage,
};
