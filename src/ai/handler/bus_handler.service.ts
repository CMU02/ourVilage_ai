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
                throw new HttpException(`버스노선정보 받아오는 과정에서 오류`, HttpStatus.INTERNAL_SERVER_ERROR);
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

        const runningBuses = busPositionData.msgBody.itemList.filter(bus => bus.isrunyn === "1");
        const busCount = runningBuses.length;

        const systemPrompt = `
            당신은 버스 정보를 제공하는 친절한 AI 어시스턴트입니다.
            사용자가 요청한 버스의 현재 운행 상황을 자연스럽게 알려주세요.

            버스 노선 정보:
            - 노선명: ${busRoute.bus_route_name}
            - 도시: ${busRoute.bus_route_city}

            현재 운행 중인 버스: ${busCount}대

            응답 형식: "${busRoute.bus_route_name}번 버스들이 현재 ${busCount}대 운행 중입니다."와 같이 자연스럽게 답변해주세요.
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

            const aiMessage = completion.choices[0]?.message?.content ||
                `${busRoute.bus_route_name}번 버스들이 현재 ${busCount}대 운행 중입니다.`;

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
            return {
                message: `${busRoute.bus_route_name}번 버스들이 현재 ${busCount}대 운행 중입니다.`,
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