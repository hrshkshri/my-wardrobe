export const MESSAGES = {
  // Server
  SERVER_STARTED: 'Server started successfully',
  DATABASE_CONNECTED: 'Database connected successfully',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',

  // Health Check
  SERVER_HEALTHY: 'Server is healthy',
  SERVER_UNHEALTHY: 'Server is unhealthy',
  SERVER_RESPONDING: 'Server is responding',

  // Validation & Errors
  VALIDATION_ERROR: 'Validation error occurred',
  INTERNAL_ERROR: 'Internal server error',

  // Authorization & Authentication
  UNAUTHORIZED: 'Unauthorized access',
  AUTH_HEADER_MISSING: 'Authorization header is missing',
  TOKEN_MISSING: 'Token is missing',
  AUTH_FAILED: 'Authentication failed',
  USER_NOT_AUTHENTICATED: 'User not authenticated',
  FORBIDDEN: 'Forbidden',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  RESOURCE_ACCESS_DENIED: 'You are not authorized to access this resource',
  AUTHORIZATION_CHECK_FAILED: 'Authorization check failed',

  // Resource Errors
  NOT_FOUND: 'Resource not found',
  DUPLICATE_ENTRY: 'A record with this value already exists',
  INVALID_REFERENCE: 'Invalid reference to related record',
  INVALID_DATA: 'Invalid data provided',
} as const;
