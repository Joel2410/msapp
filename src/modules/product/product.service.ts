import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '@entities/system';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class ProductService {
  constructor(private databaseService: DatabaseService) {}

  private productRepository(tenant: string): Repository<Product> {
    return this.databaseService.getRepository(tenant, Product);
  }

  async getProducts(tenant: string): Promise<Product[]> {
    return this.productRepository(tenant).find();
  }

  async getProductById(tenant: string, id: number): Promise<Product> {
    return this.productRepository(tenant).findOneBy({ id });
  }
}
