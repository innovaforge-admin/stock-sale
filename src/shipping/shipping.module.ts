import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingService } from './service/shipping.service';
import { ShippingController } from './controller/shipping.controller';
import { Shipping } from './entity/shipping.entity';
import { Order } from '../order/entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipping, Order])],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule {}
