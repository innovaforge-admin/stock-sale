import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../entity/sales-channel.entity';
import { CreateSalesChannelDto } from '../dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from '../dto/update-sales-channel.dto';

@Injectable()
export class SalesChannelService {
  constructor(
    @InjectRepository(SalesChannel)
    private readonly salesChannelRepository: Repository<SalesChannel>,
  ) {}

  async create(
    createSalesChannelDto: CreateSalesChannelDto,
  ): Promise<SalesChannel> {
    const newSalesChannel = this.salesChannelRepository.create(
      createSalesChannelDto,
    );
    return await this.salesChannelRepository.save(newSalesChannel);
  }

  async findAll(): Promise<SalesChannel[]> {
    return await this.salesChannelRepository.find();
  }

  async findOne(id: number): Promise<SalesChannel> {
    const salesChannel = await this.salesChannelRepository.findOne({
      where: { id },
    });
    if (!salesChannel) {
      throw new NotFoundException(`Sales Channel with ID ${id} not found.`);
    }
    return salesChannel;
  }

  async update(
    id: number,
    updateSalesChannelDto: UpdateSalesChannelDto,
  ): Promise<SalesChannel> {
    const salesChannel = await this.findOne(id);
    this.salesChannelRepository.merge(salesChannel, updateSalesChannelDto);
    return await this.salesChannelRepository.save(salesChannel);
  }

  async remove(id: number): Promise<void> {
    const salesChannel = await this.findOne(id);
    await this.salesChannelRepository.remove(salesChannel);
  }
}
