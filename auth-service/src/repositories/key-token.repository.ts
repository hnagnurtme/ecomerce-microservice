import KeyModel, { IKeyToken } from 'models/key-token.model';
import logger from 'utils/logger';

export class KeyTokenRepository {
    async findByUserId(userId: string): Promise<IKeyToken | null> {
        logger.info('KeyTokenRepository: findByUserId', { userId });
        return await KeyModel.findOne({
            user: userId,
        }).lean();
    }

    async createKeyToken(
        userId: string,
        publicKey: string,
        privateKey: string,
        refreshToken: string | null = null,
    ): Promise<string> {
        const filter = { user: userId };
        const update = {
            publicKey,
            privateKey,
            refreshToken,
            refreshTokenUsed: [],
        };
        const options = {
            upsert: true,
            new: true,
        };

        const keyToken = await KeyModel.findOneAndUpdate(filter, update, options);

        return keyToken?.publicKey || '';
    }
}
export default new KeyTokenRepository();
