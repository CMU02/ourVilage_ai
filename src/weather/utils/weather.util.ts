/**
 * 하늘 상태 코드값을 사람이 읽을 수 있는 설명으로 변환합니다.  
 * 코드 값 기준 (기상청 예시):
 * - 1: 맑음
 * - 3: 구름 많음
 * - 4: 흐림
 * @param code 하늘 상태 코드 값 (example: 1, 3, 4)
 * @return 하늘 상태 설명 문자열 (예: "맑음", "구름 많음", "흐림")
 */
export const mapSkyCondition = (code : string) => {
    switch (code) {
        case "1": return "맑음";
        case "3": return "구름 많음";
        case "4": return "흐림";
        default: return "알 수 없음"; // 예외 처리
    }
}

/**
 * 강수형태 코드값을 사람이 읽을 수 있는 설명으로 변환합니다.  
 * 코드값 기준 (기상청 예시):
 *  - 0: 없음
 *  - 1: 비
 *  - 2: 비/눈
 *  - 3: 눈
 *  - 4: 소나기
 *  - 5: 빗방울
 *  - 6: 빗방울/눈날림
 *  - 7: 눈날림
 * @param code 강수형태 코드값 (예: 0, 1, 2, 3, 4, 5, 6, 7)
 * @returns 강수형태 설명 문자열 (예: "없음", "비", "비/눈", ...)
 */
export const mapPrecipitationType = (target: "vilage" | "ultraShortTerm", code: string) => {
    if (target === "vilage") { // 단기 예보일 경우
        switch (code) {
            case "1": return "비";
            case "2": return "비/눈";
            case "3": return "눈";
            case "4": return "소나기";
            default: return "없음"
        }
    } else { // 초단기 예보일 경우
        switch (code) {
            case "1": return "비";
            case "2": return "비/눈";
            case "3": return "눈";
            case "5": return "빗방울";
            case "6": return "빗방울/눈날림";
            case "7": return "눈날림";
            default: return "없음";
        }
    }
}

/**
 * 강수량(RN1, PCP) 범주 값을 사람이 읽을 수 있는 형식으로 변환합니다.  
 * 기상청 단기/초단기예보의 값은 mm 단위의 강수량을 문자열 범주로 제공합니다.  
 * - "-", null, 0: 강수 없음
 * - 0.1 ~ 1.0mm 미만: 1mm 미만
 * - 1.0mm 이상 ~ 30.0mm 미만: 실수값 + mm (1.0mm ~ 29.0mm)
 * - 30.0mm이상 ~ 50.0mm 미만: 30.0mm~50.0mm
 * - 50.0mm 이상: 50.0mm 이상
 * @example PCP = 6.2 -> "6.2mm"
 * @example PCP = 30.0 -> "30.0mm ~ 50.0mm"  
 * @param value 강수량 범주 값(문자열)
 * @returns 변환된 강수량 문자열
 */
export const formatPrecipitationAmount = (value: string | null) => {
    if (value === "-" || value === null || value === "0") {
        return "강수 없음";
    }

    // 숫자만 추출
    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ""))
    if (numericPart > 0 && numericPart < 1.0) {
        return "1mm 미만";
    } else if (numericPart >= 1.0 && numericPart < 30.0) {
        return `${numericPart.toFixed(1)}mm ~ 29.9mm`;
    } else if (numericPart >= 30.0 && numericPart < 50.0) {
        return "30.0mm ~ 50.0mm";
    } else {
        return "50.0mm 이상";
    }
}

/**
 * 신적설(SNO) 값을 기상청 밤주 규칙에 맞춰 사람이 읽을 수 있는 형식으로 변환합니다.  
 * 범주 규칙:  
 * - "-", null, 0: 적설 없음
 * - 0.1 ~ 0.5cm 미만: 실수값+cm 미만
 * - 0.5cm ~ 5.0cm 미만: 실수값+cm (0.5cm~4.9cm)
 * - 5.0cm 이상: 5.0cm 이상
 * @param value 신적설 범주 값(문자열)
 * @returns 변환된 신적설 문자열
 */
