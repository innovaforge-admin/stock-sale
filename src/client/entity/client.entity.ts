import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Address } from '../../address/entity/address.entity';
import { Order } from '../../order/entity/order.entity';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 180, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 180, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  docType: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  docNumber: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Address, (address) => address.client)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];
}
