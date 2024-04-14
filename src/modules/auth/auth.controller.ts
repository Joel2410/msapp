import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO, SwitchTenantDTO } from './dtos';
import {
  CurrentTenantId,
  CurrentUser,
  Public,
  PublicTenant,
} from '@decorators';
import { UserDTO } from '../user/dtos';

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

  @PublicTenant()
  @Put('switchTenant')
  switchTenant(
    @CurrentUser() userDTO: UserDTO,
    @Body() switchTenantDTO: SwitchTenantDTO,
  ) {
    return this.authService.switchTenant(userDTO, switchTenantDTO.tenantId);
  }
}
