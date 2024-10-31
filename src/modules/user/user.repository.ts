import { User } from '@entities/msapp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findAll(): Promise<User[]> {
    return this.repository.find();
  }
}
