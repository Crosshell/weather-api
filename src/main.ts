import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WeatherApiExceptionFilter } from './filters/weather-api-exception.filter';

const port = process.env.APP_PORT ?? 3006;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new WeatherApiExceptionFilter());

  await app.listen(port);
}
bootstrap();
