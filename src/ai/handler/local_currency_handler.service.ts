import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DomainHandler } from "./handler.types";
import { DomainContext, DomainResult } from "../pipline/pipline.types";
import OpenAI from "openai";
import { LocalCurrencyService } from "src/local-currency/local_currency.service";
import { LocalCurrencyStore, ParsedLocalCurrencyData } from "src/local-currency/local_currency.types";

@Injectable()
export class LocalCurrencyHandler implements DomainHandler {
    constructor(
        private readonly localCurrencyService: LocalCurrencyService
    ) { }

    private client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async fetch(ctx: DomainContext) {
        const region = ctx.intentMeta?.region as string || '';
        const storeName = ctx.intentMeta?.storeName as string || '';
        const address = ctx.intentMeta?.address as string || '';

        try {
            const localCurrencyData = await this.localCurrencyService.getLocalCurrencyStores({
                pIndex: 1,
                pSize: 100, // 충분한 데이터를 가져와서 AI가 분석할 수 있도록
                sigun_nm: region,
                cmpnm_nm: storeName,
                refine_roadnm_addr: address,
                refine_lotno_addr: ''
            });
            return localCurrencyData;
        } catch (error) {
            throw new HttpException(
                `지역화폐 정보를 가져오는 중 오류가 발생했습니다: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async normalize(raw: ParsedLocalCurrencyData, ctx: DomainContext): Promise<Record<string, unknown>> {
        const { stores, totalCount, result } = raw;

        console.log('LocalCurrency normalize - raw data:', {
            totalCount,
            storesLength: stores?.length,
            firstStore: stores?.[0],
            sampleStates: stores?.slice(0, 3).map(s => s.LEAD_TAX_MAN_STATE)
        });

        // 운영 중인 가맹점만 필터링 (폐업하지 않은 곳)
        const activeStores = stores.filter(store =>
            store.LEAD_TAX_MAN_STATE_CD === '01' && !store.CLSBIZ_DAY
        );

        console.log('LocalCurrency normalize - after filtering:', {
            activeStoresLength: activeStores.length,
            originalLength: stores?.length
        });

        // 지역별로 그룹화
        const storesByRegion = activeStores.reduce((acc, store) => {
            const region = store.SIGUN_NM;
            if (!acc[region]) {
                acc[region] = [];
            }
            acc[region].push(store);
            return acc;
        }, {} as Record<string, LocalCurrencyStore[]>);

        // 업종별로 그룹화
        const storesByIndustry = activeStores.reduce((acc, store) => {
            const industry = store.INDUTYPE_NM;
            if (!acc[industry]) {
                acc[industry] = [];
            }
            acc[industry].push(store);
            return acc;
        }, {} as Record<string, LocalCurrencyStore[]>);

        const normalizedResult = {
            totalCount,
            activeStoreCount: activeStores.length,
            apiResult: result,
            storesByRegion,
            storesByIndustry,
            stores: activeStores.slice(0, 10) // 상위 10개만 포함 (토큰 절약)
        };

        console.log('LocalCurrency normalize - final result:', {
            activeStoreCount: normalizedResult.activeStoreCount,
            regionCount: Object.keys(storesByRegion).length,
            industryCount: Object.keys(storesByIndustry).length
        });

        return normalizedResult;
    }

    async answer(snapshot: Record<string, any>, ctx: DomainContext): Promise<DomainResult> {
        const { activeStoreCount, storesByRegion, storesByIndustry, stores } = snapshot;
        // 지역 정보 요약
        const regionSummary = Object.entries(storesByRegion as Record<string, LocalCurrencyStore[]>)
            .map(([region, regionStores]) => `${region}: ${regionStores.length}개`)
            .slice(0, 5)
            .join(', ');

        // 주요 업종 요약
        const industrySummary = Object.entries(storesByIndustry as Record<string, LocalCurrencyStore[]>)
            .sort(([, a], [, b]) => b.length - a.length)
            .slice(0, 5)
            .map(([industry, industryStores]) => `${industry}: ${industryStores.length}개`)
            .join(', ');

        const systemPrompt = `
            당신은 지역화폐 가맹점 정보를 제공하는 친절한 AI 어시스턴트입니다.
            사용자의 질문에 맞춰 지역화폐 사용 가능한 가맹점 정보를 자연스럽게 알려주세요.

            현재 데이터:
            - 총 운영 중인 가맹점: ${activeStoreCount}개
            - 지역별 분포: ${regionSummary}
            - 주요 업종: ${industrySummary}

            응답 가이드라인:
            1. 사용자가 특정 지역을 물어보면 해당 지역의 가맹점 수와 주요 업종을 알려주세요
            2. 특정 업종을 물어보면 해당 업종의 가맹점 수와 지역 분포를 알려주세요
            3. 구체적인 가맹점을 물어보면 해당 가맹점의 정보(주소, 업종 등)를 알려주세요
            4. 일반적인 질문이면 전체 현황을 요약해서 알려주세요
            5. 친근하고 도움이 되는 톤으로 답변해주세요

            주의사항:
            - 정확한 정보만 제공하세요
            - 데이터에 없는 내용은 추측하지 마세요
            - 가맹점 이용 시 지역화폐 사용 가능 여부를 미리 확인하라고 안내해주세요
        `;

        try {
            const completion = await this.client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: ctx.userQuestion }
                ],
                temperature: 0.3,
                max_tokens: 300
            });

            const aiMessage = completion.choices[0]?.message?.content ||
                `현재 운영 중인 지역화폐 가맹점은 총 ${activeStoreCount}개입니다.`;

            return {
                message: aiMessage,
                meta: {
                    intent: 'local_currency',
                    totalStores: activeStoreCount,
                    regionCount: Object.keys(storesByRegion).length,
                    industryCount: Object.keys(storesByIndustry).length,
                    topStores: (stores as LocalCurrencyStore[]).slice(0, 5).map(store => ({
                        name: store.CMPNM_NM,
                        industry: store.INDUTYPE_NM,
                        region: store.SIGUN_NM,
                        address: store.REFINE_ROADNM_ADDR,
                        lat: store.REFINE_WGS84_LAT,
                        lng: store.REFINE_WGS84_LOGT
                    })),
                    token: completion.usage?.total_tokens ?? 0
                }
            };
        } catch (error) {
            // OpenAI API 호출 실패 시 기본 메시지 반환
            return {
                message: `현재 운영 중인 지역화폐 가맹점은 총 ${activeStoreCount}개입니다. 자세한 정보는 다시 시도해주세요.`,
                meta: {
                    intent: 'local_currency',
                    totalStores: activeStoreCount,
                    regionCount: Object.keys(storesByRegion).length,
                    industryCount: Object.keys(storesByIndustry).length,
                    error: error.message
                }
            };
        }
    }
}