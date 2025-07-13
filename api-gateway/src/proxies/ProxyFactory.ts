import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ClientRequest } from 'http';
import logger from 'utils/logger';
import appConfig from 'config/app.config';
const gatewayApiKey = appConfig.apiKey.gateway as string;

export function createServiceProxy(
    serviceUrl: string,
    pathRewrite?: { [key: string]: string },
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const proxy = createProxyMiddleware({
            target: serviceUrl,
            changeOrigin: true,
            pathRewrite,
            on: {
                proxyReq: (proxyReq: ClientRequest, req: Request) => {
                    logger.info(
                        `[PROXY] Forwarding ${req.method} ${req.originalUrl} → ${serviceUrl}${req.url}`,
                    );
                    // ADD GATEWAY API KEY
                    if (gatewayApiKey) {
                        proxyReq.setHeader('x-gateway-api-key', gatewayApiKey);
                    }
                },
            },
        });

        req.url = req.originalUrl;
        return proxy(req, res, next);
    };
}
