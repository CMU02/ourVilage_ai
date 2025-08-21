import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherHandler } from './ai/handler/weather_handler.service';
import { RegistryService } from './ai/registry/registry.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusPosModule } from './bus_position/bus_pos.module';
import { BusRoute } from './bus_route/bus_route.entity';
import { BusRouteModule } from './bus_route/bus_route.module';
import { WeatherModule } from './weather/weather.module';
import { PiplineModule } from './ai/pipline/pipline.module';
import { HandlerModule } from './ai/handler/handler.module';
import { RegistryModule } from './ai/registry/registry.module';
import { BusHandler } from './ai/handler/bus_handler.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.NODE_ENV === 'production' ? process.env.DATABASE_HOST : 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PWD,
      database: 'our_vilage',
      entities: [BusRoute],
      synchronize: false,
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production'
        ? ['.env.production.local', '.env']
        : ['.env', '.env.production.local'],
      isGlobal: true,
    }),
    BusRouteModule,
    BusPosModule,
    WeatherModule,
    PiplineModule,
    HandlerModule,
    RegistryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly registry: RegistryService,
    private readonly weather: WeatherHandler,
    private readonly bus: BusHandler,
  ) { }

  onModuleInit() {
    // 핸들러 등록 (플러그인)
    this.registry.register('날씨', this.weather);
    this.registry.register('버스', this.bus)
  }
}
