import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { DatabaseModule } from '../database/database.module';
import { MatchingService } from './matching.service';
import { MarketModule } from '../market/market.module';

@Module({
  providers: [OrderService, OrderBookService, OrderRepository, MatchingService],
  controllers: [OrderController],
  imports: [DatabaseModule, MarketModule]
})
export class OrderModule {}
