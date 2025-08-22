import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Neighborhood } from "./neighborhood.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NeighborhoodResponse } from "./dto/response/neighborhoodResponse.dto";
import { NeighborhoodDataResponse } from "./dto/response/neighborhoodDataResponse.dto";
import { NeighborhoodRequest } from "./dto/request/neighborhoodRequest.dto";

@Injectable()
export class NeignborhoodService {
    constructor(
        @InjectRepository(Neighborhood)
        private readonly neighborhoodRepository: Repository<Neighborhood>
    ) { }

    findCityAddress(): Promise<NeighborhoodResponse> {
        return this.neighborhoodRepository.find().then((list) => {
            return new NeighborhoodResponse().toEntity(list);
        })
    }

    findAddrDataByCity({ ...props }: NeighborhoodRequest): Promise<NeighborhoodDataResponse> {
        const { first, second, third } = props;
        return this.neighborhoodRepository.findOneBy({
            city_first: first,
            city_second: second,
            city_third: third
        }).then((data) => {
            if (!data) {
                throw new HttpException('해당 지역 데이터가 없습니다.', HttpStatus.NOT_FOUND)
            }
            return new NeighborhoodDataResponse().toEntity(data);
        })
    }
}