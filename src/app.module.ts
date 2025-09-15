import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';
import { ClientModule } from './client/client.module';
import { AddressModule } from './address/address.module';
import { SalesChannelModule } from './sales-channel/sales-channel.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ShippingModule } from './shipping/shipping.module';
import { ReturnModule } from './return/return.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace las variables de entorno accesibles globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Usar solo en desarrollo para que TypeORM genere la base de datos
      }),
    }),
    CategoryModule,
    WarehouseModule,
    ProductModule,
    StockModule,
    StockMovementModule,
    ClientModule,
    AddressModule,
    SalesChannelModule,
    OrderModule,
    PaymentModule,
    ShippingModule,
    ReturnModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}