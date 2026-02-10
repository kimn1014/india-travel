"use client";

import Link from "next/link";
import {
  tripInfo,
  flights,
  itinerary,
  defaultExpenses,
  defaultPlaces,
  exchangeRate,
  cityColors,
  defaultChecklist,
  getTripPhase,
  getCurrentDayNumber,
  cityInfoMap,
} from "@/lib/tripData";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Wallet,
  CloudSun,
  FolderOpen,
  Plane,
  Bus,
  Hotel,
  CheckCircle2,
  MapPin,
  Check,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedNumber from "@/components/AnimatedNumber";

function getTimeUntilTrip() {
  const today = new Date();
  const tripStart = new Date(tripInfo.dates.start);
  tripStart.setHours(0, 0, 0, 0);

  const diffTime = tripStart.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor(
    (diffTime % (1000 * 60 * 60)) / (1000 * 60)
  );
  const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  return {
    days: Math.max(0, diffDays),
    hours: Math.max(0, diffHours),
    minutes: Math.max(0, diffMinutes),
    seconds: Math.max(0, diffSeconds),
  };
}

function FlightCard({
  flight,
  type,
}: {
  flight: typeof flights.departure;
  type: "출국" | "귀국";
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wide bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          {type}
        </span>
        <span className="text-[10px] sm:text-sm text-neutral-500">
          {flight.date} ({flight.dayOfWeek})
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-center min-w-0">
          <p className="text-xl sm:text-3xl font-bold tracking-tight">
            {flight.departureTime}
          </p>
          <p className="text-[10px] sm:text-sm text-neutral-500 mt-0.5 sm:mt-1 truncate">
            {flight.from.airport}
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center px-1 sm:px-4">
          <p className="text-[10px] sm:text-xs text-neutral-400 mb-1.5 sm:mb-2">
            {flight.duration}
          </p>
          <div className="w-full h-[1px] bg-neutral-300 dark:bg-neutral-700 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Plane size={14} className="text-neutral-400" />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-1.5 sm:mt-2 truncate max-w-full">
            {flight.airline} {flight.flightNumber}
          </p>
        </div>

        <div className="text-center min-w-0">
          <p className="text-xl sm:text-3xl font-bold tracking-tight">
            {flight.arrivalTime}
          </p>
          <p className="text-[10px] sm:text-sm text-neutral-500 mt-0.5 sm:mt-1 truncate">
            {flight.to.airport}
          </p>
        </div>
      </div>

      <div className="mt-3 sm:mt-5 pt-3 sm:pt-5 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-[10px] sm:text-sm text-neutral-500">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-mono text-[10px] sm:text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            PNR
          </span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {flight.pnr}
          </span>
        </span>
        <span className="hidden sm:inline">{flight.baggage}</span>
        <span className="sm:hidden text-neutral-400">위탁 1개</span>
      </div>
    </div>
  );
}

