import { Module } from "@nestjs/common";
import { BusPosService } from "./bus_pos.service";

@Module({
    providers: [BusPosService],
    exports: [BusPosService]
})

export class BusPosModule { };