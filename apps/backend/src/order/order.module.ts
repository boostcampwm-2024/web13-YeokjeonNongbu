import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { DatabaseModule } from '../database/database.module';
import { MatchingService } from './matching.service';
import { MarketModule } from '../market/market.module';
import { HasSufficientCashGuard } from '../account/guards/hasSufficientCashGuard';
import { AccountModule } from '../account/account.module';
import { HasSufficientCropGuard } from '../account/guards/hasSufficientCropGuard';
import { RedisModule } from '../redis/redis.module';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AccountService } from '../account/account.service';
import { AccountRepository } from '../account/account.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MarketModule,
    AccountModule,
    RedisModule,
    MailModule
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderBookService,
    OrderRepository,
    MatchingService,
    HasSufficientCashGuard,
    HasSufficientCropGuard,
    MailService,
    AccountService,
    AccountRepository
  ]
})
export class OrderModule {}
