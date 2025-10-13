import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}