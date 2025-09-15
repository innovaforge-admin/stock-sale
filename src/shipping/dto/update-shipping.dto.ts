import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingDto } from './create-shipping.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShippingStatus } from '../../order/enum/order.enums';

export class UpdateShippingDto extends PartialType(CreateShippingDto) {
  @IsEnum(ShippingStatus)
  @IsOptional()
  status?: ShippingStatus;

  @IsString()
  @IsOptional()
  trackingNumber?: string;
}
