import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getTenantFromRequest } from '@helpers';

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return getTenantFromRequest(request);
  },
);
