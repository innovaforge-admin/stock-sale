import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockMovement, MovementType } from '../entity/stock-movement.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { Product } from '../../product/entity/product.entity';
import { Warehouse } from '../../warehouse/entity/warehouse.entity';
import { CreateStockMovementDto } from '../dto/create-stock-movement.dto';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<StockMovement> {
    const { productId, warehouseId, movementType, quantity } =
      createStockMovementDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException(`Product with ID ${productId} not found.`);
    }

    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw new BadRequestException(
        `Warehouse with ID ${warehouseId} not found.`,
      );
    }

    // Use a transaction to ensure data integrity
    return this.dataSource
      .transaction(async (manager) => {
        let stock = await manager.findOne(Stock, {
          where: { productId, warehouseId },
        });

        if (!stock) {
          // If no stock entry exists, create one with the initial quantity
          if (
            movementType === MovementType.ENTRY ||
            movementType === MovementType.ADJUSTMENT
          ) {
            const newStock = manager.create(Stock, {
              productId,
              warehouseId,
              currentQuantity: quantity,
            });
            stock = await manager.save(newStock);
          } else {
            throw new BadRequestException(
              'Cannot make an EXIT movement on a product that has no stock.',
            );
          }
        } else {
          // Update the existing stock
          if (
            movementType === MovementType.ENTRY ||
            movementType === MovementType.ADJUSTMENT
          ) {
            stock.currentQuantity += quantity;
          } else if (movementType === MovementType.EXIT) {
            if (stock.currentQuantity < quantity) {
              throw new BadRequestException(
                `Insufficient stock. Current quantity is ${stock.currentQuantity}.`,
              );
            }
            stock.currentQuantity -= quantity;
          }
          await manager.save(stock);
        }

        // Create and save the stock movement record
        const newMovement = manager.create(
          StockMovement,
          createStockMovementDto,
        );
        return await manager.save(newMovement);
      })
      .catch((error) => {
        // Handle specific database errors or re-throw
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll(): Promise<StockMovement[]> {
    return await this.stockMovementRepository.find({
      relations: ['product', 'warehouse'],
    });
  }

  async findOne(id: number): Promise<StockMovement> {
    const movement = await this.stockMovementRepository.findOne({
      where: { id },
      relations: ['product', 'warehouse'],
    });
    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found.`);
    }
    return movement;
  }
}
