export const tripInfo = {
  title: "인도 여행 2026",
  dates: {
    start: "2026-02-13",
    end: "2026-02-22",
  },
  totalDays: 10,
};

export const flights = {
  departure: {
    date: "2026-02-13",
    dayOfWeek: "금",
    departureTime: "12:05",
    arrivalTime: "17:30",
    from: {
      city: "서울",
      airport: "인천(ICN)",
      terminal: "T1",
    },
    to: {
      city: "델리",
      airport: "인디라 간디(DEL)",
      terminal: "T3",
    },
    airline: "에어인디아",
    flightNumber: "AI0313",
    duration: "8시간 55분",
    pnr: "E98GP2",
    baggage: "위탁 1개 포함",
  },
  return: {
    date: "2026-02-22",
    dayOfWeek: "일",
    departureTime: "00:15",
    arrivalTime: "10:30",
    from: {
      city: "델리",
      airport: "DEL",
      terminal: "T3",
    },
    to: {
      city: "인천",
      airport: "ICN",
      terminal: "T1",
    },
    airline: "에어인디아",
    flightNumber: "AI0312",
    duration: "6시간 45분",
    pnr: "E98GP2",
    baggage: "위탁 1개 포함",
  },
};

export interface Place {
  id: string;
  name: string;
  nameKo: string;
  lat: number;
  lng: number;
  category: "city" | "attraction" | "food" | "hotel" | "transport";
  description?: string;
  date?: string;
}

export const defaultPlaces: Place[] = [
  {
    id: "delhi",
    name: "New Delhi",
    nameKo: "뉴델리",
    lat: 28.6139,
    lng: 77.209,
    category: "city",
    description: "인도의 수도, 도착/출발 도시",
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer",
    nameKo: "자이살메르",
    lat: 26.9157,
    lng: 70.9083,
    category: "city",
    description: "골든시티, 타르 사막",
  },
  {
    id: "udaipur",
    name: "Udaipur",
    nameKo: "우다이푸르",
    lat: 24.5854,
    lng: 73.7125,
    category: "city",
    description: "호수의 도시, 로맨틱한 궁전",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    nameKo: "자이푸르",
    lat: 26.9124,
    lng: 75.7873,
    category: "city",
    description: "핑크시티, 라자스탄의 수도",
  },
  {
    id: "varanasi",
    name: "Varanasi",
    nameKo: "바라나시",
    lat: 25.3176,
    lng: 82.9739,
    category: "city",
    description: "갠지스 강, 힌두교 성지",
  },
];

// 새로운 일정 데이터 구조
export interface DaySchedule {
  day: number;
  date: string;
  dayOfWeek: string;
  title: string;
  city: string;
  cityEn: string;
  color: string;
  transport?: {
    type: "flight" | "car";
    description: string;
    time?: string;
  };
  activities: {
    time?: string;
    title: string;
    description?: string;
  }[];
  snapPoint?: string;
  accommodation?: string;
  accommodationDetails?: {
    name: string;
    nameEn: string;
    address: string;
    tel: string;
    reservationNo: string;
    roomType: string;
    checkIn: string;
    meal: string;
    guests: number;
    nights: number;
    period: string;
    voucherUrl?: string;
  };
  note?: string;
}

