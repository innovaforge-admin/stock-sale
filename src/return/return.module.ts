import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnService } from './service/return.service';
import { ReturnController } from './controller/return.controller';
import { Return } from './entity/return.entity';
import { ReturnItem } from './entity/return-item.entity';
import { Order } from '../order/entity/order.entity';
import { OrderItem } from '../order/entity/order-item.entity';
import { StockMovement } from '../stock-movement/entity/stock-movement.entity';
import { Product } from '../product/entity/product.entity';
import { Stock } from '../stock/entity/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Return,
      ReturnItem,
      Order,
      OrderItem,
      StockMovement,
      Product,
      Stock,
    ]),
  ],
  controllers: [ReturnController],
  providers: [ReturnService],
})
export class ReturnModule {}
