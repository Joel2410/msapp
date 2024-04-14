import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getTenantIdFromRequest } from '@helpers';

export const CurrentTenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return getTenantIdFromRequest(request);
  },
);
