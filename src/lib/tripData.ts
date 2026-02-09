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
    id: "leh",
    name: "Leh",
    nameKo: "레",
    lat: 34.1526,
    lng: 77.5771,
    category: "city",
    description: "라다크의 중심지, 고산지대",
  },
  {
    id: "jodhpur",
    name: "Jodhpur",
    nameKo: "조드푸르",
    lat: 26.2389,
    lng: 73.0243,
    category: "city",
    description: "블루시티, 메헤랑가르 포트",
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
  };
  note?: string;
}

export const itinerary: DaySchedule[] = [
  {
    day: 1,
    date: "2026-02-13",
    dayOfWeek: "금",
    title: "델리 입국 및 휴식",
    city: "델리",
    cityEn: "Delhi",
    color: "#f97316",
    transport: {
      type: "flight",
      description: "인천 → 델리 (AI0313)",
      time: "12:05 - 17:30",
    },
    activities: [
      { time: "17:30", title: "인디라 간디 국제공항(DEL) 도착", description: "입국 수속" },
      { title: "휴식", description: "다음 날 이른 새벽 라다크행 비행기를 위해 무리하지 않고 휴식" },
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
    },
    note: "공항 바로 옆 | 체크인 18:00 | 조식 불포함",
  },
  {
    day: 2,
    date: "2026-02-14",
    dayOfWeek: "토",
    title: "델리 → 라다크 (레)",
    city: "레 (라다크)",
    cityEn: "Leh",
    color: "#06b6d4",
    transport: {
      type: "flight",
      description: "델리 → 레(IXL)",
      time: "오전 6~8시",
    },
    activities: [
      { title: "완전한 휴식", description: "해발 3,500m 고산 지대이므로 도착 직후 호텔에서 최소 24시간은 누워 있어야 고산병을 예방할 수 있습니다" },
    ],
    snapPoint: "호텔 창밖으로 보이는 설산의 거친 질감을 필름에 담아보세요",
    accommodation: "레 메인 마켓(Leh Main Market) 인근",
    note: "편의시설 접근성 좋음",
  },
  {
    day: 3,
    date: "2026-02-15",
    dayOfWeek: "일",
    title: "라다크 (겨울의 미학)",
    city: "레 (라다크)",
    cityEn: "Leh",
    color: "#06b6d4",
    activities: [
      { title: "틱세 수도원(Thiksey Monastery) 방문", description: "전용 차량 대절" },
      { title: "샨티 스투파(Shanti Stupa) 방문" },
    ],
    snapPoint: "틱세 수도원의 붉은 벽과 하얀 건물들이 설산과 대비되는 모습은 90년대 필름의 그레인(Grain)과 매우 잘 어울립니다",
    accommodation: "레(Leh) 시내",
  },
  {
    day: 4,
    date: "2026-02-16",
    dayOfWeek: "월",
    title: "레 → 델리 → 조드푸르",
    city: "조드푸르",
    cityEn: "Jodhpur",
    color: "#2563eb",
    transport: {
      type: "flight",
      description: "레 → 델리 경유 → 조드푸르(JDH)",
      time: "오전 출발",
    },
    activities: [
      { time: "오전", title: "레 발 델리 행 항공편 탑승" },
      { time: "오후", title: "델리 경유 조드푸르 행 항공편 탑승" },
      { time: "저녁", title: "시계탑(Clock Tower) 주변 야경 감상", description: "저녁 식사" },
    ],
    accommodation: "시계탑 근처 헤리티지 하벨리",
    note: "오래된 저택을 개조한 숙소",
  },
  {
    day: 5,
    date: "2026-02-17",
    dayOfWeek: "화",
    title: "조드푸르 (블루시티의 푸른 영감)",
    city: "조드푸르",
    cityEn: "Jodhpur",
    color: "#2563eb",
    activities: [
      { title: "메헤랑가르 포트 내부 관람" },
      { title: "브라만 구역(Blue City) 골목 탐방" },
    ],
    snapPoint: "파란색 벽이 가득한 좁은 골목에서 정면 플래시를 터뜨려보세요. 90년대 잡지 화보 같은 느낌의 스냅샷을 얻을 수 있습니다",
    accommodation: "조드푸르(Jodhpur)",
  },
  {
    day: 6,
    date: "2026-02-18",
    dayOfWeek: "수",
    title: "조드푸르 → 자이살메르",
    city: "자이살메르",
    cityEn: "Jaisalmer",
    color: "#f59e0b",
    transport: {
      type: "car",
      description: "전용 차량 이동 (약 5시간)",
      time: "08:00",
    },
    activities: [
      { time: "08:00", title: "전용 차량으로 자이살메르 이동", description: "중간에 황무지 풍경 촬영 가능" },
      { time: "15:00", title: "샘 샌드 듄(Sam Sand Dunes) 도착", description: "낙타 사파리" },
      { title: "사막의 일몰 감상 및 별밤 캠프", description: "지평선 너머로 지는 사막의 일몰" },
    ],
    accommodation: "사막 글램핑 텐트",
    note: "사막 한가운데서 자는 특별한 경험",
  },
  {
    day: 7,
    date: "2026-02-19",
    dayOfWeek: "목",
    title: "자이살메르 → 델리",
    city: "자이살메르 → 델리",
    cityEn: "Jaisalmer → Delhi",
    color: "#f59e0b",
    transport: {
      type: "flight",
      description: "자이살메르 → 델리 직항 (IndiGo)",
      time: "14:55",
    },
    activities: [
      { time: "오전", title: "자이살메르 성(Golden Fort) 내부 촬영", description: "전통 저택 '하벨리' 촬영" },
      { time: "14:55", title: "자이살메르 발 델리 행 항공편 탑승" },
      { time: "저녁", title: "하우즈 카스 빌리지(Hauz Khas)", description: "힙한 거리에서 저녁 식사" },
    ],
    accommodation: "델리 남부 (South Delhi) 또는 에어로시티",
  },
  {
    day: 8,
    date: "2026-02-20",
    dayOfWeek: "금",
    title: "델리 → 바라나시",
    city: "바라나시",
    cityEn: "Varanasi",
    color: "#a855f7",
    transport: {
      type: "flight",
      description: "델리 → 바라나시(VNS)",
      time: "오전",
    },
    activities: [
      { time: "오전", title: "델리 발 바라나시 행 항공편 탑승" },
      { time: "저녁", title: "갠지스강 강가 아르띠(제사 의식) 관람" },
    ],
    snapPoint: "의식의 자욱한 연기와 불빛, 수행자들의 모습은 필름 카메라 특유의 뭉개지는 초점과 완벽한 조화를 이룹니다",
    accommodation: "가트(Ghat) 근처 숙소",
    note: "강가와 가까워야 새벽 이동이 편함",
  },
  {
    day: 9,
    date: "2026-02-21",
    dayOfWeek: "토",
    title: "바라나시 → 델리 → 출국",
    city: "바라나시 → 델리",
    cityEn: "Varanasi → Delhi",
    color: "#a855f7",
    transport: {
      type: "flight",
      description: "바라나시 → 델리 → 서울",
      time: "저녁",
    },
    activities: [
      { time: "새벽", title: "갠지스강 일출 보트 투어", description: "강가에서 목욕하는 사람들, 화장터의 모습 촬영" },
      { time: "오후", title: "바라나시 미로 골목 스냅 촬영", description: "공항 이동" },
      { time: "저녁", title: "바라나시 발 델리 행 항공편 탑승", description: "델리 공항 대기" },
      { time: "00:15", title: "서울행 비행기 탑승 (AI0312)", description: "실질적으로 21일 밤 공항 이동" },
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
