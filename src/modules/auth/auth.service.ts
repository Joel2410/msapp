import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './dtos';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, AccessTokenContent } from 'src/interfaces';
import { User } from 'src/database/entities';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * The function `signIn` in TypeScript handles user authentication by verifying credentials and
   * generating an access token.
   * @param {SignInDTO} signInDTO - The `signInDTO` parameter in the `signIn` function likely
   * represents an object containing the user's sign-in data, such as their email and password. It
   * could have properties like `email` and `password`.
   * @param {string} tenantId - The `tenantId` parameter in the `signIn` function is a string that
   * represents the identifier of the tenant for which the user is signing in. This parameter is used
   * to determine the context or scope of the user's authentication and authorization within a
   * multi-tenant application. It helps in ensuring that the
   * @returns The `signIn` function is returning the result of calling the `getAccessToken` function
   * with the `user` object and `tenantId` as parameters.
   */
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

  /**
   * The signUp function creates a new user using the provided SignUpDTO and returns an access token
   * for the user in a specific tenant.
   * @param {SignUpDTO} signUpDTO - The `signUpDTO` parameter likely contains the data needed to create
   * a new user account, such as the user's email, password, and any other relevant information
   * required for signing up.
   * @param {string} tenantId - The `tenantId` parameter typically represents the identifier of the
   * tenant or organization to which the user belongs. It is used to associate the user with a specific
   * tenant or organization within a multi-tenant application or system.
   * @returns The `getAccessToken` function is being called with the `user` object and `tenantId` as
   * parameters, and the result of this function call is being returned.
   */
  async signUp(signUpDTO: SignUpDTO, tenantId: string) {
    const user = await this.userService.createOne(signUpDTO);
    return await this.getAccessToken(user, tenantId);
  }

  /**
   * The function `getAccessToken` generates and returns an access token for a user within a specific
   * tenant.
   * @param {User} user - The `user` parameter is an object that contains information about the user,
   * such as their `id` and `email`.
   * @param {string} tenantId - The `tenantId` parameter in the `getAccessToken` function is a string
   * that represents the identifier of the tenant for which the access token is being generated. It is
   * used to associate the access token with a specific tenant within the system.
   * @returns An object containing an `accessToken` property, which is the result of signing the
   * `payload` using the `jwtService`.
   */
  async getAccessToken(user: User, tenantId: string): Promise<AccessToken> {
    const payload: AccessTokenContent = {
      userId: user.id,
      email: user.email,
      tenantId,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
