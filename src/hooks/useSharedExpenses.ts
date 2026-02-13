"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase, SharedExpense, TRAVELERS, TravelerId } from "@/lib/supabase";
import { exchangeRate } from "@/lib/tripData";

const TABLE = "shared_expenses";

export function useSharedExpenses() {
  const [expenses, setExpenses] = useState<SharedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setExpenses(data || []);
      }
      setLoading(false);
    };

    fetchExpenses();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("shared_expenses_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setExpenses((prev) => {
              if (prev.some((e) => e.id === (payload.new as SharedExpense).id)) return prev;
              return [payload.new as SharedExpense, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            setExpenses((prev) =>
              prev.map((e) =>
                e.id === (payload.new as SharedExpense).id
                  ? (payload.new as SharedExpense)
                  : e
              )
            );
          } else if (payload.eventType === "DELETE") {
            setExpenses((prev) =>
              prev.filter((e) => e.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addExpense = useCallback(
    async (expense: Omit<SharedExpense, "id" | "created_at">) => {
      const { error } = await supabase.from(TABLE).insert(expense);
      if (error) throw error;
    },
    []
  );

  const updateExpense = useCallback(
    async (id: string, updates: Partial<Omit<SharedExpense, "id" | "created_at">>) => {
      const { error } = await supabase.from(TABLE).update(updates).eq("id", id);
      if (error) throw error;
    },
    []
  );

  const deleteExpense = useCallback(async (id: string) => {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  }, []);

  // Settlement calculation
  const settlement = useMemo(() => {
    const toKrw = (amount: number, currency: string) =>
      currency === "KRW" ? amount : amount * exchangeRate.INR_TO_KRW;

    let minsuPaid = 0;
    let dongjuPaid = 0;
    let minsuOwes = 0;
    let dongjuOwes = 0;

    for (const e of expenses) {
      const krw = toKrw(e.amount, e.currency);

      if (e.paid_by === "minsu") {
        minsuPaid += krw;
      } else {
        dongjuPaid += krw;
      }

      if (e.split_type === "equal") {
        minsuOwes += krw / 2;
        dongjuOwes += krw / 2;
      } else if (e.split_type === "full_payer") {
        if (e.paid_by === "minsu") {
          minsuOwes += krw;
        } else {
          dongjuOwes += krw;
        }
      } else if (e.split_type === "full_other") {
        if (e.paid_by === "minsu") {
          dongjuOwes += krw;
        } else {
          minsuOwes += krw;
        }
      }
    }

    // balance = 민수가 낸 금액 - 민수가 부담할 금액
    // 양수면 동주→민수 이체, 음수면 민수→동주 이체
    const balance = minsuPaid - minsuOwes;
    const totalSpent = minsuPaid + dongjuPaid;

    return {
      totalSpent,
      minsuPaid,
      dongjuPaid,
      minsuOwes,
      dongjuOwes,
      balance,
      // 누가 누구에게 얼마
      transferFrom: balance > 0 ? "dongju" as TravelerId : "minsu" as TravelerId,
      transferTo: balance > 0 ? "minsu" as TravelerId : "dongju" as TravelerId,
      transferAmount: Math.abs(balance),
    };
  }, [expenses]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    settlement,
  };
}
