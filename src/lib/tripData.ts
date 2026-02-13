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

// City Info with highlights, tips, emergency numbers
export interface CityInfo {
  id: string;
  nameKo: string;
  nameEn: string;
  color: string;
  highlights: string[];
  localTips: string[];
  emoji: string;
}

export const cityInfoMap: Record<string, CityInfo> = {
  delhi: {
    id: "delhi",
    nameKo: "뉴델리",
    nameEn: "New Delhi",
    color: "#f97316",
    highlights: ["레드포트", "쿠트브 미나르", "인디아 게이트", "찬드니 촉"],
    localTips: ["지하철이 가장 편리", "릭샤 타기 전 가격 흥정 필수", "생수만 마시기"],
    emoji: "🕌",
  },
  jaisalmer: {
    id: "jaisalmer",
    nameKo: "자이살메르",
    nameEn: "Jaisalmer",
    color: "#f59e0b",
    highlights: ["자이살메르 포트", "파트원 키 하벨리", "샘 사구", "가디사르 호수"],
    localTips: ["사막 투어 흥정 필수", "밤에 매우 추움 - 방한복 필수", "포트 안 게스트하우스 분위기 좋음"],
    emoji: "🏜️",
  },
  udaipur: {
    id: "udaipur",
    nameKo: "우다이푸르",
    nameEn: "Udaipur",
    color: "#06b6d4",
    highlights: ["시티 팰리스", "피촐라 호수", "자그만디르", "몬순 팰리스"],
    localTips: ["호수 근처 루프탑 레스토랑 추천", "보트 투어 필수", "일몰 감상 명소 많음"],
    emoji: "🏛️",
  },
  jaipur: {
    id: "jaipur",
    nameKo: "자이푸르",
    nameEn: "Jaipur",
    color: "#ec4899",
    highlights: ["하와 마할", "앰버 포트", "잔타르 만타르", "시티 팰리스"],
    localTips: ["앰버 포트 아침 일찍 방문 추천", "쇼핑 명소 - 조하리 바자르", "핑크시티 걸어서 둘러보기 좋음"],
    emoji: "🩷",
  },
  varanasi: {
    id: "varanasi",
    nameKo: "바라나시",
    nameEn: "Varanasi",
    color: "#a855f7",
    highlights: ["갠지스 강 가트", "카시 비슈와나트 사원", "아르띠 의식", "사르나트"],
    localTips: ["새벽 보트 투어 필수", "골목이 매우 좁음 - 미니멀 짐 추천", "갠지스 강물 만지지 않기"],
    emoji: "🙏",
  },
};

// City color mapping
export const cityColors: Record<string, { bg: string; text: string; hex: string; light: string }> = {
  DEL: { bg: "bg-orange-500", text: "text-white", hex: "#f97316", light: "bg-orange-50 dark:bg-orange-950/30" },
  delhi: { bg: "bg-orange-500", text: "text-white", hex: "#f97316", light: "bg-orange-50 dark:bg-orange-950/30" },
  JSA: { bg: "bg-amber-500", text: "text-white", hex: "#f59e0b", light: "bg-amber-50 dark:bg-amber-950/30" },
  jaisalmer: { bg: "bg-amber-500", text: "text-white", hex: "#f59e0b", light: "bg-amber-50 dark:bg-amber-950/30" },
  UDR: { bg: "bg-cyan-500", text: "text-white", hex: "#06b6d4", light: "bg-cyan-50 dark:bg-cyan-950/30" },
  udaipur: { bg: "bg-cyan-500", text: "text-white", hex: "#06b6d4", light: "bg-cyan-50 dark:bg-cyan-950/30" },
  JAI: { bg: "bg-pink-500", text: "text-white", hex: "#ec4899", light: "bg-pink-50 dark:bg-pink-950/30" },
  jaipur: { bg: "bg-pink-500", text: "text-white", hex: "#ec4899", light: "bg-pink-50 dark:bg-pink-950/30" },
  VNS: { bg: "bg-purple-500", text: "text-white", hex: "#a855f7", light: "bg-purple-50 dark:bg-purple-950/30" },
  varanasi: { bg: "bg-purple-500", text: "text-white", hex: "#a855f7", light: "bg-purple-50 dark:bg-purple-950/30" },
};

