/**
 * Utility functions for consistent error handling and formatting
 */

/**
 * Format error message from any error type
 */
export const formatError = (error: unknown): string => {
  return error instanceof Error ? error.message : 'Unknown error';
};

/**
 * Handle middleware errors with consistent pattern
 */
export const handleMiddlewareError = (
  err: unknown,
  errorCallback: (message: string) => void
): void => {
  if (err instanceof Error) {
    errorCallback(err.message);
  } else {
    errorCallback('Unknown error');
  }
};

export default {
  formatError,
  handleMiddlewareError,
};
