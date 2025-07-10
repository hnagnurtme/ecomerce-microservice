import { UserRegisterKakfaPayload } from 'dtos/kafka-payload.dto';
import { IUser } from 'models/user.model';

export const mapIUsertoKafkaPayload = (
  user: IUser
): Partial<UserRegisterKakfaPayload> => {
  return {
    userId: String(user._id),
    email: user.email,
  };
};
