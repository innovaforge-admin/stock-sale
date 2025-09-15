import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Return } from './return.entity';
import { OrderItem } from '../../order/entity/order-item.entity';
import { StockMovement } from '../../stock-movement/entity/stock-movement.entity';
import { ReturnItemResolution } from '../../order/enum/order.enums';

@Entity('return_item')
export class ReturnItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  returnId: number;

  @Column({ type: 'int', nullable: false })
  orderItemId: number;

  @Column({ type: 'numeric', precision: 18, scale: 3, nullable: false })
  quantity: number;

  @Column({ type: 'enum', enum: ReturnItemResolution, nullable: false })
  resolution: ReturnItemResolution; // e.g., REFUND, REPLACEMENT

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    default: 0,
    nullable: false,
  })
  refundAmount: number;

  @Column({ type: 'int', nullable: true })
  stockMovementId: number;

  // Relations
  @ManyToOne(() => Return, (returnEntity) => returnEntity.returnItems)
  @JoinColumn({ name: 'returnId' })
  return: Return;

  @ManyToOne(() => OrderItem)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @OneToOne(() => StockMovement)
  @JoinColumn({ name: 'stockMovementId' })
  stockMovement: StockMovement;
}
