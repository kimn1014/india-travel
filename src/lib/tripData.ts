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
      description: "델리 → 자이살메르 (비행기)",
      time: "15:00 도착",
    },
    activities: [
      { time: "오전", title: "델리 출발" },
      { time: "15:00", title: "자이살메르 도착" },
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
      description: "자이살메르 → 우다이푸르 (야간 버스)",
      time: "저녁 출발",
    },
    activities: [
      { title: "자이살메르 관광", description: "골든포트, 하벨리 등" },
    ],
    accommodation: "야간 버스",
    note: "야간 버스로 우다이푸르 이동",
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
      { title: "우다이푸르 도착 및 관광", description: "호수의 도시 탐방" },
    ],
    accommodation: "우다이푸르 숙소",
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
      description: "우다이푸르 → 자이푸르 (야간 버스)",
      time: "저녁 출발",
    },
    activities: [
      { title: "우다이푸르 관광" },
    ],
    accommodation: "야간 버스",
    note: "야간 버스로 자이푸르 이동",
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
      { title: "자이푸르 도착 및 관광", description: "핑크시티 탐방" },
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
      description: "자이푸르 → 뉴델리 (저녁 비행기)",
      time: "저녁",
    },
    activities: [
      { title: "자이푸르 관광" },
      { time: "저녁", title: "자이푸르 → 뉴델리 비행기 탑승" },
    ],
    accommodation: "뉴델리 숙소",
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
      description: "뉴델리 → 바라나시 (아침 비행기)",
      time: "오전",
    },
    activities: [
      { time: "오전", title: "뉴델리 → 바라나시 비행기 탑승" },
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
      description: "바라나시 → 델리 (낮 비행기)",
      time: "낮",
    },
    activities: [
      { title: "바라나시 관광" },
      { time: "낮", title: "바라나시 → 델리 비행기 탑승" },
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
