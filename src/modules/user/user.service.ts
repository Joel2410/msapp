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

  async findAll(secret = false) {
    const users = await this.usersRepository.find();
    if (secret) {
      return users.map((user) => this.removeSecretProperties(user));
    }
    return users;
  }

  async findOne(id: number, secret = false) {
    let user = await this.usersRepository.findOneBy({ id });
    if (secret) {
      user = this.removeSecretProperties(user);
    }
    return user;
  }

  async findOneByEmail(email: string, secret = false) {
    let user = await this.usersRepository.findOneBy({ email });
    if (secret) {
      user = this.removeSecretProperties(user);
    }
    return user;
  }

  removeSecretProperties(user: User): User {
    delete user.password;
    return user;
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

    user = this.removeSecretProperties(user);

    return user;
  }
}
