import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Return } from '../entity/return.entity';
import { ReturnItem } from '../entity/return-item.entity';
import { Order } from '../../order/entity/order.entity';
import { OrderItem } from '../../order/entity/order-item.entity';
import { Stock } from '../../stock/entity/stock.entity';
import {
  StockMovement,
  MovementType,
} from '../../stock-movement/entity/stock-movement.entity';
import { Product } from '../../product/entity/product.entity';
import { CreateReturnDto } from '../dto/create-return.dto';
import { ReturnItemResolution } from '../../order/enum/order.enums';

@Injectable()
export class ReturnService {
  constructor(
    @InjectRepository(Return)
    private readonly returnRepository: Repository<Return>,
    @InjectRepository(ReturnItem)
    private readonly returnItemRepository: Repository<ReturnItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createReturnDto: CreateReturnDto): Promise<Return> {
    const { orderId, items, ...returnData } = createReturnDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new BadRequestException(`Order with ID ${orderId} not found.`);
    }

    return this.dataSource
      .transaction(async (manager) => {
        let totalRefundAmount = 0;
        const newReturnItems: ReturnItem[] = [];

        for (const itemDto of items) {
          const orderItem = await this.orderItemRepository.findOne({
            where: { id: itemDto.orderItemId },
          });
          if (!orderItem) {
            throw new BadRequestException(
              `Order item with ID ${itemDto.orderItemId} not found.`,
            );
          }
          if (itemDto.quantity > orderItem.quantity) {
            throw new BadRequestException(
              `Cannot return ${itemDto.quantity} of '${orderItem.productName}'. Original quantity was ${orderItem.quantity}.`,
            );
          }

          let newStockMovement = null;

          if (
            itemDto.resolution === ReturnItemResolution.REFUND ||
            itemDto.resolution === ReturnItemResolution.REPLACEMENT
          ) {
            const product = await this.productRepository.findOne({
              where: { sku: orderItem.sku },
            });
            if (!product) {
              throw new NotFoundException(
                `Product with SKU ${orderItem.sku} not found.`,
              );
            }
            const defaultWarehouseId = 1; // Asumiendo un almacén por defecto

            const stock = await this.stockRepository.findOne({
              where: { productId: product.id, warehouseId: defaultWarehouseId },
            });
            if (!stock) {
              // Si no hay registro de stock, creamos uno nuevo.
              const newStock = manager.create(Stock, {
                productId: product.id,
                warehouseId: defaultWarehouseId,
                currentQuantity: itemDto.quantity,
              });
              await manager.save(newStock);
            } else {
              // Actualizamos el stock existente.
              stock.currentQuantity += itemDto.quantity;
              await manager.save(stock);
            }

            // Creamos el movimiento de stock de tipo 'ENTRY'.
            newStockMovement = manager.create(StockMovement, {
              productId: product.id,
              warehouseId: defaultWarehouseId,
              movementType: MovementType.ENTRY,
              quantity: itemDto.quantity,
              reference: `Return for order ${order.number}`,
            });
            await manager.save(newStockMovement);
          }

          // Crear el item de devolución
          const returnItem = manager.create(ReturnItem, {
            orderItemId: itemDto.orderItemId,
            quantity: itemDto.quantity,
            resolution: itemDto.resolution,
            refundAmount: itemDto.quantity * orderItem.unitPrice,
            stockMovementId: newStockMovement ? newStockMovement.id : null,
          });
          await manager.save(returnItem);
          newReturnItems.push(returnItem);
          totalRefundAmount += returnItem.refundAmount;
        }

        const newReturn = manager.create(Return, {
          ...returnData,
          orderId: order.id,
          totalRefund: totalRefundAmount,
          returnItems: newReturnItems,
        });

        return await manager.save(newReturn);
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll(): Promise<Return[]> {
    return await this.returnRepository.find({
      relations: ['order', 'returnItems', 'returnItems.orderItem'],
    });
  }

  async findOne(id: number): Promise<Return> {
    const returnEntity = await this.returnRepository.findOne({
      where: { id },
      relations: ['order', 'returnItems', 'returnItems.orderItem'],
    });
    if (!returnEntity) {
      throw new NotFoundException(`Return with ID ${id} not found.`);
    }
    return returnEntity;
  }
}
