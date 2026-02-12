"use client";

import { useState, useEffect, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { Expense, defaultExpenses, exchangeRate, budget } from "@/lib/tripData";
import {
  Plus,
  X,
  Plane,
  Hotel,
  UtensilsCrossed,
  Train,
  Ticket,
  ShoppingBag,
  MoreHorizontal,
  ArrowUpDown,
  Edit3,
  AlertCircle,
} from "lucide-react";
import Modal from "@/components/Modal";

const categoryConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  flight: { label: "항공", color: "#3b82f6", icon: Plane },
  accommodation: { label: "숙소", color: "#f97316", icon: Hotel },
  food: { label: "식사", color: "#22c55e", icon: UtensilsCrossed },
  transport: { label: "교통", color: "#a855f7", icon: Train },
  activity: { label: "관광/체험", color: "#ec4899", icon: Ticket },
  shopping: { label: "쇼핑", color: "#f59e0b", icon: ShoppingBag },
  other: { label: "기타", color: "#737373", icon: MoreHorizontal },
};

const categories = Object.entries(categoryConfig).map(([id, cfg]) => ({
  id,
  label: cfg.label,
}));

type SortMode = "date" | "amount" | "category";
type FilterMode = "all" | "prebooked" | "additional";

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [krwAmount, setKrwAmount] = useState("");
  const [inrAmount, setInrAmount] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [barAnimated, setBarAnimated] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: "",
    description: "",
    amount: "",
    currency: "KRW" as "KRW" | "INR",
    category: "food" as Expense["category"],
    isPreBooked: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("india-expenses");
    if (saved) {
      const savedItems: Expense[] = JSON.parse(saved);
      const missingDefaults = defaultExpenses.filter(
        (d) => !savedItems.some((s) => s.id === d.id)
      );
      if (missingDefaults.length > 0) {
        const merged = [...missingDefaults, ...savedItems];
        saveExpenses(merged);
      } else {
        setExpenses(savedItems);
      }
    }
    setTimeout(() => setBarAnimated(true), 300);
  }, []);

  const saveExpenses = (items: Expense[]) => {
    localStorage.setItem("india-expenses", JSON.stringify(items));
    setExpenses(items);
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewExpense({
      date: "",
      description: "",
      amount: "",
      currency: "KRW",
      category: "food",
      isPreBooked: false,
    });
    setShowModal(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingId(expense.id);
    setNewExpense({
      date: expense.date,
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      category: expense.category,
      isPreBooked: expense.isPreBooked || false,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewExpense({
      date: "",
      description: "",
      amount: "",
      currency: "KRW",
      category: "food",
      isPreBooked: false,
    });
  };

  const saveExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    if (editingId) {
      const updated = expenses.map((e) =>
        e.id === editingId
          ? {
              ...e,
              date: newExpense.date || e.date,
              description: newExpense.description,
              amount: parseFloat(newExpense.amount),
              currency: newExpense.currency,
              category: newExpense.category,
              isPreBooked: newExpense.isPreBooked,
            }
          : e
      );
      saveExpenses(updated);
    } else {
      const expense: Expense = {
        id: Date.now().toString(),
        date: newExpense.date || new Date().toISOString().split("T")[0],
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        currency: newExpense.currency,
        category: newExpense.category,
        isPreBooked: newExpense.isPreBooked,
      };
      saveExpenses([...expenses, expense]);
    }

    closeModal();
  };

  const deleteExpense = (id: string) => {
    if (!window.confirm("이 항목을 삭제하시겠습니까?")) return;
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  // Currency converter
  const convertKrwToInr = (value: string) => {
    setKrwAmount(value);
    if (value) {
      const inr = parseFloat(value) * exchangeRate.KRW_TO_INR;
      setInrAmount(inr.toFixed(2));
    } else {
      setInrAmount("");
    }
  };

  const convertInrToKrw = (value: string) => {
    setInrAmount(value);
    if (value) {
      const krw = parseFloat(value) * exchangeRate.INR_TO_KRW;
      setKrwAmount(krw.toFixed(0));
    } else {
      setKrwAmount("");
    }
  };

  // Totals (1인 기준 — 항공권 제외 모든 경비 2인 분할)
  const totalKrwFull = expenses.reduce((sum, e) => {
    if (e.currency === "KRW") return sum + e.amount;
    return sum + e.amount * exchangeRate.INR_TO_KRW;
  }, 0);
  const totalKrw = totalKrwFull / 2;

  const totalInrFull = expenses.reduce((sum, e) => {
    if (e.currency === "INR") return sum + e.amount;
    return sum + e.amount * exchangeRate.KRW_TO_INR;
  }, 0);
  const totalInr = totalInrFull / 2;

  const preBookedTotalKrw = expenses
    .filter((e) => e.isPreBooked)
    .reduce((sum, e) => {
      if (e.currency === "KRW") return sum + e.amount;
      return sum + e.amount * exchangeRate.INR_TO_KRW;
    }, 0) / 2;

  const additionalTotalKrw = expenses
    .filter((e) => !e.isPreBooked)
    .reduce((sum, e) => {
      if (e.currency === "KRW") return sum + e.amount;
      return sum + e.amount * exchangeRate.INR_TO_KRW;
    }, 0) / 2;

  // Category breakdown (1인 기준)
  const expensesByCategory = Object.entries(categoryConfig).map(
    ([id, cfg]) => ({
      id,
      ...cfg,
      total: expenses
        .filter((e) => e.category === id)
        .reduce((sum, e) => {
          if (e.currency === "KRW") return sum + e.amount;
          return sum + e.amount * exchangeRate.INR_TO_KRW;
        }, 0) / 2,
    })
  );

  const categoryBarTotal = expensesByCategory.reduce(
    (sum, c) => sum + c.total,
    0
  );

  // Daily summary stats
  const uniqueDates = [...new Set(expenses.map((e) => e.date))];
  const daysWithExpenses = uniqueDates.length;
  const averagePerDay = daysWithExpenses > 0 ? totalKrw / daysWithExpenses : 0;

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    if (filterMode === "prebooked") return e.isPreBooked;
    if (filterMode === "additional") return !e.isPreBooked;
    return true;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortMode === "date") {
      return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
    }
    if (sortMode === "amount") {
      const aKrw =
        a.currency === "KRW" ? a.amount : a.amount * exchangeRate.INR_TO_KRW;
      const bKrw =
        b.currency === "KRW" ? b.amount : b.amount * exchangeRate.INR_TO_KRW;
      return bKrw - aKrw;
    }
    // category
    const catOrder = Object.keys(categoryConfig);
    return catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
  });

  // Group by date
  const groupedByDate: Record<string, Expense[]> = {};
  for (const expense of sortedExpenses) {
    if (!groupedByDate[expense.date]) {
      groupedByDate[expense.date] = [];
    }
    groupedByDate[expense.date].push(expense);
  }

  const sortedDateKeys =
    sortMode === "date"
      ? Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a))
      : Object.keys(groupedByDate).sort((a, b) => a.localeCompare(b));

  // Sort toggle
  const cycleSortMode = () => {
    setSortMode((prev) => {
      if (prev === "date") return "amount";
      if (prev === "amount") return "category";
      return "date";
    });
  };

  const sortLabel: Record<SortMode, string> = {
    date: "날짜순",
    amount: "금액순",
    category: "카테고리순",
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = dayNames[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            예산 관리
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base hidden sm:block">
            여행 경비를 관리하고 환율을 계산하세요
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
              2인 분할
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-400">
              항공권 제외 · 1인 기준 표시
            </span>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 btn-primary rounded-full font-medium text-sm"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">지출 추가</span>
          <span className="sm:hidden">추가</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Currency Converter */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">
            환율 계산기
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mb-4 sm:mb-6">
            1 KRW = {exchangeRate.KRW_TO_INR} INR | 1 INR ={" "}
            {exchangeRate.INR_TO_KRW} KRW
            <br />
            <span className="text-[10px] sm:text-xs text-neutral-400">
              업데이트: {exchangeRate.lastUpdated}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex-1 w-full">
              <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                <span className="mr-1">🇰🇷</span> 한국 원 (KRW)
              </label>
              <input
                type="number"
                value={krwAmount}
                onChange={(e) => convertKrwToInr(e.target.value)}
                placeholder="0"
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-xl sm:text-2xl font-semibold number-display border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
              />
            </div>

            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 rotate-90 sm:rotate-0">
              <span className="text-neutral-400 text-sm font-medium">
                &harr;
              </span>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                <span className="mr-1">🇮🇳</span> 인도 루피 (INR)
              </label>
              <input
                type="number"
                value={inrAmount}
                onChange={(e) => convertInrToKrw(e.target.value)}
                placeholder="0"
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-xl sm:text-2xl font-semibold number-display border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
              />
            </div>
          </div>

          {/* KRW quick amount buttons */}
          <div className="mt-4 sm:mt-6 grid grid-cols-4 gap-1.5 sm:gap-2">
            {[1000, 5000, 10000, 50000].map((amount) => (
              <button
                key={`krw-${amount}`}
                onClick={() => convertKrwToInr(amount.toString())}
                className="px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all"
              >
                ₩
                {amount >= 10000
                  ? `${amount / 10000}만`
                  : amount.toLocaleString()}
              </button>
            ))}
          </div>

          {/* INR quick amount buttons */}
          <div className="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
            {[100, 500, 1000, 5000].map((amount) => (
              <button
                key={`inr-${amount}`}
                onClick={() => convertInrToKrw(amount.toString())}
                className="px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all"
              >
                ₹{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-neutral-900 dark:bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white dark:text-neutral-900 relative overflow-hidden">
          <div className="relative">
            <h2 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 opacity-60 uppercase tracking-wide">
              내 지출 (1인)
            </h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight number-display">
              ₩{totalKrw.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-base sm:text-lg opacity-50 mt-1">
              ≈ ₹{totalInr.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 dark:border-black/10">
              <p className="text-xs sm:text-sm opacity-50 mb-2 sm:mb-3">
                지출 {expenses.length}건 · 1인 기준
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {expensesByCategory
                  .filter((c) => c.total > 0)
                  .map((cat) => (
                    <span
                      key={cat.id}
                      className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/10 dark:bg-black/10 rounded-full"
                    >
                      {cat.label} ₩{cat.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">
              항공권 (별도)
            </p>
            <p className="text-lg sm:text-xl font-bold number-display">
              ₩{budget.flight.toLocaleString()}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">결제 완료</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">
              여행 경비 예산
            </p>
            <p className="text-lg sm:text-xl font-bold number-display">
              ₩{budget.travel.toLocaleString()}
            </p>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-neutral-900 dark:bg-white h-1.5 sm:h-2 rounded-full transition-all duration-700"
              style={{
                width: barAnimated ? `${Math.min((totalKrw / budget.travel) * 100, 100)}%` : "0%",
              }}
            />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 sm:mt-2">
            {((totalKrw / budget.travel) * 100).toFixed(1)}% 사용
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">
              {budget.travel - totalKrw >= 0 ? "남은 예산" : "초과 금액"}
            </p>
            <p
              className={`text-lg sm:text-xl font-bold number-display ${
                budget.travel - totalKrw < 0 ? "text-red-500" : ""
              }`}
            >
              ₩{Math.abs(budget.travel - totalKrw).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          {budget.travel - totalKrw < 0 && (
            <div className="flex items-center gap-1.5 text-red-500 mb-1">
              <AlertCircle size={12} />
              <span className="text-xs font-medium">예산 초과</span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-neutral-500">
            ≈ ₹
            {(
              Math.abs(budget.travel - totalKrw) * exchangeRate.KRW_TO_INR
            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* 내 총 부담 요약 */}
      <div className="bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide mb-1">
              내 총 부담
            </p>
            <p className="text-xl sm:text-2xl font-bold number-display">
              ₩{(budget.flight + totalKrw).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-right text-xs sm:text-sm text-neutral-400 space-y-0.5">
            <p>항공권 ₩{budget.flight.toLocaleString()}</p>
            <p>경비(1/2) ₩{totalKrw.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown with Horizontal Bar Chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
          카테고리별 지출
        </h2>

        {/* Horizontal stacked bar */}
        {categoryBarTotal > 0 && (
          <div className="w-full h-6 sm:h-8 rounded-full overflow-hidden flex mb-4 sm:mb-6 bg-neutral-100 dark:bg-neutral-800">
            {expensesByCategory
              .filter((cat) => cat.total > 0)
              .map((cat, catIdx) => {
                const widthPercent = (cat.total / categoryBarTotal) * 100;
                return (
                  <div
                    key={cat.id}
                    className="h-full relative group"
                    style={{
                      width: barAnimated ? `${widthPercent}%` : "0%",
                      backgroundColor: cat.color,
                      minWidth: barAnimated && widthPercent > 0 ? "4px" : "0",
                      transition: `width 600ms cubic-bezier(0.16, 1, 0.3, 1) ${catIdx * 80}ms`,
                    }}
                    title={`${cat.label}: ₩${cat.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${widthPercent.toFixed(1)}%)`}
                  />
                );
              })}
          </div>
        )}

        {/* Category cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {expensesByCategory.map((cat) => {
            const percentage =
              categoryBarTotal > 0
                ? (cat.total / categoryBarTotal) * 100
                : 0;
            const IconComp = cat.icon;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg sm:rounded-xl"
              >
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cat.color + "18" }}
                >
                  <IconComp size={16} style={{ color: cat.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-neutral-500 truncate">
                    {cat.label}
                  </p>
                  <p className="font-semibold text-xs sm:text-sm number-display truncate">
                    ₩
                    {cat.total >= 10000
                      ? `${(cat.total / 10000).toFixed(0)}만`
                      : cat.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  {percentage > 0 && (
                    <p className="text-[10px] text-neutral-400">
                      {percentage.toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">
            지출 일수
          </p>
          <p className="text-base sm:text-lg font-bold number-display">
            {daysWithExpenses}일
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">
            일 평균 지출
          </p>
          <p className="text-base sm:text-lg font-bold number-display">
            ₩{averagePerDay.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">
            예약 경비
          </p>
          <p className="text-base sm:text-lg font-bold number-display">
            ₩{preBookedTotalKrw.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">
            현지 추가
          </p>
          <p className="text-base sm:text-lg font-bold number-display">
            ₩{additionalTotalKrw.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {/* Header with filter tabs and sort */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-2">
            {(
              [
                { key: "all", label: "전체" },
                { key: "prebooked", label: "예약 경비" },
                { key: "additional", label: "현지 추가" },
              ] as { key: FilterMode; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterMode(tab.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  filterMode === tab.key
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={cycleSortMode}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all"
            title={`정렬: ${sortLabel[sortMode]}`}
          >
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline">{sortLabel[sortMode]}</span>
          </button>
        </div>

        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-neutral-500 text-sm sm:text-base">
              {filterMode === "all"
                ? "아직 등록된 지출이 없습니다"
                : filterMode === "prebooked"
                  ? "예약된 경비가 없습니다"
                  : "현지 추가 지출이 없습니다"}
            </p>
          </div>
        ) : sortMode === "date" ? (
          // Grouped by date
          <div className="space-y-4 sm:space-y-6">
            {sortedDateKeys.map((dateKey) => (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-400">
                    {formatDateHeader(dateKey)}
                  </h3>
                  <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
                  <span className="text-[10px] sm:text-xs text-neutral-400 number-display">
                    {groupedByDate[dateKey].length}건
                  </span>
                </div>
                <div className="space-y-2">
                  {groupedByDate[dateKey].map((expense) => (
                    <ExpenseRow
                      key={expense.id}
                      expense={expense}
                      onEdit={openEditModal}
                      onDelete={deleteExpense}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat list (amount or category sort)
          <div className="space-y-2">
            {sortedExpenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onEdit={openEditModal}
                onDelete={deleteExpense}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? "지출 수정" : "새 지출 추가"}
        footer={
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
            >
              취소
            </button>
            <button
              onClick={saveExpense}
              className="flex-1 px-4 py-3 btn-primary rounded-lg sm:rounded-xl font-medium active:scale-[0.98]"
            >
              {editingId ? "수정" : "추가"}
            </button>
          </div>
        }
      >
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
            내용
          </label>
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            placeholder="지출 내용"
            className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              금액
            </label>
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              placeholder="0"
              className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              통화
            </label>
            <select
              value={newExpense.currency}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  currency: e.target.value as "KRW" | "INR",
                })
              }
              className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            >
              <option value="KRW">KRW (원)</option>
              <option value="INR">INR (루피)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              날짜
            </label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              카테고리
            </label>
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  category: e.target.value as Expense["category"],
                })
              }
              className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newExpense.isPreBooked}
              onChange={(e) =>
                setNewExpense({ ...newExpense, isPreBooked: e.target.checked })
              }
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-white"
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              사전 예약 경비
            </span>
          </label>
        </div>
      </Modal>

      {/* Mobile Quick Add FAB */}
      <button
        onClick={openAddModal}
        className="md:hidden fixed bottom-20 right-16 z-30 w-14 h-14 rounded-full btn-primary shadow-lg flex items-center justify-center active:scale-95 transition-all"
        aria-label="빠른 지출 추가"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

function ExpenseRow({
  expense,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}) {
  const cat = categoryConfig[expense.category];
  const IconComp = cat?.icon || MoreHorizontal;

  return (
    <div
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg sm:rounded-xl group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
      onClick={() => onEdit(expense)}
    >
      <div
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: (cat?.color || "#737373") + "18" }}
      >
        <IconComp size={15} style={{ color: cat?.color || "#737373" }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="font-medium text-sm sm:text-base truncate">
            {expense.description}
          </h4>
          {expense.isPreBooked && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded font-medium">
              예약
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-neutral-500">
          {expense.date} · {cat?.label || "기타"}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-semibold text-sm sm:text-base number-display">
          {expense.currency === "KRW" ? "₩" : "₹"}
          {(expense.amount / 2).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="text-[10px] sm:text-xs text-neutral-400">
          총 {expense.currency === "KRW" ? "₩" : "₹"}
          {expense.amount.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(expense);
          }}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-all active:scale-95"
          title="수정"
        >
          <Edit3 size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(expense.id);
          }}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-red-100 dark:hover:bg-red-950/30 hover:text-red-500 flex items-center justify-center transition-all active:scale-95"
          title="삭제"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
