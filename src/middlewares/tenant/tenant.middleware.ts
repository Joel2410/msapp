import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: NextFunction) {
    const host = req.headers.host;
    const tenantId = host.split('.')[0];
    req.tenantId = tenantId;
    next();
  }
}
