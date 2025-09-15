import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateSalesChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
