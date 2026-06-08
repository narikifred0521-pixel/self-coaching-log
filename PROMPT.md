# セルフコーチングログ — AI引き継ぎプロンプト

このファイルは、他のAIがこのリポジトリのコードを理解・拡張するための引き継ぎ情報です。

---

## このアプリの目的

個人用のセルフコーチングPWAアプリです。日記ではなく、**「週次目標 → 日別ログ → 週次振り返り」** のサイクルで自己理解と行動改善を記録することを目的としています。

モルック（スポーツ）・仕事・生活・起業準備など複数の領域を横断して、自分の行動パターンを把握するために設計されています。

---

## 技術構成

| 項目 | 内容 |
|---|---|
| フレームワーク | React 19 + TypeScript |
| スタイリング | Tailwind CSS 4 + shadcn/ui |
| ルーティング | Wouter |
| データ保存 | localStorage（ブラウザ内）+ GitHub Gist（クラウド同期） |
| PWA | manifest.json + apple-touch-icon |
| ビルドツール | Vite |
| デプロイ | GitHub Pages（GitHub Actions自動デプロイ） |
| フォント | Noto Serif JP / Noto Sans JP / DM Sans |

---

## ディレクトリ構成

```
client/
  src/
    pages/
      Home.tsx          ← ホーム（週一覧・新規作成・クラウド同期）
      WeekPage.tsx      ← 週ページ（目標入力・日別ログ・週次振り返り）
      ExportPage.tsx    ← エクスポートページ（CSV/Markdown/TXT）
    components/
      DayCard.tsx       ← 日別ログカード（アコーディオン形式）
      WeekSummary.tsx   ← 週次サマリー（Flow率・習慣率・評価グラフ）
      GistSyncDialog.tsx← GitHub Gist同期ダイアログ
      ToggleButton.tsx  ← 共通トグルボタングループ
    contexts/
      WeekContext.tsx   ← 週データのグローバル状態管理
    hooks/
      useAutoGistSync.ts← 自動Gist同期フック（保存後3秒でpush）
    lib/
      types.ts          ← 型定義（DailyLog / WeekLog）
      storage.ts        ← localStorage読み書きユーティリティ
      gist.ts           ← GitHub Gist API連携
      export.ts         ← CSV/Markdown/TXTエクスポート
```

---

## データ型定義

### `WeekLog`（週単位のデータ）

```typescript
interface WeekLog {
  id: string;           // nanoid
  weekRange: string;    // "6/1-6/7"
  startDate: string;    // "YYYY-MM-DD"（月曜日）
  longTermGoals: string;
  midTermGoals: string;
  shortTermGoals: string;
  flowReason: string;   // Flow状態を目指す理由
  dailyLogs: DailyLog[];
  weeklyReview: string;
  createdAt: string;
  updatedAt: string;
}
```

### `DailyLog`（日別ログ）

```typescript
type FlowState = "Flow" | "NonFlow" | "";
type HabitCheck = "done" | "skip" | "";
type Rating = "S" | "A" | "B" | "C" | "D" | "";

interface DailyLog {
  date: string;         // "YYYY-MM-DD"
  weekday: string;      // "月" | "火" | ...
  // 非認知セクション
  emotion: string;      // いつ、どんな感情だったか
  action: string;       // どう動いたか
  flowState: FlowState;
  // 認知・習慣セクション
  meditation: HabitCheck;
  weightChecked: HabitCheck;
  gym: HabitCheck;      // ジム行ったか
  rating: Rating;       // 今日の評価
  reason: string;       // 理由・振り返り
  // 将来拡張用
  weightKg?: number | null;
}
```

---

## localStorage のキー

| キー | 内容 |
|---|---|
| `scl_weeks` | `WeekLog[]` の JSON 文字列 |
| `scl_gist_token` | GitHub Personal Access Token |
| `scl_gist_id` | 同期先のGist ID |

---

## GitHub Gist 同期の仕組み

