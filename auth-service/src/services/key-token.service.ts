import logger from 'utils/logger';

export class KeyTokenService {
  constructor() {
    logger.info('KeyTokenService instance created');
  }
  async generateKeyToken(userId: string): Promise<string> {
    // Simulate key token generation logic
    // For example, generate a simple token using userId and current timestamp
    const token = `${userId}-${Date.now()}`;
    return token;
  }
}
