export const RATE_LIMIT = {
  GLOBAL_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  GLOBAL_MAX_REQUESTS: 100,
  AUTH_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  AUTH_MAX_REQUESTS: 5,
  API_WINDOW_MS: 60 * 1000, // 1 minute
  API_MAX_REQUESTS: 30,
} as const;