export const formatSnowfallAmount = (value: string | null) => {
    if (value === "-" || value === null || value <= "0") {
        return "적설없음";
    }

    // 숫자만 추출
    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (numericPart >= 0.1 && numericPart < 0.5) {
        return `${numericPart.toFixed(1)}cm 미만`;
    } else if (numericPart >= 0.5 && numericPart < 5.0) {
        return `${numericPart.toFixed(1)}cm ~ 4.9cm`;
    } else {
        return "5.0cm 이상";
    }
}

/**
 * 낙뢰(LGT) 값을 사람이 읽을 수 있는 형식으로 변환합니다.
 */
export const formatLightningIntensity = (value: string) => {
    const numericPart = parseFloat(value);
    if (numericPart >= 0 && numericPart <= 0.1) {
        return "낙뢰 없음";
    }
    return `${numericPart.toFixed(1)}kA/㎢`;
}

/**
 * 풍향(DEG)값을 16방위 문자열로 변환합니다.
 * @param degree 풍향 값 (0 ~ 360)
 * @returns 16방위 문자열 (예: "N", "NE", "SSW", ...)
 */
export const getWindDirectionLabel = (degree: number | string) => {
    const deg = typeof degree === "string" ? Number(degree) : degree
    if (deg < 0 || deg > 360 || isNaN(deg)) {
        return "알 수 없음";
    }
    const directions = [
        "N", "NNE", "NE", "ENE",
        "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW"
    ]

    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}


interface WindSpeedInformation {
    speed: string; // 풍속
    notification: string; // 통보문
    meaning: string; // 의미
    description: string; // 비고
}
/**
 * 풍속(WSD) 값을 사람이 읽을 수 있는 형식으로 변환합니다.
 * @param value 풍속 값
 * @returns 변환된 풍속 문자열
 */
export const getWindSpeedInformation = (value: string): WindSpeedInformation | undefined => {
    const numericPart = parseFloat(value);
    if (isNaN(numericPart) || numericPart < 0) {
        return;
    }
    const speedLabel = `${numericPart.toFixed(1)}m/s`;

    if (numericPart < 4.0) {
        return {
            speed: speedLabel,
            notification: "",
            meaning: "바람이 약합니다.",
            description: "연기흐름에 따라 풍향감지가 가능합니다."
        }
    }
    if (numericPart >= 4.0 && numericPart < 9.0) {
        return {
            speed: speedLabel,
            notification: "약강",
            meaning: "바람이 약간 강합니다.",
            description: "안면에 감촉을 느끼면서, 나뭇잎이 조금 흔들립니다."
        }
    } else if (numericPart >= 9.0 && numericPart < 14.0) {
        return {
            speed: speedLabel,
            notification: "강",
            meaning: "바람이 강합니다.",
            description: "나무가지와 깃발이 가볍게 흔들립니다."
        }
    } else {
        return {
            speed: speedLabel,
            notification: "매우강",
            meaning: "바람이 매우 강합니다.",
            description: "먼지가 일고, 작은 나무 전체가 흔들립니다."
        }
    }
}
/**
 * 바람 성분을 분석하여 방향을 알려주는 유틸
 * @param ewValue "UUU" 값이 들어오며, 동(+), 서(-)
 * @param snValue "VVV" 값이 들어오며, 북(+), 남(-)
 * @returns "북동", "남서", "북", "동", "무풍"
 */
export const SimpleWindDirection = (ewValue: string | null, snValue: string | null) => {
    if (!ewValue && !snValue) {
        return;
    }
    const ew = Number(ewValue);
    const sn = Number(snValue);

    let result = "";

    if (sn > 0) result += "북"
    else if (sn < 0) result += "남"

    if (ew > 0) result += "동"
    else  if (ew < 0) result += "서"
    
    return result;
}