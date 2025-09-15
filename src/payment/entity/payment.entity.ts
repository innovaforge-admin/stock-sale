import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../../order/entity/order.entity';
import { PaymentStatus, PaymentMethod } from '../../order/enum/order.enums';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: false })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    nullable: false,
  })
  status: PaymentStatus;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'ARS' })
  currency: string;

  @Column({ type: 'timestamptz', nullable: true })
  authorizedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  capturedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  canceledAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
