import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  phone: string;
  
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  password: string;
}