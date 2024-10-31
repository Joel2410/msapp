import * as argon2 from 'argon2';
import {
  InternalServerErrorException,
  Injectable,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from '../auth/dtos';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {}

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async createOne(signUpDTO: SignUpDTO) {
    try {
      signUpDTO.password = await argon2.hash(signUpDTO.password);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    let user = this.usersRepository.create({ ...signUpDTO });

    try {
      user = await this.usersRepository.save(user);
    } catch (error) {
      if (error as typeof ConflictException) {
        throw new ConflictException({
          show: true,
          message: 'This email has been used',
        });
      }
    }

    return user;
  }
}
