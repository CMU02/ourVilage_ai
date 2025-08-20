import { Module } from "@nestjs/common";
import { WeatherHandler } from "./weather_handler.service";

@Module({
    providers: [WeatherHandler],
    exports: [WeatherHandler]
})

export class HandlerModule {}