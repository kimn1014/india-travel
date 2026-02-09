"use client";

import { useState, useEffect } from "react";
import { Expense, defaultExpenses, exchangeRate, budget } from "@/lib/tripData";
import { Plus, X } from "lucide-react";

const categories = [
  { id: "flight", label: "항공" },
  { id: "accommodation", label: "숙소" },
  { id: "food", label: "식사" },
  { id: "transport", label: "교통" },
  { id: "activity", label: "관광/체험" },
  { id: "shopping", label: "쇼핑" },
  { id: "other", label: "기타" },
];

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [krwAmount, setKrwAmount] = useState("");
  const [inrAmount, setInrAmount] = useState("");
  const [newExpense, setNewExpense] = useState({
    date: "",
    description: "",
    amount: "",
    currency: "KRW" as "KRW" | "INR",
    category: "food" as Expense["category"],
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
  }, []);

  const saveExpenses = (items: Expense[]) => {
    localStorage.setItem("india-expenses", JSON.stringify(items));
    setExpenses(items);
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      date: newExpense.date || new Date().toISOString().split("T")[0],
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      currency: newExpense.currency,
      category: newExpense.category,
    };

    saveExpenses([...expenses, expense]);
    setNewExpense({ date: "", description: "", amount: "", currency: "KRW", category: "food" });
    setShowAddModal(false);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

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

  const totalKrw = expenses.reduce((sum, e) => {
    if (e.currency === "KRW") return sum + e.amount;
    return sum + e.amount * exchangeRate.INR_TO_KRW;
  }, 0);

  const totalInr = expenses.reduce((sum, e) => {
    if (e.currency === "INR") return sum + e.amount;
    return sum + e.amount * exchangeRate.KRW_TO_INR;
  }, 0);

  const expensesByCategory = categories.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => {
        if (e.currency === "KRW") return sum + e.amount;
        return sum + e.amount * exchangeRate.INR_TO_KRW;
      }, 0),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">예산 관리</h1>
          <p className="text-neutral-500 text-sm sm:text-base hidden sm:block">여행 경비를 관리하고 환율을 계산하세요</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 btn-primary rounded-full font-medium text-sm"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden sm:inline">지출 추가</span><span className="sm:hidden">추가</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Currency Converter */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">환율 계산기</h2>
          <p className="text-xs sm:text-sm text-neutral-500 mb-4 sm:mb-6">
            1 KRW = {exchangeRate.KRW_TO_INR} INR | 1 INR = {exchangeRate.INR_TO_KRW} KRW
            <br />
            <span className="text-[10px] sm:text-xs text-neutral-400">업데이트: {exchangeRate.lastUpdated}</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex-1 w-full">
              <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">한국 원 (KRW)</label>
              <input
                type="number"
                value={krwAmount}
                onChange={(e) => convertKrwToInr(e.target.value)}
                placeholder="0"
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-xl sm:text-2xl font-semibold number-display border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
              />
            </div>

            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 rotate-90 sm:rotate-0">
              <span className="text-neutral-400 text-sm font-medium">&harr;</span>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">인도 루피 (INR)</label>
              <input
                type="number"
                value={inrAmount}
                onChange={(e) => convertInrToKrw(e.target.value)}
                placeholder="0"
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-xl sm:text-2xl font-semibold number-display border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-4 gap-1.5 sm:gap-2">
            {[1000, 5000, 10000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => convertKrwToInr(amount.toString())}
                className="px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all"
              >
                ₩{amount >= 10000 ? `${amount/10000}만` : amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-neutral-900 dark:bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white dark:text-neutral-900 relative overflow-hidden">
          <div className="relative">
            <h2 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 opacity-60 uppercase tracking-wide">총 지출</h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight number-display">₩{totalKrw.toLocaleString()}</p>
            <p className="text-base sm:text-lg opacity-50 mt-1">≈ ₹{totalInr.toLocaleString()}</p>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 dark:border-black/10">
              <p className="text-xs sm:text-sm opacity-50 mb-2 sm:mb-3">지출 {expenses.length}건</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {expensesByCategory
                  .filter((c) => c.total > 0)
                  .map((cat) => (
                    <span
                      key={cat.id}
                      className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/10 dark:bg-black/10 rounded-full"
                    >
                      {cat.label} ₩{cat.total.toLocaleString()}
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
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">항공권 (별도)</p>
            <p className="text-lg sm:text-xl font-bold number-display">₩{budget.flight.toLocaleString()}</p>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">결제 완료</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">여행 경비 예산</p>
            <p className="text-lg sm:text-xl font-bold number-display">₩{budget.travel.toLocaleString()}</p>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-neutral-900 dark:bg-white h-1.5 sm:h-2 rounded-full transition-all"
              style={{ width: `${Math.min((totalKrw / budget.travel) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 sm:mt-2">{((totalKrw / budget.travel) * 100).toFixed(1)}% 사용</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">
              {budget.travel - totalKrw >= 0 ? '남은 예산' : '초과 금액'}
            </p>
            <p className="text-lg sm:text-xl font-bold number-display">
              ₩{Math.abs(budget.travel - totalKrw).toLocaleString()}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">
            ≈ ₹{(Math.abs(budget.travel - totalKrw) * exchangeRate.KRW_TO_INR).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">카테고리별 지출</h2>
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
          {expensesByCategory.map((cat) => {
            const percentage = totalKrw > 0 ? (cat.total / totalKrw) * 100 : 0;
            return (
              <div key={cat.id} className="text-center">
                <p className="text-[10px] sm:text-sm text-neutral-500 mb-0.5 sm:mb-1 truncate">{cat.label}</p>
                <p className="font-semibold text-xs sm:text-base number-display">₩{cat.total >= 10000 ? `${(cat.total/10000).toFixed(0)}만` : cat.total.toLocaleString()}</p>
                {percentage > 0 && (
                  <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">{percentage.toFixed(0)}%</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">지출 내역</h2>

        {expenses.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-neutral-500 text-sm sm:text-base">아직 등록된 지출이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...expenses].reverse().map((expense) => {
              const cat = categories.find((c) => c.id === expense.category);
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg sm:rounded-xl group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base truncate">{expense.description}</h4>
                    <p className="text-xs sm:text-sm text-neutral-500">
                      {expense.date} · {cat?.label}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm sm:text-base number-display">
                      {expense.currency === "KRW" ? "₩" : "₹"}
                      {expense.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] sm:text-xs text-neutral-400">
                      ≈ {expense.currency === "KRW"
                        ? `₹${(expense.amount * exchangeRate.KRW_TO_INR).toFixed(0)}`
                        : `₩${(expense.amount * exchangeRate.INR_TO_KRW).toLocaleString()}`
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-all shrink-0 active:scale-95"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4 animate-fade-in modal-mobile">
          <div className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md animate-scale-in shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold">새 지출 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors active:scale-95"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">내용</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="지출 내용"
                  className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">금액</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">통화</label>
                  <select
                    value={newExpense.currency}
                    onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value as "KRW" | "INR" })}
                    className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                  >
                    <option value="KRW">KRW (원)</option>
                    <option value="INR">INR (루피)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">날짜</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">카테고리</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as Expense["category"] })}
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
            </div>

            <div className="flex gap-3 mt-5 sm:mt-6 pb-safe">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
              >
                취소
              </button>
              <button
                onClick={addExpense}
                className="flex-1 px-4 py-3 btn-primary rounded-lg sm:rounded-xl font-medium active:scale-[0.98]"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
