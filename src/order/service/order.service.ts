import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entity/order.entity';
import { OrderItem } from '../entity/order-item.entity';
import { Product } from '../../product/entity/product.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { Client } from '../../client/entity/client.entity';
import { Address } from '../../address/entity/address.entity';
import { SalesChannel } from '../../sales-channel/entity/sales-channel.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { StockMovementService } from '../../stock-movement/service/stock-movement.service';
import { MovementType } from '../../stock-movement/entity/stock-movement.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(SalesChannel)
    private readonly salesChannelRepository: Repository<SalesChannel>,
    private readonly stockMovementService: StockMovementService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      clientId,
      shippingAddressId,
      salesChannelId,
      orderItems,
      ...orderData
    } = createOrderDto;

    // Validar existencia de cliente, dirección y canal de venta
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client)
      throw new BadRequestException(`Client with ID ${clientId} not found.`);
    const salesChannel = await this.salesChannelRepository.findOne({
      where: { id: salesChannelId },
    });
    if (!salesChannel)
      throw new BadRequestException(
        `Sales Channel with ID ${salesChannelId} not found.`,
      );
    if (shippingAddressId) {
      const address = await this.addressRepository.findOne({
        where: { id: shippingAddressId },
      });
      if (!address)
        throw new BadRequestException(
          `Shipping address with ID ${shippingAddressId} not found.`,
        );
    }

    // Iniciar transacción
    return this.dataSource
      .transaction(async (manager) => {
        let totalOrder = 0;

        const newOrderItems: OrderItem[] = [];
        const defaultWarehouseId = 1;

        for (const item of orderItems) {
          const product = await this.productRepository.findOne({
            where: { sku: item.sku },
          });
          if (!product) {
            throw new BadRequestException(
              `Product with SKU '${item.sku}' not found.`,
            );
          }

          const stock = await this.stockRepository.findOne({
            where: { productId: product.id, warehouseId: defaultWarehouseId },
          });

          if (!stock || stock.currentQuantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product '${product.name}'. Available: ${stock?.currentQuantity || 0}, Required: ${item.quantity}`,
            );
          }

          const orderItem = manager.create(OrderItem, {
            sku: product.sku,
            productName: product.name,
            unitOfMeasure: product.unitOfMeasure,
            listPrice: product.salePrice,
            unitPrice: product.salePrice,
            quantity: item.quantity,
            totalLine: product.salePrice * item.quantity,
          });
          newOrderItems.push(orderItem);

          totalOrder += orderItem.lineTotal;

          const newMovement = manager.create('stock_movement', {
            productId: product.id,
            warehouseId: defaultWarehouseId,
            movementType: MovementType.EXIT,
            quantity: item.quantity,
            reference: createOrderDto.number,
          });
          await manager.save(newMovement);
        }

        const order = manager.create(Order, {
          ...orderData,
          clientId,
          shippingAddressId,
          salesChannelId,
          netSubtotal: totalOrder,
          total: totalOrder, // Simplificamos el total por ahora
          orderItems: newOrderItems,
        });

        await manager.save(order);

        // Actualizar el stock
        for (const item of newOrderItems) {
          const product = await this.productRepository.findOne({
            where: { sku: item.sku },
          });
          const stock = await this.stockRepository.findOne({
            where: { productId: product.id, warehouseId: defaultWarehouseId },
          });
          stock.currentQuantity -= item.quantity;
          await manager.save(stock);
        }

        return order;
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['client', 'shippingAddress', 'salesChannel', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'shippingAddress', 'salesChannel', 'orderItems'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }
}
