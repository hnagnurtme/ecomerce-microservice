import { NextFunction, Request, Response } from 'express';
import { KeyTokenService } from 'services';
import logger from 'utils/logger';
import { ErrorResponse, SuccessResponse } from 'response';

export class TokenController {
    private keyTokenService: KeyTokenService;

    constructor() {
        this.keyTokenService = new KeyTokenService();
        logger.info('AuthController instance created');
    }

    async getTokenByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.query.userId as string;
            if (!userId) {
                throw ErrorResponse.BADREQUEST('User ID is required');
            }
            logger.info('Fetching key token for user', userId);
            SuccessResponse.OK(await this.keyTokenService.getKeyTokenByUserId(userId)).send(res);
        } catch (error) {
            logger.error('Error in TokenController.getTokenByUserId:', error);
            next(error);
        }
    }
}
