import { IsEmail, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(16)
  password: string;
}
