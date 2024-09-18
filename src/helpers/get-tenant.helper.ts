import { Request } from 'express';
import { DEFAULT_TENANT } from '@config';

export const getTenantFromRequest = (request: Request) =>
  request?.headers?.host.split('.')[0] || DEFAULT_TENANT;
