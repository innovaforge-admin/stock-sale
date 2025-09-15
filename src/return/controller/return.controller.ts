import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReturnService } from '../service/return.service';
import { CreateReturnDto } from '../dto/create-return.dto';

@Controller('returns')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReturnDto: CreateReturnDto) {
    return this.returnService.create(createReturnDto);
  }

  @Get()
  findAll() {
    return this.returnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnService.findOne(+id);
  }
}
