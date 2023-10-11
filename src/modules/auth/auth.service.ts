import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/interfaces';
import { User } from 'src/database/entities';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDTO: SignInDTO, tenantId: string) {
    const user = await this.userService.findOneByEmail(signInDTO.email);
    if (!user)
      throw new BadRequestException({ message: 'Invalid credentials' });

    try {
      if (!(await argon2.verify(user.password, signInDTO.password)))
        throw new BadRequestException({ message: 'Invalid credentials' });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return await this.getAccessToken(user, tenantId);
  }

  async signUp(signUpDTO: SignUpDTO, tenantId: string) {
    const user = await this.userService.createOne(signUpDTO);
    return await this.getAccessToken(user, tenantId);
  }

  async getAccessToken(user: User, tenantId: string): Promise<AccessToken> {
    const payload = { userId: user.id, email: user.email, tenantId };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
