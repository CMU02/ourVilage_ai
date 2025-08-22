import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import "dotenv/config";
import { BusHandler } from './ai/handler/bus_handler.service';
import { HandlerModule } from './ai/handler/handler.module';
import { WeatherHandler } from './ai/handler/weather_handler.service';
import { PiplineModule } from './ai/pipline/pipline.module';
import { RegistryModule } from './ai/registry/registry.module';
import { RegistryService } from './ai/registry/registry.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusPosModule } from './bus_position/bus_pos.module';
import { BusRoute } from './bus_route/bus_route.entity';
import { BusRouteModule } from './bus_route/bus_route.module';
import { LocalCurrencyModule } from './local-currency/local_currency.module';
import { WeatherModule } from './weather/weather.module';
import { LocalCurrencyHandler } from './ai/handler/local_currency_handler.service';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { Neighborhood } from './neighborhood/neighborhood.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PWD,
      database: 'our_vilage',
      entities: [BusRoute, Neighborhood],
      synchronize: false,
    }),
    BusRouteModule,
    BusPosModule,
    WeatherModule,
    PiplineModule,
    HandlerModule,
    RegistryModule,
    LocalCurrencyModule,
    NeighborhoodModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly registry: RegistryService,
    private readonly weather: WeatherHandler,
    private readonly bus: BusHandler,
    private readonly localCurrency: LocalCurrencyHandler
  ) { }

  onModuleInit() {
    // 핸들러 등록 (플러그인)
    // console.log('Registering handlers...');
    // console.log('Weather handler:', !!this.weather);
    // console.log('Bus handler:', !!this.bus);
    // console.log('LocalCurrency handler:', !!this.localCurrency);
    
    this.registry.register('지역화폐', this.localCurrency);
    this.registry.register('날씨', this.weather);
    this.registry.register('버스', this.bus);
    
    console.log('Handlers registered. Registry contents:', this.registry.getAllRegistered());
  }
}
