import { MinLength, MaxLength } from 'class-validator';

export class CreateDTO {
  @MinLength(4)
  @MaxLength(16)
  tenantId: string;
}
