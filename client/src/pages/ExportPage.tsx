/**
 * セルフコーチングログ — ExportPage
 * CSV / Markdown / TXT / クリップボードコピー
 */

import { useState } from "react";
import { ArrowLeft, Download, Copy, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useWeek } from "@/contexts/WeekContext";
import { weekToMarkdown, weekToTxt, weeksToCsv, downloadFile, copyToClipboard } from "@/lib/export";
import { cn } from "@/lib/utils";

export default function ExportPage() {
  const { weeks } = useWeek();
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<string>(weeks[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  const selectedWeek = weeks.find((w) => w.id === selectedId);

  const handleCopy = async () => {
    if (!selectedWeek) return;
    await copyToClipboard(weekToMarkdown(selectedWeek));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadMd = () => {
    if (!selectedWeek) return;
    downloadFile(weekToMarkdown(selectedWeek), `${selectedWeek.weekRange}.md`, "text/markdown");
  };

  const handleDownloadTxt = () => {
    if (!selectedWeek) return;
    downloadFile(weekToTxt(selectedWeek), `${selectedWeek.weekRange}.txt`, "text/plain");
  };

  const handleDownloadCsv = () => {
    downloadFile(weeksToCsv(weeks), "self-coaching-log.csv", "text/csv");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <header className="sticky top-0 z-10 bg-[#FAFAF7]/95 backdrop-blur border-b border-[#E8E3DC] px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="p-1.5 rounded-lg text-[#9A9490] hover:text-[#C1785A] hover:bg-[#F5F3EE] transition active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-xs text-[#9A9490]">データ出力</p>
          <h1 className="text-base font-semibold text-[#2D2D2D]">エクスポート</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {weeks.length === 0 ? (
          <div className="text-center py-16 text-[#9A9490]">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">記録がまだありません</p>
          </div>
        ) : (
          <>
            {/* 週選択 */}
            <section className="rounded-2xl border border-[#E8E3DC] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#5A5550] mb-2">対象の週を選択</h2>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-xl border border-[#D9D4CC] bg-[#FAFAF7] px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:border-[#C1785A]"
              >
                {weeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.weekRange}
                  </option>
                ))}
              </select>
            </section>

            {/* 週単位エクスポート */}
            <section className="rounded-2xl border border-[#E8E3DC] bg-white p-4 space-y-3">
              <h2 className="text-sm font-semibold text-[#5A5550]">週単位で出力</h2>
              <ExportButton
                icon={<Copy size={16} />}
                label={copied ? "コピーしました ✓" : "1週間分をコピー（AI振り返り用）"}
                onClick={handleCopy}
                active={copied}
              />
              <ExportButton
                icon={<Download size={16} />}
                label="Markdown (.md) でダウンロード"
                onClick={handleDownloadMd}
              />
              <ExportButton
                icon={<Download size={16} />}
                label="テキスト (.txt) でダウンロード"
                onClick={handleDownloadTxt}
              />
            </section>

            {/* 全週CSVエクスポート */}
            <section className="rounded-2xl border border-[#E8E3DC] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#5A5550] mb-3">全週まとめて出力</h2>
              <ExportButton
                icon={<Download size={16} />}
                label="全データをCSVでダウンロード"
                onClick={handleDownloadCsv}
              />
              <p className="mt-2 text-xs text-[#9A9490]">
                全{weeks.length}週分のデータをExcel等で開けるCSV形式で出力します。
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function ExportButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 active:scale-95",
        active
          ? "bg-[#4A7C59] border-[#4A7C59] text-white"
          : "bg-[#FAFAF7] border-[#D9D4CC] text-[#5A5550] hover:border-[#C1785A] hover:text-[#C1785A]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
