import { Request, Response, NextFunction } from 'express';
import appConfig from 'config/app.config';
import { ErrorResponse } from 'response';
const gatewayApiKey = appConfig.apiKey.gateway as string;
export const gatewayAPIKeyHandler = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-gateway-api-key'];
    if (apiKey && apiKey === gatewayApiKey) {
        next();
    } else {
        throw ErrorResponse.FORBIDDEN('Invalid API Key');
    }
};
