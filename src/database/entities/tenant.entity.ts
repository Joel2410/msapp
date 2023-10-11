import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: number;

  @Column({ default: true })
  isActive: boolean;
}
