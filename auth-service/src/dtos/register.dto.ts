import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Match } from 'validators/match.decorator';
export class RegisterDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsString({ message: 'Confirm password is required' })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @IsString({ message: 'First name is required' })
  firstName!: string;

  @IsString({ message: 'Last name is required' })
  lastName!: string;

  @IsOptional()
  @Matches(/^[0-9+().\s-]{8,20}$/, { message: 'Phone number is invalid' })
  phoneNumber?: string;
}
