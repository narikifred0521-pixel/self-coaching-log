/**
 * セルフコーチングログ — DayCard
 * 1日分の入力カード。Field Note デザインテーマ。
 * アクセント: テラコッタ #C1785A / Flow: 深緑 #4A7C59 / NonFlow: テラコッタ
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyLog, FlowState, HabitCheck, Rating } from "@/lib/types";
import { ToggleButtonGroup } from "./ToggleButton";

interface DayCardProps {
  log: DailyLog;
  onChange: (updated: DailyLog) => void;
}

const FLOW_OPTIONS: { value: FlowState; label: string }[] = [
  { value: "Flow", label: "🌊 Flow" },
  { value: "NonFlow", label: "💢 NonFlow" },
  { value: "", label: "未入力" },
];

const HABIT_OPTIONS: { value: HabitCheck; label: string }[] = [
  { value: "done", label: "⭕️" },
  { value: "skip", label: "❌" },
  { value: "", label: "未入力" },
];

const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "S", label: "S" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "", label: "未入力" },
];

export function DayCard({ log, onChange }: DayCardProps) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof DailyLog>(key: K, value: DailyLog[K]) => {
    onChange({ ...log, [key]: value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const hasData =
    log.emotion || log.action || log.flowState || log.meditation || log.weightChecked || log.gym || log.rating;

  const flowColor =
    log.flowState === "Flow"
      ? "text-[#4A7C59]"
      : log.flowState === "NonFlow"
      ? "text-[#C1785A]"
      : "text-[#9A9490]";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-[#FAFAF7] shadow-sm overflow-hidden transition-all duration-200",
        open ? "border-[#C1785A]/40" : "border-[#E8E3DC]"
      )}
    >
      {/* ヘッダー */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#2D2D2D]">
            {log.date.slice(5).replace("-", "/")}
            <span className="ml-1 text-sm font-normal text-[#9A9490]">({log.weekday})</span>
          </span>
          {hasData && (
            <span className="text-xs text-[#9A9490]">
              {log.flowState && (
                <span className={cn("font-medium", flowColor)}>
                  {log.flowState === "Flow" ? "🌊" : "💢"} {log.flowState}
                </span>
              )}
              {log.rating && (
                <span className="ml-2 font-medium text-[#C1785A]">{log.rating}</span>
              )}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={18} className="text-[#9A9490]" />
        ) : (
          <ChevronDown size={18} className="text-[#9A9490]" />
        )}
      </button>

      {/* 展開コンテンツ */}
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#E8E3DC] pt-4">
          {/* 非認知 */}
          <section>
            <h4 className="text-xs font-semibold text-[#9A9490] uppercase tracking-wider mb-2">
              非認知
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#5A5550] mb-1">
                  感情（いつ、どんな感情だったか）
                </label>
                <textarea
                  value={log.emotion}
                  onChange={(e) => update("emotion", e.target.value)}
                  placeholder="例: きつい、焦り（ペア戦で順手が当たらない）"
                  rows={2}
                  className="w-full rounded-xl border border-[#D9D4CC] bg-white px-3 py-2 text-sm text-[#2D2D2D] placeholder:text-[#C4BFB9] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]/30 resize-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A5550] mb-1">
                  どう動いた？
                </label>
                <textarea
                  value={log.action}
                  onChange={(e) => update("action", e.target.value)}
                  placeholder="例: 中途半端に焦りながら投げた"
                  rows={2}
                  className="w-full rounded-xl border border-[#D9D4CC] bg-white px-3 py-2 text-sm text-[#2D2D2D] placeholder:text-[#C4BFB9] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]/30 resize-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A5550] mb-2">
                  Flow or NonFlow?
                </label>
                <ToggleButtonGroup
                  options={FLOW_OPTIONS}
                  value={log.flowState}
                  onChange={(v) => update("flowState", v)}
                />
              </div>
            </div>
          </section>

          {/* 認知・習慣 */}
          <section>
            <h4 className="text-xs font-semibold text-[#9A9490] uppercase tracking-wider mb-2">
              認知・習慣
            </h4>
            <div className="space-y-3">
              <div className="flex flex-wrap items-start gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#5A5550] mb-1">瞥想</label>
                  <ToggleButtonGroup
                    options={HABIT_OPTIONS}
                    value={log.meditation}
                    onChange={(v) => update("meditation", v)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5A5550] mb-1">体重測定</label>
                  <ToggleButtonGroup
                    options={HABIT_OPTIONS}
                    value={log.weightChecked}
                    onChange={(v) => update("weightChecked", v)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5A5550] mb-1">🏋️ジム</label>
                  <ToggleButtonGroup
                    options={HABIT_OPTIONS}
                    value={log.gym}
                    onChange={(v) => update("gym", v)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A5550] mb-1">評価</label>
                <ToggleButtonGroup
                  options={RATING_OPTIONS}
                  value={log.rating}
                  onChange={(v) => update("rating", v)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A5550] mb-1">理由・振り返り</label>
                <textarea
                  value={log.reason}
                  onChange={(e) => update("reason", e.target.value)}
                  placeholder="例: 結構仕事できた。順手はもっと投げたい。"
                  rows={3}
                  className="w-full rounded-xl border border-[#D9D4CC] bg-white px-3 py-2 text-sm text-[#2D2D2D] placeholder:text-[#C4BFB9] focus:outline-none focus:border-[#C1785A] focus:ring-1 focus:ring-[#C1785A]/30 resize-none transition"
                />
              </div>
            </div>
          </section>

          {/* 保存ボタン */}
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95",
              saved
                ? "bg-[#4A7C59] text-white"
                : "bg-[#C1785A] text-white hover:bg-[#A8644A]"
            )}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-1">
                <Check size={16} /> 保存しました
              </span>
            ) : (
              "保存"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
