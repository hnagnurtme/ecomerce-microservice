import { Response } from 'express';
export class ApiResponse<T = unknown> {
  constructor(
    public success: boolean,
    public message: string,
    public statusCode: number,
    public data?: T,
    public error?: string,
    public timestamp: string = new Date().toISOString()
  ) {}

  send(res: Response, header: Record<string, string> = {}) {
    for (const key in header) {
      res.setHeader(key, header[key]);
    }
    return res.status(this.statusCode).json(this);
  }
}
