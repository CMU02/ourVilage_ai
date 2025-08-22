import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ForecastVersion, UltraShortTermForecast, UltraShortTermRealTime, WeatherResponse } from './types/weather.types';

@Controller('/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/ultra-short-forecast')
  getUrltraShortTermForecast(
    @Query('nx') nx: number,
    @Query('ny') ny: number,
  ): Promise<WeatherResponse<UltraShortTermForecast>> {
    return this.weatherService.getUltraShortTermForecast(nx, ny);
  }

  @Get('/version')
  getForecastVersion(
    @Query('ftype') ftype: 'ODAM' | 'VSRT' | 'SHRT'
  ): Promise<WeatherResponse<ForecastVersion>> {
    return this.weatherService.getForecastVersion(ftype)
  }
}
