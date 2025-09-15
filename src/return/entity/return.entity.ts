import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../../order/entity/order.entity';
import { ReturnStatus } from '../../order/enum/order.enums';
import { ReturnItem } from './return-item.entity';

@Entity('return')
export class Return {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  orderId: number;

  @Column({
    type: 'enum',
    enum: ReturnStatus,
    default: ReturnStatus.OPEN,
    nullable: false,
  })
  status: ReturnStatus;

  @Column({ type: 'varchar', length: 200, nullable: true })
  generalReason: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    default: 0,
    nullable: false,
  })
  totalRefund: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  closedAt: Date;

  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @OneToMany(() => ReturnItem, (returnItem) => returnItem.return, {
    cascade: ['insert'],
  })
  returnItems: ReturnItem[];
}
