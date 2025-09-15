import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entity/address.entity';
import { Client } from '../../client/entity/client.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const client = await this.clientRepository.findOne({
      where: { id: createAddressDto.clientId },
    });
    if (!client) {
      throw new BadRequestException(
        `Client with ID ${createAddressDto.clientId} not found.`,
      );
    }
    const newAddress = this.addressRepository.create(createAddressDto);
    return await this.addressRepository.save(newAddress);
  }

  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({ relations: ['client'] });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found.`);
    }
    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id);
    if (updateAddressDto.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: updateAddressDto.clientId },
      });
      if (!client) {
        throw new BadRequestException(
          `Client with ID ${updateAddressDto.clientId} not found.`,
        );
      }
    }
    this.addressRepository.merge(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }
}
