import keyTokenModel, { IKeyToken } from 'models/key-token.model';
import keyTokenRepository from 'repositories/key-token.repository';
import { ErrorResponse } from 'response';
import logger from 'utils/logger';
import { getInfoData } from 'utils';
export class KeyTokenService {
    constructor() {
        logger.info('KeyTokenService instance created');
    }
    async generateKeyToken(
        userId: string,
        publicKey: string,
        privateKey: string,
        refreshToken: string | null = null,
    ): Promise<string> {
        const createdToken = await keyTokenRepository.createKeyToken(
            userId,
            publicKey,
            privateKey,
            refreshToken,
        );
        if (!createdToken) {
            logger.error('Failed to create key token', { userId });
            throw ErrorResponse.INTERNAL('Failed to create key token');
        }
        logger.info('Key token created successfully', { userId, publicKey });
        return createdToken;
    }

    async getKeyTokenByUserId(userId: string): Promise<Partial<IKeyToken>> {
        if (!userId) {
            logger.warn('User ID is required to retrieve key token');
            throw ErrorResponse.BADREQUEST('User ID is required');
        }
        const keyToken = await keyTokenRepository.findByUserId(userId);
        if (!keyToken) {
            logger.warn('Key token not found for user', { userId });
            throw ErrorResponse.NOTFOUND('Key token not found');
        }
        logger.info('Key token retrieved successfully', { userId });
        return getInfoData({
            fields: ['publicKey'],
            object: keyToken,
        });
    }
}
