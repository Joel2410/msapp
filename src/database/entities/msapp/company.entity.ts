import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserCompany } from './user-company.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tenant: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  userCompanies: UserCompany[];
}
