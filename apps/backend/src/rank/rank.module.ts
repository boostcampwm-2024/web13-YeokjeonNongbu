import { Module } from '@nestjs/common';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RankController],
  providers: [RankService]
})
export class RankModule {}
