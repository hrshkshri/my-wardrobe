import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/register
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