// Checklist items
export interface ChecklistItem {
  id: string;
  label: string;
  category: "document" | "health" | "tech" | "clothing" | "finance";
}

export const defaultChecklist: ChecklistItem[] = [
  { id: "passport", label: "여권 (유효기간 6개월 이상)", category: "document" },
  { id: "visa", label: "인도 e-비자 발급 완료", category: "document" },
  { id: "insurance", label: "여행자 보험 가입", category: "document" },
  { id: "flight-print", label: "항공권 e-ticket 출력/저장", category: "document" },
  { id: "hotel-voucher", label: "숙소 바우처 출력/저장", category: "document" },
  { id: "medicine", label: "상비약 (지사제, 소화제, 진통제, 밴드)", category: "health" },
  { id: "sanitizer", label: "손 소독제 & 물티슈", category: "health" },
  { id: "sunscreen", label: "선크림 & 선글라스", category: "health" },
  { id: "adapter", label: "인도 전기 어댑터 (C/D 타입)", category: "tech" },
  { id: "battery", label: "보조 배터리 (비행기 기내 반입)", category: "tech" },
  { id: "sim", label: "인도 eSIM/SIM카드", category: "tech" },
  { id: "jacket", label: "얇은 재킷/바람막이 (야간 버스용)", category: "clothing" },
  { id: "scarf", label: "스카프 (사막/사원용)", category: "clothing" },
  { id: "cash", label: "현금 환전 (INR)", category: "finance" },
  { id: "card", label: "해외 결제 카드 준비", category: "finance" },
];

// Emergency contacts
export interface EmergencyContact {
  name: string;
  nameEn: string;
  number: string;
  description: string;
}

export const emergencyContacts: EmergencyContact[] = [
  { name: "인도 경찰", nameEn: "Police", number: "100", description: "긴급 신고" },
  { name: "앰뷸런스", nameEn: "Ambulance", number: "102", description: "의료 응급" },
  { name: "소방서", nameEn: "Fire", number: "101", description: "화재 신고" },
  { name: "관광 경찰", nameEn: "Tourist Police", number: "1363", description: "관광객 전용 신고" },
  { name: "주인도 한국대사관", nameEn: "Korean Embassy", number: "+91-11-4200-7000", description: "9 Chandragupta Marg, New Delhi" },
  { name: "영사콜센터 (24시간)", nameEn: "Consular Call Center", number: "+82-2-3210-0404", description: "한국 외교부 24시간 긴급전화" },
];

