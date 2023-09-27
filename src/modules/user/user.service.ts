import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDTO } from '../auth/dtos';
import { ErrorInterface } from 'src/utils/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async createOne(signUpDTO: SignUpDTO) {
    let user = this.usersRepository.create({ ...signUpDTO });

    try {
      user = await this.usersRepository.save(user);
    } catch (error: any) {
      const mappedError: ErrorInterface = {
        error: error.number,
        message:
          error.number == 2627
            ? 'This email has been used'
            : error.originalError.message,
      };

      throw new BadRequestException(mappedError);
    }

    delete user.password;
    return user;
  }
}
