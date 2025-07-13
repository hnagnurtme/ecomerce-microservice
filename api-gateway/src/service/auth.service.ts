import { HEADER } from 'utils';
import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from 'response';
import { KeyTokenRepository } from 'repositories';
import logger from 'utils/logger';
import JWT, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from 'request/authenciation.request';

export class AuthService {
    private readonly keyTokenRepository: KeyTokenRepository;
    constructor() {
        logger.info('AuthService instance created');
        this.keyTokenRepository = new KeyTokenRepository();
    }
    async authenciation(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.headers[HEADER.CLIENT_ID] as string;
        if (!userId) {
            throw ErrorResponse.UNAUTHORIZED('Client ID is required');
        }
        const keyTokenData = await this.keyTokenRepository.findByUserId(userId);
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
        return next();
    }
}
