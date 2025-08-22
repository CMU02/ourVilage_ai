import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './logging/httpExceptionFilter';

async function bootstrap() {
  console.log(process.env.DATABASE_HOST);
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // 전역 필터 등록
  
  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://ourvliage.cieloblu.co.kr',
      'http://ourvliage.cieloblu.co.kr'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
