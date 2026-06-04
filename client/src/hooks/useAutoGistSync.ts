/**
 * useAutoGistSync
 * - weeksが変更されるたびに、debounce（3秒）してGistへ自動push
 * - トークンが未設定の場合は何もしない
 * - 同期中・エラーはコンソールのみ（UIをブロックしない）
 */

import { useEffect, useRef } from "react";
import type { WeekLog } from "@/lib/types";
import { getGistToken, pushToGist } from "@/lib/gist";

const DEBOUNCE_MS = 3000;

export function useAutoGistSync(weeks: WeekLog[]) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountRef = useRef(true);

  useEffect(() => {
    // 初回マウント時はスキップ（読み込み直後に不要なpushをしない）
    if (isMountRef.current) {
      isMountRef.current = false;
      return;
    }

    if (!getGistToken()) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await pushToGist(weeks);
        console.info("[AutoSync] Gistへ自動保存しました");
      } catch (e) {
        console.warn("[AutoSync] Gist自動保存に失敗:", e);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [weeks]);
}
