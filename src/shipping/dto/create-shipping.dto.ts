import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateShippingDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  courier?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  cost?: number;
}
