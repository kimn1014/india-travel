"use client";

import { useState, useEffect } from "react";
import { itinerary, cityColors } from "@/lib/tripData";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  FileText,
  Copy,
  Bed,
  Clock,
  UtensilsCrossed,
  AlertCircle,
  Plane,
  Bus,
} from "lucide-react";

// 숙소가 있는 일정만 필터 (비행기 내 제외)
const accommodations = itinerary.filter(
  (day) => day.accommodation && day.accommodation !== "비행기 내"
);

const confirmedCount = accommodations.filter(
  (d) => d.accommodationDetails
).length;
const unconfirmedCount = accommodations.length - confirmedCount;

// 9박 타임라인 데이터
const nightTimeline = [
  { night: 1, city: "델리", color: "#f97316", date: "2/13" },
  { night: 2, city: "자이살메르", color: "#f59e0b", date: "2/14" },
  { night: 3, city: "야간버스", color: "#f59e0b", date: "2/15", isBus: true },
  { night: 4, city: "우다이푸르", color: "#06b6d4", date: "2/16" },
  { night: 5, city: "야간버스", color: "#06b6d4", date: "2/17", isBus: true },
  { night: 6, city: "자이푸르", color: "#ec4899", date: "2/18" },
  { night: 7, city: "델리", color: "#f97316", date: "2/19" },
  { night: 8, city: "바라나시", color: "#a855f7", date: "2/20" },
  { night: 9, city: "기내", color: "#737373", date: "2/21", isFlight: true },
];

// 도시 필터 버튼 데이터
const cityFilters: {
  label: string;
  city: string | null;
  color?: string;
}[] = [
  { label: "전체", city: null },
  { label: "델리", city: "델리", color: "#f97316" },
  { label: "자이살메르", city: "자이살메르", color: "#f59e0b" },
  { label: "우다이푸르", city: "우다이푸르", color: "#06b6d4" },
  { label: "자이푸르", city: "자이푸르", color: "#ec4899" },
  { label: "바라나시", city: "바라나시", color: "#a855f7" },
];

// 도시 이름에서 색상 코드 가져오기
function getCityColor(cityName: string): string {
  const map: Record<string, string> = {
    델리: "#f97316",
    자이살메르: "#f59e0b",
    우다이푸르: "#06b6d4",
    자이푸르: "#ec4899",
    바라나시: "#a855f7",
  };
  // 도시 이름에 포함된 키를 찾기 (예: "자이푸르 → 델리" → "자이푸르")
  for (const [key, value] of Object.entries(map)) {
    if (cityName.includes(key)) return value;
  }
  return "#737373";
}

