import { Neighborhood } from "src/neighborhood/neighborhood.entity";

export class NeighborhoodDataResponse {
    grid_x: string; // 격자X
    grid_y: string; // 격자Y
    logt_hour: string; // 경도(시)
    logt_minute: string; // 경도(분)
    logt_second: string; // 경도(초)
    lat_hour: string; // 위도(시)
    lat_minute: string; // 위도(분)
    lat_second: string; // 위도(초)
    logt_second_100: string; // 경도(초/100)
    lat_second_100: string; // 위도(초/100)

    toEntity(neighborhoods: Neighborhood): NeighborhoodDataResponse {
        this.grid_x = neighborhoods.grid_x
        this.grid_y = neighborhoods.grid_y
        this.logt_hour = neighborhoods.logt_hour
        this.logt_minute = neighborhoods.logt_minute
        this.logt_second = neighborhoods.logt_second
        this.lat_hour = neighborhoods.lat_hour
        this.lat_minute = neighborhoods.lat_minute
        this.lat_second = neighborhoods.lat_second
        this.logt_second_100 = neighborhoods.logt_second_100
        this.lat_second_100 = neighborhoods.lat_second_100

        return this;
    }
}