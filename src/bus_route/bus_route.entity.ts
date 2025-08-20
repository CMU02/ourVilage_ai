import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('bus_route')
export class BusRoute {
  @PrimaryColumn({ length: 50 })
  route_id: string; // 노선ID

  @Column({ length: 100 })
  route_name: string; // 노선명
  
  @Column({ length: 50 })
  route_city: string; // 노선도시
}
