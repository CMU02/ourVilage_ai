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

  // 디버깅을 위한 유사 버스 번호 검색 메서드
  async findSimilarBusNumbers(busNumber: string): Promise<BusRoute[]> {
    const pattern = busNumber.substring(0, Math.min(4, busNumber.length));
    return this.busRouteRepository
      .createQueryBuilder('bus_route')
      .where('bus_route.route_name LIKE :pattern', { pattern: `${pattern}%` })
      .limit(10)
      .getMany();
  }

  async findOneByBusNumber(busNumber: string): Promise<BusRouteResponse | null> {
    if (!busNumber) {
      throw new HttpException(
        `버스번호은 필수 값입니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    
    // 정확한 매치 먼저 시도
    let data = await this.busRouteRepository.findOneBy({ route_name: busNumber });
    
    // 정확한 매치가 없으면 대소문자 구분 없이 검색
    if (!data) {
      data = await this.busRouteRepository
        .createQueryBuilder('bus_route')
        .where('UPPER(bus_route.route_name) = UPPER(:busNumber)', { busNumber })
        .getOne();
    }
    
    // 여전히 없으면 공백 제거 후 검색
    if (!data) {
      const trimmedBusNumber = busNumber.replace(/\s+/g, '');
      data = await this.busRouteRepository
        .createQueryBuilder('bus_route')
        .where('UPPER(REPLACE(bus_route.route_name, \' \', \'\')) = UPPER(:trimmedBusNumber)', { trimmedBusNumber })
        .getOne();
    }
    
    // LIKE 검색으로 부분 매칭 시도 (5522A난곡 -> 5522A% 패턴)
    if (!data) {
      data = await this.busRouteRepository
        .createQueryBuilder('bus_route')
        .where('UPPER(bus_route.route_name) LIKE UPPER(:pattern)', { pattern: `${busNumber}%` })
        .getOne();
    }
    
    // 숫자+문자 부분만으로 검색 (5522A난곡 -> 5522A로 검색)
    if (!data) {
      const basePattern = busNumber.match(/^(\d+[A-Za-z]+)/)?.[1];
      if (basePattern) {
        data = await this.busRouteRepository
          .createQueryBuilder('bus_route')
          .where('UPPER(bus_route.route_name) LIKE UPPER(:pattern)', { pattern: `${basePattern}%` })
          .getOne();
      }
    }
    
    // 하이픈이나 특수문자 제거 후 검색 (5522-A난곡 -> 5522A난곡)
    if (!data) {
      const normalizedBusNumber = busNumber.replace(/[-_\s]/g, '');
      data = await this.busRouteRepository
        .createQueryBuilder('bus_route')
        .where('UPPER(REPLACE(REPLACE(REPLACE(bus_route.route_name, \'-\', \'\'), \'_\', \'\'), \' \', \'\')) = UPPER(:normalizedBusNumber)', { normalizedBusNumber })
        .getOne();
    }
    
    // 역방향 검색: 데이터베이스의 버스명이 입력값을 포함하는지 확인
    if (!data) {
      data = await this.busRouteRepository
        .createQueryBuilder('bus_route')
        .where('UPPER(bus_route.route_name) LIKE UPPER(:pattern)', { pattern: `%${busNumber}%` })
        .getOne();
    }
    
    if (!data) {
      // 유사한 버스 번호들을 찾아서 로그로 출력
      const similarBuses = await this.findSimilarBusNumbers(busNumber);
      return null;
    } else {
      return new BusRouteResponse().toEntity(data);
    }
  }
}
