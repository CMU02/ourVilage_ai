import { Module } from "@nestjs/common";
import { WeatherHandler } from "./weather_handler.service";
import { WeatherModule } from "src/weather/weather.module";
import { BusHandler } from "./bus_handler.service";
import { BusRouteModule } from "src/bus_route/bus_route.module";
import { BusPosModule } from "src/bus_position/bus_pos.module";
import { LocalCurrencyModule } from "src/local-currency/local_currency.module";
import { LocalCurrencyHandler } from "./local_currency_handler.service";

@Module({
    imports: [WeatherModule, BusRouteModule, BusPosModule, LocalCurrencyModule],
    providers: [WeatherHandler, BusHandler, LocalCurrencyHandler],
    exports: [WeatherHandler, BusHandler, LocalCurrencyHandler]
})

export class HandlerModule { }