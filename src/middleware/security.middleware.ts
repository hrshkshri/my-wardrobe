import helmet from 'helmet';
import { Express } from 'express';

export const setupSecurityMiddleware = (app: Express): void => {
  // Security headers
  app.use(helmet());

  // Disable x-powered-by header
  app.disable('x-powered-by');
};

export default { setupSecurityMiddleware };
