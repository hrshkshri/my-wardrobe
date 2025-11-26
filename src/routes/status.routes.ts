import { Router } from 'express';
import statusController from '../controllers/status.controller';

const router = Router();

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get server health status
 *     description: Returns the health status of the API, including database connectivity and uptime
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Server is healthy
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
 *                   example: Server is healthy
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, unhealthy]
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                       description: Server uptime in seconds
 *                     environment:
 *                       type: string
 *                       enum: [development, staging, production]
 *                     database:
 *                       type: string
 *                       enum: [connected, disconnected]
 *                     version:
 *                       type: string
 *       503:
 *         description: Server is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server is unhealthy
 *                 data:
 *                   type: object
 */
router.get('/', statusController.getStatus);

/**
 * @swagger
 * /api/status/ping:
 *   get:
 *     summary: Simple ping endpoint
 *     description: Quick endpoint to verify server is responding
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Server is responding
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
 *                   example: Server is responding
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: pong
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
router.get('/ping', statusController.ping);

export default router;
