import { MinLength, MaxLength } from 'class-validator';

export class CreateCompanyDTO {
  @MinLength(4)
  @MaxLength(16)
  tenant: string;
}
