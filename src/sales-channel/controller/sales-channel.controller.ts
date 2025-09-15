import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SalesChannelService } from '../service/sales-channel.service';
import { CreateSalesChannelDto } from '../dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from '../dto/update-sales-channel.dto';

@Controller('sales-channels')
export class SalesChannelController {
  constructor(private readonly salesChannelService: SalesChannelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSalesChannelDto: CreateSalesChannelDto) {
    return this.salesChannelService.create(createSalesChannelDto);
  }

  @Get()
  findAll() {
    return this.salesChannelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesChannelService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesChannelDto: UpdateSalesChannelDto,
  ) {
    return this.salesChannelService.update(+id, updateSalesChannelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.salesChannelService.remove(+id);
  }
}
