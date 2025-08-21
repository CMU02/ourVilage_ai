import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './logging/httpExceptionFilter';

async function bootstrap() {
  console.log(process.env.DATABASE_HOST);
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // 전역 필터 등록
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
