import { Controller, Get } from '@nestjs/common';
import { CurrentTenant } from 'src/decorators';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@CurrentTenant() tenant: string) {
    return this.productService.getProducts(tenant);
  }
}
