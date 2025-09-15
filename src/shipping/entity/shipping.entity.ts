import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../../order/entity/order.entity';
import { ShippingStatus } from '../../order/enum/order.enums';

@Entity('shipping')
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  method: string;

  @Column({
    type: 'enum',
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
    nullable: false,
  })
  status: ShippingStatus;

  @Column({ type: 'varchar', length: 120, nullable: true })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  courier: string;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    nullable: false,
  })
  cost: number;

  @Column({ type: 'timestamptz', nullable: true })
  dispatchDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deliveryDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relation with Order
  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
