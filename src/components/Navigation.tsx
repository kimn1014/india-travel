"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Wallet, Cloud, FolderOpen } from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/schedule", label: "일정", icon: Calendar },
  { href: "/budget", label: "예산", icon: Wallet },
  { href: "/weather", label: "날씨", icon: Cloud },
  { href: "/resources", label: "자료", icon: FolderOpen },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <span className="text-lg font-semibold tracking-tight">
                India 2026
              </span>
            </Link>

            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800 safe-area-top">
        <div className="flex items-center justify-center h-14 px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            India 2026
          </Link>
        </div>
      </header>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl border-t border-neutral-200 dark:border-neutral-800 safe-area-bottom">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
