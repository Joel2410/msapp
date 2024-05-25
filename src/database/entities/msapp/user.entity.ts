import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserToTenant } from './user-to-tenant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserToTenant, (userToTenant) => userToTenant.user)
  userToTenants: UserToTenant[];
}
