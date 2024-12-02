import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketRepository } from './market.repository';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [MarketController],
  providers: [MarketService, MarketRepository],
  imports: [DatabaseModule, RedisModule],
  exports: [MarketService]
})
export class MarketModule {}
