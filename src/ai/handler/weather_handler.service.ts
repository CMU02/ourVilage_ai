import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DomainHandler } from "./handler.types";
import { DomainContext, DomainResult } from "../pipline/pipline.types";
import { WeatherService } from "src/weather/weather.service";
import { UltraShortTermRealTime } from "src/weather/types/weather.types";
import { formatPrecipitationAmount, getWindSpeedInformation, mapPrecipitationType, SimpleWindDirection } from "src/weather/utils/weather.util";
import OpenAI from "openai";
import { getKrTime } from "src/weather/utils/krTime.util";

@Injectable()
export class WeatherHandler implements DomainHandler {

    constructor(
        private readonly weatherServcie: WeatherService
    ) {}

    private client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    private krtime = getKrTime();

    async fetch(ctx: DomainContext) {
        if (!ctx.coords) {
            throw new HttpException('날씨 좌표 파라미터가 없습니다.', HttpStatus.BAD_REQUEST)
        }

        const { nx, ny } = ctx.coords;
        const base_date = this.krtime.slice(0, 10).replace(/-/g, "");
        const base_time = this.krtime.slice(11, 12) + '00';

        const response = await this.weatherServcie.getUltraShortTermRealTime(nx, ny, base_date, base_time);
        return response.response.body.items.item as Array<UltraShortTermRealTime>;
    }

    async normalize(raw: Array<UltraShortTermRealTime>, ctx: DomainContext) {
        const get = (category: string) => raw.find(i => i.category === category)?.obsrValue
        const t1h = get("T1H"); // 기온
        const rn1 = get("RN1"); // 1시간 강수량
        const uuu = get("UUU"); // 동서 바람성분
        const vvv = get("VVV"); // 남북 바람성분
        const reh = get("REH"); // 습도
        const pty = get("PTY"); // 강수형태
        const wsd = get("WSD"); // 풍속

        const base_datetime = this.krtime.slice(0, 10).replace(/-/g, "") + this.krtime.slice(11, 12) + '00';
        const version = this.weatherServcie.getForecastVersion("ODAM", base_datetime); // 초단기실황 버전 조회

        const result: Record<string, unknown> = {
            version,
            temperature: t1h ? `${Number(t1h).toFixed(1)}°C` : undefined,
            precipitation: rn1 || pty ? {
                type: mapPrecipitationType("ultraShortTerm", pty ?? "-1"),
                value: formatPrecipitationAmount(rn1 ?? null)
            } : undefined,
            wind: wsd && uuu && vvv ? (() => {
                const info = getWindSpeedInformation(wsd)
                return {
                    speed: info?.speed,
                    meaning: info?.meaning,
                    direction: SimpleWindDirection(uuu ?? "0", vvv ?? "0")
                }
            })() : undefined,
            humidity: reh ? `${reh}%` : undefined
        }

        return result;
    }

    async answer(snapshot: Record<string, any>, ctx: DomainContext): Promise<DomainResult> {
        const systemPrompt = `
            너는 친절한 날씨 도우미야. 아래의 스냅샷 정보 바탕으로 간결하고 사용자에게 정확하게 대답해줘. 
            비어있는 값은 언급하지마. \n
            스냅샷: ${JSON.stringify(snapshot, null, 2)}
        `
        const response = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: ctx.userQuestion }
            ]
        })

        return {
            message: response.choices[0].message.content ?? "지금 정보를 불러오지 못했습니다. 다시시도 해주세요.",
            meta: {
                intent: 'weather',
                token: response.usage?.total_tokens ?? 0 
            }
        }
    }
}