import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './service/address.service';
import { AddressController } from './controller/address.controller';
import { Address } from './entity/address.entity';
import { Client } from '../client/entity/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Client])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
