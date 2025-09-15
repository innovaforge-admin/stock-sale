import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReturnItemDto } from './create-return-item.dto';

export class CreateReturnDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsOptional()
  generalReason?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  items: CreateReturnItemDto[];
}
