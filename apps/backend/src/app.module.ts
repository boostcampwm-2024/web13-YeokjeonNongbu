import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MarketModule } from './market/market.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { LottoModule } from './lotto/lotto.module';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    MarketModule,
    OrderModule,
    MailModule,
    LottoModule,
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
