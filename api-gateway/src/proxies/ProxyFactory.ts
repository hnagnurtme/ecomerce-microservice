// proxyFactory.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ClientRequest } from 'http';
import logger from 'utils/logger';

export function createServiceProxy(
  serviceUrl: string,
  pathRewrite?: { [key: string]: string }
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const proxy = createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      pathRewrite,
      on: {
        proxyReq: (proxyReq: ClientRequest, req: Request) => {
          logger.info(
            `[PROXY] Forwarding ${req.method} ${req.originalUrl} → ${serviceUrl}${req.url}`
          );
        },
      },
    });

    req.url = req.originalUrl;
    return proxy(req, res, next);
  };
}
