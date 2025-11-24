import { z } from 'zod';
import { emailSchema, passwordSchema, uuidSchema } from './common.validator';

/**
 * Example validators for common use cases
 * Copy and modify these for your specific models
 */

// Example: Create user validation
export const createUserSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.number().int().positive().optional(),
  }),
});

// Example: Update user validation
export const updateUserSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    email: emailSchema.optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    age: z.number().int().positive().optional(),
  }),
});

// Example: Get user by ID validation
export const getUserSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

// Example: Login validation
export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),
});

// Example: Query params validation
export const getUsersQuerySchema = z.object({
  query: z.object({
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
    search: z.string().optional(),
    sortBy: z.enum(['name', 'email', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  }),
});
