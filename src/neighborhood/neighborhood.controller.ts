import { Body, Controller, Get, Post } from "@nestjs/common";
import { NeignborhoodService } from "./neighborhood.service";
import { NeighborhoodResponse } from "./dto/response/neighborhoodResponse.dto";
import { NeighborhoodDataResponse } from "./dto/response/neighborhoodDataResponse.dto";
import { NeighborhoodRequest } from "./dto/request/neighborhoodRequest.dto";

@Controller('/neighborhood')
export class NeighborhoodController {
    constructor(
        private readonly neighborhoodService: NeignborhoodService
    ) {}

    @Get('/city')
    findCityAddress(): Promise<NeighborhoodResponse> {
        return this.neighborhoodService.findCityAddress();
    }

    @Post('/get-city-data')
    findAddrDataByCity(@Body() {...props}: NeighborhoodRequest): Promise<NeighborhoodDataResponse> {
        return this.neighborhoodService.findAddrDataByCity(props);
    }
}