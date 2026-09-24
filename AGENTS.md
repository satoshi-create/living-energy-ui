<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — living-energy-ui

生活実感型・再エネダッシュボード。プラグインPVの発電を「在宅ワークのPC代がタダになるか」が即座にわかる形で見せる。

## Reading order

1. このファイル
2. `doc/構造分析書.md` — クリステンセン理論・ノード・JTBD
3. `.cursorrules` — 編集時の禁止事項とスタック
4. `features/*/data.ts` — 機能別モックと純関数
5. `features/shell/components/app-shell.tsx` — 4画面のエントリ

## Current vs planned

| 層 | 現行プロトタイプ | 構造分析書上の次ステップ |
| --- | --- | --- |
| Top | 生活実感メーター / ベランダ / 流域・田んぼダム | `living-sense-ui` / `balcony-plug-in-pv` / `orifice-paddy-dam-node` |
| Middle | CSS の簡易フロー図、ヒューリスティック適性スコア、流域DAG | React Flow、SunCalc、Open-Meteo×FastAPI |
| Bottom | 静的モック | 太陽幾何・pvlib・分散型マイクログリッド |

数値はすべてデモ。実発電・気象API・IoTは未接続。`NEXT_PUBLIC_DATA_SOURCE=mock` を正とする。

## Directory map

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | `<AppShell />` のみ |
| `app/layout.tsx` | metadata / フォント / ダーク固定 / Analytics |
| `app/globals.css` | oklch トークン、`animate-flow-dash` |
| `features/living-sense/` | 生活実感メーター（`living-sense-ui`） |
| `features/balcony-pv/` | ベランダシミュレーター（`balcony-plug-in-pv`） |
| `features/basin-dam/` | 流域・田んぼダム（`basin-dag-flow-visualizer` / `orifice-paddy-dam-node`） |
| `features/network/` | 地域P2X網（`react-flow-visualizer` / `modular-microgrid-vn`） |
| `features/ranking/` | 都道府県番付 |
| `features/shell/` | AppShell + 地域ヘッダー |
| `components/ui/` | shadcn プリミティブ |
| `lib/regions.ts` | 共有地域・天気モック |
| `lib/utils.ts` | `cn()` |
| `doc/構造分析書.md` | 戦略正本 |

## Views (`AppShell`) ↔ 構造分析書

| id | Label | Feature | ノード |
| --- | --- | --- | --- |
| `home` | 生活実感メーター | `features/living-sense` | `living-sense-ui` |
| `balcony` | ベランダ発電シミュレーター | `features/balcony-pv` | `balcony-plug-in-pv` |
| `basin` | 流域・田んぼダム | `features/basin-dam` | `basin-dag-flow-visualizer` / `orifice-paddy-dam-node` |
| `network` | 地域再エネネットワーク | `features/network` | `react-flow-visualizer` |
| `ranking` | 都道府県別 再エネ番付 | `features/ranking` | （独立ノードなし） |

既定地域は北杜市（`REGIONS[0]`）。地域切替はヘッダーのみで、ビュー間の計算にはまだ効かない。

## Commands

```bash
pnpm dev      # http://localhost:3000
pnpm build
pnpm lint
```

環境変数: `.env.example` を `.env.local` にコピー。現行コードは未参照でも、live 接続時の契約として残す。

## Conventions

- エイリアス: `@/` → リポジトリルート
- パッケージマネージャ: **pnpm**（`package-lock.json` を正本にしない）
- コミット・push はユーザー明示指示時のみ
- デザイン正本: `app/globals.css` の `.dark` トークン（primary hue 152）

## Cursor assets

| File | Role |
| --- | --- |
| `.cursorrules` | 常時適用の哲学・禁止事項 |
| `.cursor/rules/energy-ui.mdc` | `features/**/*.tsx` |
| `.cursor/rules/energy-data.mdc` | `features/**/data.ts`, `lib/regions.ts` |
| `.cursorignore` | ビルド成果物・lockfile・バイナリをインデックスから除外 |
| `.env.example` | 公開してよい環境変数の契約 |

## Do not

- `.env*` の実値やトークンをコミットしない
- v0 内部ファイル（`__v0_*`, `.snowflake/`）を編集・依存しない
- 産業用 SCADA / ログイン / kWh 単独ヒーローを足さない
- 依頼なしに React Flow・SunCalc・FastAPI を導入しない
