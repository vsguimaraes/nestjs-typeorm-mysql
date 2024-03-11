import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); /* class validator - DTO */
  app.useGlobalInterceptors(
    new LogInterceptor(),
  ); /* interceptador sendo utilizado de forma global */
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
