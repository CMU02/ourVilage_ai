import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DomainHandler } from "./handler.types";
import { BusRouteService } from "src/bus_route/bus_route.service";
import { DomainContext, DomainResult } from "../pipline/pipline.types";
import OpenAI from "openai";
import { BusPosService } from "src/bus_position/bus_pos.service";
import { BusRouteResponse } from "src/bus_route/dto/response/BusRouteResponse.dto";
import { BusPosByRtid, BusResponse } from "src/bus_position/types/bus.types";

@Injectable()
export class BusHandler implements DomainHandler {
    constructor(
        private readonly busRouteService: BusRouteService,
        private readonly busPosService: BusPosService,
    ) { }

    private client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    async fetch(ctx: DomainContext) {
        const busNumber = ctx.intentMeta?.busNumber as string || undefined;

        if (!busNumber) {
            throw new HttpException('버스번호가 필요합니다.', HttpStatus.BAD_REQUEST);
        }


        const busRouteInfo = await this.busRouteService.findOneByBusNumber(busNumber).then((data) => {
            if (!data) {
                console.log(`버스 번호 ${busNumber}에 대한 노선 정보를 찾을 수 없습니다.`);
                throw new HttpException(`${busNumber}번 버스 노선 정보를 찾을 수 없습니다. 버스 번호를 다시 확인해주세요.`, HttpStatus.NOT_FOUND);
            }
            return data;
        })
        const busPositionList = await this.busPosService.getBusPosByRtidList(busRouteInfo.bus_route_id);

        return { busRouteInfo, busPositionList };
    }


    async normalize(raw: { busRouteInfo: BusRouteResponse, busPositionList: BusResponse<BusPosByRtid> }, ctx: DomainContext): Promise<Record<string, unknown>> {
        const { busPositionList, busRouteInfo } = raw;

        const result: Record<string, unknown> = {
            busRoute: busRouteInfo,
            busPosition: busPositionList
        }

        return result;
    }

    async answer(snapshot: Record<string, BusRouteResponse | BusPosByRtid>, ctx: DomainContext): Promise<DomainResult> {
        const busRoute = snapshot.busRoute as BusRouteResponse;
        const busPositionData = snapshot.busPosition as unknown as BusResponse<BusPosByRtid>;

        // 안전한 null 체크
        const itemList = busPositionData?.msgBody?.itemList || [];
        const runningBuses = itemList.filter(bus => bus.isrunyn === "1");
        const busCount = runningBuses.length;

        // 버스 위치 데이터 상태 확인
        const hasPositionData = itemList.length > 0;
        const statusMessage = hasPositionData 
            ? `현재 운행 중인 버스: ${busCount}대`
            : '현재 실시간 위치 정보를 가져올 수 없습니다';

        const systemPrompt = `
            당신은 버스 정보를 제공하는 친절한 AI 어시스턴트입니다.
            사용자가 요청한 버스의 현재 운행 상황을 자연스럽게 알려주세요.

            버스 노선 정보:
            - 노선명: ${busRoute.bus_route_name}
            - 도시: ${busRoute.bus_route_city}

            ${statusMessage}

            ${hasPositionData 
                ? `응답 형식: "${busRoute.bus_route_name}번 버스들이 현재 ${busCount}대 운행 중입니다."와 같이 자연스럽게 답변해주세요.`
                : `응답 형식: "${busRoute.bus_route_name}번 버스 노선은 존재하지만 현재 실시간 위치 정보를 확인할 수 없습니다."와 같이 안내해주세요.`
            }
        `;

        try {
            const completion = await this.client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: ctx.userQuestion }
                ],
                temperature: 0.7,
                max_tokens: 200
            });

            const defaultMessage = hasPositionData 
                ? `${busRoute.bus_route_name}번 버스들이 현재 ${busCount}대 운행 중입니다.`
                : `${busRoute.bus_route_name}번 버스 노선은 존재하지만 현재 실시간 위치 정보를 확인할 수 없습니다.`;

            const aiMessage = completion.choices[0]?.message?.content || defaultMessage;

            return {
                message: aiMessage,
                meta: {
                    intent: 'bus',
                    busRoute: busRoute,
                    runningBusCount: busCount,
                    busPositions: runningBuses.map(bus => ({
                        vehId: bus.vehId,
                        plainNo: bus.plainNo,
                        gpsX: bus.gpsX,
                        gpsY: bus.gpsY,
                        posX: bus.posX,
                        posY: bus.posY,
                        stopFlag: bus.stopFlag,
                        nextStTm: bus.nextStTm,
                        congetion: bus.congetion,
                        busType: bus.busType,
                        isFullFlag: bus.isFullFlag,
                        dataTm: bus.dataTm
                    }))
                }
            };
        } catch (error) {
            // OpenAI API 호출 실패 시 기본 메시지 반환
            const fallbackMessage = hasPositionData 
                ? `${busRoute.bus_route_name}번 버스들이 현재 ${busCount}대 운행 중입니다.`
                : `${busRoute.bus_route_name}번 버스 노선은 존재하지만 현재 실시간 위치 정보를 확인할 수 없습니다.`;
                
            return {
                message: fallbackMessage,
                meta: {
                    busRoute: busRoute,
                    runningBusCount: busCount,
                    busPositions: runningBuses.map(bus => ({
                        vehId: bus.vehId,
                        plainNo: bus.plainNo,
                        gpsX: bus.gpsX,
                        gpsY: bus.gpsY,
                        posX: bus.posX,
                        posY: bus.posY,
                        stopFlag: bus.stopFlag,
                        nextStTm: bus.nextStTm,
                        congetion: bus.congetion,
                        busType: bus.busType,
                        isFullFlag: bus.isFullFlag,
                        dataTm: bus.dataTm
                    })),
                    error: error.message
                }
            };
        }
    }
}