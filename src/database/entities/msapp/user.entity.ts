import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserCompany } from './user-company.entity';

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

  @OneToMany(() => UserCompany, (userCompany) => userCompany.user)
  companies: UserCompany[];
}
