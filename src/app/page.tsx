"use client";

import Link from "next/link";
import { tripInfo, flights, itinerary } from "@/lib/tripData";
import { Calendar, Wallet, Cloud, Plane, MapPin, Clock, Luggage, ArrowRight, FolderOpen, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

function getTimeUntilTrip() {
  const today = new Date();
  const tripStart = new Date(tripInfo.dates.start);
  tripStart.setHours(0, 0, 0, 0);

  const diffTime = tripStart.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  return { days: Math.max(0, diffDays), hours: Math.max(0, diffHours), minutes: Math.max(0, diffMinutes), seconds: Math.max(0, diffSeconds) };
}

function FlightCard({ flight, type }: { flight: typeof flights.departure; type: "출국" | "귀국" }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <span className={`text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wide ${
          type === "출국"
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        }`}>
          {type}
        </span>
        <span className="text-xs sm:text-sm text-neutral-500">{flight.date} ({flight.dayOfWeek})</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-center min-w-0">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">{flight.departureTime}</p>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 truncate">{flight.from.airport}</p>
        </div>

        <div className="flex-1 flex flex-col items-center px-2 sm:px-4">
          <p className="text-[10px] sm:text-xs text-neutral-400 mb-2">{flight.duration}</p>
          <div className="w-full h-[2px] bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 relative rounded-full">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-900 dark:bg-white rounded-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-900 dark:bg-white rounded-full" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 px-2">
              <Plane size={14} className="text-neutral-400 rotate-90" />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-2 truncate max-w-full">{flight.airline} {flight.flightNumber}</p>
        </div>

        <div className="text-center min-w-0">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">{flight.arrivalTime}</p>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 truncate">{flight.to.airport}</p>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-xs sm:text-sm text-neutral-500">
        <span className="flex items-center gap-2">
          <span className="font-mono text-[10px] sm:text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">PNR</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{flight.pnr}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Luggage size={14} /> <span className="hidden sm:inline">{flight.baggage}</span><span className="sm:hidden">위탁 1</span>
        </span>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-20 sm:w-24 sm:h-28 bg-gradient-to-b from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-3xl sm:text-5xl font-bold text-white dark:text-neutral-900 tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-neutral-700 dark:bg-neutral-300 opacity-30" />
      </div>
      <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider mt-2 sm:mt-3">{label}</span>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [timeUntil, setTimeUntil] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeUntil(getTimeUntilTrip());

    const timer = setInterval(() => {
      setTimeUntil(getTimeUntilTrip());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = ["서울", "델리", "레", "조드푸르", "자이살메르", "바라나시", "델리", "서울"];
  const cityColors = ["#171717", "#f97316", "#06b6d4", "#2563eb", "#f59e0b", "#a855f7", "#f97316", "#171717"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Hero Section with D-Day Countdown */}
      <section className="mb-16 sm:mb-24">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full mb-6">
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300">
              {tripInfo.dates.start} ~ {tripInfo.dates.end}
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              India
            </span>
            <span className="text-neutral-300 dark:text-neutral-600 ml-3">2026</span>
          </h1>
          <p className="text-neutral-500 mt-4 text-sm sm:text-base">9박 10일 인도 여행</p>
        </div>

        {/* Countdown */}
        {mounted ? (
          <div className="flex justify-center items-center gap-3 sm:gap-5 mb-10 sm:mb-14">
            <CountdownUnit value={timeUntil.days} label="일" />
            <span className="text-2xl sm:text-3xl font-light text-neutral-300 dark:text-neutral-600 mt-[-20px]">:</span>
            <CountdownUnit value={timeUntil.hours} label="시간" />
            <span className="text-2xl sm:text-3xl font-light text-neutral-300 dark:text-neutral-600 mt-[-20px]">:</span>
            <CountdownUnit value={timeUntil.minutes} label="분" />
            <span className="text-2xl sm:text-3xl font-light text-neutral-300 dark:text-neutral-600 mt-[-20px] hidden sm:block">:</span>
            <div className="hidden sm:block">
              <CountdownUnit value={timeUntil.seconds} label="초" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-3 sm:gap-5 mb-10 sm:mb-14">
            <CountdownUnit value={0} label="일" />
            <span className="text-2xl sm:text-3xl font-light text-neutral-300 dark:text-neutral-600 mt-[-20px]">:</span>
            <CountdownUnit value={0} label="시간" />
            <span className="text-2xl sm:text-3xl font-light text-neutral-300 dark:text-neutral-600 mt-[-20px]">:</span>
            <CountdownUnit value={0} label="분" />
            <span className="text-2xl sm:text-3xl font-light text-neutral-300 dark:text-neutral-600 mt-[-20px] hidden sm:block">:</span>
            <div className="hidden sm:block">
              <CountdownUnit value={0} label="초" />
            </div>
          </div>
        )}

        {/* City Route Preview */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-8">
          <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-5">여행 루트</h3>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {cities.map((city, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                    style={{ backgroundColor: cityColors[idx] }}
                  />
                  <span className="text-sm sm:text-base font-medium">{city}</span>
                </div>
                {idx < cities.length - 1 && (
                  <ArrowRight size={14} className="text-neutral-300 dark:text-neutral-600" />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold">{tripInfo.totalDays}</p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">일정</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold">5</p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">도시</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold">6</p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">항공편</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold">-3.5h</p>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-1">시차</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-12 sm:mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { href: "/schedule", icon: Calendar, label: "일정", desc: "여행 일정 확인", color: "from-cyan-500 to-blue-500" },
            { href: "/budget", icon: Wallet, label: "예산", desc: "경비 관리", color: "from-green-500 to-emerald-500" },
            { href: "/weather", icon: Cloud, label: "날씨", desc: "현지 날씨 확인", color: "from-amber-500 to-orange-500" },
            { href: "/resources", icon: FolderOpen, label: "자료실", desc: "필수 정보", color: "from-purple-500 to-pink-500" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-300 active:scale-[0.98]"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={20} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{item.label}</h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-neutral-300 group-hover:text-neutral-600 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flight Info */}
      <section className="mb-12 sm:mb-20">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
            <Plane size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">항공 일정</h2>
            <p className="text-xs sm:text-sm text-neutral-500">에어인디아 직항</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <FlightCard flight={flights.departure} type="출국" />
          <FlightCard flight={flights.return} type="귀국" />
        </div>
      </section>

      {/* Today's Schedule Preview */}
      <section>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">일정 미리보기</h2>
              <p className="text-xs sm:text-sm text-neutral-500">{itinerary.length}일간의 여정</p>
            </div>
          </div>
          <Link
            href="/schedule"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            전체 보기 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {itinerary.slice(0, 6).map((day) => (
            <Link
              key={day.day}
              href={`/schedule#day-${day.day}`}
              className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: day.color }}
                >
                  D{day.day}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-neutral-400 mb-0.5">
                    {day.date.split("-").slice(1).join("/")} ({day.dayOfWeek})
                  </p>
                  <h3 className="font-semibold text-sm sm:text-base truncate">{day.title}</h3>
                  <p className="text-xs text-neutral-500 truncate">{day.city}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {itinerary.length > 6 && (
          <div className="text-center mt-6">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-sm font-medium transition-colors"
            >
              나머지 {itinerary.length - 6}일 보기 <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
