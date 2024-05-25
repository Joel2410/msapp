import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserToTenantType {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
