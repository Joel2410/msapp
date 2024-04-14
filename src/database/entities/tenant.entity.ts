import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryColumn()
  id: string;

  @Column({ default: true })
  isActive: boolean;
}
