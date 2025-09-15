import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Client } from '../client/entity/client.entity';
import { Address } from '../address/entity/address.entity';
import { SalesChannel } from '../sales-channel/entity/sales-channel.entity';
import { Product } from '../product/entity/product.entity';
import { Stock } from '../stock/entity/stock.entity';
import { StockMovement } from '../stock-movement/entity/stock-movement.entity';
import { StockMovementService } from '../stock-movement/service/stock-movement.service';
import { Warehouse } from 'src/warehouse/entity/warehouse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Client,
      Address,
      SalesChannel,
      Product,
      Stock,
      StockMovement,
      Warehouse
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, StockMovementService],
})
export class OrderModule {}
