import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { WebsocketGateway } from './websocket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChartModule } from 'src/chart/chart.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }
      })
    }),
    forwardRef(() => ChartModule)
  ],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway]
})
export class WebsocketModule {}
