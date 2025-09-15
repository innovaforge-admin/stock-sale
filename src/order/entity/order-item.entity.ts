import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entity/product.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  orderId: number;

  @Column({ type: 'varchar', length: 64 })
  sku: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  productName: string;

  @Column({ type: 'varchar', length: 32 })
  unitOfMeasure: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: false })
  listPrice: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: false })
  unitPrice: number;

  @Column({ type: 'numeric', precision: 18, scale: 3, nullable: false })
  quantity: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'numeric', precision: 18, scale: 2, nullable: false })
  lineTotal: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'sku', referencedColumnName: 'sku' })
  product: Product;
}
