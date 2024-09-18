import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserCompanyRole } from './user-company-role.entity';
import { Company } from './company.entity';
import { User } from './user.entity';

@Entity()
export class UserCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  companyId: number;

  @Column()
  roleId: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Company)
  company: Company;

  @ManyToOne(() => UserCompanyRole)
  role: UserCompanyRole;
}
