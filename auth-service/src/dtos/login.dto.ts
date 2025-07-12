import { IsEmail, IsString, MinLength } from 'class-validator';
export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  refreshToken?: string;
}
