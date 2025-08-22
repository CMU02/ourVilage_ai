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
  private getCurrentDateTime() {
    // 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
    const now = new Date();

    // 한국 시간대로 변환
    const kstTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

    // YYYY-MM-DDTHH:mm:ss 형태로 포맷팅
    const year = kstTime.getFullYear();
    const month = String(kstTime.getMonth() + 1).padStart(2, '0');
    const day = String(kstTime.getDate()).padStart(2, '0');
    const hours = String(kstTime.getHours()).padStart(2, '0');
    const minutes = String(kstTime.getMinutes()).padStart(2, '0');
    const seconds = String(kstTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

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
    const currentDateTime = this.getCurrentDateTime();
    const baseDate = currentDateTime.slice(0, 10).replace(/-/g, "");
    const baseTime = currentDateTime.slice(11, 12);

    const { data } = await this.client.get('/getUltraSrtNcst', {
      params: {
        numOfRows: 100,
        nx,
        ny,
        base_date: baseDate,
        base_time: baseTime + '00',
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
    const currentDateTime = this.getCurrentDateTime();
    const baseDate = currentDateTime.slice(0, 10).replace(/-/g, "");
    const baseTime = currentDateTime.slice(11, 12);

    const { data } = await this.client.get("/getUltraSrtFcst", {
      params: {
        numOfRows: 100,
        nx,
        ny,
        base_date: baseDate,
        base_time: baseTime + '30',
      },
    });

    return data;
  };

  /**
   * 예보버전조회 (목록)
   */
  async getForecastVersion(
    ftype: 'ODAM' | 'VSRT' | 'SHRT',
  ): Promise<WeatherResponse<ForecastVersion>> {
    const currentDateTime = this.getCurrentDateTime();
    const basedatetime = currentDateTime.slice(0, 10).replace(/-/g, '') +
      currentDateTime.slice(11, 16).replace(':', '');

    const { data } = await this.client.get('/getFcstVersion', {
      params: {
        ftype,
        basedatetime,
      },
    });

    return data.response.body.items;
  }
}
