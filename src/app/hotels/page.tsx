"use client";

import { useState } from "react";
import { itinerary } from "@/lib/tripData";
import { ChevronDown, ChevronUp } from "lucide-react";

// 숙소가 있는 일정만 필터 (비행기 내 제외)
const accommodations = itinerary.filter(
  (day) => day.accommodation && day.accommodation !== "비행기 내"
);

const confirmedCount = accommodations.filter((d) => d.accommodationDetails).length;
const unconfirmedCount = accommodations.length - confirmedCount;

export default function HotelsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(
    accommodations.find((d) => d.accommodationDetails)?.day ?? null
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">숙소</h1>
        <p className="text-sm text-neutral-500">
          9박 중 {confirmedCount}박 예약 완료 · {unconfirmedCount}박 미정
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
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

      {/* Accommodation List */}
      <div className="space-y-3 sm:space-y-4">
        {accommodations.map((day) => {
          const isConfirmed = !!day.accommodationDetails;
          const isExpanded = expandedId === day.day;

          return (
            <div
              key={day.day}
              className={`bg-white dark:bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                isConfirmed
                  ? isExpanded
                    ? "border-neutral-400 dark:border-neutral-600"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  : "border-dashed border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : day.day)}
                className="w-full p-4 sm:p-5 text-left flex items-start gap-3 sm:gap-4 group"
              >
                {/* Day Badge */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                    isConfirmed
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  <span className="text-[10px] font-medium leading-none opacity-60">
                    D{day.day}
                  </span>
                  <span className="text-sm font-bold leading-tight">
                    {day.date.split("-")[2]}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold truncate">
                      {isConfirmed ? day.accommodationDetails!.name : day.accommodation}
                    </span>
                    {isConfirmed ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shrink-0">
                        확정
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 shrink-0">
                        미정
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {day.city} · {day.date.split("-").slice(1).join("/")} ({day.dayOfWeek})
                    {isConfirmed && ` · ${day.accommodationDetails!.roomType}`}
                  </p>
                  {day.note && !isConfirmed && (
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
                      <ChevronUp size={16} className="text-white dark:text-neutral-900" />
                    ) : (
                      <ChevronDown size={16} className="text-neutral-500" />
                    )}
                  </div>
                )}
              </button>

              {/* Expanded Details (confirmed only) */}
              {isConfirmed && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:px-5 pb-5 sm:pb-6 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    {/* Hotel Name English */}
                    <p className="text-lg sm:text-xl font-bold mb-1">
                      {day.accommodationDetails!.nameEn}
                    </p>
                    <p className="text-xs text-neutral-500 mb-5">
                      {day.accommodationDetails!.address}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide mb-1">
                          체크인
                        </p>
                        <p className="text-sm font-semibold">
                          {day.accommodationDetails!.checkIn}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide mb-1">
                          숙박 기간
                        </p>
                        <p className="text-sm font-semibold">
                          {day.accommodationDetails!.nights}박
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide mb-1">
                          객실
                        </p>
                        <p className="text-sm font-semibold">
                          {day.accommodationDetails!.roomType}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                        <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide mb-1">
                          투숙 인원
                        </p>
                        <p className="text-sm font-semibold">
                          성인 {day.accommodationDetails!.guests}명
                        </p>
                      </div>
                    </div>

                    {/* Info Rows */}
                    <div className="space-y-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">식사</span>
                        <span className="font-medium">{day.accommodationDetails!.meal}</span>
                      </div>
                      <div className="border-t border-neutral-200 dark:border-neutral-700" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">예약번호</span>
                        <span className="font-mono font-medium">
                          {day.accommodationDetails!.reservationNo}
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
                        <span className="text-neutral-500">전화</span>
                        <a
                          href={`tel:${day.accommodationDetails!.tel}`}
                          className="font-mono font-medium hover:underline"
                        >
                          {day.accommodationDetails!.tel}
                        </a>
                      </div>
                    </div>

                    {/* Voucher Link */}
                    <a
                      href="/vouchers/voucher_HH2632177268.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
                    >
                      바우처 PDF 보기 &rarr;
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Flight Night */}
        <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center shrink-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
              <span className="text-[10px] font-medium leading-none opacity-60">D9</span>
              <span className="text-sm font-bold leading-tight">21</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
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
    </div>
  );
}
