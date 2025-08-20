import { BusRoute } from "src/bus_route/bus_route.entity";

export class BusRouteResponse {
    bus_route_id: string;
    bus_route_name: string;
    bus_route_city: string;

    toEntity(busRoute: BusRoute): BusRouteResponse {
        this.bus_route_id = busRoute.route_id;
        this.bus_route_name = busRoute.route_name;
        this.bus_route_city = busRoute.route_city;
        return this;
    }
}