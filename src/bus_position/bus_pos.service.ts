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
    const response = await this.client.get('/getBusPosByRtid', {
      params: { busRouteId },
    });

    return response.data;
  }
}
