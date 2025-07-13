import logger from 'utils/logger';
import { RegisterDto } from 'dtos';
import { getInfoData } from 'utils';
import userRepository from 'repositories/user.repository';
import { ErrorResponse } from 'response';
import { publishCreatUserEvent } from 'kafka/producer/user.producer';
import errorMessage from 'response/htttpResponse/errorMessage';
import { IUser } from 'models/user.model';
import { mapRegisterDtoToUser, mapIUsertoKafkaPayload } from 'mapper';
import { map } from 'lodash';
import { UserRegisterKakfaPayload } from 'dtos/kafka-payload.dto';

export class UserService {
    constructor() {
        logger.info('UserService instance created');
    }

    async creatUser(userData: RegisterDto) {
        /**
         * 1. Extract user information from the provided data.
         */
        const { email } = userData;

        /**
         * 2. Check if the user already exists in the database.
         */
        const existingUser = await userRepository.existsByEmail(email);
        if (existingUser) {
            throw new ErrorResponse(errorMessage.EMAIL_EXISTS, 'Email already exists');
        }
        /**
         * 3. Create a new user in the database.
         */
        const newUser = await userRepository.createUser(mapRegisterDtoToUser(userData) as IUser);

        if (!newUser) {
            throw new ErrorResponse(errorMessage.INTERNAL_SERVER_ERROR, 'Failed to create user');
        }
        /**
         * 4.Check if the user was created successfully.
         */
        const { _id } = newUser;
        if (!_id) {
            throw new ErrorResponse(errorMessage.INTERNAL_SERVER_ERROR, 'User creation failed');
        }

        logger.info('User registration event published successfully');
    }
}
