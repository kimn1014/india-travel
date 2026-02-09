"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/schedule", label: "일정" },
  { href: "/hotels", label: "숙소" },
  { href: "/budget", label: "예산" },
  { href: "/weather", label: "날씨" },
  { href: "/resources", label: "자료" },
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
              className="text-lg font-semibold tracking-tight"
            >
              India 2026
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
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
        <div className="grid grid-cols-6 h-14">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center transition-all duration-200 active:scale-95 text-sm font-medium ${
                  isActive
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
