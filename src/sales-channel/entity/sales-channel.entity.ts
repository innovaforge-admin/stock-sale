import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../../order/entity/order.entity';

@Entity('sale_channel')
export class SalesChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string; // E.g., Web, App, Physical Store, Marketplace-X

  @Column({ type: 'varchar', length: 40, unique: true })
  code: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relation with Order
  @OneToMany(() => Order, (order) => order.salesChannel)
  orders: Order[];
}
