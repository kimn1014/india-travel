"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  CalendarDays,
  Hotel,
  Wallet,
  CloudSun,
  FolderOpen,
} from "lucide-react";
import { tripInfo } from "@/lib/tripData";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/schedule", label: "일정", icon: CalendarDays },
  { href: "/hotels", label: "숙소", icon: Hotel },
  { href: "/budget", label: "예산", icon: Wallet },
  { href: "/weather", label: "날씨", icon: CloudSun },
  { href: "/resources", label: "자료", icon: FolderOpen },
];

function getDDay(): number {
  const today = new Date();
  const tripStart = new Date(tripInfo.dates.start);
  tripStart.setHours(0, 0, 0, 0);
  const diff = tripStart.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Navigation() {
  const pathname = usePathname();
  const [dday, setDday] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setDday(getDDay());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentPageLabel = navItems.find((item) => item.href === pathname)?.label || "홈";

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-sm"
          : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-semibold tracking-tight"
            >
              <span>India 2026</span>
              {dday !== null && dday > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white animate-pulse-soft">
                  D-{dday}
                </span>
              )}
              {dday !== null && dday <= 0 && dday >= -9 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                  여행 중
                </span>
              )}
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800"
                        : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    {item.label}
                    {/* Active underline indicator */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-orange-500 transition-all duration-300 ${
                        isActive ? "w-4 opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Top Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 safe-area-top transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-sm"
          : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800"
      }`}>
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">India 2026</span>
            {dday !== null && dday > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white animate-pulse-soft">
                D-{dday}
              </span>
            )}
            {dday !== null && dday <= 0 && dday >= -9 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500 text-white">
                Day {Math.abs(dday) + 1}
              </span>
            )}
          </Link>
          <span className="text-xs font-medium text-neutral-400">{currentPageLabel}</span>
        </div>
      </header>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border-t border-neutral-200 dark:border-neutral-800 safe-area-bottom shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 active:scale-90 ${
                  isActive
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className="transition-all duration-300" />
                  {/* Animated indicator dot */}
                  <div
                    className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                  />
                </div>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