const cityRoute = [
  { name: "델리", en: "DEL" },
  { name: "자이살메르", en: "JSA", transport: "flight" as const },
  { name: "우다이푸르", en: "UDR", transport: "bus" as const },
  { name: "자이푸르", en: "JAI", transport: "bus" as const },
  { name: "바라나시", en: "VNS", transport: "flight" as const },
  { name: "델리", en: "DEL", transport: "flight" as const },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [timeUntil, setTimeUntil] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [phase, setPhase] = useState<"before" | "during" | "after">("before");
  const [currentDay, setCurrentDay] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [progressAnimated, setProgressAnimated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeUntil(getTimeUntilTrip());
    setPhase(getTripPhase());
    setCurrentDay(getCurrentDayNumber());

    const saved = localStorage.getItem("india-checklist");
    if (saved) setCheckedItems(JSON.parse(saved));

    const timer = setInterval(() => {
      setTimeUntil(getTimeUntilTrip());
      setPhase(getTripPhase());
      setCurrentDay(getCurrentDayNumber());
    }, 1000);

    // Trigger progress bar animation after mount
    setTimeout(() => setProgressAnimated(true), 300);

    return () => clearInterval(timer);
  }, []);

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem("india-checklist", JSON.stringify(updated));
  };

  const checkedCount = defaultChecklist.filter(
    (item) => checkedItems[item.id]
  ).length;
  const checklistProgress = Math.round(
    (checkedCount / defaultChecklist.length) * 100
  );

  // Budget calculation for quick link preview (1인 기준)
  const totalKRW = defaultExpenses.reduce((sum, e) => {
    if (e.currency === "KRW") return sum + e.amount;
    return sum + Math.round(e.amount * exchangeRate.INR_TO_KRW);
  }, 0) / 2;

  // Voucher count for quick link preview
  const voucherCount = itinerary.filter(
    (d) => d.accommodationDetails?.voucherUrl
  ).length;

  // Today's schedule (during phase)
  const todaySchedule =
    phase === "during"
      ? itinerary.find((d) => d.day === currentDay)
      : undefined;

  const quickLinks = [
    {
      href: "/schedule",
      label: "일정",
      desc: `D1~D${tripInfo.totalDays} · 5개 도시`,
      icon: CalendarDays,
    },
    {
      href: "/budget",
      label: "예산",
      desc: `₩${Math.round(totalKRW / 10000)}만 지출`,
      icon: Wallet,
    },
    {
      href: "/weather",
      label: "날씨",
      desc: "현재 날씨 확인",
      icon: CloudSun,
    },
    {
      href: "/resources",
      label: "자료실",
      desc: `바우처 · 영수증 관리`,
      icon: FolderOpen,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-16">
      {/* Hero Section */}
      <section id="countdown" className="mb-10 sm:mb-24">
        <div className="text-center mb-8 sm:mb-14 hero-gradient rounded-3xl py-8 sm:py-14 px-4">
          <p className="text-[10px] sm:text-sm text-neutral-400 tracking-widest uppercase mb-3 sm:mb-6">
            2월 13일 (금) ~ 22일 (일)
          </p>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
            <span className="india-gradient">India</span>
            <span className="text-neutral-300 dark:text-neutral-600 ml-2 sm:ml-3">
              2026
            </span>
          </h1>

          {mounted && phase === "before" && (
            <div className="mt-4 sm:mt-8">
              <p className="text-[10px] sm:text-xs text-neutral-400 mb-1 sm:mb-2 uppercase tracking-widest">
                여행까지
              </p>
              <div className="inline-flex items-center bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl px-6 sm:px-10 py-3 sm:py-5">
                <p className="text-5xl sm:text-8xl font-bold tracking-tighter text-neutral-900 dark:text-white">
                  D-{timeUntil.days}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 sm:gap-5 mt-3 sm:mt-4">
                {[
                  { value: timeUntil.hours, label: "시간" },
                  { value: timeUntil.minutes, label: "분" },
                  { value: timeUntil.seconds, label: "초" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3.5 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm"
                  >
                    <span className="text-xl sm:text-3xl font-bold tabular-nums text-neutral-900 dark:text-white">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mounted && phase === "during" && (
            <div className="mt-4 sm:mt-8">
              <div className="inline-flex items-center bg-green-50 dark:bg-green-950/40 rounded-2xl px-6 sm:px-10 py-3 sm:py-5 border border-green-200/50 dark:border-green-800/50">
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mb-1 uppercase tracking-widest font-medium">
                    여행 중
                  </p>
                  <p className="text-4xl sm:text-7xl font-bold tracking-tighter text-green-700 dark:text-green-300">
                    Day {currentDay}
                  </p>
                </div>
              </div>
              {todaySchedule && (
                <div className="mt-4 sm:mt-6 max-w-md mx-auto">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-left">
                    <p className="text-xs text-neutral-400 mb-1">
                      {todaySchedule.date} ({todaySchedule.dayOfWeek})
                    </p>
                    <p className="font-semibold text-sm sm:text-base">
                      {todaySchedule.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {todaySchedule.city}
                    </p>
                    {todaySchedule.activities.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        {todaySchedule.activities.slice(0, 3).map((act, i) => (
                          <p
                            key={i}
                            className="text-[10px] sm:text-xs text-neutral-500 py-0.5"
                          >
                            {act.time && (
                              <span className="text-neutral-400 mr-1.5 font-mono">
                                {act.time}
                              </span>
                            )}
                            {act.title}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {mounted && phase === "after" && (
            <div className="mt-4 sm:mt-8">
              <div className="inline-flex items-center bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl px-6 sm:px-10 py-3 sm:py-5">
                <p className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  여행 완료!
                </p>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-3">
                9박 10일 인도 여행의 추억
              </p>
            </div>
          )}

          {!mounted && (
            <p className="text-neutral-500 mt-3 sm:mt-4 text-xs sm:text-base">
              9박 10일 인도 여행
            </p>
          )}
        </div>

        {/* City Route Preview */}
        <ScrollReveal>
          <div
            id="route"
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-8"
          >
            <h3 className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4 sm:mb-6">
              여행 루트
            </h3>
            {/* Visual route with transport icons */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
              {cityRoute.map((city, idx) => {
                const color = cityColors[city.en];
                return (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[9px] sm:text-[11px] font-bold ${color.bg} ${color.text}`}
                        style={{ boxShadow: `0 0 12px ${color.hex}40` }}
                      >
                        {city.en}
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium mt-1.5 whitespace-nowrap">
                        {city.name}
                      </span>
                    </div>
                    {idx < cityRoute.length - 1 && (
                      <div className="flex flex-col items-center mx-1 sm:mx-2 mb-5 sm:mb-6">
                        {cityRoute[idx + 1].transport === "flight" ? (
                          <Plane
                            size={12}
                            className="text-neutral-400 sm:[width:14px] sm:[height:14px]"
                          />
                        ) : (
                          <Bus
                            size={12}
                            className="text-neutral-400 sm:[width:14px] sm:[height:14px]"
                          />
                        )}
                        <div className="w-5 sm:w-8 h-[2px] mt-0.5 route-line-animated text-neutral-300 dark:text-neutral-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-100 dark:border-neutral-800">
              {[
                { value: tripInfo.totalDays, label: "일정", suffix: "일" },
                { value: 5, label: "도시", suffix: "곳" },
                { value: 6, label: "항공편", suffix: "회" },
                { value: -3.5, label: "시차", suffix: "h" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl sm:text-3xl font-bold">
                    {stat.value}
                    <span className="text-xs sm:text-sm font-normal text-neutral-400 ml-0.5">
                      {stat.suffix}
                    </span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Checklist Widget (before phase only) */}
      {mounted && phase === "before" && (
        <ScrollReveal>
          <section id="checklist" className="mb-8 sm:mb-20">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setChecklistOpen(!checklistOpen)}
                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
                    <CheckCircle2
                      size={18}
                      className="text-white dark:text-neutral-900 sm:[width:20px] sm:[height:20px]"
                    />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base sm:text-xl font-bold">
                      출발 체크리스트
                    </h2>
                    <p className="text-[10px] sm:text-sm text-neutral-500">
                      {checkedCount}/{defaultChecklist.length}개 완료 ·{" "}
                      {checklistProgress}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-32 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        checklistProgress === 100
                          ? "bg-green-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: progressAnimated ? `${checklistProgress}%` : "0%" }}
                    />
                  </div>
                  {checklistOpen ? (
                    <ChevronUp
                      size={18}
                      className="text-neutral-400 shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-neutral-400 shrink-0"
                    />
                  )}
                </div>
              </button>

              {/* Progress bar mobile */}
              <div className="sm:hidden px-4 pb-2">
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      checklistProgress === 100 ? "bg-green-500" : "bg-amber-500"
                    }`}
                    style={{ width: progressAnimated ? `${checklistProgress}%` : "0%" }}
                  />
                </div>
              </div>

              <div className={`accordion-grid ${checklistOpen ? "open" : ""}`}>
                <div>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-neutral-100 dark:border-neutral-800">
                    {(() => {
                      const categoryLabels: Record<string, string> = {
                        document: "서류/예약",
                        health: "건강/위생",
                        tech: "전자기기",
                        clothing: "의류",
                        finance: "금융",
                      };
                      let globalIdx = 0;
                      return Object.entries(categoryLabels).map(([cat, label]) => {
                        const items = defaultChecklist.filter((item) => item.category === cat);
                        if (items.length === 0) return null;
                        return (
                          <div key={cat} className="mt-3 sm:mt-4">
                            <p className="text-[10px] sm:text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1 px-3 sm:px-4">
                              {label}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 sm:gap-1">
                              {items.map((item) => {
                                const isChecked = !!checkedItems[item.id];
                                const idx = globalIdx++;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => toggleCheck(item.id)}
                                    className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-left transition-all duration-300 active:scale-[0.97] ${
                                      isChecked
                                        ? "bg-green-50 dark:bg-green-950/20"
                                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                    }`}
                                    style={{ transitionDelay: `${idx * 30}ms` }}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all duration-300 ${
                                        isChecked
                                          ? "bg-green-500 border-green-500"
                                          : "border-neutral-300 dark:border-neutral-600"
                                      }`}
                                    >
                                      {isChecked && (
                                        <Check size={12} className="text-white" />
                                      )}
                                    </div>
                                    <span
                                      className={`text-xs sm:text-sm transition-all duration-300 ${
                                        isChecked
                                          ? "text-neutral-400 line-through"
                                          : "text-neutral-700 dark:text-neutral-300"
                                      }`}
                                    >
                                      {item.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Quick Links */}
      <ScrollReveal>
        <section id="quicklinks" className="mb-8 sm:mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 active:scale-[0.97] hover:-translate-y-1 hover:shadow-lg reveal revealed stagger-${idx + 1}`}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:-translate-y-[2px] transition-all duration-300">
                      <Icon
                        size={18}
                        className="text-neutral-600 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-900 transition-colors duration-300 sm:[width:20px] sm:[height:20px]"
                      />
                    </div>
                    <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                      &rarr;
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">
                    {item.label}
                  </h3>
                  <p className="text-[10px] sm:text-sm text-neutral-500 mt-0.5">
                    {item.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* Preparation Status */}
      <ScrollReveal>
        <section id="preparation" className="mb-8 sm:mb-20">
          <div className="flex items-center gap-3 mb-4 sm:mb-8">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2
                size={18}
                className="text-white sm:[width:20px] sm:[height:20px]"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">준비 현황</h2>
              <p className="text-[10px] sm:text-sm text-neutral-500">
                예약 및 경비 확인
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {/* Accommodation Status */}
            {(() => {
              const totalNights = itinerary.filter(
                (d) => d.accommodation && d.accommodation !== "비행기 내"
              ).length;
              const confirmedNights = itinerary.filter(
                (d) =>
                  d.accommodationDetails ||
                  d.accommodation === "야간 버스" ||
                  (d.accommodation &&
                    d.accommodation.includes("숙소 없음"))
              ).length;
              const isComplete = confirmedNights >= totalNights;
              return (
                <Link
                  href="/hotels"
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 active:scale-[0.97] overflow-hidden relative reveal revealed stagger-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Hotel size={14} className="text-neutral-400" />
                    <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-medium">
                      숙소
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {confirmedNights}
                    <span className="text-sm font-normal text-neutral-400">
                      /{totalNights}
                    </span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">
                    확정 완료
                  </p>
                  <div className="mt-3 h-[3px] rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isComplete ? "bg-green-500" : "bg-amber-500"
                      }`}
                      style={{
                        width: progressAnimated
                          ? `${
                              totalNights > 0
                                ? Math.round(
                                    (confirmedNights / totalNights) * 100
                                  )
                                : 0
                            }%`
                          : "0%",
                      }}
                    />
                  </div>
                </Link>
              );
            })()}
            {/* Flights Status */}
            <Link
              href="/resources"
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 active:scale-[0.97] overflow-hidden reveal revealed stagger-2"
            >
              <div className="flex items-center gap-2 mb-3">
                <Plane size={14} className="text-neutral-400" />
                <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-medium">
                  항공권
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                6
                <span className="text-sm font-normal text-neutral-400">/6</span>
              </p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">
                예약 완료
              </p>
              <div className="mt-3 h-[3px] rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-700"
                  style={{ width: progressAnimated ? "100%" : "0%" }}
                />
              </div>
            </Link>
            {/* Bus Status */}
            <Link
              href="/resources"
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 active:scale-[0.97] overflow-hidden reveal revealed stagger-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <Bus size={14} className="text-neutral-400" />
                <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-medium">
                  야간버스
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                2
                <span className="text-sm font-normal text-neutral-400">/2</span>
              </p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">
                예약 완료
              </p>
              <div className="mt-3 h-[3px] rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-700"
                  style={{ width: progressAnimated ? "100%" : "0%" }}
                />
              </div>
            </Link>
            {/* Budget Status */}
            <Link
              href="/budget"
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 active:scale-[0.97] overflow-hidden reveal revealed stagger-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={14} className="text-neutral-400" />
                <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-medium">
                  확정 경비
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {Math.round(totalKRW / 10000)}
                <span className="text-sm font-normal text-neutral-400">
                  만원
                </span>
              </p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">
                예약 확정분
              </p>
              <div className="mt-3 h-[3px] rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-700"
                  style={{ width: progressAnimated ? "75%" : "0%" }}
                />
              </div>
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* City Highlights */}
      <ScrollReveal>
        <section id="cities" className="mb-8 sm:mb-20">
          <div className="flex items-center gap-3 mb-4 sm:mb-8">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
              <MapPin
                size={18}
                className="text-white sm:[width:20px] sm:[height:20px]"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">방문 도시</h2>
              <p className="text-[10px] sm:text-sm text-neutral-500">
                5개 도시 탐방
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {defaultPlaces.map((place, idx) => {
              const cityDays = itinerary.filter(
                (d) =>
                  d.cityEn.includes(place.name) ||
                  d.city.includes(place.nameKo)
              );
              const cityEn = ["DEL", "JSA", "UDR", "JAI", "VNS"][idx];
              const color = cityColors[cityEn];
              const cityInfo =
                cityInfoMap[place.id];
              return (
                <div
                  key={place.id}
                  className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 active:scale-[0.97] reveal revealed stagger-${idx + 1} ${idx === defaultPlaces.length - 1 && defaultPlaces.length % 2 !== 0 ? "city-card-last" : ""}`}
                >
                  <div
                    className="h-[3px] absolute top-0 left-0 right-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[10px] sm:text-xs text-neutral-400">
                      {cityDays.length > 0 ? `${cityDays.length}일` : ""}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {place.nameKo}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">
                    {place.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 mt-2 leading-relaxed">
                    {place.description}
                  </p>
                  {cityInfo && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cityInfo.highlights.slice(0, 2).map((h) => (
                        <span
                          key={h}
                          className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md ${color.light} font-medium`}
                          style={{ color: color.hex }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* Flight Info */}
      <ScrollReveal>
        <section id="flights" className="mb-8 sm:mb-20">
          <div className="flex items-center gap-3 mb-4 sm:mb-8">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Plane
                size={18}
                className="text-white sm:[width:20px] sm:[height:20px]"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">항공 일정</h2>
              <p className="text-[10px] sm:text-sm text-neutral-500">
                에어인디아 직항
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <FlightCard flight={flights.departure} type="출국" />
            <FlightCard flight={flights.return} type="귀국" />
          </div>
        </section>
      </ScrollReveal>

      {/* Schedule Preview */}
      <ScrollReveal>
        <section id="schedule-preview">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
                <CalendarDays
                  size={18}
                  className="text-white dark:text-neutral-900 sm:[width:20px] sm:[height:20px]"
                />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">일정 미리보기</h2>
                <p className="text-[10px] sm:text-sm text-neutral-500">
                  {itinerary.length}일간의 여정
                </p>
              </div>
            </div>
            <Link
              href="/schedule"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              전체 보기 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {itinerary.slice(0, 6).map((day, idx) => {
              const dayCityEn = day.cityId;
              const dayColor = cityColors[dayCityEn] || cityColors["DEL"];
              return (
                <Link
                  key={day.day}
                  href={`/schedule#day-${day.day}`}
                  className={`group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 active:scale-[0.97] reveal revealed stagger-${idx + 1}`}
                >
                  <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${dayColor.bg} ${dayColor.text}`}
                    >
                      D{day.day}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-neutral-400">
                        {day.date.split("-").slice(1).join("/")} ({day.dayOfWeek})
                      </p>
                      <p className="text-[10px] sm:text-xs text-neutral-500 truncate">
                        {day.city}
                      </p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm truncate">
                    {day.title}
                  </h3>
                  {day.transport && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {day.transport.type === "flight" ? (
                        <Plane
                          size={14}
                          className="text-neutral-400 shrink-0"
                        />
                      ) : (
                        <Bus
                          size={14}
                          className="text-neutral-400 shrink-0"
                        />
                      )}
                      <span className="text-[10px] text-neutral-400 truncate">
                        {day.transport.type === "flight" ? "항공" : "야간버스"}
                        {day.transport.time ? ` · ${day.transport.time}` : ""}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          {itinerary.length > 6 && (
            <div className="text-center mt-6">
              <Link
                href="/schedule"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
              >
                나머지 {itinerary.length - 6}일 보기 &rarr;
              </Link>
            </div>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}
