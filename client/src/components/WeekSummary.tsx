/**
 * セルフコーチングログ — WeekSummary
 * 週次の Flow率・瞑想率・体重測定率・評価分布（棒グラフ）を表示
 * Design: Field Note (Warm Analog Digital)
 */

import type { WeekLog } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WeekSummaryProps {
  week: WeekLog;
}

function rate(
  logs: WeekLog["dailyLogs"],
  key: "flowState" | "meditation" | "weightChecked",
  match: string
) {
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

const RATING_COLORS: Record<string, string> = {
  S: "#C1785A",
  A: "#D4956A",
  B: "#4A7C59",
  C: "#7BA8C4",
  D: "#C4BFB9",
};

export function WeekSummary({ week }: WeekSummaryProps) {
  const logs = week.dailyLogs;
  const flowRate = rate(logs, "flowState", "Flow");
  const meditationRate = rate(logs, "meditation", "done");
  const weightRate = rate(logs, "weightChecked", "done");
  const dist = ratingDist(logs);
  const hasRating = Object.values(dist).some((v) => v > 0);

  const hasAnyData =
    flowRate !== null || meditationRate !== null || weightRate !== null || hasRating;

  if (!hasAnyData) return null;

  const ratingData = (["S", "A", "B", "C", "D"] as const).map((r) => ({
    name: r,
    count: dist[r],
  }));

  return (
    <div className="rounded-2xl border border-[#E8E3DC] bg-[#F5F3EE] px-4 py-3 space-y-3">
      <p className="text-xs font-semibold text-[#9A9490] uppercase tracking-wider">週次サマリー</p>

      {/* 率バッジ */}
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

      {/* 評価分布グラフ */}
      {hasRating && (
        <div>
          <p className="text-xs text-[#9A9490] mb-1.5">評価分布</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart
              data={ratingData}
              margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
              barCategoryGap="30%"
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9A9490" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#C4BFB9" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #E8E3DC",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#2D2D2D",
                }}
                formatter={(value: number) => [`${value}日`, "日数"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {ratingData.map((entry) => (
                  <Cell key={entry.name} fill={RATING_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
