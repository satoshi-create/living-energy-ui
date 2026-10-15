# 本日のセッション前提コンテキスト

- **実行日時（JST）**: 2026/10/15(木) 13:44:37
- **プロジェクト**: my-project
- **用途**: Gemini 新規スレッド開始時に貼るコード地図（特定タスクの出力強制ではない）
- **ダンプ方針**: パス選定用にスリム化。AppShell 到達可能のみ。未接続 feature / PDF 研究資産 / ネスト別アプリは本文ダンプしない。巨大 TSX はプレビューのみ。

## セッション運用（このスレッドの前提）

このファイルは **本日のセッション開始用コード地図** です。特定タスク用の出力フォーマットではない。

- パス選定の正本は下の「編集対象マップ」。ツリーやプレビューよりマップを優先する。
- UI は AppShell の **3画面のみ**（`balcony-simulation` / `global-implementation` / `regional-network`）。
- 「未接続」に挙げたパスは、明示的な復活依頼がない限り提案・編集対象にしない。
- 命名の取り違えに注意（マップ内の注意書きを正とする）。特にナビ ID `global-implementation` の本体は `WorldImplementationView`（`features/balcony-pv/...`）。
- このダンプ内のソースプレビューは断片にすぎない。実装の正本はリポジトリ上の実ファイル。
- 具体的な改修タスクが来たら、「編集対象マップ」からパスを選び、Cursor には **Read してから編集** するよう指示する。プレビューを鵜呑みに書き換えない。
- ユーザー向け文言は `messages/{ja,en}.json`。トーンは `.cursorrules`（ダーク×エメラルド）。
- Cursor への依頼文の書き方例は、必要になったとき末尾の「参考」を見る（毎回この形式で答えなくてよい）。


## 編集対象マップ（正・パス指定はここから）

AppShell（`features/shell/components/app-shell.tsx`）のナビは次の **3画面のみ**。
UI 変更の話が出たら、View ID → entry のパスだけを編集候補にする。

### `balcony-simulation` — ベランダ発電シミュレーション

- **entry（必須）**: `features/balcony-pv/components/balcony-view.tsx`
- **関連（必要時のみ）**:
  - `features/balcony-pv/simulator-data.ts`
  - `features/balcony-pv/components/balcony-illustration.tsx`
  - `features/living-sense/components/home-view.tsx (タブ living-sense)`
  - `features/living-sense/data.ts`
  - `messages/ja.json`
  - `messages/en.json`

### `global-implementation` — ベランダソーラー世界実装

- **entry（必須）**: `features/balcony-pv/components/world-implementation-view.tsx`
- **関連（必要時のみ）**:
  - `features/balcony-pv/components/world-pv-map.tsx`
  - `features/balcony-pv/data.ts`
  - `features/balcony-pv/history-data.ts`
  - `features/global-implementation/components/global-implementation-view.tsx (MajorVendorsListView / NonProfitOrgsListView のみ使用)`
  - `messages/ja.json`
  - `messages/en.json`

### `regional-network` — 地域再エネネットワーク

- **entry（必須）**: `features/network/components/network-view.tsx`
- **関連（必要時のみ）**:
  - `features/network/components/japan-re-map.tsx`
  - `features/network/components/network-detail-sidebar.tsx`
  - `features/network/data.ts`
  - `messages/ja.json`
  - `messages/en.json`

### 命名の注意（取り違え防止）

- ナビ ID `global-implementation` の本体は `WorldImplementationView`（`features/balcony-pv/...`）。`GlobalImplementationView` 全体は未マウント。
- 生活実感 `HomeView` はトップナビではなく `balcony-simulation` 内タブ。
- `features/basin-dam` / `ranking` / `ecosystem` / `ecosystem-orgs` は AppShell 未接続。明示依頼がない限り編集しない。
- AGENTS.md の旧5画面表より、本ファイルの「編集対象マップ」と `app-shell.tsx` を優先する。


## 未接続（既定で編集しない）

次はリポジトリに残っているが **AppShell から未接続**。
明示的な復活依頼がない限り、パス指定・編集対象にしない。

