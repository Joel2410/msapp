import { IsEmail, Length } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;

  @Length(4, 16)
  password: string;
}
