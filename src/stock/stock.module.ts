import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './service/stock.service';
import { StockController } from './controller/stock.controller';
import { Stock } from './entity/stock.entity';
import { Product } from '../product/entity/product.entity';
import { Warehouse } from '../warehouse/entity/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Product, Warehouse])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
