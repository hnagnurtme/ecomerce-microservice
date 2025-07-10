import { RegisterDto } from 'dtos/register.dto';
import { IUser } from 'models/user.model';

export const mapRegisterDtoToUser = (dto: RegisterDto): Partial<IUser> => {
  return {
    email: dto.email,
    password: dto.password,
    name: `${dto.firstName} ${dto.lastName}`,
    status: 'active',
    verify: false,
    roles: ['user'],
  };
};
