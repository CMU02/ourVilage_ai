export interface WeatherResponse<T> {
    response: {
        header: Header;
        body: {
            dataType: "XML" | "JSON";
            items: {
                item : T[]
            },
            pageNo: number;
            numOfRows: number;
            totalCount: number;
        }
    }
}

interface Header {
    resultCode: string;
    resultMsg: string;
}

/**
 * 초단기 실황 조회 타입
 */
export interface UltraShortTermRealTime {
    baseDate: string; // 기준일자
    baseTime: string; // 기준시간
    category: string; // 자료구분코드
    nx: number; // 예보지점 X 좌표
    ny: number; // 예보지점 Y 좌표
    obsrValue: string; // 관측값
}

/**
 * 초단기예보조회
 */
export interface UltraShortTermForecast {
    baseDate: string; // 기준일자
    baseTime: string; // 기준시간
    category: string; // 자료구분코드
    fcstDate: string; // 예측일자
    fcstTime: string; // 예측시간
    fcstValue: string; // 예보값
    nx: number; // 예보지점 X 좌표
    ny: number; // 예보지점 Y 좌표
}

/**
 * 단기예보조회
 */
export interface VilageForecast {
    baseDate: string; // 기준일자
    baseTime: string; // 기준시간
    category: string; // 자료구분코드
    fcstDate: string; // 예측일자
    fcstTime: string; // 예측시간
    fcstValue: string; // 예보값
    nx: number; // 예보지점 X 좌표
    ny: number; // 예보지점 Y 좌표
}

/**
 * 예보버전조회
 */
export interface ForecastVersion {
    /**
     * 예보구분코드  
     * - ODAM: 초단기실황  
     * - VSRT: 초단기예보  
     * - SHRT: 단기예보  
     */
    filetype: "ODAM" | "VSRT" | "SHRT";
    version: string; // 예보버전
}
