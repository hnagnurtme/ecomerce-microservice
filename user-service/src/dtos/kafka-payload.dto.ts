import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterKakfaPayload {
  @IsString({ message: 'First name is required' })
  userId!: string;
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;
}
