/**
 * Middleware configuration
 * Shared configuration and helpers used across multiple middleware files
 */

/**
 * Paths to ignore in logging and error handling
 * These are browser requests that don't need to be logged
 */
export const IGNORE_PATHS = [
  '/serviceWorker.js',
  '/favicon.ico',
  '/.well-known',
];

/**
 * Check if a request path should be ignored
 * @param path - Request path to check
 * @returns true if path should be ignored, false otherwise
 */
export const shouldIgnorePath = (path: string): boolean => {
  return IGNORE_PATHS.some((ignorePath) => path.includes(ignorePath));
};
