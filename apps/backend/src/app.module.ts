import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MarketModule } from './market/market.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { LottoModule } from './lotto/lotto.module';
import { RankModule } from './rank/rank.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from './account/account.module';
import { WebsocketModule } from './websocket/websocket.module';
import { MongoModule } from './mongo/mongo.module';
import { ChartModule } from './chart/chart.module';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    MarketModule,
    OrderModule,
    MailModule,
    LottoModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    RankModule,
    AccountModule,
    WebsocketModule,
    MongoModule,
    ChartModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
