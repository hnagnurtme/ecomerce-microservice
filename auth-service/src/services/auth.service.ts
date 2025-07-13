import logger from 'utils/logger';
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterKafkaPayload,
} from 'dtos';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import userRepository from 'repositories/user.repository';
import { ErrorResponse } from 'response';
import { publishUserRegisterEvent } from 'kafka/producer/user.producer';
import errorMessage from 'response/htttpResponse/errorMessage';
import { mapRegiterDtoToKafka } from 'mapper';
import { convertToIdString, convertToObjectId, PROJECT_CONSTANTS } from 'utils';
import { KeyTokenService } from './key-token.service';
import { createTokenPair } from 'utils';
import { IUser } from 'models/user.model';

export class AuthService {
  private readonly keyTokenService: KeyTokenService;
  constructor() {
    logger.info('AuthService instance created');
    this.keyTokenService = new KeyTokenService();
  }

  async register(userData: RegisterDto): Promise<{ message: string }> {
    /**
     * 1. Extract user information from the provided data.
     */
    const { email, password } = userData;
    /**
     * 2. Check if the user already exists in the database.
     */
    const existingUser = await userRepository.existsByEmail(email);
    if (existingUser) {
      throw ErrorResponse.UNAUTHORIZED(errorMessage.USER_EXISTS);
    }
    /**
     * 3. Hash the password with bcrypt.
     */
    const hashedPassword = await bcrypt.hash(
      password,
      PROJECT_CONSTANTS.BCRYPT_SALT_ROUNDS
    );
    if (!hashedPassword) {
      throw ErrorResponse.INTERNAL('Failed to hash password');
    }
    userData.password = hashedPassword;

    /**
     * 4. Send message kafka to create a new user.
     */

    publishUserRegisterEvent(
      mapRegiterDtoToKafka(userData) as RegisterKafkaPayload
    );
    /**
     * 5. Return the user information.
     */
    logger.info('User registered successfully', { email });

    return {
      message: 'User registered successfully',
    };
  }

  async login(userData: LoginDto): Promise<LoginResponse> {
    /**
     * 1. Extract user information from the provided data.
     */
    const { email, password } = userData;
    /**
     * 2. Check if the user exists in the database.
     */
    const existingUser = await userRepository.findByEmail(email);
    if (!existingUser) {
      throw ErrorResponse.UNAUTHORIZED(errorMessage.USER_NOT_EXISTS);
    }
    const userId = convertToIdString(String(existingUser._id));
    const userRoles = existingUser.roles || [];
    /**
     * 3. Compare the provided password with the stored hashed password.
     */
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw ErrorResponse.UNAUTHORIZED(errorMessage.INCORRECT_PASSWORD);
    }
    /**
     * 4. Create a key pair token for the user. for RSA algorithm, we need to generate a key pair token.
     */
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
    /**
     * 6. Create and return the token pair.
     */
    const tokenPair = await createTokenPair(
      { userId, email, roles: userRoles },
      publicKey,
      privateKey
    );
    const { accessToken, refreshToken } = tokenPair;
    /**
     * 5. Save the key pair token to the database.
     */

    const keyTokenStore = await this.keyTokenService.generateKeyToken(
      userId,
      publicKey,
      privateKey,
      refreshToken
    );

    if (!keyTokenStore) {
      throw ErrorResponse.INTERNAL(errorMessage.INTERNAL_SERVER_ERROR);
    }
    logger.info(
      'Keytoken',
      { userId, publicKey, privateKey, refreshToken },
      keyTokenStore
    );

    /**
     * 7. Return the IUser and IKeyToken in LoginResponse.
     */
    const user: Partial<IUser> = {
      _id: userId,
      email: existingUser.email,
      name: existingUser.name,
      roles: existingUser.roles,
    };

    return new LoginResponse(accessToken, refreshToken, user);
  }
}
