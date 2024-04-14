import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_TENANT_KEY } from '@config';

export const PublicTenant = () => SetMetadata(IS_PUBLIC_TENANT_KEY, true);
