import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO, SwitchCompanyDTO } from './dtos';
import { CurrentTenant, CurrentUser, Public, PublicTenant } from '@decorators';
import { UserDTO } from '../user/dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDTO: SignInDTO, @CurrentTenant() tenant: string) {
    return this.authService.signIn(signInDTO, tenant);
  }

  @Public()
  @Post('signUp')
  signUp(@Body() signUpDTO: SignUpDTO, @CurrentTenant() tenant: string) {
    return this.authService.signUp(signUpDTO, tenant);
  }

  @PublicTenant()
  @Put('switchTenant')
  switchTenant(
    @CurrentUser() userDTO: UserDTO,
    @Body() switchCompanyDTO: SwitchCompanyDTO,
  ) {
    return this.authService.switchTenant(userDTO, switchCompanyDTO.tenant);
  }
}
