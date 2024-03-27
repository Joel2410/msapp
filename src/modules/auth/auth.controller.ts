import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dtos';
import { CurrentTenantId, Public } from '../../decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDTO: SignInDTO, @CurrentTenantId() tenantId: string) {
    return this.authService.signIn(signInDTO, tenantId);
  }

  @Public()
  @Post('signUp')
  signUp(@Body() signUpDTO: SignUpDTO, @CurrentTenantId() tenantId: string) {
    return this.authService.signUp(signUpDTO, tenantId);
  }
}
