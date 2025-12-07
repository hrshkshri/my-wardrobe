import { Router } from 'express';
import statusController from '../controllers/status.controller';

const router = Router();

/**
 * @swagger
 * /api/status/ping:
 *   get:
 *     summary: Simple ping endpoint
 *     description: Quick health check endpoint to verify the server is responding
 *     operationId: ping
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Server is responding and healthy
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
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-12-07T10:15:00.000Z
 */
router.get('/ping', statusController.ping);

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get server health status
 *     description: |
 *       Returns comprehensive health status of the API including:
 *       - Overall server health
 *       - Database connectivity status
 *       - Server uptime
 *       - Current environment and version
 *     operationId: getStatus
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Server is healthy and fully operational
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
 *                       description: Overall server health status
 *                       example: healthy
 *                     uptime:
 *                       type: number
 *                       description: Server uptime in seconds
 *                       example: 3600
 *                     environment:
 *                       type: string
 *                       enum: [development, staging, production]
 *                       example: development
 *                     database:
 *                       type: string
 *                       enum: [connected, disconnected]
 *                       example: connected
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-12-07T10:15:00.000Z
 *       503:
 *         description: Server is unhealthy (database unavailable or critical service down)
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
 *                   example: Service temporarily unavailable
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-12-07T10:15:00.000Z
 */
router.get('/', statusController.getStatus);

export default router;
