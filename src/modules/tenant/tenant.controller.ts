import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateDTO } from './dtos';

@Controller('tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get('get')
  signIn() {
    return this.tenantService.find();
  }

  @Post('create')
  signUp(
    @Request() req: { user: { userId: number } },
    @Body() createDTO: CreateDTO,
  ) {
    return this.tenantService.create(req.user.userId, createDTO.tenantId);
  }
}
