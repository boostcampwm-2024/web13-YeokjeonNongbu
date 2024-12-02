import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { DatabaseModule } from 'src/database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { MailCreateUtil } from './util/mailCreateUtil';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [MailController],
  providers: [MailService, MailCreateUtil],
  exports: [MailCreateUtil]
})
export class MailModule {}
