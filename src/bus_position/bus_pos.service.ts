import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BusPosByRtid, BusResponse } from './types/bus.types';

@Injectable()
export class BusPosService {
  private BASE_URL: string = 'http://ws.bus.go.kr/api/rest/buspos';
  private client = axios.create({
    baseURL: this.BASE_URL,
    params: {
      ServiceKey: process.env.PUBLIC_DATA_PORTAL_API_KEY_DECODING,
      resultType: 'json',
    },
  });

  async getBusPosByRtidList(
    busRouteId: string,
  ): Promise<BusResponse<BusPosByRtid>> {
    console.log(`버스 위치 API 호출: busRouteId=${busRouteId}`);
    
    try {
      const response = await this.client.get('/getBusPosByRtid', {
        params: { busRouteId },
      });

      console.log('버스 위치 API 응답:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('버스 위치 API 호출 오류:', error);
      // 기본 응답 구조 반환
      return {
        msgHeader: { headerMsg: 'API 호출 실패', headerCd: '4', itemCount: 0 },
        msgBody: { itemList: [] }
      } as unknown as BusResponse<BusPosByRtid>;
    }
  }
}