- `client/src/lib/gist.ts` に全ロジックが集約されている
- トークン（gistスコープのみ）をlocalStorageに保存
- 全WeekLogデータを `self-coaching-log.json` という1ファイルのPrivate Gistに保存
- `useAutoGistSync` フックが WeekContext の変化を監視し、3秒のデバウンスで自動push
- 初回接続時は既存Gistを検索して自動でIDを復元する

---

## デザイン哲学

**「フィールドノート」スタイル（Warm Analog Digital）**

- 背景色: クリーム白 `#F5F3EE` / `#FAFAF7`
- アクセントカラー: テラコッタ `#C1785A`（保存ボタン・強調）
- Flow色: フォレストグリーン `#4A7C59`
- テキスト: ウォームブラック `#2D2D2D` / ミュート `#9A9490`
- ボーダー: `#E8E3DC`
- 角丸: `rounded-2xl`（やや大きめ）
- フォント: 見出しに Noto Serif JP、本文に Noto Sans JP / DM Sans

---

## 実装済み機能

- 週の作成・削除・一覧表示
- 長期・中期・短期目標の入力（週ごとに管理）
- Flow状態を目指す理由のメモ欄
- 日別ログ（感情・行動・Flow/NonFlow・瞑想・体重測定・ジム・評価・理由）
- 前週の目標をコピーして新週を作成するボタン
- 週次サマリー（Flow率・瞑想率・体重測定率・ジム率・評価分布棒グラフ）
- 週次振り返りのフリーテキスト入力
- CSV / Markdown / TXT エクスポート
- クリップボードコピー（AIへの振り返り入力用）
- GitHub Gist によるクラウド同期（自動push + 手動pull）
- PWA対応（iPhoneホーム画面追加）
- GitHub Pages への自動デプロイ（GitHub Actions）

---

## 未実装・拡張候補

以下は今後追加が想定される機能です。実装する際はこのリストを参考にしてください。

| 優先度 | 機能 | 概要 |
|---|---|---|
| 高 | 体重数値入力 + 折れ線グラフ | `weightKg` フィールドに数値を入力し、週内推移を recharts で表示 |
| 高 | 週をまたいだ振り返りページ | 過去数週のFlow率・評価を並べて傾向を確認できるページ |
| 中 | ホーム画面追加ガイド | 初回起動時にiPhoneのホーム画面追加手順をバナーで案内 |
| 中 | ジム内容メモ | ジム◯の日に「今日やったメニュー」を1行メモできる入力欄 |
| 中 | NonFlow感情キーワード集計 | NonFlowの日の感情テキストからキーワードを抽出・一覧化 |
| 低 | Gist以外のクラウド保存 | Supabase / Firebase 連携によるマルチユーザー対応 |
| 低 | iOSネイティブアプリ化 | Capacitor等を使ったネイティブ化 |

---

## 新機能を追加するときの注意点

1. **型定義は `client/src/lib/types.ts` を先に更新する**。`DailyLog` に新フィールドを追加したら、`storage.ts` の `buildEmptyDailyLogs` にも初期値を追加すること（TypeScriptエラーで気づける）。

2. **デザインはフィールドノートスタイルを維持する**。新しいUIを追加するときは、既存のカラーパレット・角丸・フォントを踏襲すること。新しいカラーを安易に追加しない。

3. **localStorageのキーは `scl_` プレフィックスで統一する**。

4. **グラフは recharts を使う**（すでにインストール済み）。Chart.js や他のライブラリは追加しない。

5. **shadcn/ui コンポーネントは `@/components/ui/*` から import する**。新しいUIライブラリを追加しない。

6. **Gist同期はオプション機能として扱う**。トークン未設定でも全機能がlocalStorageで動作すること。

---

## コードを変更するときのコマンド

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動（localhost:3000）
pnpm dev

# TypeScriptエラーチェック
npx tsc --noEmit

# ビルド
pnpm build
```

---

## ライセンス

MIT License — 詳細は [LICENSE](./LICENSE) を参照。
