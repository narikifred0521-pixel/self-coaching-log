/**
 * セルフコーチングログ — Home
 * 今週の記録 / 過去週一覧 / エクスポートへのナビゲーション
 * Design: Field Note (Warm Analog Digital)
 * Color: Cream #FAFAF7, Terracotta #C1785A, Forest #4A7C59, Charcoal #2D2D2D
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, ChevronRight, Download, Trash2, BookOpen } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import { getThisMonday, buildWeekRange } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function Home() {
  const { weeks, createWeek, removeWeek, setCurrentWeekId } = useWeek();
  const [, navigate] = useLocation();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const thisMonday = getThisMonday();
  const thisWeek = weeks.find((w) => w.startDate === thisMonday);

  const handleOpenWeek = (id: string) => {
    setCurrentWeekId(id);
    navigate(`/week/${id}`);
  };

  const handleCreateThisWeek = () => {
    const w = createWeek(thisMonday);
    navigate(`/week/${w.id}`);
  };

  const handleDelete = (id: string) => {
    removeWeek(id);
    setConfirmDelete(null);
  };

  const pastWeeks = weeks.filter((w) => w.startDate !== thisMonday);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* ヘッダー */}
      <header className="px-4 pt-10 pb-5">
        <p className="text-xs font-medium text-[#C1785A] tracking-widest uppercase mb-1">
          Self Coaching Log
        </p>
        <h1 className="text-2xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Noto Serif JP', serif" }}>
          セルフコーチング
          <br />
          ログ
        </h1>
        <p className="mt-2 text-sm text-[#9A9490]">
          週次目標 → 日別ログ → 週次振り返り
        </p>
      </header>

      <main className="max-w-lg mx-auto px-4 space-y-5 pb-10">
        {/* 今週のカード */}
        <section>
          <h2 className="text-xs font-semibold text-[#9A9490] uppercase tracking-wider mb-2 px-1">
            今週の記録
          </h2>
          {thisWeek ? (
            <WeekCard
              week={thisWeek}
              onOpen={() => handleOpenWeek(thisWeek.id)}
              onDelete={() => setConfirmDelete(thisWeek.id)}
              confirmDelete={confirmDelete === thisWeek.id}
              onConfirmDelete={() => handleDelete(thisWeek.id)}
              onCancelDelete={() => setConfirmDelete(null)}
              highlight
            />
          ) : (
            <button
              type="button"
              onClick={handleCreateThisWeek}
              className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl border-2 border-dashed border-[#D9D4CC] text-[#C1785A] hover:border-[#C1785A] hover:bg-[#FDF7F4] transition active:scale-98"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">今週（{buildWeekRange(thisMonday)}）を作成</span>
            </button>
          )}
        </section>

        {/* 過去週一覧 */}
        {pastWeeks.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-[#9A9490] uppercase tracking-wider mb-2 px-1">
              過去の記録
            </h2>
            <div className="space-y-2">
              {pastWeeks.map((w) => (
                <WeekCard
                  key={w.id}
                  week={w}
                  onOpen={() => handleOpenWeek(w.id)}
                  onDelete={() => setConfirmDelete(w.id)}
                  confirmDelete={confirmDelete === w.id}
                  onConfirmDelete={() => handleDelete(w.id)}
                  onCancelDelete={() => setConfirmDelete(null)}
                />
              ))}
            </div>
          </section>
        )}

        {/* エクスポートボタン */}
        {weeks.length > 0 && (
          <section>
            <button
              type="button"
              onClick={() => navigate("/export")}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border border-[#E8E3DC] bg-white text-[#5A5550] hover:border-[#C1785A] hover:text-[#C1785A] transition active:scale-95"
            >
              <div className="flex items-center gap-2">
                <Download size={16} />
                <span className="text-sm font-medium">エクスポート</span>
              </div>
              <ChevronRight size={16} className="text-[#C4BFB9]" />
            </button>
          </section>
        )}

        {/* 空状態 */}
        {weeks.length === 0 && (
          <div className="text-center py-12 text-[#9A9490]">
            <BookOpen size={40} className="mx-auto mb-3 text-[#D9D4CC]" />
            <p className="text-sm">まだ記録がありません</p>
            <p className="text-xs mt-1">「今週を作成」から始めましょう</p>
          </div>
        )}
      </main>
    </div>
  );
}

interface WeekCardProps {
  week: { id: string; weekRange: string; dailyLogs: Array<{ flowState: string; rating: string }> };
  onOpen: () => void;
  onDelete: () => void;
  confirmDelete: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  highlight?: boolean;
}

function WeekCard({
  week,
  onOpen,
  onDelete,
  confirmDelete,
  onConfirmDelete,
  onCancelDelete,
  highlight,
}: WeekCardProps) {
  const flowCount = week.dailyLogs.filter((d) => d.flowState === "Flow").length;
  const filledDays = week.dailyLogs.filter((d) => d.flowState !== "").length;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white overflow-hidden transition-all",
        highlight ? "border-[#C1785A]/50 shadow-sm" : "border-[#E8E3DC]"
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-[#F5F3EE] transition"
      >
        <div>
          <p className="text-sm font-semibold text-[#2D2D2D]">{week.weekRange}</p>
          {filledDays > 0 && (
            <p className="text-xs text-[#9A9490] mt-0.5">
              🌊 Flow {flowCount}/{filledDays}日
            </p>
          )}
        </div>
        <ChevronRight size={16} className="text-[#C4BFB9]" />
      </button>

      {/* 削除 */}
      {confirmDelete ? (
        <div className="flex border-t border-[#E8E3DC]">
          <button
            type="button"
            onClick={onCancelDelete}
            className="flex-1 py-2.5 text-xs text-[#9A9490] hover:bg-[#F5F3EE] transition"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            className="flex-1 py-2.5 text-xs text-red-500 hover:bg-red-50 transition border-l border-[#E8E3DC]"
          >
            削除する
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-1 py-2 border-t border-[#E8E3DC] text-xs text-[#C4BFB9] hover:text-red-400 hover:bg-[#FFF5F5] transition"
        >
          <Trash2 size={12} />
          削除
        </button>
      )}
    </div>
  );
}
