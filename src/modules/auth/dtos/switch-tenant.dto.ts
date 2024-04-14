import { IsNotEmpty } from 'class-validator';

export class SwitchTenantDTO {
  @IsNotEmpty()
  tenantId: string;
}
