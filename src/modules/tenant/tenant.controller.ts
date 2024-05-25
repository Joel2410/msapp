import { Body, Controller, Get, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDTO } from './dtos';
import { UserDTO } from '../user/dtos';
import { CurrentUser } from '../../decorators';

@Controller('tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  getAll(@CurrentUser() user: UserDTO) {
    return this.tenantService.find(user);
  }

  @Post('create')
  signUp(@CurrentUser() user: UserDTO, @Body() createDTO: CreateTenantDTO) {
    return this.tenantService.create(user.userId, createDTO.tenantId);
  }
}
