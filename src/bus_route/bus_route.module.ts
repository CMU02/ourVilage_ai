import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusRoute } from "./bus_route.entity";
import { BusRouteController } from "./bus_route.controller";
import { BusRouteService } from "./bus_route.service";

@Module({
    imports: [TypeOrmModule.forFeature([BusRoute])],
    controllers: [BusRouteController],
    providers: [BusRouteService],
    exports: [BusRouteService]
})

export class BusRouteModule {};