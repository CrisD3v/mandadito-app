import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../../application/order/services/order.service';
import { OrderController } from './controllers/order.controller';
import { OrderRepositoryImpl } from './repositories/order.repository.impl';
import { Order } from '../../domain/order/entities/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [
      OrderRepositoryImpl,
      OrderService,
    ],
    controllers: [OrderController],
    exports: [OrderService],
})
export class OrderModule {}
