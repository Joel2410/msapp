import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DEFAULT_TENANT } from '../helpers';

export const CurrentTenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request['tenandId'] ?? DEFAULT_TENANT;
  },
);
