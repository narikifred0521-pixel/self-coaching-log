/**
 * セルフコーチングログ — WeekPage
 * 週の目標・Flowメモ・7日分ログ・週次振り返りを表示・編集
 * Design: Field Note (Warm Analog Digital)
 */

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import type { WeekLog, DailyLog } from "@/lib/types";
import { useWeek } from "@/contexts/WeekContext";
import { DayCard } from "@/components/DayCard";
import { WeekSummary } from "@/components/WeekSummary";

interface WeekPageProps {
  weekId: string;
}

export default function WeekPage({ weekId }: WeekPageProps) {
  const { getWeek, updateWeek } = useWeek();
  const [, navigate] = useLocation();
  const [week, setWeek] = useState<WeekLog | null>(null);

  useEffect(() => {
    const w = getWeek(weekId);
    if (w) setWeek(w);
    else navigate("/");
  }, [weekId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!week) return null;

  const update = <K extends keyof WeekLog>(key: K, value: WeekLog[K]) => {
    const updated = { ...week, [key]: value };
    setWeek(updated);
    updateWeek(updated);
  };

  const updateDay = (idx: number, log: DailyLog) => {
    const dailyLogs = [...week.dailyLogs];
    dailyLogs[idx] = log;
    update("dailyLogs", dailyLogs);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-[#FAFAF7]/95 backdrop-blur border-b border-[#E8E3DC] px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="p-1.5 rounded-lg text-[#9A9490] hover:text-[#C1785A] hover:bg-[#F5F3EE] transition active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-xs text-[#9A9490]">週次ログ</p>
          <h1 className="text-base font-semibold text-[#2D2D2D]">{week.weekRange}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* 週次サマリー */}
        <WeekSummary week={week} />

        {/* 目標セクション */}
        <section className="rounded-2xl border border-[#E8E3DC] bg-white p-4 space-y-3">
          <h2 className="text-sm font-semibold text-[#C1785A]">🚩 目標</h2>
          <GoalField
            label="長期目標（5年・2030まで）"
            value={week.longTermGoals}
            onChange={(v) => update("longTermGoals", v)}
            placeholder={"例:\n・FIする、資産1000万突破\n・モルックを教えることができる人になる"}
          />
          <GoalField
            label="中期目標（1年・2026年）"
            value={week.midTermGoals}
            onChange={(v) => update("midTermGoals", v)}
            placeholder={"例:\n・モルックで日本一になる\n・起業の準備をする"}
          />
          <GoalField
            label="短期目標（今月）"
            value={week.shortTermGoals}
            onChange={(v) => update("shortTermGoals", v)}
            placeholder={"例:\n・テイクバックを取る順手を安定させる\n・メンタルの継続強化"}
          />
        </section>

        {/* Flow状態の理由 */}
        <section className="rounded-2xl border border-[#E8E3DC] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#4A7C59] mb-2">🧘 Flow状態を目指す理由</h2>
          <textarea
            value={week.flowReason}
            onChange={(e) => update("flowReason", e.target.value)}
            placeholder={"例:\n・自分のメンタルを知れる\n・ブレないパフォーマンスができる\n・仲間を傷つけない"}
            rows={3}
            className="w-full rounded-xl border border-[#D9D4CC] bg-[#FAFAF7] px-3 py-2 text-sm text-[#2D2D2D] placeholder:text-[#C4BFB9] focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]/30 resize-none transition"
          />
        </section>

        {/* 日別ログ */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-[#5A5550] px-1">📅 日別ログ</h2>
          {week.dailyLogs.map((log, idx) => (
            <DayCard
              key={log.date}
              log={log}
              onChange={(updated) => updateDay(idx, updated)}
            />
          ))}
        </section>

        {/* 週次振り返り */}
        <section className="rounded-2xl border border-[#E8E3DC] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#C1785A] mb-2">📝 週次振り返り</h2>
          <textarea
            value={week.weeklyReview}
            onChange={(e) => update("weeklyReview", e.target.value)}
            placeholder="今週を振り返って..."
            rows={5}
            className="w-full rounded-xl border border-[#D9D4CC] bg-[#FAFAF7] px-3 py-2 text-sm text-[#2D2D2D] placeholder:text-[#C4BFB9] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]/30 resize-none transition"
          />
        </section>

        <div className="h-8" />
      </main>
    </div>
  );
}

function GoalField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#9A9490] mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-[#D9D4CC] bg-[#FAFAF7] px-3 py-2 text-sm text-[#2D2D2D] placeholder:text-[#C4BFB9] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]/30 resize-none transition"
      />
    </div>
  );
}
