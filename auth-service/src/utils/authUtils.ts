import jwt from 'jsonwebtoken';
import appConfig from 'config/app.config';

export const createTokenPair = (
  payload: any,
  publicKey: string,
  privateKey: string
): { accessToken: string; refreshToken: string } => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1d',
      keyid: publicKey,
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
      keyid: publicKey,
    });

    // Verify the tokens
    jwt.verify(
      accessToken,
      publicKey,
      { algorithms: ['RS256'] },
      (err, decode) => {
        if (err) {
          throw new Error('Access token is invalid');
        }
        console.log('Access token is valid', decode);
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error('Failed to create token pair');
  }
};
