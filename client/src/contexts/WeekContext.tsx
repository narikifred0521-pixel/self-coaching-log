/**
 * セルフコーチングログ — 週データ管理コンテキスト
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import type { WeekLog } from "@/lib/types";
import {
  loadAllWeeks,
  saveWeek,
  deleteWeek,
  buildEmptyDailyLogs,
  buildWeekRange,
  getThisMonday,
} from "@/lib/storage";

interface WeekContextValue {
  weeks: WeekLog[];
  currentWeekId: string | null;
  setCurrentWeekId: (id: string | null) => void;
  createWeek: (startDate?: string) => WeekLog;
  updateWeek: (week: WeekLog) => void;
  removeWeek: (id: string) => void;
  getWeek: (id: string) => WeekLog | undefined;
}

const WeekContext = createContext<WeekContextValue | null>(null);

export function WeekProvider({ children }: { children: React.ReactNode }) {
  const [weeks, setWeeks] = useState<WeekLog[]>(() => loadAllWeeks());
  const [currentWeekId, setCurrentWeekId] = useState<string | null>(null);

  // 初回: 今週のデータがあれば自動選択
  useEffect(() => {
    const monday = getThisMonday();
    const thisWeek = weeks.find((w) => w.startDate === monday);
    if (thisWeek) setCurrentWeekId(thisWeek.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createWeek = useCallback(
    (startDate?: string): WeekLog => {
      const sd = startDate ?? getThisMonday();
      const week: WeekLog = {
        id: nanoid(),
        weekRange: buildWeekRange(sd),
        startDate: sd,
        longTermGoals: "",
        midTermGoals: "",
        shortTermGoals: "",
        flowReason: "",
        dailyLogs: buildEmptyDailyLogs(sd),
        weeklyReview: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveWeek(week);
      setWeeks(loadAllWeeks());
      return week;
    },
    []
  );

  const updateWeek = useCallback((week: WeekLog) => {
    saveWeek(week);
    setWeeks(loadAllWeeks());
  }, []);

  const removeWeek = useCallback((id: string) => {
    deleteWeek(id);
    setWeeks(loadAllWeeks());
  }, []);

  const getWeek = useCallback(
    (id: string) => weeks.find((w) => w.id === id),
    [weeks]
  );

  return (
    <WeekContext.Provider
      value={{
        weeks,
        currentWeekId,
        setCurrentWeekId,
        createWeek,
        updateWeek,
        removeWeek,
        getWeek,
      }}
    >
      {children}
    </WeekContext.Provider>
  );
}

export function useWeek() {
  const ctx = useContext(WeekContext);
  if (!ctx) throw new Error("useWeek must be used inside WeekProvider");
  return ctx;
}
