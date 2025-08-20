import { Module } from "@nestjs/common";
import { BusPosService } from "./bus_pos.service";

@Module({
    providers: [BusPosService]
})

export class BusPosModule {};