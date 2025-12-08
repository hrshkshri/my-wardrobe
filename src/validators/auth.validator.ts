import { z } from 'zod';

/**
 * Register validation schema
 * Validates: email, password, firstName, lastName
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/\d/, 'Password must contain number')
    .regex(/[@$!%*?&]/, 'Password must contain special character (@$!%*?&)'),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
});

/**
 * Login validation schema
 * Validates: email, password
 */
// export const loginSchema = z.object({
//   email: z.string().email('Invalid email format'),
//   password: z.string().min(1, 'Password is required'),
// });

/**
 * Google OAuth redirect validation
 */
// export const googleOAuthSchema = z.object({
//   redirectUri: z.string().url('Invalid redirect URI'),
// });

/**
 * Infer types from schemas
 */
export type RegisterInput = z.infer<typeof registerSchema>;
// export type LoginInput = z.infer<typeof loginSchema>;
// export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;
