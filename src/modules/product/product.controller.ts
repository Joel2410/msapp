import { Controller, Get } from '@nestjs/common';
import { CurrentTenantId } from 'src/decorators';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@CurrentTenantId() tenantId: string) {
    return this.productService.getProducts(tenantId);
  }
}
