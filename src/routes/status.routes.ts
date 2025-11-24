import { Router } from 'express';
import statusController from '../controllers/status.controller';

const router = Router();

// GET /api/status - Get server health status
router.get('/', statusController.getStatus);

// GET /api/status/ping - Simple ping endpoint
router.get('/ping', statusController.ping);

export default router;
