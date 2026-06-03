# セルフコーチングログ デザインアイデア

## 対象ユーザー
毎日iPhoneで入力する個人ユーザー。モルック・仕事・生活・起業準備を横断して自己理解を深めたい。

---

<response>
<probability>0.07</probability>
<idea>

### アプローチA: 「禅ノート」— Minimal Wabi-Sabi

**Design Movement:** Japanese Minimalism × Wabi-Sabi

**Core Principles:**
- 余白を最大限に使い、情報密度を意図的に低く保つ
- テキストと線だけで構成し、装飾を極限まで排除
- 「書く」行為そのものを尊重するタイポグラフィ中心設計

**Color Philosophy:**
- 背景: 生成り色（#F7F4EE）— 紙の温かみ
- テキスト: 墨色（#1C1C1C）
- アクセント: 薄い朱色（#C0392B）— 印鑑のような一点のみ
- 感情: 静けさと内省を促す

**Layout Paradigm:**
- 縦長の「ノート」レイアウト。左端に細い罫線
- 日別カードは横幅いっぱいのシンプルな区切り線のみ
- ナビゲーションは画面下部のテキストのみ

**Signature Elements:**
- 手書き風フォント（Noto Serif JP）
- 朱色の細い区切り線
- 入力フォームは下線のみ（枠なし）

**Interaction Philosophy:**
- タップ時に軽いフェードのみ。アニメーションは最小限
- 「書く」集中を妨げない

**Animation:**
- ページ遷移: opacity 0→1、200ms ease-out
- カード展開: height auto、150ms

**Typography System:**
- 見出し: Noto Serif JP 700
- 本文: Noto Sans JP 400
- 数値: Noto Serif JP 500

</idea>
</response>

<response>
<probability>0.06</probability>
<idea>

### アプローチB: 「コーチングダッシュボード」— Structured Clarity

**Design Movement:** Swiss Grid × Functional Modernism

**Core Principles:**
- 情報の階層を厳格なグリッドで表現
- 色はデータの意味に直結させる（Flow=緑、NonFlow=橙）
- 週次サマリーを一目で把握できるダッシュボード型

**Color Philosophy:**
- 背景: 白（#FFFFFF）
- プライマリ: ディープネイビー（#1A2B4A）
- Flow: #27AE60（緑）、NonFlow: #E67E22（橙）
- 評価S: #2980B9、A: #27AE60、B: #F1C40F、C: #E67E22、D: #E74C3C

**Layout Paradigm:**
- 上部に週サマリーバー（Flow率・瞑想率・評価分布）
- 下部に7日分のカードをスクロール
- ホーム画面は2カラムグリッド（今週 / 過去週）

**Signature Elements:**
- カラーコードされた評価バッジ
- 週サマリーの横棒グラフ（recharts）
- 太いセクション区切りライン

**Interaction Philosophy:**
- 選択ボタンは色が変わる即時フィードバック
- 保存時に軽いチェックアニメーション

**Animation:**
- ボタン選択: background-color 100ms
- カード展開: scale 0.97→1、160ms ease-out

**Typography System:**
- 見出し: DM Sans 700
- 本文: DM Sans 400
- 数値: DM Mono 500

</idea>
</response>

<response>
<probability>0.08</probability>
<idea>

### アプローチC: 「フィールドノート」— Warm Analog Digital

**Design Movement:** Analog Notebook × Warm Modernism

**Core Principles:**
- 紙のノートのような温かみをデジタルで再現
- 入力欄は「書き込む」感覚を大切に、大きく余裕ある設計
- 毎日続けたくなる「愛着」が生まれるデザイン

**Color Philosophy:**
- 背景: クリーム白（#FAFAF7）
- カード背景: 温かいオフホワイト（#F5F3EE）
- アクセント: テラコッタ（#C1785A）— 温かみと継続感
- テキスト: チャコール（#2D2D2D）
- Flow: #4A7C59（深緑）、NonFlow: #C1785A（テラコッタ）

**Layout Paradigm:**
- 縦スクロール一本道。タブは下部固定ナビゲーション
- 日別カードは角丸の「付箋」スタイル
- 週目標は折りたたみ可能なセクション

**Signature Elements:**
- 薄いドット柄背景（5%透明度）
- テラコッタのアクセントボーダー
- 選択ボタンは「スタンプ」風の丸ボタン

**Interaction Philosophy:**
- タップ時に軽い押し込み感（scale 0.97）
- 保存成功時にチェックマークがフェードイン

**Animation:**
- ページ遷移: slide-up 200ms ease-out
- ボタン押下: scale 0.97、100ms
- カード表示: opacity + translateY(8px)→0、180ms stagger 40ms

**Typography System:**
- 見出し: Noto Serif JP 700（温かみ）
- 本文: Noto Sans JP 400（読みやすさ）
- 数値・ラベル: DM Sans 500（モダン）

</idea>
</response>

---

## 選択: アプローチC「フィールドノート」

毎日続けやすい温かみ、iPhoneで使いやすい縦スクロール設計、「書き込む」感覚を重視する点が要件に最も合致する。
