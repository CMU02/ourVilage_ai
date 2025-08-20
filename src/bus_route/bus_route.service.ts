import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusRoute } from './bus_route.entity';
import { BusRouteResponse } from './dto/response/BusRouteResponse.dto';

@Injectable()
export class BusRouteService {
  constructor(
    @InjectRepository(BusRoute)
    private busRouteRepository: Repository<BusRoute>,
  ) {}

  private now = new Date().toISOString();

  /**
   * Bus Route 리스트 조회
   */
  findAll(): Promise<BusRouteResponse[]> {
    return this.busRouteRepository.find().then((list) => {
      return list.map((data) => new BusRouteResponse().toEntity(data));
    });
  }

  /**
   * 도시 이름으로 Bus Route 리스트 조회
   * @param city 도시이름 ex: seoul
   */
  findAllByCity(city: string): Promise<BusRouteResponse[]> {
    if (!city) {
      throw new HttpException(
        `도시명은 필수 값입니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.busRouteRepository.findBy({ route_city: city }).then((list) => {
      return list.map((data) => new BusRouteResponse().toEntity(data));
    });
  }

  findOneByBusNumber(busNumber: string): Promise<BusRouteResponse | null> {
    if (!busNumber) {
      throw new HttpException(
        `버스번호은 필수 값입니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.busRouteRepository
      .findOneBy({ route_name: busNumber })
      .then((data) => {
        if (!data) {
          return null;
        } else {
          return new BusRouteResponse().toEntity(data);
        }
      });
  }
}
