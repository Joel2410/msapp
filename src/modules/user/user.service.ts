import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDTO } from '../auth/dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async createOne(signupDTO: SignupDTO) {
    let user: User = this.usersRepository.create({ ...signupDTO });

    try {
      user = await this.usersRepository.save(user);
    } catch (error: any) {
      return { error: error.number, message: error.originalError.message };
    }
    return user;
  }
}
