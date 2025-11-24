export interface StatusResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  database: 'connected' | 'disconnected';
  version: string;
}
