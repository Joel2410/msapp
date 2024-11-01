import { Product } from '@entities/system';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  private productRepository(tenant: string): ProductRepository {
    return new ProductRepository(
      this.databaseService.getRepository(tenant, Product),
    );
  }

  constructor(private databaseService: DatabaseService) {}

  async getProducts(tenant: string): Promise<Product[]> {
    return this.productRepository(tenant).findAll();
  }

  async getProductById(tenant: string, id: number): Promise<Product> {
    return this.productRepository(tenant).findOneBy({ id });
  }
}
