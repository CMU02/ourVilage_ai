/**
 * 안전하게 JSON 문자열을 파싱하는 함수
 * - 모델 응답이나 외부 API 응답이 JSON이 아닐 수도 있으므로
 *   JSON.parse()에서 에러가 나더라도 안전하게 null 반환
 * - 흔히 발생하는 "텍스트 + JSON" 섞임 문제(예: 코드블록, 설명 텍스트 포함)를
 *   대비해서 중괄호 부분만 추출하여 재시도
 *
 * @param text JSON 문자열(또는 null/undefined)
 * @returns 성공 시 파싱된 객체, 실패 시 null
 */
export const safeParseJson = <T = any>(text: string): T | null => {
  if (!text) return null; // 입력이 없으면 null 반환
  try {
    return JSON.parse(text) as T;
  } catch {
    // 예외 발생 시 (보통 JSON 앞뒤에 불필요한 텍스트/코드블록이 있을 때)
    // 중괄호 { ... } 부분만 정규식으로 추출 시도
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]) as T; // 추출한 부분 파싱
      } catch {
        return null; // 여전히 실패하면 null 반환
      }
    }
    return null;
  }
};