export const itinerary: DaySchedule[] = [
  {
    day: 1,
    date: "2026-02-13",
    dayOfWeek: "금",
    title: "인천 → 델리 도착",
    city: "델리",
    cityEn: "Delhi",
    color: "#f97316",
    transport: {
      type: "flight",
      description: "인천 → 델리 (AI0313)",
      time: "12:05 - 17:30",
    },
    activities: [
      { time: "17:00", title: "인디라 간디 국제공항(DEL) 도착", description: "입국 수속" },
      { title: "호텔 이동 및 휴식" },
    ],
    accommodation: "Pride Plaza Hotel Aerocity, New Delhi",
    accommodationDetails: {
      name: "프라이드 플라자 호텔 에어로시티",
      nameEn: "Pride Plaza Hotel Aerocity",
      address: "Hospitality District, Delhi Aerocity, IGI Airport, New Delhi - 110037",
      tel: "+91-20-66471471",
      reservationNo: "HH2632177268",
      roomType: "Superior Twin Room",
      checkIn: "18:00 (Late Check-in)",
      meal: "조식 불포함",
      guests: 2,
      nights: 1,
      period: "2026-02-13 ~ 2026-02-14",
      voucherUrl: "/vouchers/voucher_HH2632177268.pdf",
    },
    note: "공항 바로 옆 | 체크인 18:00 | 조식 불포함",
  },
  {
    day: 2,
    date: "2026-02-14",
    dayOfWeek: "토",
    title: "델리 → 자이살메르",
    city: "자이살메르",
    cityEn: "Jaisalmer",
    color: "#f59e0b",
    transport: {
      type: "flight",
      description: "델리 → 자이살메르 (AI-1783)",
      time: "13:30 - 15:00",
    },
    activities: [
      { time: "13:30", title: "델리(DEL T2) 출발", description: "Air India AI-1783 · 좌석 24A/24B" },
      { time: "15:00", title: "자이살메르(JSA) 도착" },
      { time: "저녁", title: "자이살메르 탐방" },
    ],
    accommodation: "Rupal Residency, Jaisalmer",
    accommodationDetails: {
      name: "루팔 레지던시",
      nameEn: "Rupal Residency",
      address: "Jaisalmer - Sam - Dhanana Rd, Ram Kund, Jaisalmer, India, 345001",
      tel: "+919460807000",
      reservationNo: "1697174974",
      roomType: "Premium Room (Twin Beds)",
      checkIn: "2026-02-14",
      meal: "조식 포함",
      guests: 2,
      nights: 1,
      period: "2026-02-14 ~ 2026-02-15",
      voucherUrl: "/vouchers/booking_1697174974.pdf",
    },
    note: "조식·수영장·Wi-Fi·웰컴드링크·주차·피트니스 포함 | Agoda 예약",
  },
  {
    day: 3,
    date: "2026-02-15",
    dayOfWeek: "일",
    title: "자이살메르 → 우다이푸르",
    city: "자이살메르",
    cityEn: "Jaisalmer",
    color: "#f59e0b",
    transport: {
      type: "car",
      description: "자이살메르 → 우다이푸르 (야간 버스, BS Maharaja Travels)",
      time: "20:45 출발 → 익일 06:45 도착",
    },
    activities: [
      { title: "자이살메르 관광", description: "골든포트, 하벨리 등" },
      { time: "20:30", title: "B S MAHARAJA TRAVELS AIRPORT CIRCLE 집합", description: "승차지 연락처: 9461351919" },
      { time: "20:45", title: "야간 버스 출발 (자이살메르 → 우다이푸르)", description: "A/C Sleeper (2+1) · 좌석 L9/L10 · Booking: 3BQPHSXP" },
    ],
    accommodation: "야간 버스",
    note: "야간 버스로 우다이푸르 이동 · 하차: Fatehpura Circle",
  },
  {
    day: 4,
    date: "2026-02-16",
    dayOfWeek: "월",
    title: "우다이푸르",
    city: "우다이푸르",
    cityEn: "Udaipur",
    color: "#06b6d4",
    activities: [
      { time: "06:45", title: "우다이푸르 도착 (Fatehpura Circle)", description: "야간 버스 하차" },
      { title: "우다이푸르 관광", description: "호수의 도시 탐방" },
    ],
    accommodation: "Parallel Hotel, Udaipur (패러렐 호텔)",
    note: "⚠️ 17~18일로 잘못 예약됨 → 16~17일로 일정 변경 문의 중 (호텔 및 여행사)",
  },
  {
    day: 5,
    date: "2026-02-17",
    dayOfWeek: "화",
    title: "우다이푸르 → 자이푸르",
    city: "우다이푸르",
    cityEn: "Udaipur",
    color: "#06b6d4",
    transport: {
      type: "car",
      description: "우다이푸르 → 자이푸르 (야간 버스, Patel Travels)",
      time: "2/18 01:00 출발 → 08:45 도착",
    },
    activities: [
      { title: "우다이푸르 관광" },
      { time: "00:45", title: "Udaipole 승차지 집합 (Jain Parshwanath Travels)", description: "승차지 연락처: 9409413146" },
      { time: "01:00", title: "야간 버스 출발 (우다이푸르 → 자이푸르)", description: "A/C Sleeper (2+1) · 좌석 L8/L9 · Booking: 3BFFM366" },
    ],
    accommodation: "야간 버스",
    note: "야간 버스로 자이푸르 이동 · 하차: ITC Rajputana Sheraton 근처 (기차역 맞은편)",
  },
  {
    day: 6,
    date: "2026-02-18",
    dayOfWeek: "수",
    title: "자이푸르",
    city: "자이푸르",
    cityEn: "Jaipur",
    color: "#ec4899",
    activities: [
      { time: "08:45", title: "자이푸르 도착 (ITC Rajputana Sheraton 근처)", description: "야간 버스 하차" },
      { title: "자이푸르 관광", description: "핑크시티 탐방" },
    ],
    accommodation: "자이푸르 숙소",
  },
  {
    day: 7,
    date: "2026-02-19",
    dayOfWeek: "목",
    title: "자이푸르 → 뉴델리",
    city: "자이푸르 → 델리",
    cityEn: "Jaipur → Delhi",
    color: "#ec4899",
    transport: {
      type: "flight",
      description: "자이푸르 → 뉴델리 (IX-1289)",
      time: "18:55 - 19:55",
    },
    activities: [
      { title: "자이푸르 관광" },
      { time: "18:55", title: "자이푸르(JAI) → 뉴델리(DEL) 출발", description: "Air-India Express IX-1289 · 좌석 26E/26F" },
    ],
    accommodation: "Hotel Ramhan Palace, New Delhi",
    accommodationDetails: {
      name: "호텔 람한 팰리스",
      nameEn: "Hotel Ramhan Palace",
      address: "A-125, Mahipalpur Extension, NH 8 Highway, Near IGI Airport T3 Terminal, New Delhi, 110037",
      tel: "+918929150993",
      reservationNo: "1697203885",
      roomType: "Standard Double Room (Twin Beds)",
      checkIn: "2026-02-19",
      meal: "조식 포함",
      guests: 2,
      nights: 1,
      period: "2026-02-19 ~ 2026-02-20",
      voucherUrl: "/vouchers/booking_1697203885.pdf",
    },
    note: "공항 T3 근처 | Wi-Fi·주차·조식 포함 | Agoda 예약",
  },
  {
    day: 8,
    date: "2026-02-20",
    dayOfWeek: "금",
    title: "뉴델리 → 바라나시",
    city: "바라나시",
    cityEn: "Varanasi",
    color: "#a855f7",
    transport: {
      type: "flight",
      description: "가지아바드(힌돈) → 바라나시 (6E-2571)",
      time: "09:45 - 11:00",
    },
    activities: [
      { time: "09:45", title: "힌돈공항(HDO) → 바라나시(VNS) 출발", description: "IndiGo 6E-2571 · 좌석 21D/21E" },
      { time: "11:00", title: "바라나시 도착" },
      { time: "저녁", title: "바라나시 관광" },
    ],
    accommodation: "바라나시 숙소",
  },
  {
    day: 9,
    date: "2026-02-21",
    dayOfWeek: "토",
    title: "바라나시 → 델리",
    city: "바라나시 → 델리",
    cityEn: "Varanasi → Delhi",
    color: "#a855f7",
    transport: {
      type: "flight",
      description: "바라나시 → 델리 (IX-1252)",
      time: "14:45 - 16:20",
    },
    activities: [
      { title: "바라나시 관광" },
      { time: "14:45", title: "바라나시(VNS) → 델리(DEL T1) 출발", description: "Air-India Express IX-1252 · 좌석 26A/26B" },
      { time: "16:20", title: "델리 도착" },
    ],
    accommodation: "델리 숙소",
  },
  {
    day: 10,
    date: "2026-02-22",
    dayOfWeek: "일",
    title: "델리 관광 및 귀국",
    city: "델리",
    cityEn: "Delhi",
    color: "#f97316",
    activities: [
      { title: "델리 둘러보기" },
      { title: "공항 이동", description: "귀국편 탑승" },
    ],
    accommodation: "비행기 내",
  },
];

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  time?: string;
  location?: string;
  category: "flight" | "accommodation" | "activity" | "food" | "transport";
}

