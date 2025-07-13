import { Response } from 'express';

export class ApiResponse<T = unknown> {
  constructor(
    public success: boolean,
    public message: string,
    public statusCode: number,
    public data: T | null = null,
    public error?: string,
    public timestamp: string = new Date().toISOString()
  ) {}

  send(res: Response, headers: Record<string, string> = {}) {
    for (const key in headers) {
      res.setHeader(key, headers[key]);
    }
    return res.status(this.statusCode).json(this);
  }
}
