"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  X,
  Hotel,
  UtensilsCrossed,
  Train,
  Ticket,
  ShoppingBag,
  MoreHorizontal,
  ArrowLeft,
  ArrowRightLeft,
  Loader2,
  Trash2,
} from "lucide-react";
import Modal from "@/components/Modal";
import { useSharedExpenses } from "@/hooks/useSharedExpenses";
import { TRAVELERS, SharedExpense, TravelerId } from "@/lib/supabase";
import { exchangeRate } from "@/lib/tripData";

const categoryConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<any> }
> = {
  food: { label: "식사", color: "#22c55e", icon: UtensilsCrossed },
  transport: { label: "교통", color: "#a855f7", icon: Train },
  activity: { label: "관광/체험", color: "#ec4899", icon: Ticket },
  shopping: { label: "쇼핑", color: "#f59e0b", icon: ShoppingBag },
  accommodation: { label: "숙소", color: "#f97316", icon: Hotel },
  other: { label: "기타", color: "#737373", icon: MoreHorizontal },
};

const categories = Object.entries(categoryConfig).map(([id, cfg]) => ({
  id,
  label: cfg.label,
}));

type FormData = {
  description: string;
  amount: string;
  currency: "KRW" | "INR";
  paid_by: TravelerId;
  split_type: "equal" | "full_payer" | "full_other";
  category: SharedExpense["category"];
  date: string;
};

const defaultForm: FormData = {
  description: "",
  amount: "",
  currency: "INR",
  paid_by: "minsu",
  split_type: "equal",
  category: "food",
  date: "",
};

