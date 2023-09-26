import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class SigninDTO {
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(16)
  password: string;
}
