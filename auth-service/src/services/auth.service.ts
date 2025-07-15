import logger from 'utils/logger';
import axios from 'axios';
import { LoginDto, LoginResponse, RegisterDto, RegisterKafkaPayload } from 'dtos';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ErrorResponse } from 'response';
import { publishUserRegisterEvent } from 'kafka/producer/user.producer';
import errorMessage from 'response/htttpResponse/errorMessage';
import { mapRegiterDtoToKafka } from 'mapper';
import { convertToIdString, PROJECT_CONSTANTS } from 'utils';
import { KeyTokenService } from './key-token.service';
import { createTokenPair } from 'utils';
import { IUser } from 'models/user.model';
import { HttpService } from 'utils/httpClient';
export class AuthService {
    private readonly keyTokenService: KeyTokenService;
    private readonly userService: HttpService;
    constructor() {
        logger.info('AuthService instance created');
        this.keyTokenService = new KeyTokenService();
        this.userService = new HttpService(
            process.env.USER_SERVICE_URL || 'http://user-service:3002',
        );
    }

    async register(userData: RegisterDto): Promise<{ message: string }> {
        /**
         * 1. Extract user information from the provided data.
         */
        const { email, password } = userData;
        /**
         * 2. Call api getUserByEmail to check if the user already exists.
         */

        const result = await this.userService.get<any>(`/api/v1/users?email=${email}`);

        if (result.success && result.data) {
            logger.info('User already exists', {
                email,
                existingUser: result.data,
            });

            throw ErrorResponse.CONFLICT(errorMessage.USER_EXISTS);
        }

        if (!result.success && result.statusCode !== 404) {
            logger.error('Error checking user existence', {
                email,
                message: result.message,
                status: result.statusCode,
                error: result.error,
            });

            throw ErrorResponse.INTERNAL(errorMessage.INTERNAL_SERVER_ERROR);
        }

        logger.info('User does not exist, proceeding with registration', { email });

        /**
         * 3. Hash the password with bcrypt.
         */
        const hashedPassword = await bcrypt.hash(password, PROJECT_CONSTANTS.BCRYPT_SALT_ROUNDS);
        if (!hashedPassword) {
            throw ErrorResponse.INTERNAL('Failed to hash password');
        }
        userData.password = hashedPassword;

        /**
         * 4. Send message kafka to create a new user.
         */
        // Gửi request tạo user mới
        const createUserResult = await this.userService.post<any>('/api/v1/users', userData);

        // Xử lý kết quả
        if (!createUserResult.success) {
            logger.error('Failed to create user in user-service', {
                message: createUserResult.message,
                status: createUserResult.statusCode,
                error: createUserResult.error,
            });

            if (createUserResult.statusCode === 409) {
                throw ErrorResponse.CONFLICT(createUserResult.message);
            }

            throw ErrorResponse.INTERNAL(
                createUserResult.message || errorMessage.INTERNAL_SERVER_ERROR,
            );
        }

        // Thành công
        logger.info('Created user in user-service', {
            userId: createUserResult.data?._id,
            email: createUserResult.data?.email,
        });

        /**
         * 5. Return the user information.
         */

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
         * 2. Check if the user exists
         */

        const userResult = await this.userService.get<IUser>(`/api/v1/users?email=${email}`);

        // Nếu không tìm thấy → throw lỗi
        if (!userResult.success || !userResult.data) {
            logger.warn('User not found during login', {
                email,
                statusCode: userResult.statusCode,
                error: userResult.error,
            });

            throw ErrorResponse.NOTFOUND(errorMessage.USER_NOT_EXISTS);
        }

        // Nếu tìm thấy → trích thông tin user
        const existingUser = {
            _id: userResult.data._id,
            email: userResult.data.email,
            name: userResult.data.name,
            roles: userResult.data.roles,
            password: userResult.data.password, // dùng để verify mật khẩu
        } as IUser;

        const userId = convertToIdString(String(existingUser._id));
        const userRoles = existingUser.roles || [];
        /**
         * 3. Compare the provided password with the stored hashed password.
         */
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
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
            privateKey,
        );
        const { accessToken, refreshToken } = tokenPair;
        /**
         * 5. Save the key pair token to the database.
         */

        const keyTokenStore = await this.keyTokenService.generateKeyToken(
            userId,
            publicKey,
            privateKey,
            refreshToken,
        );

        if (!keyTokenStore) {
            throw ErrorResponse.INTERNAL(errorMessage.INTERNAL_SERVER_ERROR);
        }
        logger.info('Keytoken', { userId, publicKey, privateKey, refreshToken }, keyTokenStore);

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
