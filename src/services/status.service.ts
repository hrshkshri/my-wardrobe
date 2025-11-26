import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { env } from '../config';
import { StatusResponse } from '../types/status.types';

const statusService = {
  // Get server status and health
  getStatus: async (): Promise<StatusResponse> => {
    try {
      // Check database connection
      let databaseStatus: 'connected' | 'disconnected' = 'disconnected';

      try {
        await prisma.$queryRaw`SELECT 1`;
        databaseStatus = 'connected';
      } catch (error) {
        logger.error('Database connection check failed:', error);
        databaseStatus = 'disconnected';
      }

      // Calculate uptime in seconds
      const uptime = process.uptime();

      // Get current timestamp
      const timestamp = new Date().toISOString();

      // Get environment
      const environment = env.NODE_ENV;

      // Determine overall status
      const status: 'healthy' | 'unhealthy' =
        databaseStatus === 'connected' ? 'healthy' : 'unhealthy';

      return {
        status,
        timestamp,
        uptime,
        environment,
        database: databaseStatus,
        version: '1.0.0',
      };
    } catch (error) {
      throw error;
    }
  },

  // Simple ping
  ping: async () => {
    try {
      return {
        message: 'pong',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
};

export default statusService;
