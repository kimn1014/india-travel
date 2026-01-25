"use client";

import { useState, useEffect } from "react";
import { itinerary } from "@/lib/tripData";
import { Calendar, Plane, Car, Hotel, Camera, MapPin, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export default function SchedulePage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Group itinerary by city for visual summary
  const cityGroups = [
    { city: "델리", color: "#f97316", days: [1] },
    { city: "레 (라다크)", color: "#06b6d4", days: [2, 3] },
    { city: "조드푸르", color: "#2563eb", days: [4, 5] },
    { city: "자이살메르", color: "#f59e0b", days: [6, 7] },
    { city: "바라나시", color: "#a855f7", days: [8, 9] },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Calendar size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">여행 일정</h1>
            <p className="text-sm text-neutral-500">2026.02.13 ~ 02.22</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-full">
          <Sparkles size={14} className="text-cyan-500" />
          <span className="text-xs sm:text-sm font-medium text-cyan-700 dark:text-cyan-300">9박 10일</span>
        </div>
      </div>

      {/* City Progress Bar */}
      <div className="mb-8 sm:mb-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">도시별 일정</h3>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4">
          {cityGroups.map((group, idx) => (
            <div
              key={idx}
              className="transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: group.color,
                flex: group.days.length,
              }}
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
      <div className="mb-8 sm:mb-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {itinerary.map((day) => (
            <button
              key={day.day}
              onClick={() => {
                setExpandedDay(day.day);
                document.getElementById(`day-${day.day}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                expandedDay === day.day
                  ? "border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-800"
                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1.5 shadow-sm"
                style={{ backgroundColor: day.color }}
              >
                D{day.day}
              </div>
              <span className="text-[10px] text-neutral-500 whitespace-nowrap">{day.city.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[22px] sm:left-[26px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800" />

        <div className="space-y-4 sm:space-y-6">
          {itinerary.map((day, index) => {
            const isExpanded = expandedDay === day.day;

            return (
              <div
                key={day.day}
                id={`day-${day.day}`}
                className={`relative transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Day Marker */}
                <div
                  className={`absolute left-0 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10 transition-transform duration-300 ${
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
                        ? "border-neutral-300 dark:border-neutral-600 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleDay(day.day)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: `${day.color}15`, color: day.color }}
                          >
                            {day.date.split("-").slice(1).join("/")} ({day.dayOfWeek})
                          </span>
                          {day.transport && (
                            <span className="text-[10px] sm:text-xs text-neutral-400 flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                              {day.transport.type === "flight" ? <Plane size={10} /> : <Car size={10} />}
                              {day.transport.type === "flight" ? "항공 이동" : "차량 이동"}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base sm:text-lg group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                          {day.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={12} />
                          {day.city}
                        </p>
                      </div>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isExpanded
                          ? "bg-neutral-900 dark:bg-white"
                          : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
                      }`}>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-white dark:text-neutral-900" />
                        ) : (
                          <ChevronDown size={16} className="text-neutral-500" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="px-4 sm:px-5 pb-5 sm:pb-6 space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                        {/* Transport */}
                        {day.transport && (
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-800/30">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                              day.transport.type === "flight"
                                ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                                : "bg-gradient-to-br from-amber-500 to-orange-500"
                            }`}>
                              {day.transport.type === "flight" ? (
                                <Plane size={16} className="text-white" />
                              ) : (
                                <Car size={16} className="text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{day.transport.description}</p>
                              {day.transport.time && (
                                <p className="text-xs text-neutral-500 mt-1 font-mono">{day.transport.time}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Activities */}
                        <div>
                          <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
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
                          <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 border border-pink-100 dark:border-pink-800/30">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0 shadow-md">
                                <Camera size={14} className="text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-1.5 uppercase tracking-wide">
                                  Snap Point
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{day.snapPoint}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Accommodation */}
                        {day.accommodation && (
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-100 dark:border-green-800/30">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-md">
                              <Hotel size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 uppercase tracking-wide">숙소</p>
                              <p className="text-sm font-medium">{day.accommodation}</p>
                              {day.note && <p className="text-xs text-neutral-500 mt-1">{day.note}</p>}
                            </div>
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
      <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-neutral-900 dark:to-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <MapPin size={18} className="text-white" />
          </div>
          여행 요약
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 sm:p-5 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">9</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">일정</p>
          </div>
          <div className="text-center p-4 sm:p-5 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">5</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">도시</p>
          </div>
          <div className="text-center p-4 sm:p-5 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">6</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">항공편</p>
          </div>
          <div className="text-center p-4 sm:p-5 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">1</p>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">차량 이동</p>
          </div>
        </div>

        {/* City Route */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">여행 루트</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {["서울", "델리", "레", "조드푸르", "자이살메르", "델리", "바라나시", "델리", "서울"].map((city, idx, arr) => (
              <span key={idx} className="flex items-center gap-2 sm:gap-3">
                <span className="font-medium text-sm sm:text-base px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-full shadow-sm">
                  {city}
                </span>
                {idx < arr.length - 1 && (
                  <span className="text-neutral-300 dark:text-neutral-600 text-lg">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
