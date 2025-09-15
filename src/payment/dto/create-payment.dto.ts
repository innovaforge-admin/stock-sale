import { IsNotEmpty, IsInt, IsNumber, IsEnum, Min } from 'class-validator';
import { PaymentMethod } from '../../order/enum/order.enums';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  amount: number;
}
