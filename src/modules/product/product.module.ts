import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule, DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
