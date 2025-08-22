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
    @Query('base_date') base_date: string,
    @Query('base_time') base_time: string,
  ): Promise<WeatherResponse<UltraShortTermForecast>> {
    return this.weatherService.getUltraShortTermForecast(nx, ny, base_date, base_time);
  }

  @Get('/version')
  getForecastVersion(
    @Query('ftype') ftype: 'ODAM' | 'VSRT' | 'SHRT',
    @Query('base_datetime') base_datetime: string
  ): Promise<WeatherResponse<ForecastVersion>> {
    return this.weatherService.getForecastVersion(ftype, base_datetime)
  }
}
