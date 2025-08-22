// 지역화폐 가맹점 정보
export interface LocalCurrencyStore {
    SIGUN_NM: string; // 시군명
    CMPNM_NM: string; // 상호명
    INDUTYPE_NM: string; // 업종명
    REFINE_ROADNM_ADDR: string; // 정제도로명주소
    REFINE_LOTNO_ADDR: string; // 정제지번주소
    REFINE_ZIPNO: string; // 정제우편번호
    REFINE_WGS84_LAT: string; // 정제위도(WGS84)
    REFINE_WGS84_LOGT: string; // 정제경도(WGS84)
    BIZREGNO: string; // 사업자등록번호
    INDUTYPE_CD: string; // 업종코드
    FRCS_NO: string; // 가맹점번호
    LEAD_TAX_MAN_STATE: "01" | "02" | "03"; // 휴폐업상태 (01: 계속사업자, 02: 휴업자, 03: 폐업자)
    LEAD_TAX_MAN_STATE_CD: string; // 휴폐업상태코드
    CLSBIZ_DAY: string | null; // 폐업일자
}

// API 응답 헤더 정보
export interface ApiHeader {
    list_total_count: number; // 전체 데이터 수
}

export interface ApiResult {
    CODE: string; // 응답코드
    MESSAGE: string; // 응답메시지
}

export interface ApiVersion {
    api_version: string; // API 버전
}

export interface ApiRowData {
    row: LocalCurrencyStore[];
}

export interface ApiHeadData {
    head: [ApiHeader, { RESULT: ApiResult }, ApiVersion];
}

// 전체 API 응답 구조
export interface LocalCurrencyApiResponse {
    RegionMnyFacltStus: [ApiHeadData, ApiRowData];
}

// 파싱된 데이터 구조 (사용하기 편한 형태)
export interface ParsedLocalCurrencyData {
    totalCount: number;
    result: {
        code: string;
        message: string;
    };
    apiVersion: string;
    stores: LocalCurrencyStore[];
}

// 요청 인자 구조
export interface RequestLocalCurreny {
    pIndex: number; // 페이지위치
    pSize: number; // 페이지당 요청 숫자
    sigun_nm: string; // 시군명
    cmpnm_nm: string; // 상호명
    refine_roadnm_addr: string; // 정체도로명주소
    refine_lotno_addr: string; // 정체지번주소 
}