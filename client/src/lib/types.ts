/**
 * セルフコーチングログ — データ型定義
 * Design: Field Note (Warm Analog Digital)
 * 将来的な体重数値・GitHub連携・クラウド保存への拡張を考慮した設計
 */

export type FlowState = "Flow" | "NonFlow" | "";
export type HabitCheck = "done" | "skip" | "";
export type Rating = "S" | "A" | "B" | "C" | "D" | "";

export interface DailyLog {
  date: string;       // "YYYY-MM-DD"
  weekday: string;    // "月" | "火" | ...
  // 非認知
  emotion: string;
  action: string;
  flowState: FlowState;
  // 認知・習慣
  meditation: HabitCheck;
  weightChecked: HabitCheck;
  rating: Rating;
  reason: string;
  // 将来拡張用
  weightKg?: number | null;
}

export interface WeekLog {
  id: string;           // nanoid
  weekRange: string;    // "2/2-2/8"
  startDate: string;    // "YYYY-MM-DD" (週の月曜日)
  longTermGoals: string;
  midTermGoals: string;
  shortTermGoals: string;
  flowReason: string;
  dailyLogs: DailyLog[];
  weeklyReview: string;
  createdAt: string;
  updatedAt: string;
}
