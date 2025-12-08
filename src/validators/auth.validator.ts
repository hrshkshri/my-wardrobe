import { z } from 'zod';

const registerBodySchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/\d/, 'Password must contain number')
    .regex(/[@$!%*?&]/, 'Password must contain special character (@$!%*?&)'),
});

export const registerSchema = z.object({
  body: registerBodySchema,
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

const loginBodySchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const loginSchema = z.object({
  body: loginBodySchema,
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

const refreshBodySchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const refreshSchema = z.object({
  body: refreshBodySchema,
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

const logoutBodySchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const logoutSchema = z.object({
  body: logoutBodySchema,
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;
export type RefreshInput = z.infer<typeof refreshBodySchema>;
export type LogoutInput = z.infer<typeof logoutBodySchema>;
