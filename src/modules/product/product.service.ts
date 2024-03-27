import { Injectable } from '@nestjs/common';
import { Product } from 'src/database/entities';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class ProductService {
  constructor(private tenantService: TenantService) {}

  public async getProducts(tenantId: string) {
    const productRepository = this.tenantService.getRepository(
      tenantId,
      Product,
    );

    return productRepository.find();
  }
}
