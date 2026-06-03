/**
 * セルフコーチングログ — エクスポートユーティリティ
 * CSV / Markdown / TXT / クリップボードコピー
 */

import type { WeekLog, DailyLog } from "./types";

const HABIT_LABEL: Record<string, string> = {
  done: "⭕️",
  skip: "❌",
  "": "未入力",
};

const FLOW_LABEL: Record<string, string> = {
  Flow: "Flow",
  NonFlow: "NonFlow",
  "": "未入力",
};

function dailyToMarkdown(d: DailyLog): string {
  return `### ${d.date}(${d.weekday})

**【非認知】**
- 感情: ${d.emotion || "未入力"}
- どう動いた: ${d.action || "未入力"}
- Flow状態: ${FLOW_LABEL[d.flowState]}

**【認知・習慣】**
- 瞑想: ${HABIT_LABEL[d.meditation]}
- 体重測定: ${HABIT_LABEL[d.weightChecked]}
- 評価: ${d.rating || "未入力"}
- 理由: ${d.reason || "未入力"}
`;
}

export function weekToMarkdown(week: WeekLog): string {
  const lines: string[] = [
    `# ${week.weekRange} セルフコーチングログ`,
    "",
    "## 🚩 長期目標",
    week.longTermGoals || "（未入力）",
    "",
    "## 🚩 中期目標",
    week.midTermGoals || "（未入力）",
    "",
    "## 🚩 短期目標",
    week.shortTermGoals || "（未入力）",
    "",
    "## 🧘 Flow状態を目指す理由",
    week.flowReason || "（未入力）",
    "",
    "## 日別ログ",
    "",
    ...week.dailyLogs.map(dailyToMarkdown),
    "## 週次振り返り",
    week.weeklyReview || "（未入力）",
  ];
  return lines.join("\n");
}

export function weekToTxt(week: WeekLog): string {
  return weekToMarkdown(week).replace(/[#*`]/g, "").replace(/\n{3,}/g, "\n\n");
}

export function weeksToCsv(weeks: WeekLog[]): string {
  const header = [
    "weekRange",
    "date",
    "weekday",
    "emotion",
    "action",
    "flowState",
    "meditation",
    "weightChecked",
    "rating",
    "reason",
    "weightKg",
    "weeklyReview",
  ].join(",");

  const rows = weeks.flatMap((w) =>
    w.dailyLogs.map((d) =>
      [
        csvCell(w.weekRange),
        csvCell(d.date),
        csvCell(d.weekday),
        csvCell(d.emotion),
        csvCell(d.action),
        csvCell(FLOW_LABEL[d.flowState]),
        csvCell(HABIT_LABEL[d.meditation]),
        csvCell(HABIT_LABEL[d.weightChecked]),
        csvCell(d.rating || "未入力"),
        csvCell(d.reason),
        csvCell(d.weightKg != null ? String(d.weightKg) : ""),
        csvCell(w.weeklyReview),
      ].join(",")
    )
  );

  return [header, ...rows].join("\n");
}

function csvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function downloadFile(content: string, filename: string, mime: string): void {
  const bom = mime.includes("csv") ? "\uFEFF" : "";
  const blob = new Blob([bom + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
