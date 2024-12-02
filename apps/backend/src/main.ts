import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorExceptionFilter } from './global/filter/errorExceptionFilter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API 명세서')
    .setDescription('역전농부 API 명세서')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // const configService = app.get(ConfigService);
  app.enableCors({
    origin: true,
    credentials: true
  });

  SwaggerModule.setup('apis', app, document);

  await app.listen(8080, '0.0.0.0');
}

bootstrap();
