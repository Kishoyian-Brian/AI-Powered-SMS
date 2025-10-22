import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}








