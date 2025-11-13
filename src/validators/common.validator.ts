import { z } from 'zod';

/**
 * Common validation schemas that can be reused across the application
 */

// UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Email validation
export const emailSchema = z.string().email('Invalid email format');

// Password validation (minimum 8 characters, at least one letter and one number)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)/,
    'Password must contain at least one letter and one number'
  );

// Phone number validation (basic international format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

// URL validation
export const urlSchema = z.string().url('Invalid URL format');

// Date validation
export const dateSchema = z.string().datetime('Invalid date format');

// Pagination schemas
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(100)),
});

// Sort order validation
export const sortOrderSchema = z.enum(['asc', 'desc']);

// ID param validation
export const idParamSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});