```text
features/basin-dam/
features/ecosystem-orgs/
features/ecosystem/
features/ranking/
agri-dam-and-basin-grid/  (ネストされた別アプリ・ダンプ対象外)
```


## ディレクトリ構造（最大深度 3・生きている feature のみ）

```text
./
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── globals.css
├── components/
│   └── ui/
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── tabs.tsx
│       ├── toggle-group.tsx
│       └── toggle.tsx
├── docs/
│   ├── balcony-solar/  (research assets omitted — not UI edit targets)
│   ├── career/
│   │   ├── 01_market_research.md
│   │   ├── 02_jtbd_value_network_fit.md
│   │   ├── 03_portfolio_asset_mapping.md
│   │   └── 04_application_package.md
│   ├── 構造分析書_new.md
│   ├── 構造分析書_再エネ×流域治水（田んぼダム）統合UI.md
│   └── 構造分析書.md
├── features/
│   ├── balcony-pv/
│   │   ├── components/
│   │   ├── data.ts
│   │   ├── history-data.ts
│   │   ├── index.ts
│   │   └── simulator-data.ts
│   ├── global-implementation/
│   │   └── components/
│   ├── living-sense/
│   │   ├── components/
│   │   ├── data.ts
│   │   └── index.ts
│   ├── network/
│   │   ├── components/
│   │   ├── data.ts
│   │   └── index.ts
│   └── shell/
│       ├── components/
│       └── index.ts
├── i18n/
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
├── lib/
│   ├── country-codes.ts
│   ├── regions.ts
│   └── utils.ts
├── messages/
│   ├── en.json
│   └── ja.json
├── public/
│   └── maps/
├── scripts/
│   └── dump-context.mjs
├── .env.example
├── AGENTS.md
├── components.json
├── ecosystem.config.js
├── file_list.txt
├── gemini-context.md
├── global.d.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── proxy.ts
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

## 存在する主要ファイル一覧（プロジェクトルート基準）

```text
./app/globals.css
./components.json
./ecosystem.config.js
./messages/en.json
./messages/ja.json
./next.config.mjs
./package-lock.json
./package.json
./postcss.config.mjs
./scripts/dump-context.mjs
./tsconfig.json
```

## 主要依存ライブラリ

```json
{
  "dependencies": {
    "@base-ui/react": "^1.5.0",
    "@react-three/drei": "^10.7.9",
    "@react-three/fiber": "^9.8.1",
    "@vercel/analytics": "1.6.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "d3-geo": "^3.1.1",
    "lucide-react": "^1.16.0",
    "next": "16.3.0",
    "next-intl": "^4.14.6",
    "react": "^19",
    "react-dom": "^19",
    "react-simple-maps": "^5.0.5",
    "shadcn": "^4.8.0",
    "tailwind-merge": "^3.3.1",
    "three": "^0.180.0",
    "topojson-client": "^3.1.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@types/d3-geo": "^3.1.1",
    "@types/node": "^24",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.180.0",
    "@types/topojson-client": "^3.1.5",
    "postcss": "^8.5",
    "tailwindcss": "^4.3.3",
    "typescript": "5.7.3"
  }
}
```

## 型定義（TypeScript / JSDoc）

### `global.d.ts`

```typescript
import type ja from './messages/ja.json'

type Messages = typeof ja

