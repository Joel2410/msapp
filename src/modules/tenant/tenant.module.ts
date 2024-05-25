import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { Tenant, User, UserToTenant, UserToTenantType } from '@entities/msapp';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, User, UserToTenantType, UserToTenant]),
    DatabaseModule,
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
