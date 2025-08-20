import { IntentLabel } from "../intent/intent.types";

const ALLOWED: IntentLabel[] = ["기타", "날씨", "버스", "약국"] as const;

export const isIntentLabel = (x: any): x is IntentLabel => {
    return ALLOWED.includes(x);
}