import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Neighborhood } from "./neighborhood.entity";
import { NeignborhoodService } from "./neighborhood.service";
import { NeighborhoodController } from "./neighborhood.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Neighborhood])],
    providers: [NeignborhoodService],
    controllers: [NeighborhoodController],
    exports: [NeignborhoodService]
})

export class NeighborhoodModule {};