import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const user = await this.userService.findOneByEmail(signInDTO.email);
    if (!user)
      throw new BadRequestException({ message: 'Invalid credentials' });

    try {
      if (!(await argon2.verify(user.password, signInDTO.password)))
        throw new BadRequestException({ message: 'Invalid credentials' });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return await this.getAccessToken(user);
  }

  async signUp(signUpDTO: SignUpDTO) {
    const user = await this.userService.createOne(signUpDTO);
    return await this.getAccessToken(user);
  }

  async getAccessToken(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id, username: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
