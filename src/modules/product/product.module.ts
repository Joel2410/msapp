import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [TenantModule, DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
