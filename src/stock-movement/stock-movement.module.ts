import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementService } from './service/stock-movement.service';
import { StockMovementController } from './controller/stock-movement.controller';
import { StockMovement } from './entity/stock-movement.entity';
import { Stock } from '../stock/entity/stock.entity';
import { Product } from '../product/entity/product.entity';
import { Warehouse } from '../warehouse/entity/warehouse.entity';
import { ProductService } from 'src/product/service/product.service';
import { WarehouseService } from 'src/warehouse/service/warehouse.service';
import { Category } from 'src/category/entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMovement,
      Stock,
      Product,
      Warehouse,
      Category,
    ]),
  ],
  controllers: [StockMovementController],
  providers: [StockMovementService, ProductService, WarehouseService],
})
export class StockMovementModule {}
