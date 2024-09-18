import { IsNotEmpty } from 'class-validator';

export class SwitchCompanyDTO {
  @IsNotEmpty()
  tenant: string;
}
