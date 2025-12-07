export interface StatusResponse {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  environment: string;
  database: 'connected' | 'disconnected';
  version: string;
}
