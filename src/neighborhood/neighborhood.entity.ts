import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('neighborhoods')
export class Neighborhood {
    @PrimaryColumn({ length: 20 })
    neighborhood_id: string;

    @Column({ length: 50 })
    city_first: string; // 시/도

    @Column({ length: 50 })
    city_second: string; // 시/군/구

    @Column({ length: 50 })
    city_third: string; // 읍/면/리

    @Column({ length: 10 })
    grid_x: string; // 격자X

    @Column({ length: 10 })
    grid_y: string; // 격자Y

    @Column({ length: 10 })
    logt_hour: string; // 경도(시)

    @Column({ length: 10 })
    logt_minute: string; // 경도(분)

    @Column({ length: 20 })
    logt_second: string; // 경도(초)

    @Column({ length: 10 })
    lat_hour: string; // 위도(시)

    @Column({ length: 10 })
    lat_minute: string; // 위도(분)

    @Column({ length: 20 })
    lat_second: string; // 위도(초)

    @Column({ length: 30 })
    logt_second_100: string; // 경도(초/100)
    @Column({ length: 30 })
    lat_second_100: string; // 위도(초/100)
}