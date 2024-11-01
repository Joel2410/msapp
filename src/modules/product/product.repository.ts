import { Product } from '@entities/system';
import { Repository } from 'typeorm';

export class ProductRepository extends Repository<Product> {
  constructor(repository: Repository<Product>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findAll(): Promise<Product[]> {
    return this.find();
  }
}
