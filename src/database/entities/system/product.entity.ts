import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ unique: true })
  reference: string;

  @Column()
  price: number;

  @Column()
  cost: number;

  @Column({ default: true })
  isActive: boolean;
}
