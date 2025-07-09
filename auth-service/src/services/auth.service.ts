import logger from 'utils/logger';
import { RegisterDto } from 'dtos';
import { getInfoData } from 'utils';
import userRepository from 'repositories/user.repository';
import { ErrorResponse } from 'response';
import { publishUserRegisterEvent } from 'kafka/producer/user.producer';
import errorMessage from 'response/htttpResponse/errorMessage';
export class AuthService {
  constructor() {
    logger.info('AuthService instance created');
  }

  async register(
    userData: RegisterDto
  ): Promise<{ user: Partial<RegisterDto> }> {
    /**
     * 1. Extract user information from the provided data.
     */
    const { email, firstName, lastName, password, phoneNumber } = userData;

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
     * 3. Send message kafka to create a new user.
     */

    await publishUserRegisterEvent(userData);

    return {
      user: getInfoData({
        fields: ['email', 'firstName', 'lastName'],
        object: userData,
      }),
    };
  }
}
