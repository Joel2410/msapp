import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dtos';
import { Public } from 'src/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDTO: SignInDTO, @Req() req: any) {
    const tenantId = req.tenantId;
    return this.authService.signIn(signInDTO, tenantId);
  }

  @Public()
  @Post('signUp')
  signUp(@Body() signUpDTO: SignUpDTO, @Req() req: any) {
    const tenantId = req.tenantId;
    return this.authService.signUp(signUpDTO, tenantId);
  }
}
