import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { UserToTenant } from './user-to-tenant.entity';

@Entity()
export class Tenant {
  @PrimaryColumn()
  id: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserToTenant, (userToTenant) => userToTenant.tenant)
  userToTenants: UserToTenant[];
}
