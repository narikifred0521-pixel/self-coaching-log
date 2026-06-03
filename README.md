# 📓 セルフコーチングログ

> 日記ではなく、目標達成のための「週次目標 → 日別ログ → 週次振り返り」を記録するセルフコーチングPWAアプリ

[![License: MIT](https://img.shields.io/badge/License-MIT-C1785A.svg)](./LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-4A7C59.svg)](#pwa-iphone対応)

---

## 概要

このアプリは、日々の出来事をただ記録する日記ではなく、**長期・中期・短期目標に対して、感情・行動・Flow状態・習慣・認知的な振り返りを記録し、週次で自己理解と改善につなげる**ことを目的としています。

モルック、仕事、生活、起業準備など複数の領域を横断して、自分の行動パターンを把握するために設計されています。

---

## 機能一覧

| カテゴリ | 機能 |
|---|---|
| 週管理 | 週の作成・削除・一覧表示 |
| 目標入力 | 長期・中期・短期目標の入力（週ごとに管理） |
| Flowメモ | Flow状態を目指す理由のメモ欄 |
| 日別ログ | 感情・行動・Flow/NonFlow・瞑想・体重測定・評価・理由を入力 |
| 習慣チェック | 瞑想・体重測定を⭕️/❌/未入力で選択 |
| 評価 | S/A/B/C/D/未入力で選択 |
| 週次サマリー | Flow率・瞑想率・体重測定率・評価分布を自動集計 |
| 週次振り返り | フリーテキストで週の振り返りを記録 |
| ローカル保存 | データはブラウザのlocalStorageに保存（外部送信なし） |
| エクスポート | CSV・Markdown・TXT形式でダウンロード |
| クリップボード | 1週間分をコピー（AIへの振り返り入力用） |
| PWA対応 | iPhoneのホーム画面に追加してアプリとして使用可能 |

---

## スクリーンショット

> iPhoneで毎日入力しやすいシンプルなUI。白背景ベースの「フィールドノート」デザイン。

---

## PWA / iPhone対応

iPhoneのSafariで開き、「共有」→「ホーム画面に追加」でアプリとして使用できます。

- ホーム画面アイコン対応
- スタンドアロン表示（URLバー非表示）
- テーマカラー設定済み（テラコッタ #C1785A）

---

## 技術構成

| 項目 | 内容 |
|---|---|
| フレームワーク | React 19 + TypeScript |
| スタイリング | Tailwind CSS 4 + shadcn/ui |
| ルーティング | Wouter |
| データ保存 | localStorage（ブラウザ内、外部送信なし） |
| PWA | manifest.json + apple-touch-icon |
| ビルドツール | Vite |
| フォント | Noto Serif JP / Noto Sans JP / DM Sans |

---

## データ構造

### 週データ (`WeekLog`)

```typescript
interface WeekLog {
  id: string;
  weekRange: string;    // "2/2-2/8"
  startDate: string;    // "YYYY-MM-DD"
  longTermGoals: string;
  midTermGoals: string;
  shortTermGoals: string;
  flowReason: string;
  dailyLogs: DailyLog[];
  weeklyReview: string;
  createdAt: string;
  updatedAt: string;
}
```

### 日別データ (`DailyLog`)

```typescript
interface DailyLog {
  date: string;
  weekday: string;
  emotion: string;
  action: string;
  flowState: "Flow" | "NonFlow" | "";
  meditation: "done" | "skip" | "";
  weightChecked: "done" | "skip" | "";
  rating: "S" | "A" | "B" | "C" | "D" | "";
  reason: string;
  weightKg?: number | null;  // 将来拡張用
}
```

---

## ローカル開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build
```

---

## 将来の拡張予定

このアプリはシンプルなlocalStorageベースから始め、以下の拡張を想定した設計になっています。

- 体重の数値入力・7日平均・推移グラフ
- NonFlowになりやすい感情の一覧化・キーワード集計
- GitHubやクラウドへのバックアップ
- iOSネイティブアプリ化

---

## プライバシー

このアプリはすべてのデータをブラウザのlocalStorageにのみ保存します。外部サーバーへのデータ送信は一切行いません。

---

## ライセンス

[MIT License](./LICENSE)
