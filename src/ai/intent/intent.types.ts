export type IntentLabel = '약국' | '버스' | '날씨' | '지역화폐' | '기타';
export type IntentResult = {
  intent: IntentLabel;
  meta: Record<string, unknown>;
};