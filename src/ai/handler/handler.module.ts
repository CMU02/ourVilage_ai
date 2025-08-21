import { Module } from "@nestjs/common";
import { WeatherHandler } from "./weather_handler.service";
import { WeatherModule } from "src/weather/weather.module";
import { BusHandler } from "./bus_handler.service";
import { BusRouteModule } from "src/bus_route/bus_route.module";
import { BusPosModule } from "src/bus_position/bus_pos.module";

@Module({
    imports: [WeatherModule, BusRouteModule, BusPosModule],
    providers: [WeatherHandler, BusHandler],
    exports: [WeatherHandler, BusHandler]
})

export class HandlerModule { }