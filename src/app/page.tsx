"use client";

import Link from "next/link";
import { tripInfo, flights, itinerary } from "@/lib/tripData";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Wallet,
  CloudSun,
  FolderOpen,
  Plane,
  Bus,
} from "lucide-react";

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
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wide bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          {type}
        </span>
        <span className="text-[10px] sm:text-sm text-neutral-500">{flight.date} ({flight.dayOfWeek})</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-center min-w-0">
          <p className="text-xl sm:text-3xl font-bold tracking-tight">{flight.departureTime}</p>
          <p className="text-[10px] sm:text-sm text-neutral-500 mt-0.5 sm:mt-1 truncate">{flight.from.airport}</p>
        </div>

        <div className="flex-1 flex flex-col items-center px-1 sm:px-4">
          <p className="text-[10px] sm:text-xs text-neutral-400 mb-1.5 sm:mb-2">{flight.duration}</p>
          <div className="w-full h-[1px] bg-neutral-300 dark:bg-neutral-700 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-1.5 sm:mt-2 truncate max-w-full">{flight.airline} {flight.flightNumber}</p>
        </div>

        <div className="text-center min-w-0">
          <p className="text-xl sm:text-3xl font-bold tracking-tight">{flight.arrivalTime}</p>
          <p className="text-[10px] sm:text-sm text-neutral-500 mt-0.5 sm:mt-1 truncate">{flight.to.airport}</p>
        </div>
      </div>

      <div className="mt-3 sm:mt-5 pt-3 sm:pt-5 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-[10px] sm:text-sm text-neutral-500">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-mono text-[10px] sm:text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">PNR</span>
          <span className="font-medium text-neutral-700 dark:text-neutral-300">{flight.pnr}</span>
        </span>
        <span className="hidden sm:inline">{flight.baggage}</span>
        <span className="sm:hidden text-neutral-400">위탁 1개</span>
      </div>
    </div>
  );
}

const quickLinks = [
  { href: "/schedule", label: "일정", desc: "여행 일정 확인", icon: CalendarDays },
  { href: "/budget", label: "예산", desc: "경비 관리", icon: Wallet },
  { href: "/weather", label: "날씨", desc: "현지 날씨 확인", icon: CloudSun },
  { href: "/resources", label: "자료실", desc: "필수 정보", icon: FolderOpen },
];

const cityRoute = [
  { name: "델리", en: "DEL", highlight: true },
  { name: "자이살메르", en: "JSA" },
  { name: "우다이푸르", en: "UDR" },
  { name: "자이푸르", en: "JAI" },
  { name: "바라나시", en: "VNS" },
  { name: "델리", en: "DEL", highlight: true },
];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-16">
      {/* Hero Section with D-Day Countdown */}
      <section className="mb-10 sm:mb-24">
        <div className="text-center mb-8 sm:mb-14">
          <p className="text-[10px] sm:text-sm text-neutral-400 tracking-widest uppercase mb-3 sm:mb-6">
            2월 13일 (금) ~ 22일 (일)
          </p>
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
            <span className="text-neutral-900 dark:text-white">India</span>
            <span className="text-neutral-300 dark:text-neutral-600 ml-2 sm:ml-3">2026</span>
          </h1>
          {mounted && (
            <div className="mt-4 sm:mt-8">
              <p className="text-[10px] sm:text-xs text-neutral-400 mb-1 sm:mb-2 uppercase tracking-widest">여행까지</p>
              <p className="text-5xl sm:text-8xl font-bold tracking-tighter text-neutral-900 dark:text-white">
                D-{timeUntil.days}
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-5 mt-3 sm:mt-4">
                {[
                  { value: timeUntil.hours, label: "시간" },
                  { value: timeUntil.minutes, label: "분" },
                  { value: timeUntil.seconds, label: "초" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <span className="text-lg sm:text-2xl font-bold tabular-nums">{String(item.value).padStart(2, "0")}</span>
                    <span className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!mounted && <p className="text-neutral-500 mt-3 sm:mt-4 text-xs sm:text-base">9박 10일 인도 여행</p>}
        </div>

        {/* City Route Preview */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-8">
          <h3 className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4 sm:mb-6">여행 루트</h3>
          {/* Visual route with dots */}
          <div className="flex items-center justify-center">
            {cityRoute.map((city, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[9px] sm:text-[11px] font-bold ${
                    city.highlight
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  }`}>
                    {city.en}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium mt-1.5 whitespace-nowrap">{city.name}</span>
                </div>
                {idx < cityRoute.length - 1 && (
                  <div className="w-3 sm:w-8 h-[1px] bg-neutral-300 dark:bg-neutral-700 mx-0.5 sm:mx-1 mb-5 sm:mb-6" />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-100 dark:border-neutral-800">
            {[
              { value: tripInfo.totalDays, label: "일정", suffix: "일" },
              { value: "5", label: "도시", suffix: "곳" },
              { value: "6", label: "항공편", suffix: "회" },
              { value: "-3.5", label: "시차", suffix: "h" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl sm:text-3xl font-bold">{stat.value}<span className="text-xs sm:text-sm font-normal text-neutral-400 ml-0.5">{stat.suffix}</span></p>
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-8 sm:mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 active:scale-[0.97]"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-900 dark:group-hover:bg-white transition-colors duration-300">
                    <Icon size={18} className="text-neutral-600 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-900 transition-colors duration-300 sm:[width:20px] sm:[height:20px]" />
                  </div>
                  <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{item.label}</h3>
                <p className="text-[10px] sm:text-sm text-neutral-500 mt-0.5">{item.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flight Info */}
      <section className="mb-8 sm:mb-20">
        <div className="flex items-center gap-3 mb-4 sm:mb-8">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
            <Plane size={18} className="text-white dark:text-neutral-900 sm:[width:20px] sm:[height:20px]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">항공 일정</h2>
            <p className="text-[10px] sm:text-sm text-neutral-500">에어인디아 직항</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <FlightCard flight={flights.departure} type="출국" />
          <FlightCard flight={flights.return} type="귀국" />
        </div>
      </section>

      {/* Schedule Preview */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
              <CalendarDays size={18} className="text-white dark:text-neutral-900 sm:[width:20px] sm:[height:20px]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">일정 미리보기</h2>
              <p className="text-[10px] sm:text-sm text-neutral-500">{itinerary.length}일간의 여정</p>
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
          {itinerary.slice(0, 6).map((day) => (
            <Link
              key={day.day}
              href={`/schedule#day-${day.day}`}
              className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 active:scale-[0.97]"
            >
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-bold text-xs sm:text-sm shrink-0">
                  D{day.day}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-neutral-400">
                    {day.date.split("-").slice(1).join("/")} ({day.dayOfWeek})
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 truncate">{day.city}</p>
                </div>
              </div>
              <h3 className="font-semibold text-xs sm:text-sm truncate">{day.title}</h3>
              {day.transport && (
                <div className="flex items-center gap-1.5 mt-2">
                  {day.transport.type === "flight" ? (
                    <Plane size={11} className="text-neutral-400 shrink-0" />
                  ) : (
                    <Bus size={11} className="text-neutral-400 shrink-0" />
                  )}
                  <span className="text-[10px] text-neutral-400 truncate">
                    {day.transport.type === "flight" ? "항공" : "야간버스"}
                    {day.transport.time ? ` · ${day.transport.time}` : ""}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
        {itinerary.length > 6 && (
          <div className="text-center mt-6">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-sm font-medium transition-colors"
            >
              나머지 {itinerary.length - 6}일 보기 &rarr;
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
