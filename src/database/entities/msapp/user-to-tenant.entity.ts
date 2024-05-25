import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserToTenantType } from './user-to-tenant-type.entity';

@Entity()
export class UserToTenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  tenantId: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserToTenantType)
  type: UserToTenantType;
}
