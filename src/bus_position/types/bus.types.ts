export interface BusResponse<T> {
  comMsgHeader: ComMsgHeader;
  msgHeader: MsgHeader;
  msgBody: {
    itemList: T[];
  };
}

// 공통 메세지 헤더
interface ComMsgHeader {
  responseTime: string | null;
  responseMsgID: string | null;
  requestMsgID: string | null;
  returnCode: string | null;
  errMsg: string | null;
  successYN: string | null;
}
interface MsgHeader {
  headerMsg: string;
  headerCd: string;
  itemCount: number;
}

export interface BusPosByRtid {
    sectOrd: string; // 구간 순번
    fullSectDist: string; // 정류소간 거리
    sectDist: string; // 구간옵셋거리(KM)
    rtDist: string; // 노선옵셋거리(KM)
    stopFlag: "0" | "1"; // 정류소도착여부(0: 운행중, 1: 도착)
    sectionId: string; // 구간ID
    dataTm: string; // 제공시간
    gpsX: string; // 맵매칭X좌표 (WGS84);
    gpsY: string; // 맵매칭Y좌표 (WGS84);
    vehId: string; // 버스ID;
    plainNo: string; // 차량번호
    busType: "0" | "1" | "2"; // 차량유형(0: 일반버스, 1:저상버스, 2:굴절버스)
    lastStTm: string; // 종점도착소요시간
    nextStTm: string; // 다음정류소도착소요시간
    isrunyn: "0" | "1"; //  해당차량 운행여부 (0: 운행종료, 1: 운행)
    trnstnid: string; // 회차지 정류소ID
    islastyn: "0" | "1"; // 막차여부 (0: 막차아님, 1: 막차)
    isFullFlag: "0" | "1"; // 만차여부 (0: 만차아님, 1: 만차)
    posX: string; // 맵매칭X좌표 (GRS80)
    posY: string; // 맵매칭Y좌표 (GRS80)
    lastStnId: string; // 최종 정류장ID
    congetion: "0" | "3" | "4" | "5" | "6"; // 혼잡도 (0:없음, 3:여유, 4:보통, 5:혼잡, 6:매우 혼잡)
    nextStId: string; // 다음정류소 아이디
}
