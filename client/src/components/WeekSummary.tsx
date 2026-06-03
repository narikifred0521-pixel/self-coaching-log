/**
 * セルフコーチングログ — WeekSummary
 * 週次の Flow率・瞑想率・体重測定率・評価分布を表示
 */

import type { WeekLog } from "@/lib/types";

interface WeekSummaryProps {
  week: WeekLog;
}

function rate(logs: WeekLog["dailyLogs"], key: "flowState" | "meditation" | "weightChecked", match: string) {
  const filled = logs.filter((d) => d[key] !== "");
  if (filled.length === 0) return null;
  const count = filled.filter((d) => d[key] === match).length;
  return Math.round((count / filled.length) * 100);
}

function ratingDist(logs: WeekLog["dailyLogs"]) {
  const counts: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  logs.forEach((d) => {
    if (d.rating && d.rating in counts) counts[d.rating]++;
  });
  return counts;
}

export function WeekSummary({ week }: WeekSummaryProps) {
  const logs = week.dailyLogs;
  const flowRate = rate(logs, "flowState", "Flow");
  const meditationRate = rate(logs, "meditation", "done");
  const weightRate = rate(logs, "weightChecked", "done");
  const dist = ratingDist(logs);
  const hasRating = Object.values(dist).some((v) => v > 0);

  if (flowRate === null && meditationRate === null && weightRate === null && !hasRating) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#E8E3DC] bg-[#F5F3EE] px-4 py-3 space-y-2">
      <p className="text-xs font-semibold text-[#9A9490] uppercase tracking-wider">週次サマリー</p>
      <div className="flex flex-wrap gap-3">
        {flowRate !== null && (
          <Chip label="🌊 Flow率" value={`${flowRate}%`} color="#4A7C59" />
        )}
        {meditationRate !== null && (
          <Chip label="🧘 瞑想率" value={`${meditationRate}%`} color="#C1785A" />
        )}
        {weightRate !== null && (
          <Chip label="⚖️ 体重測定率" value={`${weightRate}%`} color="#5A7BA8" />
        )}
      </div>
      {hasRating && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(["S", "A", "B", "C", "D"] as const).map((r) =>
            dist[r] > 0 ? (
              <span
                key={r}
                className="text-xs px-2 py-0.5 rounded-full border border-[#D9D4CC] text-[#5A5550]"
              >
                {r}: {dist[r]}日
              </span>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-[#5A5550]">{label}</span>
      <span className="font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