export default function SettlePage() {
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense, settlement } =
    useSharedExpenses();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...defaultForm, date: new Date().toISOString().split("T")[0] });
    setShowModal(true);
  };

  const openEditModal = (expense: SharedExpense) => {
    setEditingId(expense.id);
    setForm({
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      paid_by: expense.paid_by,
      split_type: expense.split_type,
      category: expense.category,
      date: expense.date,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleSave = async () => {
    if (!form.description || !form.amount) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateExpense(editingId, {
          description: form.description,
          amount: parseInt(form.amount),
          currency: form.currency,
          paid_by: form.paid_by,
          split_type: form.split_type,
          category: form.category,
          date: form.date || new Date().toISOString().split("T")[0],
        });
      } else {
        await addExpense({
          description: form.description,
          amount: parseInt(form.amount),
          currency: form.currency,
          paid_by: form.paid_by,
          split_type: form.split_type,
          category: form.category,
          date: form.date || new Date().toISOString().split("T")[0],
        });
      }
      closeModal();
    } catch (e: any) {
      alert("저장 실패: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("이 항목을 삭제하시겠습니까?")) return;
    try {
      await deleteExpense(id);
    } catch (e: any) {
      alert("삭제 실패: " + e.message);
    }
  };

  // Group by date
  const groupedByDate = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.created_at.localeCompare(a.created_at);
    });

    const groups: Record<string, SharedExpense[]> = {};
    for (const e of sorted) {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    }
    return groups;
  }, [expenses]);

  const sortedDateKeys = Object.keys(groupedByDate).sort((a, b) =>
    b.localeCompare(a)
  );

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = dayNames[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency === "KRW" ? "₩" : "₹";
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <div className="flex items-center justify-center py-32">
          <Loader2 size={24} className="animate-spin text-neutral-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <div className="text-center py-32">
          <p className="text-red-500 mb-2">연결 오류</p>
          <p className="text-sm text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div>
          <Link
            href="/budget"
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 mb-2 transition-colors"
          >
            <ArrowLeft size={12} />
            예산 관리
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">정산</h1>
          <p className="text-neutral-500 text-xs sm:text-sm">
            실시간 경비 정산 · {TRAVELERS.minsu.short} & {TRAVELERS.dongju.short}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 btn-primary rounded-full font-medium text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">지출 추가</span>
          <span className="sm:hidden">추가</span>
        </button>
      </div>

      {/* Settlement Summary Card */}
      <div className="bg-neutral-900 dark:bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white dark:text-neutral-900 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs sm:text-sm font-medium opacity-60 uppercase tracking-wide">
            정산 요약
          </h2>
          <span className="text-xs opacity-40">{expenses.length}건</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
          <div>
            <p className="text-[10px] sm:text-xs opacity-50 mb-1">총 지출</p>
            <p className="text-2xl sm:text-3xl font-bold number-display">
              ₩{settlement.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] sm:text-xs opacity-50 mb-1">
              ≈ INR
            </p>
            <p className="text-lg sm:text-xl font-semibold number-display opacity-50">
              ₹{(settlement.totalSpent * exchangeRate.KRW_TO_INR).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Each person's payment */}
        <div className="grid grid-cols-2 gap-3 mb-4 sm:mb-6">
          <div className="bg-white/10 dark:bg-black/5 rounded-lg p-3">
            <p className="text-[10px] sm:text-xs opacity-50 mb-1">
              {TRAVELERS.minsu.short} 결제
            </p>
            <p className="text-base sm:text-lg font-bold number-display text-blue-300 dark:text-blue-600">
              ₩{settlement.minsuPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-white/10 dark:bg-black/5 rounded-lg p-3">
            <p className="text-[10px] sm:text-xs opacity-50 mb-1">
              {TRAVELERS.dongju.short} 결제
            </p>
            <p className="text-base sm:text-lg font-bold number-display text-purple-300 dark:text-purple-600">
              ₩{settlement.dongjuPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Settlement result */}
        {settlement.transferAmount > 0 ? (
          <div className="flex items-center gap-3 bg-white/10 dark:bg-black/5 rounded-lg p-3 sm:p-4">
            <ArrowRightLeft size={20} className="shrink-0 opacity-60" />
            <div>
              <p className="text-sm sm:text-base font-semibold">
                {TRAVELERS[settlement.transferFrom].short} → {TRAVELERS[settlement.transferTo].short}
              </p>
              <p className="text-lg sm:text-xl font-bold number-display">
                ₩{settlement.transferAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs sm:text-sm opacity-50 number-display">
                ≈ ₹{(settlement.transferAmount * exchangeRate.KRW_TO_INR).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 opacity-50 text-sm">
            정산 완료 (차액 없음)
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">총 건수</p>
          <p className="text-base sm:text-lg font-bold number-display">
            {expenses.length}건
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1 align-middle" />
            {TRAVELERS.minsu.short}
          </p>
          <p className="text-base sm:text-lg font-bold number-display">
            {expenses.filter((e) => e.paid_by === "minsu").length}건
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-neutral-500 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-1 align-middle" />
            {TRAVELERS.dongju.short}
          </p>
          <p className="text-base sm:text-lg font-bold number-display">
            {expenses.filter((e) => e.paid_by === "dongju").length}건
          </p>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
          지출 내역
        </h2>

        {expenses.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-neutral-500 text-sm sm:text-base mb-3">
              아직 등록된 지출이 없습니다
            </p>
            <button
              onClick={openAddModal}
              className="text-sm text-neutral-900 dark:text-white font-medium underline underline-offset-4"
            >
              첫 지출 추가하기
            </button>
          </div>
        ) : (
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
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
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
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-3 btn-primary rounded-lg sm:rounded-xl font-medium active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin mx-auto" />
              ) : editingId ? (
                "수정"
              ) : (
                "추가"
              )}
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
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0"
              className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              통화
            </label>
            <select
              value={form.currency}
              onChange={(e) =>
                setForm({ ...form, currency: e.target.value as "KRW" | "INR" })
              }
              className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            >
              <option value="INR">INR (루피)</option>
              <option value="KRW">KRW (원)</option>
            </select>
          </div>
        </div>

        {/* Paid by */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
            결제자
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["minsu", "dongju"] as TravelerId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setForm({ ...form, paid_by: id })}
                className={`px-3 py-2.5 rounded-lg sm:rounded-xl text-sm font-medium border transition-all active:scale-[0.98] ${
                  form.paid_by === id
                    ? id === "minsu"
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-purple-500 bg-purple-500/10 text-purple-400"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {TRAVELERS[id].short}
              </button>
            ))}
          </div>
        </div>

        {/* Split type */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
            분할 방식
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "equal", label: "반반" },
                { key: "full_payer", label: "본인 부담" },
                { key: "full_other", label: "상대 부담" },
              ] as { key: FormData["split_type"]; label: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setForm({ ...form, split_type: opt.key })}
                className={`px-2 py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border transition-all active:scale-[0.98] ${
                  form.split_type === opt.key
                    ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
            날짜
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
          />
        </div>

        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
            카테고리
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as SharedExpense["category"],
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
  expense: SharedExpense;
  onEdit: (expense: SharedExpense) => void;
  onDelete: (id: string) => void;
}) {
  const cat = categoryConfig[expense.category];
  const IconComp = cat?.icon || MoreHorizontal;
  const payer = TRAVELERS[expense.paid_by];
  const isMinsu = expense.paid_by === "minsu";

  const splitLabel =
    expense.split_type === "equal"
      ? "반반"
      : expense.split_type === "full_payer"
        ? "본인"
        : "상대";

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
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              isMinsu
                ? "bg-blue-500/10 text-blue-400"
                : "bg-purple-500/10 text-purple-400"
            }`}
          >
            {payer.short}
          </span>
          {expense.split_type !== "equal" && (
            <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded font-medium">
              {splitLabel}
            </span>
          )}
          <span className="text-[10px] sm:text-xs text-neutral-400">
            {cat?.label || "기타"}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="font-semibold text-sm sm:text-base number-display">
          {expense.currency === "KRW" ? "₩" : "₹"}
          {expense.amount.toLocaleString()}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(expense.id);
        }}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-red-100 dark:hover:bg-red-950/30 hover:text-red-500 flex items-center justify-center transition-all active:scale-95 shrink-0"
        title="삭제"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
