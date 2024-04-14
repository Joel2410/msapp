import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDTO } from '../auth/dtos';
import { getError } from 'src/helpers';
import * as argon2 from 'argon2';
import { User } from '@entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(showSecrets?: boolean) {
    const users = await this.usersRepository.find();
    if (!showSecrets) {
      return users.map((user) => this.removeSecretProperties(user));
    }
    return users;
  }

  async findOneById(id: number, showSecrets?: boolean) {
    let user = await this.usersRepository.findOneBy({ id });
    if (!showSecrets) {
      user = this.removeSecretProperties(user);
    }
    return user;
  }

  async findOneByEmail(email: string, showSecrets?: boolean) {
    let user = await this.usersRepository.findOneBy({ email });
    if (!showSecrets) {
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
