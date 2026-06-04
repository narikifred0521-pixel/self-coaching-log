/**
 * GistSyncDialog
 * - GitHub Personal Access Tokenの設定
 * - クラウドへ保存（push）
 * - クラウドから読み込み（pull）
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clearGistToken,
  findExistingGist,
  getGistToken,
  pullFromGist,
  pushToGist,
  setGistToken,
  verifyToken,
} from "@/lib/gist";
import { useWeek } from "@/contexts/WeekContext";
import type { WeekLog } from "@/lib/types";
import {
  CheckCircle,
  CloudDownload,
  CloudUpload,
  ExternalLink,
  Loader2,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "token" | "synced";

export default function GistSyncDialog({ open, onOpenChange }: Props) {
  const { weeks, importWeeks } = useWeek();
  const [step, setStep] = useState<Step>("token");
  const [token, setToken] = useState("");
  const [githubUser, setGithubUser] = useState("");
  const [loading, setLoading] = useState<"verify" | "push" | "pull" | null>(null);

  useEffect(() => {
    if (open) {
      const saved = getGistToken();
      if (saved) {
        setToken(saved);
        setStep("synced");
        verifyToken()
          .then((u) => setGithubUser(u))
          .catch(() => {
            setStep("token");
            setGithubUser("");
          });
      } else {
        setStep("token");
        setGithubUser("");
      }
    }
  }, [open]);

  async function handleVerify() {
    if (!token.trim()) return;
    setLoading("verify");
    try {
      setGistToken(token.trim());
      const user = await verifyToken();
      setGithubUser(user);
      await findExistingGist();
      setStep("synced");
      toast.success(`@${user} として接続しました`);
    } catch (e: unknown) {
      clearGistToken();
      toast.error((e as Error).message ?? "トークンの確認に失敗しました");
    } finally {
      setLoading(null);
    }
  }

  async function handlePush() {
    setLoading("push");
    try {
      await pushToGist(weeks);
      toast.success("クラウドに保存しました");
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "保存に失敗しました");
    } finally {
      setLoading(null);
    }
  }

  async function handlePull() {
    setLoading("pull");
    try {
      const data = await pullFromGist();
      if (!Array.isArray(data)) throw new Error("データ形式が不正です");
      importWeeks(data as WeekLog[]);
      toast.success("クラウドから読み込みました");
      onOpenChange(false);
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "読み込みに失敗しました");
    } finally {
      setLoading(null);
    }
  }

  function handleDisconnect() {
    clearGistToken();
    setToken("");
    setGithubUser("");
    setStep("token");
    toast("GitHub連携を解除しました");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <ShieldCheck className="w-5 h-5 text-[#C1785A]" />
            クラウド同期（GitHub Gist）
          </DialogTitle>
          <DialogDescription className="text-xs">
            データをGitHub Gistにバックアップ・同期します。
            <br />
            PCとスマホで同じデータを使えます。
          </DialogDescription>
        </DialogHeader>

        {step === "token" ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="pat" className="text-sm font-medium">
                Personal Access Token
              </Label>
              <Input
                id="pat"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                <a
                  href="https://github.com/settings/tokens/new?scopes=gist&description=self-coaching-log"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 inline-flex items-center gap-0.5"
                >
                  こちら
                  <ExternalLink className="w-3 h-3" />
                </a>
                でトークンを発行（gistスコープのみでOK）
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={!token.trim() || loading === "verify"}
            >
              {loading === "verify" ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              接続する
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>
                <span className="font-semibold">@{githubUser}</span> として接続中
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1"
                onClick={handlePush}
                disabled={!!loading}
              >
                {loading === "push" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CloudUpload className="w-5 h-5 text-[#C1785A]" />
                )}
                <span className="text-xs">クラウドへ保存</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1"
                onClick={handlePull}
                disabled={!!loading}
              >
                {loading === "pull" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CloudDownload className="w-5 h-5 text-[#4A7C59]" />
                )}
                <span className="text-xs">クラウドから読込</span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              「クラウドから読込」は現在のデータを上書きします
            </p>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={handleDisconnect}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              連携を解除
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
