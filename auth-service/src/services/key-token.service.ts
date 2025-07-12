import keyTokenModel from 'models/key-token.model';
import logger from 'utils/logger';

export class KeyTokenService {
  constructor() {
    logger.info('KeyTokenService instance created');
  }
  async generateKeyToken(
    userId: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string | null = null
  ): Promise<string> {
    try {
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

      const keyToken = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      if (!keyToken) {
        throw new Error('Failed to generate key token');
      }
      logger.info('Key token generated successfully', { userId });
      return keyToken.publicKey;
    } catch (error) {
      logger.error('Error generating key token', { error, userId });
      throw new Error('Failed to generate key token');
    }
  }
}
