import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { catchError, firstValueFrom, throwError } from "rxjs";
import {
    ParsedLocalCurrencyData,
    RequestLocalCurreny
} from "./local_currency.types";
import { AxiosError } from "axios";

@Injectable()
export class LocalCurrencyService {
    constructor(private readonly httpService: HttpService) { }
    private readonly logger = new Logger(LocalCurrencyService.name);

    /**
     * API 응답 데이터를 파싱하여 사용하기 편한 형태로 변환
     */
    parseApiResponse(apiResponse: any): ParsedLocalCurrencyData {
        try {
            // API 응답 구조 검증
            if (!apiResponse || !apiResponse.RegionMnyFacltStus) {
                this.logger.error('API 응답 구조가 올바르지 않습니다:', apiResponse);
                throw new Error('API 응답 구조가 올바르지 않습니다');
            }

            const regionMnyFacltStus = apiResponse.RegionMnyFacltStus;

            if (!Array.isArray(regionMnyFacltStus) || regionMnyFacltStus.length < 2) {
                this.logger.error('RegionMnyFacltStus 배열 구조가 올바르지 않습니다:', regionMnyFacltStus);
                throw new Error('RegionMnyFacltStus 배열 구조가 올바르지 않습니다');
            }

            const [headData, rowData] = regionMnyFacltStus;

            if (!headData?.head || !Array.isArray(headData.head) || headData.head.length < 3) {
                this.logger.error('Head 데이터 구조가 올바르지 않습니다:', headData);
                throw new Error('Head 데이터 구조가 올바르지 않습니다');
            }

            const [header, result, version] = headData.head;

            return {
                totalCount: header?.list_total_count || 0,
                result: {
                    code: result?.RESULT?.CODE || 'UNKNOWN',
                    message: result?.RESULT?.MESSAGE || '알 수 없는 응답'
                },
                apiVersion: version?.api_version || '1.0',
                stores: rowData?.row || []
            };
        } catch (error) {
            this.logger.error('API 응답 파싱 중 에러:', error.message);
            throw new Error(`API 응답 파싱 실패: ${error.message}`);
        }
    }

    /**
     * 지역화폐 가맹점 데이터 조회
     */
    async getLocalCurrencyStores({ ...props }: RequestLocalCurreny): Promise<ParsedLocalCurrencyData> {
        const { sigun_nm, cmpnm_nm, pIndex, refine_lotno_addr, pSize, refine_roadnm_addr } = props;

        try {
            // this.logger.debug('API 요청 파라미터:', { sigun_nm, cmpnm_nm, pIndex, refine_lotno_addr, pSize, refine_roadnm_addr });

            const response = await firstValueFrom(this.httpService.get('https://openapi.gg.go.kr/RegionMnyFacltStus', {
                params: {
                    KEY: process.env.DATA_DREAM_API_KEY,
                    Type: 'json',
                    pSize,
                    pIndex,
                    sigun_nm,
                    cmpnm_nm,
                    refine_lotno_addr,
                    refine_roadnm_addr
                }
            }).pipe(catchError((error: AxiosError) => {
                this.logger.error('지역화폐 API 호출 실패:', error.response?.data || error.message);
                return throwError(() => error);
            })));

            // API 응답 구조 로깅 (처음 몇 번만)
            // this.logger.debug('API 응답 데이터 구조:', {
            //     hasRegionMnyFacltStus: !!response.data?.RegionMnyFacltStus,
            //     isArray: Array.isArray(response.data?.RegionMnyFacltStus),
            //     length: response.data?.RegionMnyFacltStus?.length,
            //     firstElement: response.data?.RegionMnyFacltStus?.[0]
            // });

            return this.parseApiResponse(response.data);
        } catch (error) {
            this.logger.error('지역화폐 데이터 조회 중 에러:', error);
            throw new HttpException(`지역화폐 데이터 조회 실패: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}