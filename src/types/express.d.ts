declare global {
  namespace Express {
    interface Request {
      id?: string;
    }

    interface Response {
      traceId?: string;
    }
  }
}
