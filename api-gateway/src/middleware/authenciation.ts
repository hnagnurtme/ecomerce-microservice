import { NextFunction, Request, Response } from 'express';
import { HEADER } from 'utils';
import { ErrorResponse } from 'response';
import logger from 'utils/logger';
import JWT, { JwtPayload } from 'jsonwebtoken';
import { HttpService } from 'utils/httpClient';
import { IKeyToken } from 'models/key-token.model';
import { AuthenticatedRequest } from 'request/authenciation.request';
const authService = new HttpService(
    process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    5000,
);
export const authenciation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers[HEADER.CLIENT_ID] as string;
    if (!userId) {
        throw ErrorResponse.UNAUTHORIZED('Client ID is required');
    }
    const keyTokenResult = await authService.get<IKeyToken>(`/api/v1/tokens?userId=${userId}`);
    if (!keyTokenResult.success || !keyTokenResult.data) {
        logger.error('Error fetching key token', {
            userId,
            message: keyTokenResult.message,
            status: keyTokenResult.statusCode,
            error: keyTokenResult.error,
        });
        throw ErrorResponse.BADREQUEST('Failed to fetch key token');
    }
    const keyTokenData = {
        publicKey: keyTokenResult.data.publicKey,
    } as IKeyToken;

    if (!keyTokenData) {
        throw ErrorResponse.UNAUTHORIZED('Invalid Client ID');
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
    if (!accessToken) {
        throw ErrorResponse.UNAUTHORIZED('Authorization header is required');
    }
    const decodedUser = JWT.verify(accessToken, keyTokenData.publicKey, {
        algorithms: ['RS256'],
    }) as JwtPayload;

    if (!decodedUser) {
        throw ErrorResponse.UNAUTHORIZED('Invalid access token');
    }

    if (!decodedUser.userId) {
        throw ErrorResponse.UNAUTHORIZED('Invalid access token');
    }

    if (decodedUser.userId.toString() !== userId) {
        throw ErrorResponse.UNAUTHORIZED('Access token does not match user ID');
    }
    const reqWithAuth = req as AuthenticatedRequest;

    reqWithAuth.user = {
        userId: decodedUser.userId as string,
        email: decodedUser.email as string,
        roles: decodedUser.roles as string[],
    };
    reqWithAuth.keyToken = keyTokenData;
    req.headers['x-client-id'] = decodedUser.userId as string;
    req.headers['x-client-email'] = decodedUser.email as string;
    req.headers['x-client-roles'] = (decodedUser.roles || []).join(',');
    return next();
};
