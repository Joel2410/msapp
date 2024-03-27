import { MinLength, MaxLength } from 'class-validator';

export class CreateTenantDTO {
  @MinLength(4)
  @MaxLength(16)
  tenantId: string;
}
