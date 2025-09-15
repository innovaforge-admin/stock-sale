import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsOptional()
  shippingAddressId?: number;

  @IsInt()
  @IsNotEmpty()
  salesChannelId: number;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
