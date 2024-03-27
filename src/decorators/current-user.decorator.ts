import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDTO } from '../modules/user/dtos';

export const CurrentUser = createParamDecorator<UserDTO>(
  (_data: unknown, ctx: ExecutionContext): UserDTO => {
    const request = ctx.switchToHttp().getRequest();
    request.user.clientIp = request.ip;
    return request.user;
  },
);
