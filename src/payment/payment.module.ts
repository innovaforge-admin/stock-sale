import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { Payment } from './entity/payment.entity';
import { Order } from '../order/entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
