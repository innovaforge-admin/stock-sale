import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipping } from '../entity/shipping.entity';
import { Order } from '../../order/entity/order.entity';
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createShippingDto: CreateShippingDto): Promise<Shipping> {
    const order = await this.orderRepository.findOne({
      where: { id: createShippingDto.orderId },
    });
    if (!order) {
      throw new BadRequestException(
        `Order with ID ${createShippingDto.orderId} not found.`,
      );
    }

    const newShipping = this.shippingRepository.create(createShippingDto);
    return await this.shippingRepository.save(newShipping);
  }

  async findAll(): Promise<Shipping[]> {
    return await this.shippingRepository.find({ relations: ['order'] });
  }

  async findOne(id: number): Promise<Shipping> {
    const shipping = await this.shippingRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!shipping) {
      throw new NotFoundException(`Shipping with ID ${id} not found.`);
    }
    return shipping;
  }

  async update(
    id: number,
    updateShippingDto: UpdateShippingDto,
  ): Promise<Shipping> {
    const shipping = await this.findOne(id);
    if (updateShippingDto.orderId) {
      throw new BadRequestException(
        'Cannot change orderId on a shipping record.',
      );
    }
    this.shippingRepository.merge(shipping, updateShippingDto);
    return await this.shippingRepository.save(shipping);
  }

  async remove(id: number): Promise<void> {
    const shipping = await this.findOne(id);
    await this.shippingRepository.remove(shipping);
  }
}
