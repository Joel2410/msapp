import { Injectable } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signIn(signInDTO: SignInDTO) {
    return signInDTO;
  }

  signUp(signUpDTO: SignUpDTO) {
    return this.userService.createOne(signUpDTO);
  }
}
