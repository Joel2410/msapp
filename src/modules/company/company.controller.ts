import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDTO } from './dtos';
import { UserDTO } from '../user/dtos';
import { CurrentUser } from '../../decorators';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  getAll(@CurrentUser() user: UserDTO) {
    return this.companyService.find(user);
  }

  @Post('create')
  signUp(@CurrentUser() user: UserDTO, @Body() createDTO: CreateCompanyDTO) {
    return this.companyService.create(user.userId, createDTO.tenant);
  }
}
