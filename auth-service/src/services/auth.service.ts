import logger from 'utils/logger';
import { RegisterDto, RegisterKafkaPayload } from 'dtos';
import bcrypt from 'bcrypt';
import userRepository from 'repositories/user.repository';
import { ErrorResponse } from 'response';
import { publishUserRegisterEvent } from 'kafka/producer/user.producer';
import errorMessage from 'response/htttpResponse/errorMessage';
import { mapRegiterDtoToKafka } from 'mapper';
import { PROJECT_CONSTANTS } from 'utils';
export class AuthService {
  constructor() {
    logger.info('AuthService instance created');
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
      throw new ErrorResponse(
        errorMessage.EMAIL_EXISTS,
        'Email already exists'
      );
    }
    /**
     * 3. Hash the password with bcrypt.
     */
    const hashedPassword = await bcrypt.hash(
      password,
      PROJECT_CONSTANTS.BCRYPT_SALT_ROUNDS
    );
    if (!hashedPassword) {
      throw new ErrorResponse(
        errorMessage.INTERNAL_SERVER_ERROR,
        'Failed to hash password'
      );
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
}
