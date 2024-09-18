import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, User, UserCompany, UserCompanyRole } from '@entities/msapp';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User, UserCompanyRole, UserCompany]),
    DatabaseModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
