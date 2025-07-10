import { RegisterKafkaPayload } from 'dtos';
import { RegisterDto } from 'dtos';

export const mapRegisterPayloadToDto = (
  payload: RegisterKafkaPayload
): Partial<RegisterDto> => {
  return {
    email: payload.email,
    password: payload.password,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phoneNumber: payload.phoneNumber || undefined,
  };
};
