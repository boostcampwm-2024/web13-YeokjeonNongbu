import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InningUtil } from './model/util.mongo';
import { Inning, InningSchema } from './model/lotto.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Inning.name, schema: InningSchema }])
  ],
  controllers: [LottoController],
  providers: [LottoService, InningUtil],
  exports: [InningUtil]
})
export class LottoModule {}
