import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SharedExpense {
  id: string;
  description: string;
  amount: number;
  currency: "KRW" | "INR";
  paid_by: "minsu" | "dongju";
  split_type: "equal" | "full_payer" | "full_other";
  category: "food" | "transport" | "activity" | "shopping" | "accommodation" | "other";
  date: string;
  created_at: string;
}

export const TRAVELERS = {
  minsu: { name: "김민수", short: "민수" },
  dongju: { name: "임동주", short: "동주" },
} as const;

export type TravelerId = keyof typeof TRAVELERS;
