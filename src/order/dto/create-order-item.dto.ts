import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}
