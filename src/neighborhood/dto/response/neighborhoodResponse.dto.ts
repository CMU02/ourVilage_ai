import { Neighborhood } from "src/neighborhood/neighborhood.entity";

// 계층적 구조를 위한 인터페이스
interface CitySecond {
    name: string;
    city_thirds: string[];
}

interface CityFirst {
    name: string;
    city_seconds: CitySecond[];
}

export class NeighborhoodResponse {
    cities: CityFirst[];

    toEntity(neighborhoods: Neighborhood[]): NeighborhoodResponse {
        const cityMap = new Map<string, Map<string, Set<string>>>();

        // 데이터를 계층적으로 그룹화
        neighborhoods.forEach(({ city_first, city_second, city_third }) => {
            // city_first 레벨
            if (!cityMap.has(city_first)) {
                cityMap.set(city_first, new Map());
            }

            // city_second 레벨
            const secondMap = cityMap.get(city_first)!;
            if (!secondMap.has(city_second)) {
                secondMap.set(city_second, new Set());
            }

            // city_third 레벨 (동네 이름만)
            const thirdSet = secondMap.get(city_second)!;
            thirdSet.add(city_third);
        });

        // Map을 배열 구조로 변환
        this.cities = Array.from(cityMap.entries()).map(([firstCity, secondMap]) => ({
            name: firstCity,
            city_seconds: Array.from(secondMap.entries()).map(([secondCity, thirdSet]) => ({
                name: secondCity,
                city_thirds: Array.from(thirdSet)
            }))
        }));

        return this;
    }
}
