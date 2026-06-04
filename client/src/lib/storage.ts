/**
 * セルフコーチングログ — localStorage 永続化ユーティリティ
 * 将来的なGitHub連携・クラウド保存への差し替えを想定したアダプタ設計
 */

import type { WeekLog, DailyLog } from "./types";

const STORAGE_KEY = "self-coaching-log-v1";

export function loadAllWeeks(): WeekLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WeekLog[];
  } catch {
    return [];
  }
}

export function saveAllWeeks(weeks: WeekLog[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
}

export function saveWeek(week: WeekLog): void {
  const weeks = loadAllWeeks();
  const idx = weeks.findIndex((w) => w.id === week.id);
  const updated = { ...week, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    weeks[idx] = updated;
  } else {
    weeks.unshift(updated);
  }
  saveAllWeeks(weeks);
}

export function deleteWeek(id: string): void {
  const weeks = loadAllWeeks().filter((w) => w.id !== id);
  saveAllWeeks(weeks);
}

export function getWeekById(id: string): WeekLog | undefined {
  return loadAllWeeks().find((w) => w.id === id);
}

/** 7日分の空DailyLogを生成 */
export function buildEmptyDailyLogs(startDate: string): DailyLog[] {
  const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      weekday: WEEKDAYS[d.getDay()],
      emotion: "",
      action: "",
      flowState: "",
      meditation: "",
      weightChecked: "",
      gym: "",
      rating: "",
      reason: "",
      weightKg: null,
    };
  });
}

/** 週範囲文字列を生成 "M/D-M/D" */
export function buildWeekRange(startDate: string): string {
  const start = new Date(startDate);
  const end = new Date(startDate);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(start)}-${fmt(end)}`;
}

/** 直近の月曜日を返す (YYYY-MM-DD) */
export function getThisMonday(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  today.setDate(today.getDate() + diff);
  return today.toISOString().slice(0, 10);
}
