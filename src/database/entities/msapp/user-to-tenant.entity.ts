import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserToTenantType } from './user-to-tenant-type.entity';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

@Entity()
export class UserToTenant {
  @PrimaryGeneratedColumn()
  id: number;

  userId: number;
  tenantId: string;
  typeId: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @ManyToOne(() => UserToTenantType)
  type: UserToTenantType;
}
