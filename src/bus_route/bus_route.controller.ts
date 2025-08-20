import { Controller, Get, Param, Query } from "@nestjs/common";
import { BusRouteService } from "./bus_route.service";
import { BusRouteResponse } from "./dto/response/BusRouteResponse.dto";

@Controller('/bus-route')
export class BusRouteController {
    constructor(private readonly busRouteService: BusRouteService) {}

    @Get('/list')
    findAllBusRoute(): Promise<BusRouteResponse[]> {
        return this.busRouteService.findAll();
    }

    @Get('/listByCity')
    findAllBusRouteByCity(@Query('city') city: string): Promise<BusRouteResponse[]> {
        return this.busRouteService.findAllByCity(city);
    }

    @Get('listByBusNumber')
    findAllBusRouteByBusNumber(@Query('busNumber') busNumber: string): Promise<BusRouteResponse | null> {
        return this.busRouteService.findOneByBusNumber(busNumber);
    }
}