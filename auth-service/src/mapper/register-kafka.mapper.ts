import { RegisterKafkaPayload } from 'dtos';
import { RegisterDto } from 'dtos';

export const mapRegiterDtoToKafka = (user: RegisterDto): Partial<RegisterKafkaPayload> => {
    return {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || undefined,
    };
};
