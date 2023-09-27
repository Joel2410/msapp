import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDTO } from '../auth/dtos';
import { getError } from 'src/utils';
import * as argon2 from 'argon2';

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

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async createOne(signUpDTO: SignUpDTO) {
    try {
      signUpDTO.password = await argon2.hash(signUpDTO.password);
    } catch (error) {
      throw new InternalServerErrorException(getError(error));
    }

    let user = this.usersRepository.create({ ...signUpDTO });

    try {
      user = await this.usersRepository.save(user);
    } catch (error: any) {
      throw new BadRequestException(
        getError(error, [{ error: 2627, message: 'This email has been used' }]),
      );
    }

    delete user.password;
    return user;
  }
}
