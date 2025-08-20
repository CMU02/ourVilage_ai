export interface DomainContext {
    userQuestion: string; // 사용자 질문
    intentMeta?: Record<string, unknown>; // AI 의도 분석 메타데이터
    coords?: { nx : number, ny: number }; // 날씨용 좌표
    geo?: { lat: string, lng: string }; // 버스/약국 공통
    option?: {
        bus: {
            busNumber: string; // 버스번호
        }
    }
}

export interface DomainResult {
    message: string; // LLM이 유저에게 최종 전달한 자연어 메세지
    meta?: Record<string, unknown>; // 디버깅/추적/후처리용 메타데이터
}