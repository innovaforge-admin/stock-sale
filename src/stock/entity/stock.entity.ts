import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { Warehouse } from '../../warehouse/entity/warehouse.entity';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  warehouseId: number;

  @Column({ type: 'numeric', precision: 18, scale: 3, default: 0 })
  currentQuantity: number;

  @Column({ type: 'numeric', precision: 18, scale: 3, nullable: true })
  minQuantity: number;

  @Column({ type: 'numeric', precision: 18, scale: 3, nullable: true })
  maxQuantity: number;

  // Relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;
}