// 새로운 일정 데이터 구조
export interface DaySchedule {
  day: number;
  date: string;
  dayOfWeek: string;
  title: string;
  city: string;
  cityEn: string;
  cityId: string;
  color: string;
  transport?: {
    type: "flight" | "car";
    description: string;
    time?: string;
    bookingRef?: string;
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
    cityId: "delhi",
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
    cityId: "jaisalmer",
    color: "#f59e0b",
    transport: {
      type: "flight",
      description: "델리 → 자이살메르 (AI-1783)",
      time: "13:30 - 15:00",
    },
    activities: [
      { time: "13:30", title: "델리(DEL T2) 출발", description: "Air India AI-1783 · 좌석 24A/24B" },
      { time: "15:00", title: "자이살메르(JSA) 도착" },
      { time: "15:30", title: "호텔 체크인", description: "Rupal Residency · 짐 정리 후 출발" },
      { time: "16:30", title: "Café The Kaku", description: "자이살메르 카페에서 차이/커피 한잔" },
      { time: "17:30", title: "Fort View Point 선셋", description: "카페에서 도보 3분 · 일몰 ~18:20" },
      { time: "18:30", title: "저녁 식사", description: "주변 레스토랑" },
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
    cityId: "jaisalmer",
    color: "#f59e0b",
    transport: {
      type: "car",
      description: "자이살메르 → 우다이푸르 (야간 버스, BS Maharaja Travels)",
      time: "20:45 출발 → 익일 06:45 도착",
      bookingRef: "3BQPHSXP",
    },
    activities: [
      { time: "오전", title: "자이살메르 포트 관광", description: "골든포트 내부 · 궁전, 자이나교 사원, 골목길 (2~3시간)" },
      { time: "오후", title: "자이살메르 시내 관광", description: "하벨리 등 자유 탐방" },
      { time: "20:30", title: "B S MAHARAJA TRAVELS AIRPORT CIRCLE 집합", description: "승차지 연락처: 9461351919" },
      { time: "20:45", title: "야간 버스 출발 (자이살메르 → 우다이푸르)", description: "A/C Sleeper (2+1) · 좌석 L9/L10 · Booking: 3BQPHSXP" },
    ],
    accommodation: "야간 버스",
    accommodationDetails: {
      name: "야간 버스 (BS Maharaja Travels)",
      nameEn: "Overnight Bus (BS Maharaja Travels)",
      address: "B S MAHARAJA TRAVELS AIRPORT CIRCLE, Jaisalmer",
      tel: "9461351919",
      reservationNo: "3BQPHSXP",
      roomType: "A/C Sleeper (2+1) · 좌석 L9/L10",
      checkIn: "20:45",
      meal: "없음",
      guests: 2,
      nights: 1,
      period: "2026-02-15 ~ 2026-02-16",
      voucherUrl: "/vouchers/bus_JSA_UDR_0215.pdf",
    },
    note: "야간 버스로 우다이푸르 이동 · 하차: Fatehpura Circle",
  },
  {
    day: 4,
    date: "2026-02-16",
    dayOfWeek: "월",
    title: "우다이푸르",
    city: "우다이푸르",
    cityEn: "Udaipur",
    cityId: "udaipur",
    color: "#06b6d4",
    activities: [
      { time: "06:45", title: "우다이푸르 도착 (Fatehpura Circle)", description: "야간 버스 하차" },
      { title: "우다이푸르 관광", description: "호수의 도시 탐방" },
    ],
    accommodation: "Parallel Hotel Udaipur, Radisson Individuals",
    accommodationDetails: {
      name: "패러렐 호텔 우다이푸르 (래디슨 인디비주얼스)",
      nameEn: "Parallel Hotel Udaipur, a member of Radisson Individuals",
      address: "11, Saheli Marg, New Fatehpura, Udaipur, Rajasthan 313001",
      tel: "+91-2942-471123",
      reservationNo: "2391856538",
      roomType: "Standard Room",
      checkIn: "14:00 ~ 23:00",
      meal: "조식 불포함 (뷔페 ₹500/인 별도)",
      guests: 2,
      nights: 1,
      period: "2026-02-16 ~ 2026-02-17",
      voucherUrl: "/vouchers/booking_2391856538.pdf",
    },
    note: "⚠️ 기존 17~18일 실수 예약(₩115,852) 취소 불가 → 16~17일 재예약(₩103,390). 체크인 시 사정 설명 후 취소 예정 (룸 업그레이드/혜택 기대)",
  },
  {
    day: 5,
    date: "2026-02-17",
    dayOfWeek: "화",
    title: "우다이푸르 → 자이푸르",
    city: "우다이푸르",
    cityEn: "Udaipur",
    cityId: "udaipur",
    color: "#06b6d4",
    transport: {
      type: "car",
      description: "우다이푸르 → 자이푸르 (야간 버스, Patel Travels)",
      time: "2/18 01:00 출발 → 08:45 도착",
      bookingRef: "3BFFM366",
    },
    activities: [
      { title: "우다이푸르 관광" },
      { time: "00:45", title: "Udaipole 승차지 집합 (Jain Parshwanath Travels)", description: "승차지 연락처: 9409413146" },
      { time: "01:00", title: "야간 버스 출발 (우다이푸르 → 자이푸르)", description: "A/C Sleeper (2+1) · 좌석 L8/L9 · Booking: 3BFFM366" },
    ],
    accommodation: "야간 버스",
    accommodationDetails: {
      name: "야간 버스 (Patel Travels)",
      nameEn: "Overnight Bus (Patel Travels)",
      address: "Udaipole, Udaipur (Jain Parshwanath Travels)",
      tel: "9409413146",
      reservationNo: "3BFFM366",
      roomType: "A/C Sleeper (2+1) · 좌석 L8/L9",
      checkIn: "01:00",
      meal: "없음",
      guests: 2,
      nights: 1,
      period: "2026-02-17 ~ 2026-02-18",
      voucherUrl: "/vouchers/bus_UDR_JAI_0217.pdf",
    },
    note: "야간 버스로 자이푸르 이동 · 하차: ITC Rajputana Sheraton 근처 (기차역 맞은편)",
  },
  {
    day: 6,
    date: "2026-02-18",
    dayOfWeek: "수",
    title: "자이푸르",
    city: "자이푸르",
    cityEn: "Jaipur",
    cityId: "jaipur",
    color: "#ec4899",
    activities: [
      { time: "08:45", title: "자이푸르 도착 (ITC Rajputana Sheraton 근처)", description: "야간 버스 하차" },
      { title: "자이푸르 관광", description: "핑크시티 탐방" },
    ],
    accommodation: "Umaid Bhawan - A Heritage Style Boutique Hotel",
    accommodationDetails: {
      name: "우마이드 바완 헤리티지 부티크 호텔",
      nameEn: "Umaid Bhawan - A Heritage Style Boutique Hotel",
      address: "D1-2A, Behind Collectorate, (Via) Bank Road, Bani Park, Jaipur, 302016",
      tel: "+911412316184",
      reservationNo: "1697209146",
      roomType: "Royal Suite (Twin Beds)",
      checkIn: "2026-02-18",
      meal: "조식 포함",
      guests: 2,
      nights: 1,
      period: "2026-02-18 ~ 2026-02-19",
      voucherUrl: "/vouchers/booking_1697209146.pdf",
    },
    note: "버스/기차역 무료 픽업 · 익스프레스 체크인 · Wi-Fi·주차·조식 포함 · 짐 보관 요청 | Agoda 예약",
  },
  {
    day: 7,
    date: "2026-02-19",
    dayOfWeek: "목",
    title: "자이푸르 → 뉴델리",
    city: "자이푸르 → 델리",
    cityEn: "Jaipur → Delhi",
    cityId: "jaipur",
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
    cityId: "varanasi",
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
    accommodation: "Airbnb - 일출 및 강 전망 객실, Pandey Ghat",
    accommodationDetails: {
      name: "일출 및 강 전망 객실 (에어비앤비)",
      nameEn: "Sunrise & River View Room, Pandey Ghat",
      address: "Bengali Tola D 24/26 Pandey Ghat, Varanasi, Uttar Pradesh 221001, India",
      tel: "+919455169432",
      reservationNo: "HMS59YB824",
      roomType: "일출 및 강 전망 객실 (2층)",
      checkIn: "14:00",
      meal: "조식 불포함",
      guests: 2,
      nights: 1,
      period: "2026-02-20 ~ 2026-02-21",
      voucherUrl: "/vouchers/airbnb_HMS59YB824.pdf",
    },
    note: "Airbnb · 호스트: Harsh · 갠지스 강 전망 · 체크아웃 11:00",
  },
  {
    day: 9,
    date: "2026-02-21",
    dayOfWeek: "토",
    title: "바라나시 → 델리",
    city: "바라나시 → 델리",
    cityEn: "Varanasi → Delhi",
    cityId: "varanasi",
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
      { time: "저녁", title: "델리 시내 관광 및 저녁 식사" },
      { time: "22:00", title: "인디라 간디 국제공항(DEL T3) 이동", description: "귀국편 탑승 준비" },
    ],
    accommodation: "숙소 없음 (심야 귀국편)",
    note: "2/22 00:15 귀국편 탑승 → 숙소 예약 불필요",
  },
  {
    day: 10,
    date: "2026-02-22",
    dayOfWeek: "일",
    title: "귀국",
    city: "델리 → 서울",
    cityEn: "Delhi → Seoul",
    cityId: "delhi",
    color: "#f97316",
    transport: {
      type: "flight",
      description: "델리 → 인천 (AI0312)",
      time: "00:15 - 10:30",
    },
    activities: [
      { time: "00:15", title: "델리(DEL T3) 출발", description: "에어인디아 AI0312 · PNR: E98GP2" },
      { time: "10:30", title: "인천(ICN) 도착", description: "여행 종료" },
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
  isPreBooked?: boolean;
}

export const defaultExpenses: Expense[] = [
  {
    id: "hotel-delhi-day1",
    date: "2026-02-13",
    description: "델리 숙소 - Pride Plaza Hotel Aerocity (1박)",
    amount: 238556,
    currency: "KRW",
    category: "accommodation",
    isPreBooked: true,
  },
  {
    id: "hotel-jaisalmer-day2",
    date: "2026-02-14",
    description: "자이살메르 숙소 - Rupal Residency (1박)",
    amount: 135796,
    currency: "KRW",
    category: "accommodation",
    isPreBooked: true,
  },
  {
    id: "flight-del-jsa-0214",
    date: "2026-02-14",
    description: "델리→자이살메르 항공 (AI-1783) · PNR: DWRIFE",
    amount: 219646,
    currency: "KRW",
    category: "flight",
    isPreBooked: true,
  },
  {
    id: "flight-jai-del-0219",
    date: "2026-02-19",
    description: "자이푸르→델리 항공 (IX-1289) · PNR: K158RL",
    amount: 115857,
    currency: "KRW",
    category: "flight",
    isPreBooked: true,
  },
  {
    id: "flight-hdo-vns-0220",
    date: "2026-02-20",
    description: "가지아바드→바라나시 항공 (6E-2571) · PNR: W5LE4S",
    amount: 239700,
    currency: "KRW",
    category: "flight",
    isPreBooked: true,
  },
  {
    id: "flight-vns-del-0221",
    date: "2026-02-21",
    description: "바라나시→델리 항공 (IX-1252) · PNR: TZUT5L",
    amount: 208469,
    currency: "KRW",
    category: "flight",
    isPreBooked: true,
  },
  {
    id: "hotel-delhi-day7",
    date: "2026-02-19",
    description: "델리 숙소 - Hotel Ramhan Palace (1박)",
    amount: 53084,
    currency: "KRW",
    category: "accommodation",
    isPreBooked: true,
  },
  {
    id: "hotel-jaipur-day6",
    date: "2026-02-18",
    description: "자이푸르 숙소 - Umaid Bhawan Heritage Hotel (1박)",
    amount: 141344,
    currency: "KRW",
    category: "accommodation",
    isPreBooked: true,
  },
  {
    id: "airbnb-varanasi-day8",
    date: "2026-02-20",
    description: "바라나시 숙소 - Airbnb 일출 및 강 전망 객실 (1박)",
    amount: 88632,
    currency: "KRW",
    category: "accommodation",
    isPreBooked: true,
  },
  {
    id: "bus-jsa-udr-0215",
    date: "2026-02-15",
    description: "야간버스 자이살메르→우다이푸르 (BS Maharaja Travels) · 2인 · Booking: 3BQPHSXP",
    amount: 54002,
    currency: "KRW",
    category: "transport",
    isPreBooked: true,
  },
  {
    id: "bus-udr-jai-0217",
    date: "2026-02-17",
    description: "야간버스 우다이푸르→자이푸르 (Patel Travels) · 2인 · Booking: 3BFFM366",
    amount: 65833,
    currency: "KRW",
    category: "transport",
    isPreBooked: true,
  },
  {
    id: "hotel-hanatour-mistake",
    date: "2026-02-16",
    description: "숙소 실수 예약 (하나투어 · 취소불가 · 체크인 시 취소 예정)",
    amount: 115852,
    currency: "KRW",
    category: "accommodation",
    isPreBooked: true,
  },
  {
    id: "hotel-udaipur-rebooking",
    date: "2026-02-16",
    description: "우다이푸르 숙소 - Parallel Hotel (트립비토즈 · 16~17일 재예약)",
    amount: 103390,
    currency: "KRW",
    category: "accommodation",
    isPreBooked: true,
  },
];

export const exchangeRate = {
  KRW_TO_INR: 0.061,
  INR_TO_KRW: 16.39,
  lastUpdated: "2025-01-25",
};

export const budget = {
  flight: 1021200,
  travel: 1800000,
};

// Helper: get trip phase
export function getTripPhase(now?: Date): "before" | "during" | "after" {
  const today = now || new Date();
  const start = new Date(tripInfo.dates.start);
  const end = new Date(tripInfo.dates.end);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  if (today < start) return "before";
  if (today > end) return "after";
  return "during";
}

// Helper: get current day number (1-10)
export function getCurrentDayNumber(now?: Date): number {
  const today = now || new Date();
  const start = new Date(tripInfo.dates.start);
  start.setHours(0, 0, 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayNum = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(dayNum, 10));
}

// Helper: get city ID from day
export function getCityIdFromDay(dayNum: number): string {
  const day = itinerary.find(d => d.day === dayNum);
  return day?.cityId || "delhi";
}
