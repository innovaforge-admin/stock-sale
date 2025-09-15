import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsOptional()
  currentQuantity?: number;
}