export const defaultSchedule: ScheduleItem[] = [];

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: "KRW" | "INR";
  category: "flight" | "accommodation" | "food" | "transport" | "activity" | "shopping" | "other";
}

export const defaultExpenses: Expense[] = [
  {
    id: "hotel-delhi-day1",
    date: "2026-02-13",
    description: "델리 숙소 - Pride Plaza Hotel Aerocity (1박)",
    amount: 238556,
    currency: "KRW",
    category: "accommodation",
  },
  {
    id: "hotel-jaisalmer-day2",
    date: "2026-02-14",
    description: "자이살메르 숙소 - Rupal Residency (1박)",
    amount: 137796,
    currency: "KRW",
    category: "accommodation",
  },
  {
    id: "flight-del-jsa-0214",
    date: "2026-02-14",
    description: "델리→자이살메르 항공 (AI-1783) · PNR: DWRIFE",
    amount: 12571,
    currency: "INR",
    category: "flight",
  },
  {
    id: "flight-jai-del-0219",
    date: "2026-02-19",
    description: "자이푸르→델리 항공 (IX-1289) · PNR: K158RL",
    amount: 6631,
    currency: "INR",
    category: "flight",
  },
  {
    id: "flight-hdo-vns-0220",
    date: "2026-02-20",
    description: "가지아바드→바라나시 항공 (6E-2571) · PNR: W5LE4S",
    amount: 13719,
    currency: "INR",
    category: "flight",
  },
  {
    id: "flight-vns-del-0221",
    date: "2026-02-21",
    description: "바라나시→델리 항공 (IX-1252) · PNR: TZUT5L",
    amount: 11932,
    currency: "INR",
    category: "flight",
  },
  {
    id: "hotel-delhi-day7",
    date: "2026-02-19",
    description: "델리 숙소 - Hotel Ramhan Palace (1박)",
    amount: 53084,
    currency: "KRW",
    category: "accommodation",
  },
];

export const exchangeRate = {
  KRW_TO_INR: 0.061,
  INR_TO_KRW: 16.39,
  lastUpdated: "2025-01-25",
};

export const budget = {
  flight: 1000000,
  travel: 1800000,
};
