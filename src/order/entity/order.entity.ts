import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../client/entity/client.entity';
import { Address } from '../../address/entity/address.entity';
import { SalesChannel } from '../../sales-channel/entity/sales-channel.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enum/order.enums';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40, unique: true, nullable: false })
  number: string;

  @Column({ type: 'int', nullable: false })
  clientId: number;

  @Column({ type: 'int', nullable: true })
  shippingAddressId: number;

  @Column({ type: 'int', nullable: false })
  salesChannelId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
    nullable: false,
  })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 3, default: 'ARS' })
  currency: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  netSubtotal: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  totalDiscount: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  totalTax: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  shippingTotal: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Client, (client) => client.orders)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'shippingAddressId' })
  shippingAddress: Address;

  @ManyToOne(() => SalesChannel, (salesChannel) => salesChannel.orders)
  @JoinColumn({ name: 'salesChannelId' })
  salesChannel: SalesChannel;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert'],
  })
  orderItems: OrderItem[];
}
