"use client";

import { useState, useEffect, useCallback } from "react";
import { itinerary, cityColors, getTripPhase, getCurrentDayNumber } from "@/lib/tripData";
import { ChevronDown, ChevronUp, Plane, Bus, Copy, MapPin, StickyNote, ChevronsUpDown } from "lucide-react";

export default function SchedulePage() {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState("");
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [visibleNotes, setVisibleNotes] = useState<Set<number>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }, []);

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => showToast("복사됨!"));
    },
    [showToast]
  );

  const cityGroups = [
    { city: "델리", cityId: "delhi", days: [1], color: "#f97316" },
    { city: "자이살메르", cityId: "jaisalmer", days: [2, 3], color: "#f59e0b" },
    { city: "우다이푸르", cityId: "udaipur", days: [4, 5], color: "#06b6d4" },
    { city: "자이푸르", cityId: "jaipur", days: [6, 7], color: "#ec4899" },
    { city: "바라나시", cityId: "varanasi", days: [8, 9], color: "#a855f7" },
    { city: "델리", cityId: "delhi", days: [10], color: "#f97316" },
  ];

  // Load notes from localStorage
  useEffect(() => {
    setMounted(true);
    const loaded: Record<number, string> = {};
    for (let i = 1; i <= 10; i++) {
      const n = localStorage.getItem(`india-note-day-${i}`);
      if (n) loaded[i] = n;
    }
    setNotes(loaded);
  }, []);

  // Auto-scroll to today if during trip
  useEffect(() => {
    if (!mounted) return;
    const phase = getTripPhase();
    if (phase === "during") {
      const currentDay = getCurrentDayNumber();
      setExpandedDays((prev) => new Set([...prev, currentDay]));
      setTimeout(() => {
        document.getElementById(`day-${currentDay}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [mounted]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedDays(new Set());
    } else {
      setExpandedDays(new Set(itinerary.map((d) => d.day)));
    }
    setAllExpanded(!allExpanded);
  };

  const toggleNote = (day: number) => {
    setVisibleNotes((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const saveNote = (day: number, value: string) => {
    setNotes((prev) => ({ ...prev, [day]: value }));
    if (value.trim()) {
      localStorage.setItem(`india-note-day-${day}`, value);
    } else {
      localStorage.removeItem(`india-note-day-${day}`);
    }
  };

  const getDayColor = (dayNum: number): string => {
    const day = itinerary.find((d) => d.day === dayNum);
    return day?.color || "#737373";
  };

  // Build gradient stops for the timeline vertical line
  const timelineGradient = itinerary
    .map((day, idx) => {
      const pct = (idx / (itinerary.length - 1)) * 100;
      return `${day.color} ${pct}%`;
    })
    .join(", ");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-16">
      {/* Header */}
      <div className="mb-5 sm:mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold mb-0.5 sm:mb-1">여행 일정</h1>
          <p className="text-xs sm:text-sm text-neutral-500">2026.02.13 ~ 02.22 · 9박 10일</p>
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronsUpDown size={14} />
          {allExpanded ? "전체 접기" : "전체 펼치기"}
        </button>
      </div>

      {/* City Progress Bar */}
      <div className="mb-5 sm:mb-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3 sm:mb-4">도시별 일정</h3>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-4">
          {cityGroups.map((group, idx) => (
            <div
              key={idx}
              className="transition-all duration-300"
              style={{ flex: group.days.length, backgroundColor: group.color }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {cityGroups.map((group, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <span className="text-xs sm:text-sm font-medium">{group.city}</span>
              <span className="text-[10px] sm:text-xs text-neutral-400">({group.days.length}일)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Day Navigation */}
      <div className="mb-5 sm:mb-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {itinerary.map((day) => {
            const isActive = expandedDays.has(day.day);
            return (
              <button
                key={day.day}
                onClick={() => {
                  if (!expandedDays.has(day.day)) {
                    setExpandedDays((prev) => new Set([...prev, day.day]));
                  }
                  document.getElementById(`day-${day.day}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={`flex-shrink-0 snap-center flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "border-neutral-300 dark:border-neutral-600"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
                style={
                  isActive
                    ? { backgroundColor: day.color + "15", borderColor: day.color + "60" }
                    : undefined
                }
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 text-white"
                  style={{ backgroundColor: day.color }}
                >
                  D{day.day}
                </div>
                <span className="text-[10px] text-neutral-500 whitespace-nowrap">{day.city.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line with gradient */}
        <div
          className="absolute left-[22px] sm:left-[26px] top-6 bottom-6 w-0.5"
          style={{ background: `linear-gradient(to bottom, ${timelineGradient})` }}
        />

        <div className="space-y-4 sm:space-y-6">
          {itinerary.map((day, index) => {
            const isExpanded = expandedDays.has(day.day);

            return (
              <div
                key={day.day}
                id={`day-${day.day}`}
                className={`relative transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Day Marker */}
                <div
                  className={`absolute left-0 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-transform duration-300 text-white ${
                    isExpanded ? "scale-110" : ""
                  }`}
                  style={{ backgroundColor: day.color }}
                >
                  D{day.day}
                </div>

                {/* Content Card */}
                <div className="ml-16 sm:ml-20">
                  <div
                    className={`bg-white dark:bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? "border-neutral-400 dark:border-neutral-600"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                    }`}
                    style={{ borderLeftWidth: "4px", borderLeftColor: day.color }}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleDay(day.day)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {day.date.split("-").slice(1).join("/")} ({day.dayOfWeek})
                          </span>
                          {day.transport && (
                            <span
                              className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium text-white flex items-center gap-1"
                              style={{ backgroundColor: day.color + "cc" }}
                            >
                              {day.transport.type === "flight" ? (
                                <Plane size={10} />
                              ) : (
                                <Bus size={10} />
                              )}
                              {day.transport.type === "flight" ? "항공 이동" : "차량 이동"}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base sm:text-lg group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                          {day.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-0.5">{day.city}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {/* Note toggle */}
                        {isExpanded && (
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNote(day.day);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                toggleNote(day.day);
                              }
                            }}
                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              visibleNotes.has(day.day)
                                ? "text-white"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            }`}
                            style={visibleNotes.has(day.day) ? { backgroundColor: day.color } : undefined}
                          >
                            <StickyNote size={14} />
                          </div>
                        )}
                        <div
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isExpanded
                              ? ""
                              : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
                          }`}
                          style={isExpanded ? { backgroundColor: day.color } : undefined}
                        >
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-white" />
                          ) : (
                            <ChevronDown size={16} className="text-neutral-500" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="px-4 sm:px-5 pb-5 sm:pb-6 space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                        {/* Transport */}
                        {day.transport && (
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                              style={{ backgroundColor: day.color }}
                            >
                              {day.transport.type === "flight" ? (
                                <Plane size={18} />
                              ) : (
                                <Bus size={18} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{day.transport.description}</p>
                              {day.transport.time && (
                                <p className="text-xs text-neutral-500 mt-1 font-mono">{day.transport.time}</p>
                              )}
                              {day.transport.bookingRef && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-xs text-neutral-500 font-mono">예약: {day.transport.bookingRef}</span>
                                  <button
                                    onClick={() => copyToClipboard(day.transport!.bookingRef!)}
                                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    title="예약번호 복사"
                                  >
                                    <Copy size={12} className="text-neutral-400" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        <div>
                          <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: day.color }} />
                            활동
                          </h4>
                          <div className="space-y-3">
                            {day.activities.map((activity, idx) => (
                              <div key={idx} className="flex items-start gap-3 group/item">
                                <div className="w-16 shrink-0">
                                  {activity.time && (
                                    <span className="text-xs font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                      {activity.time}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium group-hover/item:text-neutral-600 dark:group-hover/item:text-neutral-300 transition-colors">
                                    {activity.title}
                                  </p>
                                  {activity.description && (
                                    <p className="text-xs text-neutral-500 mt-0.5">{activity.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Snap Point */}
                        {day.snapPoint && (
                          <div
                            className="p-4 rounded-xl border"
                            style={{
                              backgroundColor: day.color + "08",
                              borderColor: day.color + "30",
                            }}
                          >
                            <p className="text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
                              Snap Point
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{day.snapPoint}</p>
                          </div>
                        )}

                        {/* Accommodation */}
                        {day.accommodation && (
                          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">숙소</p>
                              {(day.accommodationDetails || day.accommodation === "야간 버스" || day.accommodation.includes("숙소 없음")) && (
                                <span
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: day.color }}
                                >
                                  확정
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium">{day.accommodation}</p>
                            {day.accommodationDetails && (
                              <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-medium text-neutral-600 dark:text-neutral-400 w-16 shrink-0">객실</span>
                                  <span>{day.accommodationDetails.roomType} · {day.accommodationDetails.guests}인</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-medium text-neutral-600 dark:text-neutral-400 w-16 shrink-0">체크인</span>
                                  <span>{day.accommodationDetails.checkIn}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-medium text-neutral-600 dark:text-neutral-400 w-16 shrink-0">식사</span>
                                  <span>{day.accommodationDetails.meal}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-medium text-neutral-600 dark:text-neutral-400 w-16 shrink-0">예약번호</span>
                                  <span className="font-mono">{day.accommodationDetails.reservationNo}</span>
                                  <button
                                    onClick={() => copyToClipboard(day.accommodationDetails!.reservationNo)}
                                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    title="예약번호 복사"
                                  >
                                    <Copy size={12} className="text-neutral-400" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-medium text-neutral-600 dark:text-neutral-400 w-16 shrink-0">전화</span>
                                  <span className="font-mono">{day.accommodationDetails.tel}</span>
                                  <button
                                    onClick={() => copyToClipboard(day.accommodationDetails!.tel)}
                                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    title="전화번호 복사"
                                  >
                                    <Copy size={12} className="text-neutral-400" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-medium text-neutral-600 dark:text-neutral-400 w-16 shrink-0">주소</span>
                                  <span className="flex-1 min-w-0 truncate">{day.accommodationDetails.address}</span>
                                  <button
                                    onClick={() => copyToClipboard(day.accommodationDetails!.address)}
                                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    title="주소 복사"
                                  >
                                    <Copy size={12} className="text-neutral-400" />
                                  </button>
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.accommodationDetails.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    title="Google Maps에서 보기"
                                  >
                                    <MapPin size={12} className="text-neutral-400" />
                                  </a>
                                </div>
                              </div>
                            )}
                            {day.note && !day.accommodationDetails && <p className="text-xs text-neutral-500 mt-1">{day.note}</p>}
                          </div>
                        )}

                        {/* Daily Note */}
                        {visibleNotes.has(day.day) && (
                          <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-800/30">
                            <div className="flex items-center gap-2 mb-2">
                              <StickyNote size={14} style={{ color: day.color }} />
                              <span className="text-xs font-medium text-neutral-500">Day {day.day} 메모</span>
                            </div>
                            <textarea
                              className="w-full min-h-[80px] text-sm bg-transparent border-none outline-none resize-y placeholder:text-neutral-400 text-neutral-700 dark:text-neutral-300"
                              placeholder="이 날의 메모를 작성하세요..."
                              value={notes[day.day] || ""}
                              onChange={(e) => setNotes((prev) => ({ ...prev, [day.day]: e.target.value }))}
                              onBlur={(e) => saveNote(day.day, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="font-bold text-lg mb-6">여행 요약</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <p className="text-3xl sm:text-4xl font-bold">10</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">일정</p>
          </div>
          <div className="text-center p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <p className="text-3xl sm:text-4xl font-bold">5</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">도시</p>
          </div>
          <div className="text-center p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <p className="text-3xl sm:text-4xl font-bold">5</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">항공편</p>
          </div>
          <div className="text-center p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <p className="text-3xl sm:text-4xl font-bold">2</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">야간버스</p>
          </div>
        </div>

        {/* City Route */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">여행 루트</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {["서울", "델리", "자이살메르", "우다이푸르", "자이푸르", "델리", "바라나시", "델리", "서울"].map((city, idx, arr) => (
              <span key={idx} className="flex items-center gap-2 sm:gap-3">
                <span className="font-medium text-sm sm:text-base px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 rounded-full">
                  {city}
                </span>
                {idx < arr.length - 1 && (
                  <span className="text-neutral-300 dark:text-neutral-600">&rarr;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-full shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}
