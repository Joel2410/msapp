import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signIn(signInDTO: SignInDTO) {
    const user = await this.userService.findOneByEmail(signInDTO.email);
    if (!user)
      throw new BadRequestException({ message: 'Invalid credentials' });

    if (!(await argon2.verify(user.password, signInDTO.password)))
      throw new BadRequestException({ message: 'Invalid credentials' });

    delete user.password;
    return user;
  }

  signUp(signUpDTO: SignUpDTO) {
    return this.userService.createOne(signUpDTO);
  }
}
