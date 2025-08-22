# Our Village API Documentation

우리 동네 서비스 API 문서입니다. 날씨, 버스, 지역화폐, AI 챗봇 기능을 제공합니다.

## Base URL
```
https://your-domain.com
```

## 목차
- [Health Check](#health-check)
- [AI 챗봇](#ai-챗봇)
- [날씨 정보](#날씨-정보)
- [버스 노선](#버스-노선)
- [지역화폐](#지역화폐)

---

## Health Check

### GET /
서비스 기본 상태 확인

**Response**
```json
"Hello World!"
```

### GET /health
서비스 헬스체크

**Response**
```json
{
  "status": "OK",
  "timestamp": "2025-08-22T10:30:00.000Z"
}
```

---

## AI 챗봇

### POST /chatbot/ask
AI 챗봇에게 질문하기

**Request Body**
```json
{
  "userQuestion": "부천시 지역화폐 가맹점 알려줘",
  "coords": {
    "nx": 55,
    "ny": 124
  }
}
```

**Parameters**
- `userQuestion` (string, required): 사용자 질문
- `coords` (object, optional): 날씨 조회용 격자 좌표
  - `nx` (number): X 좌표
  - `ny` (number): Y 좌표

**Response**
```json
{
  "message": "부천시에는 현재 1,234개의 지역화폐 가맹점이 운영 중입니다. 주요 업종으로는 음식점 456개, 편의점 123개가 있습니다.",
  "meta": {
    "intent": "지역화폐",
    "totalStores": 1234,
    "regionCount": 5,
    "industryCount": 15,
    "topStores": [
      {
        "name": "맛있는 식당",
        "industry": "한식",
        "region": "부천시",
        "address": "경기도 부천시 원미구 ..."
      }
    ],
    "token": 150
  }
}
```

**지원하는 질문 유형**
- 날씨: "오늘 날씨 어때?", "비 와?"
- 버스: "7016번 버스 언제 와?", "금천우체국 정류장"
- 지역화폐: "부천시 지역화폐 가맹점", "음식점에서 지역화폐 써?"
- 약국: "당번 약국 어디야?"

---

## 날씨 정보

### GET /weather/ultra-short-forecast
초단기 예보 조회

**Query Parameters**
- `nx` (number, required): 격자 X 좌표
- `ny` (number, required): 격자 Y 좌표

**Example Request**
```
GET /weather/ultra-short-forecast?nx=55&ny=124
```

**Response**
```json
{
  "response": {
    "header": {
      "resultCode": "00",
      "resultMsg": "NORMAL_SERVICE"
    },
    "body": {
      "dataType": "JSON",
      "items": {
        "item": [
          {
            "baseDate": "20250822",
            "baseTime": "1000",
            "category": "T1H",
            "fcstDate": "20250822",
            "fcstTime": "1100",
            "fcstValue": "25",
            "nx": 55,
            "ny": 124
          }
        ]
      }
    }
  }
}
```

### GET /weather/version
예보 버전 정보 조회

**Query Parameters**
- `ftype` (string, required): 예보 타입
  - `ODAM`: 초단기실황
  - `VSRT`: 초단기예보
  - `SHRT`: 단기예보

**Example Request**
```
GET /weather/version?ftype=ODAM
```

---

## 버스 노선

### GET /bus-route/list
전체 버스 노선 조회

**Response**
```json
[
  {
    "bus_route_id": "234000001",
    "bus_route_name": "7016",
    "bus_route_city": "부천시"
  }
]
```

### GET /bus-route/listByCity
도시별 버스 노선 조회

**Query Parameters**
- `city` (string, required): 도시명

**Example Request**
```
GET /bus-route/listByCity?city=부천시
```

### GET /bus-route/listByBusNumber
버스 번호로 노선 조회

**Query Parameters**
- `busNumber` (string, required): 버스 번호

**Example Request**
```
GET /bus-route/listByBusNumber?busNumber=7016
```

**Response**
```json
{
  "bus_route_id": "234000001",
  "bus_route_name": "7016",
  "bus_route_city": "부천시"
}
```

---

## 지역화폐

### POST /local-currency/search
지역화폐 가맹점 검색

**Request Body**
```json
{
  "pIndex": 1,
  "pSize": 20,
  "sigun_nm": "부천시",
  "cmpnm_nm": "음식점",
  "refine_roadnm_addr": "",
  "refine_lotno_addr": ""
}
```

**Parameters**
- `pIndex` (number, required): 페이지 번호 (1부터 시작)
- `pSize` (number, required): 페이지당 결과 수
- `sigun_nm` (string, optional): 시군명 (예: "부천시")
- `cmpnm_nm` (string, optional): 상호명 또는 업종
- `refine_roadnm_addr` (string, optional): 도로명 주소
- `refine_lotno_addr` (string, optional): 지번 주소

**Response**
```json
{
  "totalCount": 1234,
  "result": {
    "code": "INFO-000",
    "message": "정상 처리되었습니다."
  },
  "apiVersion": "1.0",
  "stores": [
    {
      "SIGUN_NM": "부천시",
      "CMPNM_NM": "맛있는 식당",
      "INDUTYPE_NM": "한식",
      "REFINE_ROADNM_ADDR": "경기도 부천시 원미구 중동로 123",
      "REFINE_LOTNO_ADDR": "경기도 부천시 원미구 중동 123-45",
      "REFINE_ZIPNO": "14500",
      "REFINE_WGS84_LAT": "37.5048",
      "REFINE_WGS84_LOGT": "126.7644",
      "BIZREGNO": "1234567890",
      "INDUTYPE_CD": "2601",
      "FRCS_NO": "987654321",
      "LEAD_TAX_MAN_STATE": "01",
      "LEAD_TAX_MAN_STATE_CD": "01",
      "CLSBIZ_DAY": null
    }
  ]
}
```

**휴폐업 상태 코드**
- `01`: 계속사업자 (운영 중)
- `02`: 휴업자
- `03`: 폐업자

---

## 에러 응답

모든 API는 에러 발생 시 다음과 같은 형식으로 응답합니다:

```json
{
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "Bad Request"
}
```

**주요 HTTP 상태 코드**
- `200`: 성공
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 내부 오류

---

## 사용 예시

### 1. AI 챗봇으로 날씨 문의
```bash
curl -X POST https://your-domain.com/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "userQuestion": "오늘 날씨 어때?",
    "coords": {"nx": 55, "ny": 124}
  }'
```

### 2. 지역화폐 가맹점 검색
```bash
curl -X POST https://your-domain.com/local-currency/search \
  -H "Content-Type: application/json" \
  -d '{
    "pIndex": 1,
    "pSize": 10,
    "sigun_nm": "부천시",
    "cmpnm_nm": "음식점"
  }'
```

### 3. 버스 노선 조회
```bash
curl "https://your-domain.com/bus-route/listByBusNumber?busNumber=7016"
```

---

## 개발 정보

- **Framework**: NestJS
- **Database**: MySQL
- **AI Model**: OpenAI GPT-4o-mini
- **External APIs**: 
  - 기상청 단기예보 API
  - 경기도 공공데이터 API
  - 버스 정보 API

## 업데이트 내역

- **v1.0.0** (2025-08-22): 초기 버전 배포
  - AI 챗봇 기능
  - 날씨, 버스, 지역화폐 정보 제공