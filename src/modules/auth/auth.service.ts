import { Injectable } from '@nestjs/common';
import { SigninDTO, SignupDTO } from './dtos';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signin(signinDTO: SigninDTO) {
    return signinDTO;
  }

  signup(signupDTO: SignupDTO) {
    return this.userService.createOne(signupDTO);
  }
}
