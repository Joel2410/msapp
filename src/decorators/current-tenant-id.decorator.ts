import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getTenantId } from '../helpers';

export const CurrentTenatId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return getTenantId(request);
  },
);
