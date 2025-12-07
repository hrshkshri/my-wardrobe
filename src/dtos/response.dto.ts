import { getCurrentTimestamp } from '../utils/common/dateTime';

/**
 * Standard API Response DTO
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  traceId?: string;
  timestamp?: string;
}

/**
 * Create success response
 */
export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  traceId?: string
): ApiResponse<T> => {
  return {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(traceId && { traceId }),
    timestamp: getCurrentTimestamp(),
  };
};

/**
 * Create error response
 */
export const createErrorResponse = (
  message: string,
  errors?: Record<string, string[]>,
  traceId?: string
): ApiResponse<null> => {
  return {
    success: false,
    message,
    ...(errors && { errors }),
    ...(traceId && { traceId }),
    timestamp: getCurrentTimestamp(),
  };
};

export default {
  createSuccessResponse,
  createErrorResponse,
};
