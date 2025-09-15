import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entity/stock.entity';
import { Product } from '../../product/entity/product.entity';
import { Warehouse } from '../../warehouse/entity/warehouse.entity';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    const product = await this.productRepository.findOne({
      where: { id: createStockDto.productId },
    });
    if (!product) {
      throw new BadRequestException(
        `Product with ID ${createStockDto.productId} not found.`,
      );
    }
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: createStockDto.warehouseId },
    });
    if (!warehouse) {
      throw new BadRequestException(
        `Warehouse with ID ${createStockDto.warehouseId} not found.`,
      );
    }

    const existingStock = await this.stockRepository.findOne({
      where: {
        productId: createStockDto.productId,
        warehouseId: createStockDto.warehouseId,
      },
    });
    if (existingStock) {
      throw new BadRequestException(
        'Stock entry for this product and warehouse already exists.',
      );
    }

    const newStock = this.stockRepository.create(createStockDto);
    return await this.stockRepository.save(newStock);
  }

  async findAll(): Promise<Stock[]> {
    return await this.stockRepository.find({
      relations: ['product', 'warehouse'],
    });
  }

  async findOne(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['product', 'warehouse'],
    });
    if (!stock) {
      throw new NotFoundException(`Stock entry with ID ${id} not found.`);
    }
    return stock;
  }

  async update(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    const stock = await this.findOne(id);

    if (updateStockDto.productId) {
      throw new BadRequestException(
        'Cannot change productId on a stock entry.',
      );
    }
    if (updateStockDto.warehouseId) {
      throw new BadRequestException(
        'Cannot change warehouseId on a stock entry.',
      );
    }

    this.stockRepository.merge(stock, updateStockDto);
    return await this.stockRepository.save(stock);
  }

  async remove(id: number): Promise<void> {
    const stock = await this.findOne(id);
    await this.stockRepository.remove(stock);
  }
}
