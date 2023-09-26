import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinDTO: SigninDTO) {
    return this.authService.signin(signinDTO);
  }

  @Post('signup')
  signup(@Body() signinDTO: SignupDTO) {
    return this.authService.signup(signinDTO);
  }
}
