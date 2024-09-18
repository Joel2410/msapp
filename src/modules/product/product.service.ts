import { Injectable } from '@nestjs/common';
import { Product } from '@entities/system';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class ProductService {
  constructor(private databaseService: DatabaseService) {}

  public async getProducts(tenant: string) {
    const productRepository = this.databaseService.getRepository(
      tenant,
      Product,
    );

    return productRepository.find();
  }
}
