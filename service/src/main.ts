import { NestFactory } from '@nestjs/core';
import { ApiExceptionFilter } from '@tsalliance/rest';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.listen(3000);
}

bootstrap();
