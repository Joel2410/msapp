import { Injectable } from '@nestjs/common';
import { Product } from '@entities/system';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class ProductService {
  constructor(private databaseService: DatabaseService) {}

  public async getProducts(tenantId: string) {
    const productRepository = this.databaseService.getRepository(
      tenantId,
      Product,
    );

    return productRepository.find();
  }
}