export default function HotelsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(
    accommodations.find((d) => d.accommodationDetails)?.day ?? null
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast("복사됨!");
      setTimeout(() => setToast(""), 2000);
    });
  };

  // 도시 필터 적용
  const filteredAccommodations = selectedCity
    ? accommodations.filter((d) => d.city.includes(selectedCity))
    : accommodations;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      {/* Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toast
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">숙소</h1>
        <p className="text-sm text-neutral-500">
          9박 중 {confirmedCount}박 예약 완료 · {unconfirmedCount}박 미정
        </p>
      </div>

      {/* Night Timeline */}
      <div className="mb-6 sm:mb-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
          9박 숙박 타임라인
        </p>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {nightTimeline.map((n, idx) => {
            // 도시 전환 시 아이콘 표시 여부
            const prevCity =
              idx > 0 ? nightTimeline[idx - 1].city : null;
            const showTransition = prevCity !== null && prevCity !== n.city;
            const isTransport = n.isBus || n.isFlight;

            return (
              <div key={n.night} className="flex items-center flex-1 min-w-0">
                {/* 전환 아이콘 */}
                {showTransition && (
                  <div className="shrink-0 mx-0.5 hidden sm:flex items-center">
                    {n.isBus || (prevCity && (prevCity === "야간버스" || n.city === "야간버스")) ? (
                      <Bus size={10} className="text-neutral-400" />
                    ) : (
                      <Plane size={10} className="text-neutral-400" />
                    )}
                  </div>
                )}
                {/* 박 블록 */}
                <div className="flex-1 min-w-0 group relative">
                  <div
                    className="h-7 sm:h-8 rounded-md flex items-center justify-center cursor-default transition-transform hover:scale-105"
                    style={{
                      backgroundColor: n.color,
                      opacity: isTransport ? 0.5 : 1,
                    }}
                  >
                    {isTransport ? (
                      n.isBus ? (
                        <Bus size={12} className="text-white" />
                      ) : (
                        <Plane size={12} className="text-white" />
                      )
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-bold text-white leading-none">
                        {n.night}
                      </span>
                    )}
                  </div>
                  <p className="text-[8px] sm:text-[9px] text-neutral-400 text-center mt-1 truncate">
                    {n.date}
                  </p>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {n.city}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* 범례 */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          {cityFilters.slice(1).map((c) => (
            <div key={c.label} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-[10px] text-neutral-500">{c.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: "#737373" }}
            />
            <span className="text-[10px] text-neutral-500">이동/기내</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center">
          <p className="text-3xl sm:text-4xl font-bold">9</p>
          <p className="text-[10px] sm:text-xs text-neutral-500 mt-1 uppercase tracking-wide">
            총 숙박
          </p>
        </div>
        <div className="bg-neutral-900 dark:bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center text-white dark:text-neutral-900">
          <p className="text-3xl sm:text-4xl font-bold">{confirmedCount}</p>
          <p className="text-[10px] sm:text-xs mt-1 uppercase tracking-wide opacity-60">
            예약 확정
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center">
          <p className="text-3xl sm:text-4xl font-bold">{unconfirmedCount}</p>
          <p className="text-[10px] sm:text-xs text-neutral-500 mt-1 uppercase tracking-wide">
            미정
          </p>
        </div>
      </div>

      {/* City Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
        {cityFilters.map((filter) => {
          const isActive = selectedCity === filter.city;
          return (
            <button
              key={filter.label}
              onClick={() => setSelectedCity(filter.city)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: filter.color || "#171717",
                      borderColor: filter.color || "#171717",
                    }
                  : undefined
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Accommodation List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAccommodations.map((day) => {
          const isConfirmed = !!day.accommodationDetails;
          const isExpanded = expandedId === day.day;
          const isUnconfirmedUdaipur =
            day.day === 4 && !day.accommodationDetails;
          const cardColor = getCityColor(day.city);

          return (
            <div
              key={day.day}
              className={`bg-white dark:bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                isConfirmed
                  ? isExpanded
                    ? "border-neutral-400 dark:border-neutral-600 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  : "border-dashed border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {/* City Color Stripe */}
              <div
                className="h-1"
                style={{ backgroundColor: cardColor }}
              />

              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : day.day)}
                className="w-full p-4 sm:p-5 text-left flex items-start gap-3 sm:gap-4 group"
              >
                {/* Day Badge */}
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                  style={
                    isConfirmed
                      ? { backgroundColor: cardColor }
                      : undefined
                  }
                >
                  {isConfirmed ? (
                    <>
                      <span className="text-[10px] font-medium leading-none text-white/70">
                        D{day.day}
                      </span>
                      <span className="text-sm font-bold leading-tight text-white">
                        {day.date.split("-")[2]}
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full rounded-xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center text-neutral-400">
                      <span className="text-[10px] font-medium leading-none opacity-60">
                        D{day.day}
                      </span>
                      <span className="text-sm font-bold leading-tight">
                        {day.date.split("-")[2]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold truncate">
                      {isConfirmed
                        ? day.accommodationDetails!.name
                        : day.accommodation}
                    </span>
                    {isConfirmed ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shrink-0">
                        확정
                      </span>
                    ) : isUnconfirmedUdaipur ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 shrink-0">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-pulse-soft absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                        </span>
                        미정
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 shrink-0">
                        미정
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {day.city} · {day.date.split("-").slice(1).join("/")}{" "}
                    ({day.dayOfWeek})
                    {isConfirmed &&
                      ` · ${day.accommodationDetails!.roomType}`}
                  </p>
                  {isUnconfirmedUdaipur && day.note && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {day.note}
                    </p>
                  )}
                  {day.note && !isConfirmed && !isUnconfirmedUdaipur && (
                    <p className="text-xs text-neutral-400 mt-1">{day.note}</p>
                  )}
                </div>

                {/* Expand Icon */}
                {isConfirmed && (
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isExpanded
                        ? "bg-neutral-900 dark:bg-white"
                        : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronUp
                        size={16}
                        className="text-white dark:text-neutral-900"
                      />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-neutral-500"
                      />
                    )}
                  </div>
                )}
              </button>

              {/* Expanded Details (confirmed only) */}
              {isConfirmed && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "max-h-[800px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:px-5 pb-5 sm:pb-6 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    {/* Hotel Name English */}
                    <p className="text-lg sm:text-xl font-bold mb-1">
                      {day.accommodationDetails!.nameEn}
                    </p>
                    <p className="text-xs text-neutral-500 mb-4">
                      {day.accommodationDetails!.address}
                    </p>

                    {/* Quick Actions Row */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {/* Phone */}
                      <a
                        href={`tel:${day.accommodationDetails!.tel}`}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-95"
                      >
                        <Phone size={16} className="text-neutral-600 dark:text-neutral-400" />
                        <span className="text-[10px] font-medium text-neutral-500">
                          전화
                        </span>
                      </a>
                      {/* Map */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          day.accommodationDetails!.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-95"
                      >
                        <MapPin size={16} className="text-neutral-600 dark:text-neutral-400" />
                        <span className="text-[10px] font-medium text-neutral-500">
                          지도
                        </span>
                      </a>
                      {/* Voucher */}
                      {day.accommodationDetails!.voucherUrl ? (
                        <a
                          href={day.accommodationDetails!.voucherUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-95"
                        >
                          <FileText size={16} className="text-neutral-600 dark:text-neutral-400" />
                          <span className="text-[10px] font-medium text-neutral-500">
                            바우처
                          </span>
                        </a>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 opacity-30">
                          <FileText size={16} className="text-neutral-400" />
                          <span className="text-[10px] font-medium text-neutral-400">
                            바우처
                          </span>
                        </div>
                      )}
                      {/* Copy Reservation */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(
                            day.accommodationDetails!.reservationNo
                          );
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-95"
                      >
                        <Copy size={16} className="text-neutral-600 dark:text-neutral-400" />
                        <span className="text-[10px] font-medium text-neutral-500">
                          예약번호
                        </span>
                      </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Bed size={12} className="text-neutral-400" />
                          <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide">
                            객실
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {day.accommodationDetails!.roomType}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Clock size={12} className="text-neutral-400" />
                          <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide">
                            체크인
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {day.accommodationDetails!.checkIn}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <UtensilsCrossed
                            size={12}
                            className="text-neutral-400"
                          />
                          <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide">
                            식사
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {day.accommodationDetails!.meal}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Clock size={12} className="text-neutral-400" />
                          <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide">
                            숙박 기간
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {day.accommodationDetails!.nights}박
                        </p>
                      </div>
                    </div>

                    {/* Info Rows */}
                    <div className="space-y-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">예약번호</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              day.accommodationDetails!.reservationNo
                            )
                          }
                          className="flex items-center gap-1.5 font-mono font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                          {day.accommodationDetails!.reservationNo}
                          <Copy
                            size={12}
                            className="text-neutral-400"
                          />
                        </button>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-700" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">투숙 인원</span>
                        <span className="font-medium">
                          성인 {day.accommodationDetails!.guests}명
                        </span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-700" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">숙박 기간</span>
                        <span className="font-medium">
                          {day.accommodationDetails!.period}
                        </span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-700" />
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          <Phone size={12} />
                          <span>전화</span>
                        </div>
                        <a
                          href={`tel:${day.accommodationDetails!.tel}`}
                          className="font-mono font-medium hover:underline"
                        >
                          {day.accommodationDetails!.tel}
                        </a>
                      </div>
                    </div>

                    {/* Voucher Button Enhanced */}
                    {day.accommodationDetails!.voucherUrl && (
                      <a
                        href={day.accommodationDetails!.voucherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2.5 w-full py-3.5 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
                      >
                        <FileText size={16} className="text-neutral-500" />
                        바우처 PDF 보기
                        <span className="text-neutral-400">&rarr;</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Flight Night - only show when no filter or matching filter */}
        {!selectedCity && (
          <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl overflow-hidden">
            <div
              className="h-1"
              style={{ backgroundColor: "#737373" }}
            />
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center shrink-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                  <span className="text-[10px] font-medium leading-none opacity-60">
                    D9
                  </span>
                  <span className="text-sm font-bold leading-tight">21</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Plane size={14} className="text-neutral-400" />
                    <span className="text-sm font-bold">기내 숙박</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                      AI0312
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    바라나시 → 델리 → 서울 · 02/21 (토) 심야 출발
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
