import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dtos';
import { CurrentTenatId, Public } from 'src/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDTO: SignInDTO, @CurrentTenatId() tenantId: string) {
    return this.authService.signIn(signInDTO, tenantId);
  }

  @Public()
  @Post('signUp')
  signUp(@Body() signUpDTO: SignUpDTO, @CurrentTenatId() tenantId: string) {
    return this.authService.signUp(signUpDTO, tenantId);
  }
}
