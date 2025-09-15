import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesChannelService } from './service/sales-channel.service';
import { SalesChannelController } from './controller/sales-channel.controller';
import { SalesChannel } from './entity/sales-channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesChannel])],
  controllers: [SalesChannelController],
  providers: [SalesChannelService],
})
export class SalesChannelModule {}
