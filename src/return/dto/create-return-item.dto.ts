import { IsNotEmpty, IsInt, IsNumber, Min, IsEnum } from 'class-validator';
import { ReturnItemResolution } from '../../order/enum/order.enums';

export class CreateReturnItemDto {
  @IsInt()
  @IsNotEmpty()
  orderItemId: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @IsEnum(ReturnItemResolution)
  @IsNotEmpty()
  resolution: ReturnItemResolution;
}
