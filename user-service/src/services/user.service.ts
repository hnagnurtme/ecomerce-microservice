import logger from 'utils/logger';
import { RegisterDto } from 'dtos';
import userRepository from 'repositories/user.repository';
import { ErrorResponse } from 'response';
import errorMessage from 'response/htttpResponse/errorMessage';
import { IUser } from 'models/user.model';
import { mapRegisterDtoToUser } from 'mapper';
import { getInfoData } from 'utils';
export class UserService {
    constructor() {
        logger.info('UserService instance created');
    }

    async creatUser(userData: RegisterDto): Promise<Partial<IUser>> {
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
        /**
         * 5. Map the user data to the Kafka payload format.
         */
        /**
         * 6. Return the Kafka payload.
         */
        return getInfoData({
            fields: ['_id', 'email', 'name', 'roles'],
            object: newUser,
        });
    }

    async getUserById(userId: string): Promise<Partial<IUser>> {
        /**
         * 1. Validate the user ID.
         */
        if (!userId) {
            throw new ErrorResponse(errorMessage.MISSING_INPUTS, 'User ID is required');
        }
        /**
         * 2. Fetch the user from the database.
         */
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new ErrorResponse(errorMessage.USER_NOT_EXISTS, 'User not found');
        }
        return getInfoData({
            fields: ['_id', 'email', 'name', 'roles'],
            object: user,
        });
    }

    async getUserByEmail(email: string): Promise<Partial<IUser> | null> {
        /**
         * 1. Validate the email.
         */
        if (!email) {
            throw ErrorResponse.INTERNAL(errorMessage.MISSING_INPUTS, 'Email is required');
        }
        /**
         * 2. Fetch the user by email from the database.
         */
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw ErrorResponse.NOTFOUND(errorMessage.USER_NOT_EXISTS, 'User not found');
        }
        return getInfoData({
            fields: ['_id', 'email', 'name', 'roles', 'password'],
            object: user,
        });
    }
}
