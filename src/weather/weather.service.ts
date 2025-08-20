import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  ForecastVersion,
  UltraShortTermForecast,
  UltraShortTermRealTime,
  WeatherResponse,
} from './types/weather.types';

@Injectable()
export class WeatherService {
  private BASE_URL: string =
    'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';
  private currentDateTime: string = new Date().toISOString();
  private client = axios.create({
    baseURL: this.BASE_URL,
    params: {
      serviceKey: process.env.PUBLIC_DATA_PORTAL_API_KEY_DECODING,
      dataType: 'JSON',
      numOfRows: 10,
      pageNo: 1,
    },
  });

  /**
   * 초단기실황조회 (목록)
   * @param nx 예보의 X 좌표
   * @param ny 예보의 Y 좌표
   */
  async getUltraShortTermRealTime(
    nx: number,
    ny: number,
  ): Promise<WeatherResponse<UltraShortTermRealTime>> {
    const { data } = await this.client.get('/getUltraSrtNcst', {
      params: {
        nx,
        ny,
        base_date: this.currentDateTime.slice(0, 10).replace(/-/g, ''),
        base_time: this.currentDateTime.slice(11, 16).replace(':', ''),
      },
    });

    return data;
  }

  /**
 * 초단기예보조회 (상세)
 * @param nx 예보의 X 좌표
 * @param ny 예보의 Y 좌표
 */
  async getUltraShortTermForecast(
    nx: number,
    ny: number
  ): Promise<WeatherResponse<UltraShortTermForecast>> {
    const { data } = await this.client.get("getUltraSrtFcst", {
      params: {
        nx,
        ny,
        base_date: this.currentDateTime.slice(0, 10).replace(/-/g, ""),
        base_time: this.currentDateTime.slice(11, 16).replace(":", ""),
      },
    });
  
    return data.response.body.items;
  };

  /**
   * 예보버전조회 (목록)
   */
  async getForecastVersion(
    ftype: 'ODAM' | 'VSRT' | 'SHRT',
  ): Promise<WeatherResponse<ForecastVersion>> {
    const { data } = await this.client.get('/getFcstVersion', {
      params: {
        ftype,
        basedatetime:
          this.currentDateTime.slice(0, 10).replace(/-/g, '') +
          this.currentDateTime.slice(11, 16).replace(':', ''),
      },
    });

    return data.response.body.items;
  }
}
