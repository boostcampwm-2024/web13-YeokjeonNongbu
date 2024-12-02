import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { DatabaseModule } from '../database/database.module';
import { HasSufficientCashGuard } from './guards/hasSufficientCashGuard';
import { HasSufficientCropGuard } from './guards/hasSufficientCropGuard';
import { MarketModule } from '../market/market.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, HasSufficientCashGuard, HasSufficientCropGuard],

  exports: [AccountService],
  imports: [DatabaseModule, MarketModule]
})
export class AccountModule {}
