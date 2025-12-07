/**
 * Utility functions for JWT token extraction and handling
 */

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value (e.g., "Bearer token123")
 * @returns Token or null if not found/invalid
 */
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Check if token exists in header
 */
export const hasToken = (authHeader: string | undefined): boolean => {
  return extractToken(authHeader) !== null;
};

export default {
  extractToken,
  hasToken,
};
