import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';
import { MovementType } from '../entity/stock-movement.entity';

export class CreateStockMovementDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  warehouseId: number;

  @IsEnum(MovementType)
  @IsNotEmpty()
  movementType: MovementType;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  reference?: string;
}