declare global {
  // Augment next-intl message keys for typed useTranslations / getTranslations.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}

export {}
```

### `next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";
import "./.next/dev/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```


## エントリ参照（到達可能・プレビュー優先）

巨大ソースの全文は載せない。パス選定用の短いプレビューのみ。
Cursor は必ず実ファイルを Read すること。

| path | lines | bytes | dump |
| --- | ---: | ---: | --- |
| `features/shell/components/app-shell.tsx` | 215 | 7446 | full |
| `features/balcony-pv/components/balcony-view.tsx` | 256 | 11385 | preview |
| `features/balcony-pv/components/world-implementation-view.tsx` | 1612 | 63192 | preview |
| `features/balcony-pv/simulator-data.ts` | 922 | 30696 | preview |
| `features/balcony-pv/data.ts` | 6198 | 265114 | preview |
| `features/living-sense/data.ts` | 110 | 2861 | preview |
| `features/network/components/network-view.tsx` | 58 | 1654 | full |
| `features/network/data.ts` | 1506 | 52000 | preview |

### `features/shell/components/app-shell.tsx` (full, 215 lines)

```tsx
"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Sun, Network, Globe2, Leaf, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { RegionHeader } from "./region-header"
import { REGIONS } from "@/lib/regions"

function ViewChunkLoading() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  )
}

const BalconyView = dynamic(
  () =>
    import("@/features/balcony-pv/components/balcony-view").then(
      (m) => m.BalconyView,
    ),
  { ssr: false, loading: () => <ViewChunkLoading /> },
)

const WorldImplementationView = dynamic(
  () =>
    import("@/features/balcony-pv/components/world-implementation-view").then(
      (m) => m.WorldImplementationView,
    ),
  { ssr: false, loading: () => <ViewChunkLoading /> },
)

const NetworkView = dynamic(
  () => import("@/features/network").then((m) => m.NetworkView),
  { ssr: false, loading: () => <ViewChunkLoading /> },
)

const NAV_ITEMS = [
  { id: "balcony-simulation", icon: Sun },
  { id: "global-implementation", icon: Globe2 },
  { id: "regional-network", icon: Network },
] as const

type ViewId = (typeof NAV_ITEMS)[number]["id"]

const VIEW_STORAGE_KEY = "living-energy-active-view"
const REGION_STORAGE_KEY = "living-energy-region-id"

function isViewId(value: string | null): value is ViewId {
  return NAV_ITEMS.some((item) => item.id === value)
}

export function AppShell() {
  const t = useTranslations("shell")
  const [activeView, setActiveView] = useState<ViewId>("balcony-simulation")
  const [regionId, setRegionId] = useState(REGIONS[0].id)
  const [hydrated, setHydrated] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const storedView = sessionStorage.getItem(VIEW_STORAGE_KEY)
    const storedRegion = sessionStorage.getItem(REGION_STORAGE_KEY)
    if (isViewId(storedView)) setActiveView(storedView)
    if (storedRegion && REGIONS.some((r) => r.id === storedRegion)) {
      setRegionId(storedRegion)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem(VIEW_STORAGE_KEY, activeView)
  }, [activeView, hydrated])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem(REGION_STORAGE_KEY, regionId)
  }, [regionId, hydrated])

  const selectView = (id: ViewId) => {
    setActiveView(id)
    setIsSidebarOpen(false)
  }

  const activeItem = NAV_ITEMS.find((item) => item.id === activeView)!

  const isMapView = activeView === "global-implementation"

  return (
    <div
      className={cn(
        "relative flex w-full",
        isMapView ? "h-screen overflow-hidden" : "min-h-screen"
      )}
    >
      {isSidebarOpen && (
        <button
          type="button"
          aria-label={t("brand")}
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/60 bg-sidebar px-4 py-6 transition-transform duration-200 ease-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-2 pb-8">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Leaf className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">{t("brand")}</span>
            <span className="text-xs text-muted-foreground">{t("tagline")}</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeView
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectView(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{t(`nav.${item.id}.label`)}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-border/60 bg-muted/40 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{t("demoDisclaimer")}</p>
        </div>
      </aside>

      <div
        className={cn(
          "flex w-full flex-1 flex-col",
          isMapView ? "h-screen min-h-0 overflow-hidden" : "min-h-screen"
        )}
      >
        <div className="flex shrink-0 items-start gap-2">
          <button
            type="button"
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="mt-3 ml-3 flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-sidebar text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:ml-4 lg:ml-6"
          >
            <PanelLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            {activeView !== "regional-network" && (
              <RegionHeader
                regionId={regionId}
                onRegionChange={setRegionId}
                title={t(`nav.${activeItem.id}.label`)}
                showRegionSelect={false}
              />
            )}
          </div>
        </div>

        <main
          className={cn(
            "min-h-0 flex-1",
            isMapView
              ? "flex flex-col overflow-hidden bg-slate-950 px-0 pb-16 pt-0 lg:pb-0"
              : "bg-slate-950 px-5 pb-24 pt-5 sm:px-6 md:px-8 lg:pb-8"
          )}
        >
          {activeView === "balcony-simulation" && <BalconyView />}
          {activeView === "regional-network" && <NetworkView />}
          {activeView === "global-implementation" && <WorldImplementationView />}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-sidebar/95 backdrop-blur lg:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeView
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectView(item.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium transition-colors sm:px-2 sm:text-[11px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{t(`nav.${item.id}.shortLabel`)}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
```

### `features/balcony-pv/components/balcony-view.tsx` (preview, 256 lines)

```tsx
"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Gauge, PackageCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { BalconyIllustration } from "./balcony-illustration"
import {
  DIRECTIONS,
  RAILING_TYPES,
  computeBalconyLifeCompliance,
  computeBalconyScore,
  DEFAULT_LIVING_CONTEXT,
  recommendedKit,
  type Direction,
  type LivingContext,
  type LivingHabit,
  type PanelTiltMode,
  type RailingType,
  type WeatherCondition,
} from "../simulator-data"

const HomeView = dynamic(
  () => import("@/features/living-sense").then((m) => m.HomeView),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl bg-slate-950/40">
        <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    ),
  },
)

type BalconyTab = "simulator" | "living-sense"

function formatHour(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

function scoreBand(score: number): "excellent" | "good" | "fair" | "poor" {
  if (score >= 80) return "excellent"
  if (score >= 60) return "good"
  if (score >= 40) return "fair"
  return "poor"
}

export function BalconyView() {
  const t = useTranslations("balconyPv")
  const tDirections = useTranslations("common.directions")
  const [tab, setTab] = useState<BalconyTab>("simulator")
  const [direction, setDirection] = useState<Direction>("south")
  const [railing, setRailing] = useState<RailingType>("grid")
  const [hour, setHour] = useState(12.5)
  const [livingContext, setLivingContext] = useState<LivingContext>(DEFAULT_LIVING_CONTEXT)

  const simulatorTiltMode: PanelTiltMode =
    livingContext.weather === "typhoon_alert" ? "retracted" : "optimal_tilt"

  const score = useMemo(
    () => computeBalconyScore(direction, railing, hour, livingContext, simulatorTiltMode),
    [direction, railing, hour, livingContext, simulatorTiltMode],
  )
  const lifeCompliance = useMemo(
    () => computeBalconyLifeCompliance(livingContext, simulatorTiltMode),
    [livingContext, simulatorTiltMode],

/* … preview only (11385 bytes, 256 lines). Cursor must Read the file; do not treat this snippet as source of truth. … */
```

### `features/balcony-pv/components/world-implementation-view.tsx` (preview, 1612 lines)

```tsx
"use client"

import dynamic from "next/dynamic"
import { useCallback, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  ArrowRight,
  Building2,
  Droplets,
  ExternalLink,
  Fan,
  Laptop,
  Layers,
  Lightbulb,
  Landmark,
  Refrigerator,
  Smartphone,
  type LucideIcon,
  Wifi,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  SurfaceCountryTags,
  SurfaceMountJobBadges,
} from "./balcony-illustration"
import type { Surface3DFocus } from "./surface-3d-full-view"
import type { PvHistoryStream } from "../history-data"
import type {
  EcosystemDiagramViewMode,
  MovementHistoryPhaseId,
} from "./world-pv-map"

function HeavyChunkLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[160px] w-full items-center justify-center rounded-xl bg-slate-950/40",
        className,
      )}
    >
      <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  )
}

const Surface3DFullView = dynamic(
  () => import("./surface-3d-full-view").then((m) => m.Surface3DFullView),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-full min-h-[320px]" /> },
)

const Surface3DViewer = dynamic(
  () => import("./surface-3d-viewer").then((m) => m.Surface3DViewer),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-[200px]" /> },
)

const SolarCellTypesView = dynamic(
  () => import("./solar-cell-types-view").then((m) => m.SolarCellTypesView),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-full min-h-[320px]" /> },
)

const WorldPvMap = dynamic(
  () => import("./world-pv-map").then((m) => m.WorldPvMap),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-full min-h-[480px]" /> },
)

const CountryPvEcosystem = dynamic(
  () => import("./world-pv-map").then((m) => m.CountryPvEcosystem),
  { ssr: false, loading: () => <HeavyChunkLoading /> },
)

const CountryPvOssTools = dynamic(
  () => import("./world-pv-map").then((m) => m.CountryPvOssTools),
  { ssr: false, loading: () => <HeavyChunkLoading /> },
)

const CountryPvTimelin

/* … preview only (63192 bytes, 1612 lines). Cursor must Read the file; do not treat this snippet as source of truth. … */
```

### `features/balcony-pv/simulator-data.ts` (preview, 922 lines)

```typescript
// Simulator / surface-typology mock for balcony-plug-in-pv (cold path).
// Heuristic stand-in for suncalc-js-engine.

import type { PvHistoryStream } from './history-data'

export type Direction = 'south' | 'southeast' | 'southwest' | 'east' | 'west'
export type RailingType = 'grid' | 'glass' | 'concrete'

/**
 * UK / multi-rain balcony form factors (locale-independent).
 * Labels: `balconyPv.balconyType.*`.
 */
export type BalconyType = 'standard' | 'juliet' | 'recessed' | 'roof_terrace'

/**
 * UK roof form factors for terrace-house / mansard contexts (locale-independent).
 * Labels: `balconyPv.roofType.*`.
 */
export type RoofType = 'flat' | 'pitched_gable' | 'pitched_mansard_dormer'

/** Direct / diffuse irradiance split for a receiving surface (sums ≈ 1). */
export interface SurfaceIrradianceParams {
  /** Default receiving area (m²). */
  receivingAreaM2: number
  /** Default tilt from horizontal (degrees). */
  tiltDeg: number
  /** Direct-beam irradiance share (0–1). */
  directRatio: number
  /** Diffuse-sky irradiance share (0–1). */
  diffuseRatio: number
}

export type BalconyTypePreset = { value: BalconyType } & SurfaceIrradianceParams
export type RoofTypePreset = { value: RoofType } & SurfaceIrradianceParams

/** Locale-independent kit label keys under `balconyPv.kit`. */
export type KitPanelKey = 'panelDefault' | 'panelMid' | 'panelLight'
export type KitStorageKey = 'storageDefault' | 'storageMid' | 'storageLight'

/** Locale-independent direction keys. Labels live in messages under `common.directions`. */
export const DIRECTIONS: readonly Direction[] = [
  'south',
  'southeast',
  'southwest',
  'east',
  'west',
] as const

/** Locale-independent railing keys. Labels: `balconyPv.railing.*`. */
export const RAILING_TYPES: { value: RailingType }[] = [
  { value: 'grid' },
  { value: 'glass' },
  { value: 'concrete' },
]

/**
 * UK balcony selector presets: cantilever / Juliet / recessed loggia / roof terrace.
 * Irradiance ratios reflect typical UK overcast (higher diffuse) vs clear-beam days.
 */
export const BALCONY_TYPES: readonly BalconyTypePreset[] = [
  {
    value: 'standard',
    receivingAreaM2: 4.5,
    tiltDeg: 0,
    directRatio: 0.45,
    diffuseRatio: 0.55,
  },
  {
    // Juliet: no deck — rail / French-door glazing as primary surface
    value: 'juliet',
    receivingAreaM2: 2.2,
    tiltDeg: 90,
    directRatio: 0.35,
    diffuseRatio: 0.65,
  },
  {
    // Recessed / loggia: side-wall shading → more diffuse, smaller effec

/* … preview only (30696 bytes, 922 lines). Cursor must Read the file; do not treat this snippet as source of truth. … */
```

### `features/balcony-pv/data.ts` (preview, 6198 lines)

```typescript
// World-map / ecosystem / architecture mock for balcony-plug-in-pv.
// Simulator & typology primitives re-exported from ./simulator-data.

export * from './simulator-data'

import type { CountryCode } from '@/lib/country-codes'
import type { WorldMacroRegion } from '@/lib/regions'
import {
  getSurfaceTypologyDetail,
  SURFACE_TYPOLOGIES,
  type SurfaceTypology,
  type SurfaceTypologyDetail,
  type TypicalRegionKey,
} from './simulator-data'

/** Continental / macro region for world-map focus filters (4 poles). */
export type RegionCategory = WorldMacroRegion

/**
 * Deployment / authorization model (locale-independent).
 * Legacy `status` values remain for map color / legend compatibility.
 */
export type SystemModelType =
  | 'plug_800w'
  | 'plug_1200w'
  | 'plug_600w'
  | 'net_metering'
  | 'offgrid_storage'
  | 'nec_strict'
  | 'productive_offgrid'
  | 'micro_solar_kit'

/**
 * Parent infrastructure category (locale-independent).
 * ① grid_plug_in — outlet plug-in (EU, CA/UT, AU, SG, Cape Town, …)
 * ② grid_hybrid_storage — export-restricted storage hybrid (JP/TW/CN/VN/ID/PH, US-TX/FL/NY, …)
 * ③ grid_blackout_defense — unstable-grid / blackout self-defense (ZA, NG, KE, RW)
 * ④ no_grid_leapfrog — unelectrified / independent power (ET, SN, TZ, UG, IN, …)
 */
export type GridCategory =
  | 'grid_plug_in'
  | 'grid_hybrid_storage'
  | 'grid_blackout_defense'
  | 'no_grid_leapfrog'

/** Flat map-header filter ids (all + 4 market models). */
export const WORLD_PV_MODEL_FILTER_OPTIONS = [
  'all',
  'grid_plug_in',
  'grid_hybrid_storage',
  'grid_blackout_defense',
  'no_grid_leapfrog',
] as const

export type WorldPvModelFilterOption = (typeof WORLD_PV_MODEL_FILTER_OPTIONS)[number]

/** systemModel → parent gridCategory (code-level overrides in resolveGridCategory). */
export const SYSTEM_MODEL_GRID_CATEGORY: Record<SystemModelType, GridCategory> = {
  plug_800w: 'grid_plug_in',
  plug_1200w: 'grid_plug_in',
  plug_600w: 'grid_plug_in',
  net_metering: 'grid_plug_in',
  offgrid_storage: 'grid_hybrid_storage',
  nec_strict: 'grid_hybrid_storage',
  productive_offgrid: 'no_grid_leapfrog',
  micro_solar_kit: 'no_grid_leapfrog',
}

/** ISO / subnational code → GridCategory (splits Africa urban blackout vs Asia hybrid). */
const GRID_CATEGORY_BY_CODE: Partial<Record<string, GridCategory>> = {
  ZA: 'grid_blackout_defense',
  NG: 'grid_blackout_defense',
  KE: 'grid_blackout_defense',
  RW: 'grid_blackout_defense',
  JP: 'grid_hybrid_storage',
  TW: 'grid_hyb

/* … preview only (265114 bytes, 6198 lines). Cursor must Read the file; do not treat this snippet as source of truth. … */
```

### `features/living-sense/data.ts` (preview, 110 lines)

```typescript
// Mock for living-sense-ui. Static — no backend or external API calls.

export type LivingCard = {
  id: string
  icon: 'laptop' | 'fan' | 'coffee' | 'smartphone' | 'waves' | 'shield' | 'moon'
  title: string
  value: string
  unit: string
  progress: number // 0-100
  detail: string
}

export const LIVING_CARDS: LivingCard[] = [
  {
    id: 'macbook',
    icon: 'laptop',
    title: 'MacBook Pro 充電',
    value: '2.5',
    unit: '回分 完了',
    progress: 62,
    detail: '60Wh バッテリー想定',
  },
  {
    id: 'fan',
    icon: 'fan',
    title: 'サーキュレーター稼働',
    value: '8.2',
    unit: '時間 残り',
    progress: 78,
    detail: '30W 連続稼働想定',
  },
  {
    id: 'kettle',
    icon: 'coffee',
    title: '電気ケトル(1L沸騰)',
    value: '4',
    unit: '回分 達成',
    progress: 100,
    detail: '約110Wh / 回',
  },
  {
    id: 'phone',
    icon: 'smartphone',
    title: 'スマホ充電',
    value: '12',
    unit: '回分 達成',
    progress: 95,
    detail: '15Wh / 回想定',
  },
]

export const LIVE_STATUS = {
  instantWatts: 340,
  todayKwh: 1.8,
  batteryPercent: 84,
  co2SavedKg: 0.9,
  monthlySavingsYen: 1420,
}

/** 流域・田んぼダムの生活実感（デモ。詳細操作は basin ビュー） */
export const FLOOD_LIVING_CARDS: LivingCard[] = [
  {
    id: 'pool',
    icon: 'waves',
    title: '小学校プール換算',
    value: '0.8',
    unit: '杯分 一時貯留',
    progress: 55,
    detail: '水田オリフィス群のピークカット想定',
  },
  {
    id: 'risk',
    icon: 'shield',
    title: '下流氾濫リスク',
    value: '−15',
    unit: '% 目安',
    progress: 70,
    detail: '平常時のパッシブ制御デモ',
  },
  {
    id: 'patrol',
    icon: 'moon',
    title: '今夜の水路見回り',
    /** Locale-independent; resolve via `livingSense.notRequired` in the view. */
    value: 'notRequired',
    unit: '',
    progress: 100,
    detail: '板1枚で危険な水門作業を解雇',
  },
]

/** Locale-independent watershed status key. Label: `livingSense.watershedNormal`. */
export const FLOOD_STATUS = {
  systemKey: 'watershedNormal' as const,
  note: '流域の水位・排水は安定。詳細は「流域・田んぼダム」で確認できます。',
}

export type FlowNode = {
  id: string
  label: string
  sublabel: string
  icon: 'sun' | 'battery' | 'laptop'
}

export const HOME_FLOW: FlowNode[] = [
  { id: 'panel', label: 'ベランダパネル', sublabel: '340W 発電中', icon: 'sun' },
  { id: 'battery', label: 'ポータブル蓄電池', sublabel: '残量 84%', icon: 'battery' },
  { id: 'desk', label: '在宅ワークPC・デスク', sublabel: '給電中', icon: 'laptop' },
]


/* preview complete (2861 bytes, 110 lines) */
```

### `features/network/components/network-view.tsx` (full, 58 lines)

```tsx
"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { JapanReMap } from "./japan-re-map"
import { NetworkDetailSidebar } from "./network-detail-sidebar"
import {
  type NetworkLocale,
  type NetworkModel,
} from "../data"

const SIDEBAR_DEFAULT_WIDTH = 384
const SIDEBAR_MIN_WIDTH = 320
const SIDEBAR_MAX_WIDTH = 700

function toNetworkLocale(locale: string): NetworkLocale {
  return locale === "en" ? "en" : "ja"
}

export function NetworkView() {
  const locale = toNetworkLocale(useLocale())
  const [selectedModel, setSelectedModel] = useState<NetworkModel | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const sidebarOpen = selectedModel !== null

  return (
    <div
      className="relative h-[calc(100dvh-7.5rem)] min-h-[500px] w-full overflow-hidden bg-slate-950"
      style={{ ["--sidebar-w" as string]: `${sidebarWidth}px` }}
    >
      <div
        className={cn(
          "absolute inset-0 min-h-0 min-w-0 overflow-hidden transition-[right] duration-300 ease-in-out",
          sidebarOpen && "lg:right-[var(--sidebar-w)]",
        )}
      >
        <JapanReMap
          locale={locale}
          selectedModelId={selectedModel}
          onSelect={setSelectedModel}
        />
      </div>

      <NetworkDetailSidebar
        modelId={selectedModel}
        locale={locale}
        open={sidebarOpen}
        onClose={() => setSelectedModel(null)}
        width={sidebarWidth}
        onWidthChange={setSidebarWidth}
        minWidth={SIDEBAR_MIN_WIDTH}
        maxWidth={SIDEBAR_MAX_WIDTH}
      />
    </div>
  )
}
```

### `features/network/data.ts` (preview, 1506 lines)

```typescript
// Mock for react-flow-visualizer / modular-microgrid-vn. Static — no API.

export type NetworkLocale = "ja" | "en"

/** Japan map site id — sourced from Notion「再生可能エネルギーの導入事例（日本）」 */
export type NetworkModel =
  | "ichinoseki-solar-sharing"
  | "goto-tidal"
  | "goto-floating-wind"
  | "kairyu-ocean-current"
  | "fh2r"
  | "gifu-biomass"
  | "yumesakura-p2g"
  | "choshi-offshore-wind"
  | "tomakomai-biomass"
  | "kumejima-otec"
  | "katatsumuri-geothermal"
  | "wasabizawa-geothermal"
  | "nagayoshigawa-hydro"
  | "hiratsuka-wave"

/** Japan RE map filter / pin category (再エネ種別) */
export type ModelCategory =
  | "solar"
  | "wind"
  | "ocean"
  | "biomass"
  | "geothermal"
  | "hydro"
  | "hydrogen"

/** Macro region for map camera / filter */
export type MapRegionFocus =
  | "all"
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "kyushu"
  | "okinawa"
  | "ocean"

/** ステータス（Notion select） */
export type CaseStatus =
  | "commercial"
  | "demo"
  | "planning"
  | "construction"

export type NetworkNodeStatus = "normal" | "watch"

export type NetworkNode = {
  id: string
  label: string
  labelEn?: string
  sublabel: string
  sublabelEn?: string
  kind: "supply" | "convert" | "consume"
  icon:
    | "sun-medium"
    | "wind"
    | "droplets"
    | "flame"
    | "battery-charging"
    | "building-2"
    | "home"
    | "fuel"
    | "sprout"
  levelPct?: number
  status?: NetworkNodeStatus
}

export type NetworkEdge = {
  from: string
  to: string
}

export type NetworkModelConfig = {
  label: string
  labelEn?: string
  description: string
  descriptionEn?: string
  /** WGS84 [longitude, latitude] for react-simple-maps Marker */
  coordinates: [number, number]
  regionName: string
  regionNameEn?: string
  /** Primary pin color / filter category */
  modelCategory: ModelCategory
  /** All RE types on the case (Notion multi_select) */
  energyTypes: ModelCategory[]
  mapRegion: Exclude<MapRegionFocus, "all">
  caseStatus: CaseStatus
  scaleLabel: string
  scaleLabelEn?: string
  /** Demo self-sufficiency ratio (0–100); omit when not meaningful */
  selfSufficiencyPct?: number
  partners?: string
  partnersEn?: string
  paradigmPoint: string
  paradigmPointEn?: string
  sourceUrl?: string | null
  nodes: NetworkNode[]
  edges: NetworkEdge[]
}

/** Country / plug-in PV regulation entry for map + detail sheet. */
export type CountryDetails = {
  system: string
  legal: string
  meter: string
  payback: string
  summary: string
  connection: st

/* … preview only (52000 bytes, 1506 lines). Cursor must Read the file; do not treat this snippet as source of truth. … */
```


## 参考：Cursor 依頼の書き方例（タスク具体化時のみ）

_タスクが具体化したとき用。セッション開始直後からこの形式で返答する必要はない。_

```markdown
## Task
<日本語で 1〜3 文。何をどう変えるか>

## View
`<viewId>` — <ラベル>

## Edit (only these)
- `<entry path>` （必須）
- `<related path>` （必要なときだけ。messages/{ja,en}.json は文言変更時）

## Do not edit
- features/basin-dam/**
- features/ranking/**
- features/ecosystem/**
- features/ecosystem-orgs/**
- agri-dam-and-basin-grid/**

## Cursor instructions
- 列挙したパスを Read してから編集する。このコンテキストのプレビュー断片を正本にしない。
- ユーザー向け文言は messages/{ja,en}.json を優先する。
- .cursorrules / 既存トーン（ダーク×エメラルド）を崩さない。
- 未接続 feature を復活させない。新規ルートを増やさない。
```

