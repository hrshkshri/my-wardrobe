import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: Creates a new user account with email and password. Returns JWT access token for immediate use.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique)
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password (min 8 chars, must include uppercase, lowercase, number, special char)
 *                 example: SecurePass123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token (expires in 15 minutes)
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.abc123...
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token (expires in 30 days, stored in secure cookie)
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.xyz789...
 *                     authAccount:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: 550e8400-e29b-41d4-a716-446655440000
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-12-09T10:15:00.000Z
 *                 traceId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: 'Validation error: body.email: Invalid email format'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Email already registered
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Internal server error
 */
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
// router.post('/login', authController.login);

// POST /api/auth/refresh
// router.post('/refresh', authController.refresh);

// POST /api/auth/logout
// router.post('/logout', authController.logout);

// GET /api/auth/me
// router.get('/me', authController.getMe);

// POST /api/auth/google/redirect
// router.post('/google/redirect', authController.googleRedirect);

// GET /api/auth/google/callback
// router.get('/google/callback', authController.googleCallback);

export default router;
