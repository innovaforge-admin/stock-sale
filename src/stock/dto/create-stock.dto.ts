import { IsNotEmpty, IsInt, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateStockDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsNotEmpty()
  currentQuantity: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsOptional()
  minQuantity?: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsOptional()
  maxQuantity?: number;
}
