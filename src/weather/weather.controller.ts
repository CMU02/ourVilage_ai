import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ForecastVersion, UltraShortTermForecast, UltraShortTermRealTime, WeatherResponse } from './types/weather.types';

@Controller('/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/ultra-short-realtime')
  getUrltraShortTermForecast(
    @Query('nx') nx: number,
    @Query('ny') ny: number,
  ): Promise<WeatherResponse<UltraShortTermRealTime>> {
    return this.weatherService.getUltraShortTermRealTime(nx, ny);
  }

  @Get('/version')
  getForecastVersion(
    @Query('ftype') ftype: 'ODAM' | 'VSRT' | 'SHRT'
  ): Promise<WeatherResponse<ForecastVersion>> {
    return this.weatherService.getForecastVersion(ftype)
  }
}
