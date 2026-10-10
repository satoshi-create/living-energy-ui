# 本日のセッション前提コンテキスト

- **実行日時（JST）**: 2026/10/10(土) 16:21:27
- **プロジェクト**: my-project

## ディレクトリ構造（最大深度 3）

```text
./
├── agri-dam-and-basin-grid/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   │   └── utils.ts
│   ├── public/
│   │   ├── apple-icon.png
│   │   ├── icon-dark-32x32.png
│   │   ├── icon-light-32x32.png
│   │   ├── icon.svg
│   │   ├── placeholder-logo.png
│   │   ├── placeholder-logo.svg
│   │   ├── placeholder-user.jpg
│   │   ├── placeholder.jpg
│   │   └── placeholder.svg
│   ├── components.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.mjs
│   └── tsconfig.json
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
│   ├── balcony-solar/
│   │   ├── 2403.09278v2.pdf
│   │   ├── 2408.15147v1.pdf
│   │   ├── 2408.15460v3.pdf
│   │   ├── 2412.09181v1.pdf
│   │   ├── 2503.17214v1.pdf
│   │   ├── 2504.06729v2.pdf
│   │   ├── 2510.08029v1.pdf
│   │   ├── 2512.17479v1.pdf
│   │   ├── 2602.23891v1.pdf
│   │   ├── 2604.25756v1.pdf
│   │   ├── 2608.07348v1.pdf
│   │   ├── 2608.08217v1.pdf
│   │   ├── 2608.28296v1.pdf
│   │   ├── balcony-solar-map.csv
│   │   ├── Optimized Three-Dimensional Photovoltaic Structures with LLM guided Tree Search.pdf
│   │   └── REI_Japan_PlugInSolar_Roadmap_20260601.pdf
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
│   │   └── index.ts
│   ├── basin-dam/
│   │   ├── components/
│   │   ├── data.ts
│   │   └── index.ts
│   ├── ecosystem/
│   │   ├── components/
│   │   ├── data.ts
│   │   └── index.ts
│   ├── ecosystem-orgs/
│   │   └── components/
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
│   ├── ranking/
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
│   ├── maps/
│   │   └── japan.topojson
│   ├── apple-icon.png
│   ├── icon-dark-32x32.png
│   ├── icon-light-32x32.png
│   ├── icon.svg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
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


## 主要ロジックファイル

### `features/balcony-pv/data.ts`

```typescript
// Mock for balcony-plug-in-pv. Heuristic stand-in for suncalc-js-engine.

import type { CountryCode } from '@/lib/country-codes'
import type { WorldMacroRegion } from '@/lib/regions'

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
    // Recessed / loggia: side-wall shading → more diffuse, smaller effective area
    value: 'recessed',
    receivingAreaM2: 3.8,
    tiltDeg: 0,
    directRatio: 0.28,
    diffuseRatio: 0.72,
  },
  {
    // Roof terrace on flat roof deck
    value: 'roof_terrace',
    receivingAreaM2: 12,
    tiltDeg: 5,
    directRatio: 0.5,
    diffuseRatio: 0.5,
  },
] as const

/**
 * UK roof selector presets: flat / pitched gable (terrace house) / mansard+dormer.
 */
export const ROOF_TYPES: readonly RoofTypePreset[] = [
  {
    value: 'flat',
    receivingAreaM2: 18,
    tiltDeg: 5,
    directRatio: 0.48,
    diffuseRatio: 0.52,
  },
  {
    // Pitched gable — slate / clay tile terrace-house slopes
    value: 'pitched_gable',
    receivingAreaM2: 14,
    tiltDeg: 40,
    directRatio: 0.42,
    diffuseRatio: 0.58,
  },
  {
    // Mansard / dormer — steep outer pitch + dormer cheeks
    value: 'pitched_mansard_dormer',
    receivingAreaM2: 10,
    tiltDeg: 55,
    directRatio: 0.38,
    diffuseRatio: 0.62,
  },
] as const

export function getBalconyTypePreset(type: BalconyType): BalconyTypePreset {
  return BALCONY_TYPES.find((p) => p.value === type) ?? BALCONY_TYPES[0]
}

export function getRoofTypePreset(type: RoofType): RoofTypePreset {
  return ROOF_TYPES.find((p) => p.value === type) ?? ROOF_TYPES[0]
}

// Returns a suitability score (0-100) for the balcony simulator based on
// direction, railing type, and time of day.
export function computeBalconyScore(direction: Direction, railing: RailingType, hour: number): number {
  const directionScore: Record<Direction, number> = {
    south: 100,
    southeast: 88,
    southwest: 88,
    east: 68,
    west: 68,
  }
  const railingScore: Record<RailingType, number> = {
    glass: 100,
    grid: 90,
    concrete: 55,
  }
  // Bell curve centered at 12:30 across an 8:00-17:00 window.
  const distanceFromNoon = Math.abs(hour - 12.5)
  const timeScore = Math.max(30, 100 - distanceFromNoon * 12)

  const raw = directionScore[direction] * 0.45 + railingScore[railing] * 0.25 + timeScore * 0.3
  return Math.round(Math.min(100, Math.max(0, raw)))
}

export function scoreLabel(score: number): string {
  if (score >= 85) return '最高適性'
  if (score >= 70) return '高適性'
  if (score >= 50) return '標準適性'
  return '要検討'
}

export function recommendedKit(score: number): { panel: KitPanelKey; battery: KitStorageKey } {
  if (score >= 85) return { panel: 'panelDefault', battery: 'storageDefault' }
  if (score >= 70) return { panel: 'panelMid', battery: 'storageMid' }
  return { panel: 'panelLight', battery: 'storageLight' }
}

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
 * ① grid_plug_in — grid present, plug-in authorized
 * ② grid_no_plug — grid present, plug-in banned (storage / licensed work)
 * ③ no_grid_leapfrog — weak/absent grid, solar leapfrog
 */
export type GridCategory = 'grid_plug_in' | 'grid_no_plug' | 'no_grid_leapfrog'

/** systemModel → parent gridCategory */
export const SYSTEM_MODEL_GRID_CATEGORY: Record<SystemModelType, GridCategory> = {
  plug_800w: 'grid_plug_in',
  plug_1200w: 'grid_plug_in',
  plug_600w: 'grid_plug_in',
  net_metering: 'grid_plug_in',
  offgrid_storage: 'grid_no_plug',
  nec_strict: 'grid_no_plug',
  productive_offgrid: 'no_grid_leapfrog',
  micro_solar_kit: 'no_grid_leapfrog',
}

/** Authorization / deployment status shown on the world map. */
export type CountryPvStatusKind =
  | 'legal_plug'
  | 'appliance_notified'
  | 'storage_only'
  | 'strict_code'
  | 'plug_exemption'
  | 'productive_offgrid'
  | 'micro_solar_kit'

/** ISO country or US-state / subnational code used on the map. */
export type PvRegionCode =
  | CountryCode
  | 'NG'
  | 'ET'
  | 'KE'
  | 'ZA'
  | 'RW'
  | 'TZ'
  | 'UG'
  | 'SN'
  | 'AU'
  | 'VN'
  | 'IN'
  | 'SG'
  | 'ID'
  | 'PH'
  | 'TW'
  | 'US-UT'
  | 'US-CA'
  | 'US-CO'
  | 'US-WA'
  | 'US-OR'
  | 'US-AZ'
  | 'US-ME'
  | 'US-MN'
  | 'US-TX'
  | 'US-FL'
  | 'US-NY'
  | 'NZ'
  | 'ZA-CPT'
  | 'BR'

/** Global / widely distributed equipment vendor IDs (locale-independent). */
export type AdoptedVendorId =
  | 'enphase'
  | 'hoymiles'
  | 'anker-solix'
  | 'ecoflow'
  | 'tesla-energy'
  | 'mkopa'
  | 'sun-king'
  | 'dlight'
  | 'priwatt'
  | 'yuma'
  | 'solaredge'
  | 'sunrun'
  | 'goodleap'

export interface CountryPvDetail {
  id: string
  name: string
  /** English display name (locale bind). */
  nameEn?: string
  code: PvRegionCode
  rating: string // 例: "★★★★★"
  status: CountryPvStatusKind
  statusLabel: string
  /** Optional system-model tag (defaults inferred from status when omitted). */
  systemModel?: SystemModelType
  /**
   * Parent infrastructure category (defaults inferred from systemModel).
   * ① grid_plug_in / ② grid_no_plug / ③ no_grid_leapfrog
   */
  gridCategory?: GridCategory
  /** Macro region for focus tabs (defaults inferred from id when omitted). */
  regionCategory?: RegionCategory
  /** Parent region id for US-state grouping (e.g. `'usa'`). */
  parentId?: string
  /** Locale-independent driver keys or short JA demo phrases. */
  keyDrivers?: string[]
  /** English counterparts for `keyDrivers`. */
  keyDriversEn?: string[]
  /** Locale-independent bottleneck keys or short JA demo phrases. */
  bottlenecks?: string[]
  /** English counterparts for `bottlenecks`. */
  bottlenecksEn?: string[]
  powerLimit: string
  connectionMethod: string
  /** Optional English override for connection method (locale bind). */
  connectionMethodEn?: string
  tenantRights: string
  /** Optional English override for legal / tenant rights (locale bind). */
  tenantRightsEn?: string
  regulation: string
  /** Optional English override for regulation label (locale bind). */
  regulationEn?: string
  costRange: string
  paybackYears: string
  baseLoadCoverage: string
  incentives: string
  antiIslanding: string
  meterRequirement: string
  windSafety: string
  mountingRules: string
  summary: string
  /** Optional English override for summary (locale bind). */
  summaryEn?: string
  /** Map pin as [longitude, latitude]. */
  coordinates: [number, number]
  lastUpdated: string
  /**
   * Locale-independent vendor IDs suited to this region's rules / market
   * (resolved via `PV_VENDORS`). Not shown in related-orgs.
   */
  adoptedVendors?: AdoptedVendorId[]
}

/** Map legend rows (labels: `worldPv.map.*` or `label` fallback). */
export const WORLD_PV_STATUS_LEGEND = [
  { status: 'legal_plug' as const, colorClass: 'bg-emerald-500 ring-emerald-500/20', labelKey: 'legendLegalPlug', label: '800Wプラグ公認' },
  { status: 'plug_exemption' as const, colorClass: 'bg-cyan-500 ring-cyan-500/20', labelKey: 'legendPlugExemption', label: '1,200W免除' },
  { status: 'appliance_notified' as const, colorClass: 'bg-blue-500 ring-blue-500/20', labelKey: 'legendAppliance', label: '600W/家電区分' },
  { status: 'storage_only' as const, colorClass: 'bg-amber-500 ring-amber-500/20', labelKey: 'legendStorage', label: 'オフグリッド蓄電' },
  { status: 'productive_offgrid' as const, colorClass: 'bg-violet-500 ring-violet-500/20', labelKey: 'legendProductiveOffgrid', label: '生産型オフグリッド（灌漑・保冷）' },
  { status: 'micro_solar_kit' as const, colorClass: 'bg-rose-500 ring-rose-500/20', labelKey: 'legendMicroSolarKit', label: '生活キット/E-waste' },
  { status: 'strict_code' as const, colorClass: 'bg-red-500 ring-red-500/20', labelKey: 'legendStrictCode', label: 'NEC/厳格規程' },
] as const

export function resolveSystemModel(country: CountryPvDetail): SystemModelType {
  if (country.systemModel) return country.systemModel
  switch (country.status) {
    case 'legal_plug':
      return 'plug_800w'
    case 'plug_exemption':
      return 'plug_1200w'
    case 'appliance_notified':
      return 'plug_600w'
    case 'strict_code':
      return 'nec_strict'
    case 'productive_offgrid':
      return 'productive_offgrid'
    case 'micro_solar_kit':
      return 'micro_solar_kit'
    case 'storage_only':
    default:
      return 'offgrid_storage'
  }
}

/** Resolve parent ①/②/③ category from explicit field or systemModel. */
export function resolveGridCategory(country: CountryPvDetail): GridCategory {
  if (country.gridCategory) return country.gridCategory
  return SYSTEM_MODEL_GRID_CATEGORY[resolveSystemModel(country)]
}

const GRID_CATEGORY_SET = new Set<string>([
  'grid_plug_in',
  'grid_no_plug',
  'no_grid_leapfrog',
])

/** True when filter is a parent GridCategory id. */
export function isGridCategoryFilter(filter: string): filter is GridCategory {
  return GRID_CATEGORY_SET.has(filter)
}

/**
 * Model-dropdown match: `all` | parent GridCategory | leaf SystemModelType.
 */
export function matchesModelFilter(country: CountryPvDetail, filter: string): boolean {
  if (filter === 'all') return true
  if (isGridCategoryFilter(filter)) return resolveGridCategory(country) === filter
  return resolveSystemModel(country) === filter
}

export function resolveRegionCategory(country: CountryPvDetail): RegionCategory {
  if (country.regionCategory) return country.regionCategory
  if (
    country.parentId === 'usa' ||
    country.id.startsWith('us-') ||
    country.id === 'usa' ||
    country.id === 'br'
  ) {
    return 'americas'
  }
  if (
    ['nigeria', 'ethiopia', 'kenya', 'za', 'za-cpt', 'rw', 'tz', 'ug', 'sn'].includes(country.id)
  ) {
    return 'africa'
  }
  if (
    ['china', 'japan', 'au', 'vn', 'in', 'sg', 'indonesia', 'philippines', 'tw', 'nz'].includes(
      country.id,
    )
  ) {
    return 'asia-oceania'
  }
  if (
    ['germany', 'austria', 'italy', 'uk', 'france', 'belgium', 'switzerland'].includes(country.id)
  ) {
    return 'europe'
  }
  return 'asia-oceania'
}

export function getParentCountry(country: CountryPvDetail): CountryPvDetail | undefined {
  if (!country.parentId) return undefined
  return WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === country.parentId)
}

/** ★5段階評価（rating の ★個数）。セマンティックズーム／ランキング用。 */
export function getMaturityScore(country: CountryPvDetail): number {
  return (country.rating.match(/★/g) ?? []).length
}

/** @deprecated Prefer CountryPvDetail */
export type CountryPvStatus = CountryPvDetail

export function getCountryPvByCode(code: PvRegionCode): CountryPvDetail | undefined {
  return WORLD_BALCONY_PV_COUNTRIES.find((c) => c.code === code)
}

/** World-map chrome keys under `worldPv.sidebar` / `worldPv.detail`. */
export const WORLD_MAP_TITLE = 'ベランダソーラー世界実装'
export const WORLD_MAP_TAB_LABEL = '世界実装マップ'
/** @deprecated Prefer `worldPv.detail.close` via next-intl */
export const WORLD_MAP_CLOSE_LABEL = '閉じる'
/** @deprecated Prefer `worldPv.sidebar.relatedOrgs` via next-intl */
export const RELATED_ORGS_TITLE = '関連組織'
/** @deprecated Prefer `worldPv.sidebar.relatedOrgsEmpty` via next-intl */
export const RELATED_ORGS_EMPTY = '該当する組織がありません'
/** @deprecated Prefer `worldPv.sidebar.adoptedVendors` via next-intl */
export const ADOPTED_VENDORS_TITLE = '現地主要ソリューション / 適合機器'
/** @deprecated Prefer `worldPv.sidebar.adoptedVendorsEmpty` via next-intl */
export const ADOPTED_VENDORS_EMPTY = '該当する機器ベンダーがありません'
/** @deprecated Prefer `worldPv.sidebar.resizeAria` via next-intl */
export const SIDEBAR_RESIZE_ARIA_LABEL = 'サイドバー幅を調整'

/** Analysis panel chrome (map overlay; prefer `worldPv.detail.*` when dictionaries catch up). */
export const WORLD_PV_ANALYSIS_LABELS = {
  drivers: '主な推進要因',
  bottlenecks: '制度・経済の障壁',
  relatedOrgs: '関連組織',
  adoptedVendors: '現地主要ソリューション / 適合機器',
} as const

export type PvVendor = {
  id: AdoptedVendorId
  name: string
  nameEn?: string
  role: string
  roleEn?: string
  url?: string
}

/** Catalog of equipment vendors shown as adopted-solution chips (not related orgs). */
export const PV_VENDORS: Record<AdoptedVendorId, PvVendor> = {
  enphase: {
    id: 'enphase',
    name: 'Enphase Energy',
    role: 'マイクロインバータ・プラグイン機器',
    roleEn: 'Microinverters & plug-in equipment',
    url: 'https://enphase.com/',
  },
  hoymiles: {
    id: 'hoymiles',
    name: 'Hoymiles',
    role: 'マイクロインバータ製造・輸出',
    roleEn: 'Microinverter manufacturing & export',
    url: 'https://www.hoymiles.com/',
  },
  'anker-solix': {
    id: 'anker-solix',
    name: 'Anker Solix',
    role: 'ベランダ向け蓄電・プラグインキット',
    roleEn: 'Balcony storage & plug-in kits',
    url: 'https://www.anker.com/solix',
  },
  ecoflow: {
    id: 'ecoflow',
    name: 'EcoFlow',
    role: 'ポータブル電源・ベランダ向け蓄電キット',
    roleEn: 'Portable power stations & balcony storage kits',
    url: 'https://www.ecoflow.com/',
  },
  'tesla-energy': {
    id: 'tesla-energy',
    name: 'Tesla Energy',
    role: '家庭用蓄電・屋根連系ソリューション',
    roleEn: 'Residential storage & rooftop solutions',
    url: 'https://www.tesla.com/energy',
  },
  mkopa: {
    id: 'mkopa',
    name: 'M-KOPA',
    role: 'PAYGフィンテック / ソーラーホームシステム',
    roleEn: 'PAYG fintech / solar home systems',
    url: 'https://www.m-kopa.com/',
  },
  'sun-king': {
    id: 'sun-king',
    name: 'Sun King',
    role: 'オフグリッドSHS・インバータ',
    roleEn: 'Off-grid SHS & inverters',
    url: 'https://sunking.com/',
  },
  dlight: {
    id: 'dlight',
    name: 'd.light',
    role: 'ソーラーランタン・高耐久家庭用電源',
    roleEn: 'Solar lanterns & durable household power',
    url: 'https://www.dlight.com/',
  },
  priwatt: {
    id: 'priwatt',
    name: 'Priwatt',
    role: 'ベランダソーラーD2C・800W公認キット',
    roleEn: 'Balcony solar D2C & 800W certified kits',
    url: 'https://priwatt.de',
  },
  yuma: {
    id: 'yuma',
    name: 'Yuma',
    role: 'バルコニー手すり特化プラグインキット',
    roleEn: 'Balcony-railing plug-in kits',
    url: 'https://yuma.de',
  },
  solaredge: {
    id: 'solaredge',
    name: 'SolarEdge',
    role: 'スマートインバータ・DCオプティマイザ',
    roleEn: 'Smart inverters & DC optimizers',
    url: 'https://www.solaredge.com',
  },
  sunrun: {
    id: 'sunrun',
    name: 'Sunrun',
    role: '家庭用蓄電・分散型VPP',
    roleEn: 'Residential storage & distributed VPP',
    url: 'https://www.sunrun.com',
  },
  goodleap: {
    id: 'goodleap',
    name: 'GoodLeap',
    role: 'PAYGフィンテック・クリーンエネルギーローン',
    roleEn: 'PAYG fintech & clean-energy loans',
    url: 'https://goodleap.com',
  },
}

/** Product category for global hardware vendors (display labels). */
export type GlobalPvVendorCategory =
  | 'マイクロインバータ'
  | 'ベランダ蓄電キット'
  | 'ポータブル電源'
  | '家庭用蓄電'
  | 'オフグリッドSHS'
  | 'PAYGフィンテック'
  | 'スマートインバータ・DCオプティマイザ'
  | '家庭用蓄電・分散型VPP'
  | 'PAYGフィンテック・クリーンエネルギーローン'

/** Global hardware vendor card for the major-vendors sidebar. */
export type GlobalPvVendor = {
  id: AdoptedVendorId
  name: string
  nameJa: string
  /** 銘柄・上場区分（例: `NASDAQ: SEDG` / `未上場`）。 */
  ticker?: string
  tickerEn?: string
  /** 本社所在地（国・都市の表示ラベル）。 */
  hqCountry: string
  hqCountryEn?: string
  /**
   * 本社・発祥のマクロ地域。
   * 主要企業一覧の「地域」フィルターは既定でこの値で絞り込む。
   */
  headquartersRegion: RegionCategory
  category: GlobalPvVendorCategory
  categoryEn?: string
  description: string
  descriptionEn?: string
  keyProducts: string[]
  /** WORLD_BALCONY_PV_COUNTRIES ids where the vendor is suited / deployed. */
  targetRegionIds: string[]
  /**
   * 主要展開マクロ地域（欧州 / アフリカ / アジア・オセアニア / 北米・米州）。
   * カード下部の展開バッジに使い、国名チップの肥大化を避ける。
   */
  targetRegions: RegionCategory[]
  url: string
}

/** Major global hardware vendors (阳台 / plug-in / storage kit makers). */
export const GLOBAL_PV_VENDORS: GlobalPvVendor[] = [
  {
    id: 'enphase',
    name: 'Enphase Energy',
    nameJa: 'エンフェーズ・エナジー',
    hqCountry: 'アメリカ合衆国（カリフォルニア）',
    hqCountryEn: 'United States (California)',
    headquartersRegion: 'americas',
    category: 'マイクロインバータ',
    description:
      'マイクロインバータとプラグイン対応機器で米欧のベランダ・小規模PV市場を牽引。州別プラグイン免除との相性が高い。',
    descriptionEn:
      'Leads U.S./EU balcony and small PV with microinverters and plug-in gear—strong fit with state plug-in waivers.',
    keyProducts: ['IQ Microinverter', 'IQ Battery', 'Plug & Play kits'],
    targetRegionIds: [
      'usa',
      'us-ut',
      'us-ca',
      'us-co',
      'us-wa',
      'us-or',
      'us-az',
      'us-me',
      'us-mn',
      'us-ny',
      'au',
      'sg',
      'nz',
    ],
    targetRegions: ['americas', 'asia-oceania'],
    url: 'https://enphase.com/',
  },
  {
    id: 'hoymiles',
    name: 'Hoymiles',
    nameJa: 'ホイマイルズ',
    hqCountry: '中国（杭州）',
    hqCountryEn: 'China (Hangzhou)',
    headquartersRegion: 'asia-oceania',
    category: 'マイクロインバータ',
    description:
      '欧州ベランダPV向けマイクロインバータの主要輸出メーカー。800W/1,200W級プラグインキットの心臓部として広く流通。',
    descriptionEn:
      'Major microinverter exporter for European balcony PV—widely used as the core of 800W/1,200W plug-in kits.',
    keyProducts: ['HM / HMS microinverters', 'Plug-in balcony kits'],
    targetRegionIds: [
      'germany',
      'austria',
      'italy',
      'uk',
      'france',
      'belgium',
      'switzerland',
      'china',
      'us-ut',
      'us-ca',
      'us-co',
      'us-wa',
      'us-or',
      'us-az',
      'us-me',
      'us-mn',
      'za',
      'au',
      'vn',
      'in',
      'sg',
      'nz',
      'za-cpt',
      'br',
    ],
    targetRegions: ['europe', 'asia-oceania', 'americas', 'africa'],
    url: 'https://www.hoymiles.com/',
  },
  {
    id: 'anker-solix',
    name: 'Anker Solix',
    nameJa: 'アンカー・ソリックス',
    hqCountry: '中国（深圳）',
    hqCountryEn: 'China (Shenzhen)',
    headquartersRegion: 'asia-oceania',
    category: 'ベランダ蓄電キット',
    description:
      'ベランダ向け蓄電・プラグインキットを量販チャネルで展開。欧州の800W公認市場とアジアのオフグリッド蓄電需要の双方に適合。',
    descriptionEn:
      'Retail balcony storage and plug-in kits—fits Europe’s 800W certified market and Asia’s off-grid storage demand.',
    keyProducts: ['Solix balcony kits', 'Solix power banks', 'Balcony storage'],
    targetRegionIds: [
      'germany',
      'austria',
      'italy',
      'uk',
      'france',
      'belgium',
      'switzerland',
      'china',
      'japan',
      'us-ut',
      'us-ca',
      'us-az',
      'nigeria',
      'kenya',
      'za',
      'rw',
      'ug',
      'au',
      'vn',
      'in',
      'tw',
      'za-cpt',
      'br',
    ],
    targetRegions: ['europe', 'asia-oceania', 'americas', 'africa'],
    url: 'https://www.anker.com/solix',
  },
  {
    id: 'ecoflow',
    name: 'EcoFlow',
    nameJa: 'エコフロー',
    hqCountry: '中国（深圳）',
    hqCountryEn: 'China (Shenzhen)',
    headquartersRegion: 'asia-oceania',
    category: 'ポータブル電源',
    description:
      'ポータブル電源とベランダ蓄電キットで、系統直結が難しい市場（日本・NEC厳格州・停電自衛市場）の自給ルートを担う。',
    descriptionEn:
      'Portable power and balcony storage for markets where outlet tie is hard (Japan, NEC-strict states, outage self-supply).',
    keyProducts: ['DELTA / RIVER series', 'PowerStream', 'Balcony storage kits'],
    targetRegionIds: [
      'japan',
      'usa',
      'us-tx',
      'us-fl',
      'us-ny',
      'nigeria',
      'ethiopia',
      'kenya',
      'za',
      'rw',
      'tz',
      'ug',
      'sn',
      'vn',
      'tw',
      'za-cpt',
    ],
    targetRegions: ['asia-oceania', 'americas', 'africa'],
    url: 'https://www.ecoflow.com/',
  },
  {
    id: 'tesla-energy',
    name: 'Tesla Energy',
    nameJa: 'テスラ・エナジー',
    hqCountry: 'アメリカ合衆国（テキサス）',
    hqCountryEn: 'United States (Texas)',
    headquartersRegion: 'americas',
    category: '家庭用蓄電',
    description:
      '家庭用蓄電と屋根連系ソリューション。米国内のNEC厳格州ではオフグリッド／バックアップ寄りの選択肢として位置づけられる。',
    descriptionEn:
      'Home storage and rooftop solutions—positioned as off-grid/backup options in NEC-strict U.S. states.',
    keyProducts: ['Powerwall', 'Solar Roof', 'Backup Gateway'],
    targetRegionIds: ['usa', 'us-tx', 'us-fl'],
    targetRegions: ['americas'],
    url: 'https://www.tesla.com/energy',
  },
  {
    id: 'mkopa',
    name: 'M-KOPA',
    nameJa: 'エムコパ',
    hqCountry: 'ケニア / 英国',
    hqCountryEn: 'Kenya / United Kingdom',
    headquartersRegion: 'africa',
    category: 'PAYGフィンテック',
    description:
      'PAYGフィンテックとソーラーホームシステムで、日額・週額の小口払いで非消費層の電化を解放。M-Pesa連動の遠隔通電モデルを東アフリカで先行させた。',
    descriptionEn:
      'PAYG fintech and SHS unlock electrification for non-consumers via daily/weekly micro-payments—pioneered M-Pesa remote-power models in East Africa.',
    keyProducts: ['Solar Home Systems', 'PAYG IoT metering', 'Asset financing'],
    targetRegionIds: ['kenya', 'ug'],
    targetRegions: ['africa'],
    url: 'https://www.m-kopa.com/',
  },
  {
    id: 'sun-king',
    name: 'Sun King',
    nameJa: 'サンキング',
    hqCountry: 'ケニア / インド（グローバル南部分散）',
    hqCountryEn: 'Kenya / India (Global South distributed)',
    headquartersRegion: 'africa',
    category: 'オフグリッドSHS',
    description:
      '世界最大級のオフグリッドSHS・インバータベンダー。照明キットからTV・ファン付きシステムまで、エネルギーのはしごを量産で押し上げる。',
    descriptionEn:
      'One of the world’s largest off-grid SHS/inverter vendors—mass-producing the energy ladder from lighting kits to TV/fan systems.',
    keyProducts: ['SHS kits', 'Solar lanterns', 'Home inverters'],
    targetRegionIds: ['kenya', 'nigeria', 'in'],
    targetRegions: ['africa', 'asia-oceania'],
    url: 'https://sunking.com/',
  },
  {
    id: 'dlight',
    name: 'd.light',
    nameJa: 'ディーライト',
    hqCountry: 'ケニア / 米国（グローバル南部分散）',
    hqCountryEn: 'Kenya / United States (Global South distributed)',
    headquartersRegion: 'africa',
    category: 'オフグリッドSHS',
    description:
      'ソーラーランタンと高耐久家庭用電源で、ケロシン代替から生活電化までを担う。過酷環境向けの耐久設計が強み。',
    descriptionEn:
      'Solar lanterns and rugged household power from kerosene replacement to life electrification—built for harsh environments.',
    keyProducts: ['Solar lanterns', 'Portable solar kits', 'Household SHS'],
    targetRegionIds: ['kenya', 'nigeria'],
    targetRegions: ['africa'],
    url: 'https://www.dlight.com/',
  },
  {
    id: 'priwatt',
    name: 'Priwatt',
    nameJa: 'プリワット',
    hqCountry: 'ドイツ・ライプツィヒ',
    hqCountryEn: 'Germany (Leipzig)',
    headquartersRegion: 'europe',
    category: 'ベランダ蓄電キット',
    description:
      'ドイツにおけるベランダソーラーD2Cの牽引役。行政申請代行や800W公認キットのワンストップ提供で市民普及を加速。',
    descriptionEn:
      'Leading German balcony-solar D2C—one-stop 800W certified kits and filing support accelerating citizen adoption.',
    keyProducts: ['priBalcony (800W kit)', 'priFlat', 'priStorage'],
    targetRegionIds: ['germany', 'austria', 'switzerland'],
    targetRegions: ['europe'],
    url: 'https://priwatt.de',
  },
  {
    id: 'yuma',
    name: 'Yuma',
    nameJa: 'ユマ',
    hqCountry: 'ドイツ・ケルン',
    hqCountryEn: 'Germany (Cologne)',
    headquartersRegion: 'europe',
    category: 'ベランダ蓄電キット',
    description:
      '集合住宅のバルコニー手すりやテラスに特化した軽量モジュールとマイクロインバータの一体キットを展開。',
    descriptionEn:
      'Lightweight module + microinverter kits specialized for multifamily balcony railings and terraces.',
    keyProducts: ['Yuma Balcony', 'Yuma Roof', 'Yuma Flat'],
    targetRegionIds: ['germany', 'austria', 'france'],
    targetRegions: ['europe'],
    url: 'https://yuma.de',
  },
  {
    id: 'solaredge',
    name: 'SolarEdge',
    nameJa: 'ソーラーエッジ',
    ticker: 'NASDAQ: SEDG',
    hqCountry: 'アメリカ合衆国（カリフォルニア / イスラエル）',
    hqCountryEn: 'United States (California / Israel)',
    headquartersRegion: 'americas',
    category: 'スマートインバータ・DCオプティマイザ',
    categoryEn: 'Smart Inverters & DC Optimizers',
    description:
      'モジュール単位の電力最適化（DCオプティマイザ）とスマートインバータの世界的リーダー。急速遮断（Rapid Shutdown）安全基準を確立。',
    descriptionEn:
      'Global leader in module-level power electronics (DC optimizers) and smart inverters, setting safety benchmarks for Rapid Shutdown.',
    keyProducts: [
      'SolarEdge Home Hub Inverter',
      'Power Optimizer',
      'SolarEdge Home Battery',
    ],
    targetRegionIds: [
      'usa',
      'us-ca',
      'us-ut',
      'us-az',
      'us-tx',
      'germany',
      'uk',
      'au',
      'japan',
    ],
    targetRegions: ['americas', 'europe', 'asia-oceania'],
    url: 'https://www.solaredge.com',
  },
  {
    id: 'sunrun',
    name: 'Sunrun',
    nameJa: 'サンラン',
    ticker: 'NASDAQ: RUN',
    hqCountry: 'アメリカ合衆国（カリフォルニア）',
    hqCountryEn: 'United States (California)',
    headquartersRegion: 'americas',
    category: '家庭用蓄電・分散型VPP',
    categoryEn: 'Residential Storage & Distributed VPP',
    description:
      '全米最大の住宅用太陽光・蓄電池リース（PPA）事業者。NEM 3.0下の家庭用蓄電シフトと家庭用VPP（仮想発電所）網を主導。',
    descriptionEn:
      'The largest residential solar and battery storage installer/PPA provider in the US, spearheading the storage shift and residential VPP networks under NEM 3.0.',
    keyProducts: [
      'Sunrun Brightbox (Solar+Storage)',
      'Virtual Power Plant (VPP)',
      'Residential Solar PPA',
    ],
    targetRegionIds: ['usa', 'us-ca', 'us-az', 'us-tx', 'us-fl', 'us-ny'],
    targetRegions: ['americas'],
    url: 'https://www.sunrun.com',
  },
  {
    id: 'goodleap',
    name: 'GoodLeap',
    nameJa: 'グッドリープ',
    ticker: '未上場',
    tickerEn: 'Unlisted',
    hqCountry: 'アメリカ合衆国（カリフォルニア）',
    hqCountryEn: 'United States (California)',
    headquartersRegion: 'americas',
    category: 'PAYGフィンテック・クリーンエネルギーローン',
    categoryEn: 'PAYG Fintech & Clean-Energy Loans',
    description:
      '米国の住宅用太陽光・蓄電池導入を支える最大手フィンテック。即時融資プラットフォームにより初期費用の壁を取り払い普及を加速。',
    descriptionEn:
      'Leading sustainable home fintech platform in the US, driving residential solar and storage adoption through seamless point-of-sale financing.',
    keyProducts: [
      'GoodLeap Sustainable Home Loan',
      'Installer POS Financing Platform',
      'Flexible Energy Pay-over-time',
    ],
    targetRegionIds: ['usa', 'us-ca', 'us-az', 'us-tx', 'us-fl'],
    targetRegions: ['americas'],
    url: 'https://goodleap.com',
  },
]

/** Alias used by company/ticker list UIs (`COMPANIES.length` / count badges). */
export const COMPANIES = GLOBAL_PV_VENDORS

export function getAdoptedVendors(country: CountryPvDetail): PvVendor[] {
  return (country.adoptedVendors ?? [])
    .map((id) => PV_VENDORS[id])
    .filter((v): v is PvVendor => Boolean(v))
}

export function getAdoptedVendorsByCountryId(countryId: string): PvVendor[] {
  const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === countryId)
  return country ? getAdoptedVendors(country) : []
}

/** Macro regions where a global vendor is suited / deployed (explicit `targetRegions` preferred). */
export function getVendorRegionCategories(vendor: GlobalPvVendor): RegionCategory[] {
  if (vendor.targetRegions.length > 0) return vendor.targetRegions
  const cats = new Set<RegionCategory>()
  for (const id of vendor.targetRegionIds) {
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === id)
    if (country) cats.add(resolveRegionCategory(country))
  }
  return [...cats]
}

/** Display names for vendor target regions (deduped, parents preferred). */
export function getVendorRegionLabels(vendor: GlobalPvVendor): string[] {
  const names: string[] = []
  const seen = new Set<string>()
  for (const id of vendor.targetRegionIds) {
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === id)
    if (!country) continue
    const label = country.parentId
      ? (WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === country.parentId)?.name ?? country.name)
      : country.name
    if (seen.has(label)) continue
    seen.add(label)
    names.push(label)
  }
  return names
}

/** Locale-independent region filter ids for the major-vendors list. */
export const VENDOR_REGION_FILTERS = [
  'all',
  'europe',
  'africa',
  'asia-oceania',
  'americas',
] as const satisfies readonly ('all' | RegionCategory)[]

export type VendorRegionFilter = (typeof VENDOR_REGION_FILTERS)[number]

/** Category filter ids for the major-vendors list (plus `all`). */
export const VENDOR_CATEGORY_FILTERS = [
  'all',
  'マイクロインバータ',
  'ベランダ蓄電キット',
  'ポータブル電源',
  '家庭用蓄電',
  'オフグリッドSHS',
  'PAYGフィンテック',
  'スマートインバータ・DCオプティマイザ',
  '家庭用蓄電・分散型VPP',
  'PAYGフィンテック・クリーンエネルギーローン',
] as const satisfies readonly ('all' | GlobalPvVendorCategory)[]

export type VendorCategoryFilter = (typeof VENDOR_CATEGORY_FILTERS)[number]

/**
 * 主要企業一覧の絞り込み。
 * 地域は既定で本社・発祥（`headquartersRegion`）基準 — 展開市場（`targetRegions`）とは混同しない。
 */
export function filterGlobalPvVendors(
  region: VendorRegionFilter = 'all',
  category: VendorCategoryFilter = 'all',
): GlobalPvVendor[] {
  return GLOBAL_PV_VENDORS.filter((v) => {
    const regionOk = region === 'all' || v.headquartersRegion === region
    const categoryOk = category === 'all' || v.category === category
    return regionOk && categoryOk
  })
}

/** Non-profit / commons / standards actor for the world-implementation tab. */
export type NonProfitOrg = {
  id: string
  name: string
  nameEn: string
  /** 拠点国・都市（表示ラベル）。 */
  headquarters: string
  headquartersEn: string
  /** 4大地域区分。 */
  region: RegionCategory
  /** 活動種別（JA）。 */
  category: string
  categoryEn: string
  overview: string
  overviewEn: string
  barrierOvercome: string
  barrierOvercomeEn: string
  keyMilestone: string
  keyMilestoneEn: string
  websiteUrl: string
}

/** Locale-independent region filter ids for the non-profit orgs list. */
export const NON_PROFIT_REGION_FILTERS = VENDOR_REGION_FILTERS

export type NonProfitRegionFilter = VendorRegionFilter

/**
 * 非営利・推進団体・コモンズ（各地域の制度突破プレイヤー）。
 * タイムラインの重要アクターを企業一覧と同型のカードデータへ整理。
 */
export const NON_PROFIT_ORGS: NonProfitOrg[] = [
  {
    id: 'dgs',
    name: 'DGS（Deutsche Gesellschaft für Sonnenenergie）',
    nameEn: 'DGS (Deutsche Gesellschaft für Sonnenenergie)',
    headquarters: 'ドイツ',
    headquartersEn: 'Germany',
    region: 'europe',
    category: '工学安全立証・規格策定',
    categoryEn: 'Engineering safety proof & standards',
    overview:
      'ドイツ太陽エネルギー協会。ベランダプラグインPVの配線熱安全を工学的に立証し、市民・政策側の安全議論を規格レベルへ引き上げた。',
    overviewEn:
      'German Solar Energy Society. Proved balcony plug-in PV wiring thermal safety in engineering terms and lifted citizen/policy debates to standards level.',
    barrierOvercome:
      '「コンセント直結は危険・違法」という電力会社・規格側の前提と、安全マージン未証明による法制化停滞',
    barrierOvercomeEn:
      'Utility/standards assumptions that outlet ties are dangerous/illegal, and stalled legalization without proven safety margins',
    keyMilestone: '自社安全基準 DGS 0001、800W配線無害性の実証',
    keyMilestoneEn: 'In-house safety standard DGS 0001; proved 800W wiring harmlessness',
    websiteUrl: 'https://www.dgs.de/',
  },
  {
    id: 'stecker-solar',
    name: '欧州プラグインソーラー連盟（Stecker-Solar）',
    nameEn: 'European Plug-in Solar Alliance (Stecker-Solar)',
    headquarters: 'ドイツ・EU',
    headquartersEn: 'Germany / EU',
    region: 'europe',
    category: '市民普及・コモンズ',
    categoryEn: 'Citizen adoption & commons',
    overview:
      '市民・メーカー連合の欧州コモンズ。プラグインPV合法化の市民運動と Solarpaket I ロビーを牽引し、賃貸・集合住宅への普及を加速した。',
    overviewEn:
      'Citizen–maker European commons. Drove plug-in PV legalization campaigns and Solarpaket I lobbying, accelerating rental/multifamily adoption.',
    barrierOvercome:
      'ゲリラ連系と厳格届出の二極化、賃貸設置権の不在、市民向け安全規格の空白',
    barrierOvercomeEn:
      'Polarization between guerrilla ties and strict filings, missing tenant install rights, and a blank in citizen-facing safety standards',
    keyMilestone: 'プラグインPV合法化市民運動、Solarpaket Iロビー',
    keyMilestoneEn: 'Citizen plug-in PV legalization movement; Solarpaket I lobbying',
    websiteUrl: 'https://www.balkon.solar/',
  },
  {
    id: 'gogla',
    name: 'GOGLA（Global Off-Grid Lighting Association）',
    nameEn: 'GOGLA (Global Off-Grid Lighting Association)',
    headquarters: 'オランダ / ケニア',
    headquartersEn: 'Netherlands / Kenya',
    region: 'africa',
    category: '品質保証フレームワーク',
    categoryEn: 'Quality assurance framework',
    overview:
      'オフグリッド照明・SHSの国際業界団体。PAYG機器の品質標準と市場データ共有で、粗悪品排除と非消費層の電化を両立させる枠組みを整備した。',
    overviewEn:
      'Global off-grid lighting/SHS industry association. Built quality standards and market-data sharing for PAYG gear—cutting counterfeits while unlocking non-consumer electrification.',
    barrierOvercome: '粗悪品乱立とPAYG契約・課金モデルのばらつき、品質未検証キットの火災・故障リスク',
    barrierOvercomeEn:
      'Counterfeit flood, fragmented PAYG contract/billing models, and fire/failure risk from unverified kits',
    keyMilestone: 'SHS・PAYG機器の国際品質標準化、粗悪品排除',
    keyMilestoneEn: 'International quality standardization for SHS/PAYG gear; counterfeit exclusion',
    websiteUrl: 'https://www.gogla.org/',
  },
  {
    id: 'cec',
    name: 'Clean Energy Council (CEC)',
    nameEn: 'Clean Energy Council (CEC)',
    headquarters: 'オーストラリア',
    headquartersEn: 'Australia',
    region: 'asia-oceania',
    category: '系統接続規格・認証',
    categoryEn: 'Grid interconnection standards & certification',
    overview:
      '豪州の再エネ業界団体。系統混雑下の動的出力制御と賃貸テナント自給枠の検証を進め、戸建て普及後の Solar Split 解消を制度面から支援する。',
    overviewEn:
      'Australia’s clean-energy industry body. Advances Dynamic Export under grid congestion and renter self-supply trials—institutionally closing the post-rooftop Solar Split.',
    barrierOvercome: '戸建て普及後の系統逆潮限制約と賃貸テナントの自給格差',
    barrierOvercomeEn: 'Export limits after the rooftop boom and renter self-supply gaps',
    keyMilestone: '動的出力制御（Dynamic Export）策定、賃貸自給枠検証',
    keyMilestoneEn: 'Dynamic Export framework; rental self-supply verification',
    websiteUrl: 'https://www.cleanenergycouncil.org.au/',
  },
  {
    id: 'jpea',
    name: 'JPEA（太陽光発電協会）',
    nameEn: 'JPEA (Japan Photovoltaic Energy Association)',
    headquarters: '日本',
    headquartersEn: 'Japan',
    region: 'asia-oceania',
    category: '自律給電・自主指針',
    categoryEn: 'Autonomous supply & industry guidance',
    overview:
      '日本の太陽光発電業界団体。内線規程によりコンセント直結が難しい環境で、系統非連携・ポータブル電源によるオフグリッド自給枠の定着を業界指針として支えた。',
    overviewEn:
      'Japan’s PV industry association. Under wiring rules that block outlet ties, supported industry guidance for non-export and portable-power off-grid self-supply.',
    barrierOvercome: '内線規程による直結禁止と、合法な自給ルートの不明確さ',
    barrierOvercomeEn: 'Outlet-tie bans under indoor wiring rules and unclear lawful self-supply paths',
    keyMilestone: '系統非連携・ポータブル電源オフグリッド自給枠の定着',
    keyMilestoneEn: 'Normalized non-export / portable-power off-grid self-supply frameworks',
    websiteUrl: 'https://www.jpea.gr.jp/',
  },
  {
    id: 'bnetza',
    name: '連邦ネットワーク庁（BNetzA）',
    nameEn: 'Federal Network Agency (BNetzA)',
    headquarters: 'ドイツ',
    headquartersEn: 'Germany',
    region: 'europe',
    category: '登録簡素化・規制緩和',
    categoryEn: 'Registration simplification & deregulation',
    overview:
      'ドイツのエネルギー規制当局。MaStR登録の一本化と旧型メーター逆回転の一時容認により、ベランダPVの届出摩擦を劇的に下げた公的アクター。',
    overviewEn:
      'Germany’s energy regulator. Unified MaStR registration and temporarily allowed reverse-spin on legacy meters—dramatically cutting balcony-PV filing friction.',
    barrierOvercome: '複線的な届出・登録手続きと、旧メーター逆回転を理由とした導入拒否',
    barrierOvercomeEn:
      'Fragmented filing/registration processes and refusals based on reverse-spin of legacy meters',
    keyMilestone: 'MaStR登録の一本化、逆回転メーター一時容認',
    keyMilestoneEn: 'Unified MaStR registration; temporary allowance of reverse-spin meters',
    websiteUrl: 'https://www.bundesnetzagentur.de/',
  },
  {
    id: 'solar-united-neighbors',
    name: 'Solar United Neighbors (SUN)',
    nameEn: 'Solar United Neighbors (SUN)',
    headquarters: 'アメリカ・ワシントンD.C.',
    headquartersEn: 'United States (Washington, D.C.)',
    region: 'americas',
    category: '市民コモンズ・共同調達',
    categoryEn: 'Citizen commons & group purchasing',
    overview:
      '全米最大の市民ソーラー推進NPO。市民共同購入（Solar Co-op）や屋根・バルコニー設置権の擁護活動を展開。',
    overviewEn:
      'The largest U.S. citizen solar advocacy NPO. Runs Solar Co-op group buying and defends rooftop/balcony install rights.',
    barrierOvercome: '大手電力によるネットメータリング廃止攻勢と高額な個別導入コスト',
    barrierOvercomeEn:
      'Utility campaigns to end net metering and high individual install costs',
    keyMilestone: '共同購買モデルの全国展開と州レベルでのソーラー設置権利（Solar Rights）の保護',
    keyMilestoneEn:
      'Nationwide co-op purchasing model and state-level Solar Rights protection',
    websiteUrl: 'https://www.solarunitedneighbors.org',
  },
  {
    id: 'vote-solar',
    name: 'Vote Solar',
    nameEn: 'Vote Solar',
    headquarters: 'アメリカ・カリフォルニア',
    headquartersEn: 'United States (California)',
    region: 'americas',
    category: '政策提言・法制化',
    categoryEn: 'Policy advocacy & legislation',
    overview:
      '市民のエネルギーアクセス権を掲げ、全米各州で系統接続規制緩和や小型分散ソーラーの普及を促すNPO。',
    overviewEn:
      'NPO advancing citizen energy-access rights—pushing state-level interconnect relief and small distributed solar nationwide.',
    barrierOvercome: '州ごとの硬直的な許認可手続きと電力会社による接続妨害',
    barrierOvercomeEn:
      'Rigid state-by-state permitting and utility interconnection obstruction',
    keyMilestone: '分散型ソーラーに対する公平な系統アクセス権と低所得層向け自給支援策の法制化',
    keyMilestoneEn:
      'Legislation for fair grid access for distributed solar and low-income self-supply support',
    websiteUrl: 'https://votesolar.org',
  },
  {
    id: 'utah-clean-energy',
    name: 'Utah Clean Energy',
    nameEn: 'Utah Clean Energy',
    headquarters: 'アメリカ・ユタ州',
    headquartersEn: 'United States (Utah)',
    region: 'americas',
    category: '市民権利擁護・系統協議免除',
    categoryEn: 'Civic rights advocacy & grid-study exemption',
    overview:
      '全米初の1,200Wプラグイン系統協議完全免除法の成立を主導した市民環境団体。',
    overviewEn:
      "Civic clean energy coalition that spearheaded the nation's first complete 1,200W plug-in grid-study exemption law.",
    barrierOvercome: '大手電力による系統協議の長期化と高額な連系手数料によるプラグイン封殺',
    barrierOvercomeEn:
      'Plug-in solar blockage caused by protracted grid interconnection studies and punitive utility fees',
    keyMilestone: '全米初となる1,200W系統協議完全免除法の成立',
    keyMilestoneEn: "Passage of the nation's first 1,200W complete grid-study exemption law",
    websiteUrl: 'https://utahcleanenergy.org',
  },
  {
    id: 'calssa',
    name: 'CALSSA (California Solar & Storage Association)',
    nameEn: 'CALSSA (California Solar & Storage Association)',
    headquarters: 'アメリカ・カリフォルニア州',
    headquartersEn: 'United States (California)',
    region: 'americas',
    category: '自給防衛・蓄電シフト',
    categoryEn: 'Self-supply defense & storage shift',
    overview:
      'カリフォルニアの太陽光・蓄電業界連盟。NEM 3.0下の売電単価激変に対抗し、プラグイン蓄電・自家消費の標準化を推進。',
    overviewEn:
      "California's premier solar & storage alliance, defending self-consumption and plug-in storage standards amid NEM 3.0 export cuts.",
    barrierOvercome: '電力大手によるNEM 3.0売電単価75%削減と高額な系統連系工事義務',
    barrierOvercomeEn:
      '75% export rate slashing under NEM 3.0 and utility-mandated costly interconnection upgrades',
    keyMilestone: 'プラグイン蓄電・自家消費型（Solar+Storage）の普及標準化',
    keyMilestoneEn:
      'Standardization of plug-in storage and solar-plus-storage self-consumption pathways',
    websiteUrl: 'https://calssa.org',
  },
  {
    id: 'isep',
    name: '環境エネルギー政策研究所（ISEP）',
    nameEn: 'Institute for Sustainable Energy Policies (ISEP)',
    headquarters: '日本・東京',
    headquartersEn: 'Japan (Tokyo)',
    region: 'asia-oceania',
    category: '政策提言・市民エネルギー',
    categoryEn: 'Policy advocacy & citizen energy',
    overview:
      '地域分散型エネルギーと市民共同発電の草分け的シンクタンク。系統制約の可視化と制度改革を提言。',
    overviewEn:
      'Pioneer think tank for regional distributed energy and citizen co-owned generation. Visualizes grid constraints and proposes institutional reform.',
    barrierOvercome: '既存電力会社による送電網独占と「空き容量ゼロ」による系統連系拒絶',
    barrierOvercomeEn:
      'Incumbent utility grid monopolies and interconnection refusals citing “zero available capacity”',
    keyMilestone: '日本国内の再エネ接続可能容量の工学的検証と市民出資型分散発電モデルの確立',
    keyMilestoneEn:
      'Engineering verification of Japan’s renewable interconnect capacity and establishment of citizen-funded distributed generation models',
    websiteUrl: 'https://www.isep.or.jp',
  },
  {
    id: 'lighting-global',
    name: 'Lighting Global（世界銀行・IFC）',
    nameEn: 'Lighting Global (World Bank / IFC)',
    headquarters: 'ケニア・ナイロビ / 米国',
    headquartersEn: 'Kenya (Nairobi) / United States',
    region: 'africa',
    category: '品質保証・未電化普及',
    categoryEn: 'Quality assurance & unelectrified-market access',
    overview:
      'GOGLAと連携し、サブサハラアフリカにおけるオフグリッドPV機器の国際品質試験と市場開拓を支援。',
    overviewEn:
      'In partnership with GOGLA, supports international quality testing and market development for off-grid PV products across sub-Saharan Africa.',
    barrierOvercome: '市場に蔓延する粗悪・偽造ソーラー機器による住民の不信と普及停滞',
    barrierOvercomeEn:
      'Public distrust and stalled adoption caused by widespread counterfeit/substandard solar products',
    keyMilestone: '世界共通のオフグリッド品質基準（Quality Standards）策定と市場健全化',
    keyMilestoneEn:
      'Global off-grid Quality Standards and market clean-up',
    websiteUrl: 'https://www.lightingglobal.org',
  },
  {
    id: 'selco-foundation',
    name: 'セルコ財団 (SELCO Foundation)',
    nameEn: 'SELCO Foundation',
    headquarters: 'インド・バンガロール',
    headquartersEn: 'India (Bengaluru)',
    region: 'asia-oceania',
    category: 'BoP分散自給・生計電化',
    categoryEn: 'BoP decentralized self-supply & livelihood electrification',
    overview:
      'インドの低所得層・露天商向けに小口金融と分散ソーラーを結合し、生活と生計を支えるエネルギー自給モデルを確立した先駆的財団。',
    overviewEn:
      'Pioneering non-profit enabling decentralized solar and micro-financing for low-income households and street vendors across India.',
    barrierOvercome: '貧困層の初期費用不足と送電網不在によるエネルギー排除',
    barrierOvercomeEn:
      'Financial exclusion and lack of grid access among underserved rural populations',
    keyMilestone: '露店・小型農機・医療施設のオフグリッド分散電化エコシステムの確立',
    keyMilestoneEn: 'Establishment of decentralized solar livelihood and healthcare ecosystems',
    websiteUrl: 'https://selcofoundation.org',
  },
  {
    id: 'asean-centre-for-energy',
    name: 'ASEANエネルギーセンター (ACE)',
    nameEn: 'ASEAN Centre for Energy (ACE)',
    headquarters: 'インドネシア・ジャカルタ',
    headquartersEn: 'Indonesia (Jakarta)',
    region: 'asia-oceania',
    category: '地域標準化・島嶼部電化',
    categoryEn: 'Regional standardization & island electrification',
    overview:
      '東南アジア諸国連合（ASEAN）のエネルギー機関。島嶼部や農村部でのマイクログリッド・分散太陽光の標準化を推進。',
    overviewEn:
      'Intergovernmental energy center driving distributed solar, microgrids, and off-grid standards across Southeast Asia.',
    barrierOvercome: '東南アジア島嶼部の送電網延伸困難と各国規格の分断',
    barrierOvercomeEn:
      'Geographical isolation of island communities and fragmented regional technical standards',
    keyMilestone: 'ASEAN分散再エネ統合ガイドラインの策定',
    keyMilestoneEn: 'Formulation of ASEAN distributed renewable energy integration guidelines',
    websiteUrl: 'https://aseanenergy.org',
  },
  {
    id: 'rescoop-eu',
    name: '欧州市民エネルギー協同組合連盟 (REScoop.eu)',
    nameEn: 'REScoop.eu',
    headquarters: 'ベルギー・ブリュッセル',
    headquartersEn: 'Belgium (Brussels)',
    region: 'europe',
    category: '市民コモンズ・エネルギー民主化',
    categoryEn: 'Citizen commons & energy democracy',
    overview:
      '欧州全域の市民エネルギー協同組合2,250団体・150万人を代表する連盟。EU法レベルで市民のエネルギー生産・自給権を確立。',
    overviewEn:
      'European federation of 2,250 citizen energy cooperatives defending citizen energy rights under EU directives.',
    barrierOvercome: '巨大電力企業による卸・小売電力市場と送電網の寡占',
    barrierOvercomeEn:
      'Monopolistic utility control over wholesale energy markets and transmission grids',
    keyMilestone: 'EU指令における「エネルギーコミュニティ（市民自給権）」の明文化',
    keyMilestoneEn: 'Legal recognition of Energy Communities in EU Clean Energy Directives',
    websiteUrl: 'https://www.rescoop.eu',
  },
  {
    id: 'pv-austria',
    name: 'オーストリア太陽光発電協会 (PV-Austria)',
    nameEn: 'PV-Austria',
    headquarters: 'オーストリア・ウィーン',
    headquartersEn: 'Austria (Vienna)',
    region: 'europe',
    category: '800W先行法制化・業界連盟',
    categoryEn: 'Early 800W legalization & industry federation',
    overview:
      '欧州に先駆けて800W小型プラグインソーラーの制度免除（届出制）を勝ち取ったオーストリアの再エネ推進連盟。',
    overviewEn:
      'Austrian solar association that pioneered early legal exemptions for 800W plug-in solar devices in Central Europe.',
    barrierOvercome: '旧型電力メーターの逆回転禁止と個別連系申請の硬直性',
    barrierOvercomeEn:
      'Rigid grid interconnection approvals and utility bans on reverse-spinning meters',
    keyMilestone: '連邦電器法における800Wプラグインソーラー簡易連系ルールの確立',
    keyMilestoneEn:
      'Enactment of simplified notification rules for 800W plug-in PV under federal energy law',
    websiteUrl: 'https://pvaustria.at',
  },
]

/** 非営利・推進団体一覧の地域フィルター。 */
export function filterNonProfitOrgs(region: NonProfitRegionFilter = 'all'): NonProfitOrg[] {
  return NON_PROFIT_ORGS.filter((o) => region === 'all' || o.region === region)
}

/** Sidebar rows for world balcony-PV status (labels: `worldPv.sidebar.*`). */
export const COUNTRY_PV_SIDEBAR_FIELDS = [
  { key: 'powerLimit', labelKey: 'powerLimit' },
  { key: 'regulation', labelKey: 'regulation' },
  { key: 'tenantRights', labelKey: 'legalRight' },
  { key: 'connectionMethod', labelKey: 'connectionMethod' },
  { key: 'lastUpdated', labelKey: 'lastUpdated' },
] as const satisfies readonly {
  key: keyof CountryPvDetail
  labelKey: 'powerLimit' | 'regulation' | 'legalRight' | 'connectionMethod' | 'lastUpdated'
}[]

/** Related-organization actor type (locale-independent). */
export type EcosystemActorType = 'company' | 'npo' | 'government'

export type EcosystemActor = {
  id: string
  name: string
  /** Optional English display name (locale bind). */
  nameEn?: string
  type: EcosystemActorType
  countryId: string
  role: string
  roleEn?: string
  url?: string
}

export type EcosystemActorFilter = 'all' | EcosystemActorType

/** Sub-tab filters for related organizations (labels: `worldPv.sidebar.filters.*`). */
export const ECOSYSTEM_ACTOR_FILTERS: readonly { id: EcosystemActorFilter }[] = [
  { id: 'all' },
  { id: 'npo' },
  { id: 'government' },
] as const

export const ECOSYSTEM_ACTORS: EcosystemActor[] = [
  // Regional orgs only (gov / NPO / industry associations / regulators).
  // Global equipment vendors live in GLOBAL_PV_VENDORS.
  {
    id: 'nemsa',
    name: 'NEMSA',
    type: 'government',
    countryId: 'nigeria',
    role: '電気機器安全規制・粗悪品取締り',
    roleEn: 'Electrical equipment safety regulation',
    url: 'https://nemsa.gov.ng/',
  },
  {
    id: 'rea-ng',
    name: '地方電化庁 (REA)',
    nameEn: 'Rural Electrification Agency (REA)',
    type: 'government',
    countryId: 'nigeria',
    role: 'DARES等のオフグリッド電化プログラム推進・品質基準適合の監督',
    roleEn: 'Advances DARES and off-grid electrification; quality-standard oversight',
    url: 'https://rea.gov.ng/',
  },
  {
    id: 'gogla-ng',
    name: 'GOGLA',
    type: 'npo',
    countryId: 'nigeria',
    role: '独立分散型ソーラー（Off-Grid Solar）の国際業界団体・品質・市場データ共有',
    roleEn: 'Global off-grid solar industry association — quality & market intelligence',
    url: 'https://www.gogla.org/',
  },
  {
    id: 'gogla-ke',
    name: 'GOGLA',
    type: 'npo',
    countryId: 'kenya',
    role: '独立分散型ソーラー（Off-Grid Solar）普及を推進する世界的な業界団体',
    roleEn: 'Global industry association advancing off-grid solar',
    url: 'https://www.gogla.org/',
  },
  {
    id: 'epra-ke',
    name: 'エネルギー・石油規制庁 (EPRA)',
    nameEn: 'Energy and Petroleum Regulatory Authority (EPRA)',
    type: 'government',
    countryId: 'kenya',
    role: 'オフグリッド品質基準・エネルギー市場規制',
    roleEn: 'Off-grid quality standards & energy market regulation',
    url: 'https://www.epra.go.ke/',
  },
  {
    id: 'reg-rw',
    name: 'ルワンダエネルギー公社 (REG)',
    nameEn: 'Rwanda Energy Group (REG)',
    type: 'government',
    countryId: 'rw',
    role: '官民連携・PAYG電化モデルを含む国家電化の実装機関',
    roleEn: 'National electrification implementer incl. PPP / PAYG models',
    url: 'https://www.reg.rw/',
  },
  {
    id: 'steckersolar',
    name: '欧州プラグインソーラー連盟 (Stecker-Solar)',
    nameEn: 'European Plug-in Solar Alliance (Stecker-Solar)',
    type: 'npo',
    countryId: 'germany',
    role: 'プラグインPV普及・規格提言のコモンズ',
    roleEn: 'Commons for plug-in PV adoption & standards advocacy',
    url: 'https://www.steckersolar.org/',
  },
  {
    id: 'dgs',
    name: 'Deutsche Gesellschaft für Sonnenenergie (DGS)',
    type: 'npo',
    countryId: 'germany',
    role: '市民太陽エネルギー推進団体',
    roleEn: 'Citizen solar energy advocacy association',
    url: 'https://www.dgs.de/',
  },
  {
    id: 'bnetza',
    name: '連邦ネットワーク庁 (BNetzA)',
    nameEn: 'Federal Network Agency (BNetzA)',
    type: 'government',
    countryId: 'germany',
    role: 'MaStR登録・系統ルール監督',
    roleEn: 'MaStR registration & grid rule oversight',
    url: 'https://www.bundesnetzagentur.de/',
  },
  {
    id: 'esti',
    name: 'スイス連邦検査機関 (ESTI)',
    nameEn: 'Swiss Federal Inspectorate (ESTI)',
    type: 'government',
    countryId: 'switzerland',
    role: '600W家電区分・安全指針',
    roleEn: '600W appliance category & safety guidance',
    url: 'https://www.esti.admin.ch/',
  },
  {
    id: 'arera',
    name: 'ARERA',
    type: 'government',
    countryId: 'italy',
    role: 'プラグインPV規則 (Delibera) 策定',
    roleEn: 'Plug-in PV rules (Delibera) drafting',
    url: 'https://www.arera.it/',
  },
  {
    id: 'ena',
    name: 'Energy Networks Association (ENA)',
    type: 'npo',
    countryId: 'uk',
    role: 'G98接続規程・事後通知枠組み',
    roleEn: 'G98 connection rules & post-install notice framework',
    url: 'https://www.energynetworks.org/',
  },
  {
    id: 'meti-enecho',
    name: '経済産業省 資源エネルギー庁',
    nameEn: 'Agency for Natural Resources and Energy (METI)',
    type: 'government',
    countryId: 'japan',
    role: 'エネルギー政策・系統連系制度の所管',
    roleEn: 'Energy policy & grid interconnection regulation',
    url: 'https://www.enecho.meti.go.jp/',
  },
  {
    id: 'jema',
    name: '日本電機工業会 (JEMA)',
    nameEn: 'Japan Electrical Manufacturers’ Association (JEMA)',
    type: 'npo',
    countryId: 'japan',
    role: '電機・蓄電・PV関連の業界規格・普及',
    roleEn: 'Industry standards & outreach for electrical / storage / PV',
    url: 'https://www.jema-net.or.jp/',
  },
  {
    id: 'nef',
    name: '新エネルギー財団 (NEF)',
    nameEn: 'New Energy Foundation (NEF)',
    type: 'npo',
    countryId: 'japan',
    role: '新エネルギー普及・調査研究の公益財団',
    roleEn: 'Public foundation for new-energy outreach & research',
    url: 'https://www.nef.or.jp/',
  },
  // India (in)
  {
    id: 'mnre-in',
    name: '新・再生可能エネルギー省 (MNRE)',
    nameEn: 'Ministry of New and Renewable Energy (MNRE)',
    type: 'government',
    countryId: 'in',
    role: 'PM-Surya Ghar（1,000万戸屋根上・小型PV普及計画）主導官庁',
    roleEn: 'Lead ministry for PM-Surya Ghar (10M rooftop / small PV households)',
    url: 'https://mnre.gov.in/',
  },
  {
    id: 'selco-in',
    name: 'SELCO India',
    type: 'npo',
    countryId: 'in',
    role: '分散型ソーラーによる貧困層・都市低所得層のエネルギーアクセス支援NGO',
    roleEn: 'NGO expanding energy access via distributed solar for low-income urban communities',
    url: 'https://selco-india.org/',
  },
  // Brazil (br)
  {
    id: 'absolar-br',
    name: 'ブラジル太陽光発電協会 (ABSOLAR)',
    nameEn: 'Brazilian Photovoltaic Solar Energy Association (ABSOLAR)',
    type: 'npo',
    countryId: 'br',
    role: '分散型発電法（Marco Legal da GD）の推進と政策提言',
    roleEn: 'Advocates distributed-generation law (Marco Legal da GD) & policy',
    url: 'https://www.absolar.org.br/',
  },
  {
    id: 'aneel-br',
    name: '電力庁 (ANEEL)',
    nameEn: 'Brazilian Electricity Regulatory Agency (ANEEL)',
    type: 'government',
    countryId: 'br',
    role: 'ネットメータリング（相殺制度）および接続規格の規制・監督機関',
    roleEn: 'Regulator for net metering & interconnection standards',
    url: 'https://www.gov.br/aneel/pt-br',
  },
  // Singapore (sg)
  {
    id: 'ema-sg',
    name: 'エネルギー市場庁 (EMA)',
    nameEn: 'Energy Market Authority (EMA)',
    type: 'government',
    countryId: 'sg',
    role: '小規模分散型電源の配電網接続要件・安全基準の策定',
    roleEn: 'Sets interconnection & safety rules for small distributed generation',
    url: 'https://www.ema.gov.sg/',
  },
  {
    id: 'hdb-sg',
    name: '住宅開発庁 (HDB)',
    nameEn: 'Housing & Development Board (HDB)',
    type: 'government',
    countryId: 'sg',
    role: '公営高層住宅におけるベランダ・壁面BIPV（建材一体型）実証を管轄',
    roleEn: 'Oversees balcony / facade BIPV pilots in public high-rise housing',
    url: 'https://www.hdb.gov.sg/',
  },
  {
    id: 'seris-sg',
    name: 'Solar Energy Research Institute of Singapore (SERIS)',
    type: 'npo',
    countryId: 'sg',
    role: '高密度都市・熱帯環境における垂直受光・BIPVの技術研究・標準化',
    roleEn: 'R&D and standards for vertical irradiance & BIPV in dense tropical cities',
    url: 'https://www.seris.nus.edu.sg/',
  },
  // Taiwan (tw)
  {
    id: 'moeaea-tw',
    name: '経済部 能源署（Energy Administration）',
    nameEn: 'Energy Administration, Ministry of Economic Affairs',
    type: 'government',
    countryId: 'tw',
    role: '再生エネルギー発展条例の制定、自家消費型設備の政策支援',
    roleEn: 'Renewable Energy Development Act & self-consumption policy support',
    url: 'https://www.moeaea.gov.tw/',
  },
  // US California (us-ca)
  {
    id: 'cpuc-us-ca',
    name: 'カリフォルニア州公益事業委員会 (CPUC)',
    nameEn: 'California Public Utilities Commission (CPUC)',
    type: 'government',
    countryId: 'us-ca',
    role: 'SB 868（プラグイン免除）の細則策定およびNEM 3.0配電ルールの管轄',
    roleEn: 'Rules for SB 868 plug-in exemption & NEM 3.0 distribution policy',
    url: 'https://www.cpuc.ca.gov/',
  },
  {
    id: 'calssa-us-ca',
    name: 'CALSSA (California Solar & Storage Association)',
    type: 'npo',
    countryId: 'us-ca',
    role: '市民のベランダ・分散ソーラー設置権利と蓄電併用を推進する州内最大の団体',
    roleEn: 'State’s largest group advancing balcony / distributed solar rights & storage pairing',
    url: 'https://calssa.org/',
  },
  // Other US states (plug-exemption / strict-code coverage)
  {
    id: 'office-energy-us-ut',
    name: 'ユタ州エネルギー局',
    nameEn: 'Utah Office of Energy Development',
    type: 'government',
    countryId: 'us-ut',
    role: '1,200Wプラグイン免除法の州内周知・再エネ普及支援',
    roleEn: 'State outreach for 1,200W plug-in exemption & renewables',
    url: 'https://energy.utah.gov/',
  },
  {
    id: 'utah-clean-energy-us-ut',
    name: 'ユタ・クリーン・エナジー',
    nameEn: 'Utah Clean Energy',
    type: 'npo',
    countryId: 'us-ut',
    role: 'ユタ州の屋根上ソーラー普及・プラグイン免除法・クリーンエネルギー政策を主導する非営利団体。',
    roleEn: 'Nonprofit leading rooftop solar, plug-in exemption advocacy & clean energy policy in Utah',
    url: 'https://utahcleanenergy.org',
  },
  {
    id: 'utah-forge-us-ut',
    name: 'ユタ・フォージ（ユタ大学）',
    nameEn: 'UTAH FORGE',
    type: 'npo',
    countryId: 'us-ut',
    role: '米エネルギー省（DOE）とユタ大学による次世代拡張地熱（EGS）の世界的地下実証ハブ。',
    roleEn: 'DOE–University of Utah next-gen EGS underground demonstration hub',
    url: 'https://utahforge.com',
  },
  {
    id: 'utah-psc-us-ut',
    name: 'ユタ州公共事業委員会（PSC）',
    nameEn: 'Public Service Commission of Utah',
    type: 'government',
    countryId: 'us-ut',
    role: '州内の系統連系免除規則、分散型エネルギー調達、公益電気事業の規制・監督を行う州機関。',
    roleEn: 'State regulator for interconnection waivers, distributed energy procurement & utilities',
    url: 'https://psc.utah.gov',
  },
  {
    id: 'seco-us-co',
    name: 'コロラド州エネルギー局 (CEO)',
    nameEn: 'Colorado Energy Office',
    type: 'government',
    countryId: 'us-co',
    role: 'ユタ型プラグイン免除追認とコミュニティ再エネ支援',
    roleEn: 'Utah-template plug-in exemption follow-on & community renewables',
    url: 'https://energyoffice.colorado.gov/',
  },
  {
    id: 'commerce-us-wa',
    name: 'ワシントン州商業省 エネルギー部門',
    nameEn: 'Washington State Department of Commerce — Energy',
    type: 'government',
    countryId: 'us-wa',
    role: '再エネ権利拡大と1,200W免除法の州内実装支援',
    roleEn: 'Supports renewable rights expansion & 1,200W exemption rollout',
    url: 'https://www.commerce.wa.gov/',
  },
  {
    id: 'oedo-us-or',
    name: 'オレゴン州エネルギー局 (ODOE)',
    nameEn: 'Oregon Department of Energy',
    type: 'government',
    countryId: 'us-or',
    role: '西海岸型プラグイン免除と家庭用再エネ助成の所管',
    roleEn: 'West Coast plug-in exemption & household renewable incentives',
    url: 'https://www.oregon.gov/energy/',
  },
  {
    id: 'azcc-us-az',
    name: 'アリゾナ州公益事業委員会 (ACC)',
    nameEn: 'Arizona Corporation Commission',
    type: 'government',
    countryId: 'us-az',
    role: '配電規則・家庭用自給・プラグイン免除関連ルールの監督',
    roleEn: 'Oversees distribution rules & household self-supply / plug-in policy',
    url: 'https://www.azcc.gov/',
  },
  {
    id: 'maine-puc-us-me',
    name: 'メイン州公益事業委員会 (PUC)',
    nameEn: 'Maine Public Utilities Commission',
    type: 'government',
    countryId: 'us-me',
    role: '北東部プラグイン許認可免除の配電ルール管轄',
    roleEn: 'Distribution rules for Northeast plug-in permitting exemption',
    url: 'https://www.maine.gov/mpuc/',
  },
  {
    id: 'commerce-us-mn',
    name: 'ミネソタ州商業省 エネルギー局',
    nameEn: 'Minnesota Department of Commerce — Energy',
    type: 'government',
    countryId: 'us-mn',
    role: '寒冷地分散EMSと1,200Wプラグイン免除の推進',
    roleEn: 'Advances cold-climate distributed EMS & 1,200W plug-in exemption',
    url: 'https://mn.gov/commerce/energy/',
  },
  {
    id: 'puc-us-tx',
    name: 'テキサス州公益事業委員会 (PUCT)',
    nameEn: 'Public Utility Commission of Texas',
    type: 'government',
    countryId: 'us-tx',
    role: 'ERCOT連系・分散電源・蓄電関連の州規制監督',
    roleEn: 'State oversight of ERCOT interconnection, DG & storage rules',
    url: 'https://www.puc.texas.gov/',
  },
  {
    id: 'fpsc-us-fl',
    name: 'フロリダ州公益事業委員会 (FPSC)',
    nameEn: 'Florida Public Service Commission',
    type: 'government',
    countryId: 'us-fl',
    role: '州内ユーティリティ規制・分散電源連系ルールの監督',
    roleEn: 'Utility regulation & distributed-generation interconnection oversight',
    url: 'https://www.floridapsc.com/',
  },
  {
    id: 'nyserda-us-ny',
    name: 'ニューヨーク州エネルギー研究開発局 (NYSERDA)',
    nameEn: 'New York State Energy Research and Development Authority',
    type: 'government',
    countryId: 'us-ny',
    role: '州再エネ助成・分散型電源プログラムの実施機関',
    roleEn: 'Implements state renewable incentives & distributed-energy programs',
    url: 'https://www.nyserda.ny.gov/',
  },
]

export function getEcosystemActorsByCountry(
  countryId: string,
  filter: EcosystemActorFilter = 'all',
): EcosystemActor[] {
  const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === countryId)
  const ids = new Set<string>([countryId])
  // Parent gov/NPO only — never inherit parent-scoped equipment vendors.
  if (country?.parentId) ids.add(country.parentId)
  return ECOSYSTEM_ACTORS.filter(
    (a) => ids.has(a.countryId) && (filter === 'all' || a.type === filter),
  )
}

export const WORLD_BALCONY_PV_COUNTRIES: CountryPvDetail[] = [
  {
    id: 'germany',
    name: 'ドイツ',
    nameEn: 'Germany',
    code: 'DE',
    rating: '★★★★★',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    systemModel: 'plug_800w',
    regionCategory: 'europe',
    powerLimit: '800W（家電扱いで家中へ給電）',
    connectionMethod: 'コンセント直結 (プラグイン)',
    connectionMethodEn: 'Plug-in Direct Connection',
    tenantRights: '法的に権利保障',
    tenantRightsEn: 'Legally Guaranteed',
    regulation: '800Wまで公認。オンライン登録のみで届出完了。',
    regulationEn: 'Certified up to 800W. Online registration alone completes the filing.',
    costRange: '€350〜€500 (約5〜8万円)',
    paybackYears: '3〜4年',
    baseLoadCoverage: '昼間ベースロードの約70〜90%相殺',
    incentives: '付加価値税(VAT)0% + 各自治体補助金(€100〜€500)',
    antiIslanding: 'VDE-AR-N 4105 (プラグ抜去時0.2秒以内の電圧喪失)',
    meterRequirement: '旧メーター逆回転を暫定許容（順次スマートメーター化）',
    windSafety: '強風時の手すり内側退避推奨（無突起クランプ推奨）',
    mountingRules: 'ビス留め穴あけ原則禁止（挟み込みブラケット必須・所要15分）',
    summary:
      '連邦ネットワーク庁(MaStR)への登録のみで無届連系可能。賃貸人の設置権が法制化され100万世帯以上に急速普及。',
    coordinates: [10.4, 51.1],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'austria',
    name: 'オーストリア',
    code: 'AT',
    rating: '★★★★★',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    systemModel: 'plug_800w',
    regionCategory: 'europe',
    powerLimit: '800W（家電扱いで家中へ給電）',
    connectionMethod: 'コンセント直結 (プラグイン)',
    connectionMethodEn: 'Plug-in Direct Connection',
    tenantRights: '法的に権利保障',
    tenantRightsEn: 'Legally Guaranteed',
    regulation: 'TOR Erzeuger Typ A / E-Control — 登録のみ（オンライン簡易届出で即日運用）',
    costRange: '€400〜€600 (約6〜9万円)',
    paybackYears: '4〜5年',
    baseLoadCoverage: '昼間ベースロードの約60〜80%相殺',
    incentives: '一部自治体での環境助成あり',
    antiIslanding: 'TOR Erzeuger Typ A (瞬時単独運転防止)',
    meterRequirement: 'スマートメーター設置家庭推奨（2週間前通知）',
    windSafety: '耐風圧基準準拠（台風時は取り外し推奨）',
    mountingRules: '手すり無穿孔固定（小型家電分類のため電気工事士不要）',
    summary:
      '小型家電製品として分類。系統事業者への2週間前事前通知のみで手軽にコンセント給電が可能。',
    coordinates: [14.5, 47.5],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'italy',
    name: 'イタリア',
    code: 'IT',
    rating: '★★★★☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    systemModel: 'plug_800w',
    regionCategory: 'europe',
    powerLimit: '800W（家電扱いで家中へ給電）',
    connectionMethod: 'コンセント直結 (プラグイン)',
    connectionMethodEn: 'Plug-in Direct Connection',
    tenantRights: '法的に権利保障',
    tenantRightsEn: 'Legally Guaranteed',
    regulation: 'ARERA Delibera 315/2020/R/eel — 登録のみ（オンライン簡易届出で即日運用）',
    costRange: '€400〜€550 (約6〜9万円)',
    paybackYears: '3〜5年 (日照豊富)',
    baseLoadCoverage: '昼間ベースロードの約80〜100%相殺',
    incentives: '税額控除50%（Ecobonus対象）',
    antiIslanding: 'CEI 0-21 (単独運転防止・認証インバータ)',
    meterRequirement: '双方向スマートメーター対応（350W以下は届出不要）',
    windSafety: '地中海突風対策（固定式または手動折りたたみ退避）',
    mountingRules: '外観景観規制エリアを除き手すりクランプ設置可能',
    summary:
      'ARERA規則により350W以下は届出不要の完全自由。350〜800Wは簡易通信票の送付のみでプラグイン可能。',
    coordinates: [12.5, 41.9],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'uk',
    name: 'イギリス',
    code: 'GB',
    rating: '★★★★☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    systemModel: 'plug_800w',
    regionCategory: 'europe',
    powerLimit: '800W（家電扱いで家中へ給電）',
    connectionMethod: 'コンセント直結 (プラグイン)',
    connectionMethodEn: 'Plug-in Direct Connection',
    tenantRights: '規約・協議要',
    tenantRightsEn: 'Rules / consent required',
    regulation: 'ENA EREC G98 / BS 1363 — 登録のみ（オンライン簡易届出で即日運用）',
    costRange: '£400〜£650 (約8〜12万円)',
    paybackYears: '5〜7年',
    baseLoadCoverage: '昼間ベースロードの約50〜70%相殺',
    incentives: 'VAT 0%（省エネ部材特例）',
    antiIslanding: 'ENA G98認証 (プラグ抜去時0.5秒以内停止)',
    meterRequirement: 'スマートメーター推奨（ENAへの事後28日以内通知）',
    windSafety: '沿岸強風地域は風速30m/s耐性または出仕舞い退避',
    mountingRules: 'BS 1363 (5Aヒューズ付プラグ必須・屋外防滴コンセント要)',
    summary:
      '5Aヒューズ付きプラグを条件に配電事業者(ENA)への28日以内事後通知で800Wまで連系可能。',
    coordinates: [-1.2, 52.3],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'france',
    name: 'フランス',
    code: 'FR',
    rating: '★★★★☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    systemModel: 'plug_800w',
    regionCategory: 'europe',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    connectionMethodEn: 'Plug-in Direct Connection',
    tenantRights: '規約・協議要',
    tenantRightsEn: 'Rules / consent required',
    regulation: 'CACSI (Enedis)',
    costRange: '€450〜€700 (約7〜11万円)',
    paybackYears: '5〜6年',
    baseLoadCoverage: '昼間ベースロードの約60〜75%相殺',
    incentives: 'なし（低価格キットが量販店で定着）',
    antiIslanding: 'DIN VDE 0126-1-1 / VFR 2019準拠',
    meterRequirement: 'Linky（スマートメーター）による自己消費協約',
    windSafety: '強風注意報時の角度フラット化・格納推奨',
    mountingRules: '工具不要のワンタッチ手すりストラップ/ブラケット主流',
    summary:
      '配電事業者Enedisへの無料CACSIオンライン申告で即日利用可能。大手ホームセンターでキットが広く流通。',
    coordinates: [2.2, 46.2],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'belgium',
    name: 'ベルギー',
    code: 'BE',
    rating: '★★★☆☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    systemModel: 'plug_800w',
    regionCategory: 'europe',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    connectionMethodEn: 'Plug-in Direct Connection',
    tenantRights: '規約・協議要',
    tenantRightsEn: 'Rules / consent required',
    regulation: 'Synergrid C10/11',
    costRange: '€400〜€600 (約6〜9万円)',
    paybackYears: '5〜7年',
    baseLoadCoverage: '昼間ベースロードの約60〜70%相殺',
    incentives: 'フランデレン地域等での個別補助金',
    antiIslanding: 'Synergrid公認インバータリスト準拠',
    meterRequirement: 'デジタルスマートメーター設置必須（円盤逆回転不可）',
    windSafety: '突風時の固定確認義務',
    mountingRules: '共有部手すり設置は管理組合合意要',
    summary:
      '旧型円盤メーターの逆回転を防ぐためデジタルスマートメーター設置家庭でのみプラグイン連系を認可。',
    coordinates: [4.4, 50.8],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'switzerland',
    name: 'スイス',
    code: 'CH',
    rating: '★★★☆☆',
    status: 'appliance_notified',
    statusLabel: '600W/家電製品区分',
    systemModel: 'plug_600w',
    regionCategory: 'europe',
    powerLimit: '600W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    connectionMethodEn: 'Plug-in Direct Connection',
    tenantRights: '規約・協議要',
    tenantRightsEn: 'Rules / consent required',
    regulation: 'NIV Art. 16 / ESTI',
    costRange: 'CHF 600〜900 (約10〜15万円)',
    paybackYears: '6〜8年',
    baseLoadCoverage: '昼間ベースロードの約50〜65%相殺',
    incentives: 'カントン（州）ごとの再エネ助成',
    antiIslanding: 'ESTI指針・差込プラグPRCD（漏電遮断器）要件',
    meterRequirement: '電力会社への事前届出必須',
    windSafety: '降雪荷重・アルプス山間部強風耐性要',
    mountingRules: 'ベランダ手すり外側設置は賃貸家主の書面合意必須',
    summary:
      '定格600Wまでプラグ接続容認。ベランダ内側は自由だが手すり外側設置は賃貸管理者の合意が必要。',
    coordinates: [8.2, 46.8],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'china',
    name: '中国',
    nameEn: 'China',
    code: 'CN',
    rating: '★★☆☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia-oceania',
    powerLimit: '800W',
    connectionMethod: 'オフグリッド蓄電 / マイクロインバータ系統工事',
    connectionMethodEn: 'Off-grid storage / microinverter interconnect work',
    tenantRights: '原則不可',
    tenantRightsEn: 'Generally not allowed',
    regulation: '国家標準 GB/T',
    regulationEn: 'National standard GB/T',
    costRange: '1,500〜3,000元 (約3〜6万円)',
    paybackYears: '3〜4年 (電気代水準による)',
    baseLoadCoverage: '昼間ベースロードの約60〜80%相殺',
    incentives: '一部都市の実証モデル推進',
    antiIslanding: 'NB/T 32004 (系統連系規格)',
    meterRequirement: '双方向スマートメーター（集合住宅での直結は非公認）',
    windSafety: '高層ビル特有のビル風・落下防止ワイヤー多重化必須',
    mountingRules: '管理会社（物業）の許可極めて困難・防護ネット内設置中心',
    summary:
      '世界のバルコニーPV機器（インバータ・蓄電池）の最大輸出国。国内集合住宅でも実証が進む。',
    coordinates: [104.1, 35.8],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'japan',
    name: '日本',
    nameEn: 'Japan',
    code: 'JP',
    rating: '★★☆☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia-oceania',
    powerLimit: 'ポータブル蓄電池・自給（300W〜800W目安）',
    connectionMethod: 'オフグリッド蓄電',
    connectionMethodEn: 'Off-grid storage',
    tenantRights: 'コンセント直結不可（蓄電自給）',
    tenantRightsEn: 'No outlet plug-in (storage self-supply)',
    regulation: '内線規程によりコンセント直結は不可。ポータブル電源での自給が合法。',
    regulationEn:
      'Indoor wiring rules ban outlet plug-in. Self-supply via portable power stations is lawful.',
    costRange: '10〜18万円 (ポータブル電源込み)',
    paybackYears: '10年以上 (蓄電投資が主体)',
    baseLoadCoverage: 'ポータブル電源経由で夜間家電・スマホ等の部分自給',
    incentives: '一部自治体の防災蓄電池購入補助',
    antiIslanding: 'JET認証（系統連系用は別途協議要）',
    meterRequirement: '逆潮流禁止（逆電力継電器RPRなしの直結不可）',
    windSafety: '台風時の出仕舞い（室内完全退避）必須 / 落下防止基準厳格',
    mountingRules: '管理規約でベランダ手すり私物設置禁止が一般的',
    summary:
      '内線規程によりコンセント直結は不可。ポータブル電源での自給が合法な主流ルート。',
    coordinates: [138.2, 36.2],
    lastUpdated: '2026-09-30',
    adoptedVendors: ['ecoflow', 'anker-solix'],
  },
  {
    id: 'usa',
    name: 'アメリカ合衆国',
    nameEn: 'United States',
    code: 'US',
    rating: '★★☆☆☆',
    status: 'strict_code',
    statusLabel: '州別制度（連邦NEC＋州法）',
    systemModel: 'nec_strict',
    gridCategory: 'grid_no_plug',
    regionCategory: 'americas',
    keyDrivers: ['州ごとの規制改革', '電気代高騰', '停電・レジリエンス'],
    keyDriversEn: ['State-by-state regulatory reform', 'Rising electricity prices', 'Outage resilience'],
    bottlenecks: ['連邦NEC 690の急速遮断', '州間格差', '訪問販売の高額マージン'],
    bottlenecksEn: [
      'Federal NEC 690 rapid shutdown',
      'Interstate disparities',
      'High door-to-door sales margins',
    ],
    powerLimit: '州により800〜1,200W / オフグリッド',
    connectionMethod: '州法次第（プラグ免除〜蓄電のみ）',
    connectionMethodEn: 'State-dependent (plug exemption to storage-only)',
    tenantRights: '州・HOA規約による',
    tenantRightsEn: 'Varies by state / HOA rules',
    regulation: 'NEC Article 690 + 州独自法',
    regulationEn: 'NEC Article 690 + state statutes',
    costRange: '$400〜$1,500（州・構成による）',
    paybackYears: '州制度次第（3年〜回収困難）',
    baseLoadCoverage: '州モデルにより昼間ベース〜停電バックアップ',
    incentives: '連邦ITC・州リベートは州ごとに異なる',
    antiIslanding: 'UL 1741 / 州認可機器リスト',
    meterRequirement: 'ユーティリティ・州規則に依存',
    windSafety: 'ハリケーン・竜巻地域は剛体耐風基準',
    mountingRules: 'HOA・建築条例が州都市で大きく異なる',
    summary:
      '連邦は厳格な電気工事規程が基調だが、ユタの1,200W免除やカリフォルニアの届出免除＋蓄電併用など州差が実装を分ける。下位ピンで州別詳細を表示。',
    coordinates: [-95.7, 37.1],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'ecoflow'],
  },
  {
    id: 'us-ut',
    name: '米ユタ州',
    code: 'US-UT',
    rating: '★★★★★',
    status: 'plug_exemption',
    statusLabel: '1,200W許認可免除',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['全米初の1200W完全免除法', '系統協議・手数料撤廃'],
    powerLimit: '1,200W（大型冷蔵庫・空調の負荷相殺）',
    connectionMethod: 'コンセント直結（系統協議免除）',
    connectionMethodEn: 'Plug-in (interconnection study waived)',
    tenantRights: '州法でプラグイン容認（HOAは別途）',
    tenantRightsEn: 'State plug-in allowance (HOA may still apply)',
    regulation: '2025年プラグイン免除法',
    regulationEn: '2025 plug-in exemption statute',
    costRange: '$400〜$800（1,200W級キット）',
    paybackYears: '4〜6年',
    baseLoadCoverage: '昼間ベースロードの約70〜90%相殺',
    incentives: '連邦ITCとの併用は機器・設置形態による',
    antiIslanding: '認証マイクロインバータ＋プラグ抜去時停止',
    meterRequirement: '系統協議・申請の完全免除（上限内）',
    windSafety: '山岳・谷風地域はクランプ二重化推奨',
    mountingRules: '手すりクランプ中心・穿孔は賃貸規約確認',
    summary:
      '2025年法制化により1,200Wまで系統協議を完全免除。米国内で最もプラグイン寄りの先進州。',
    coordinates: [-111.9, 39.3],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles', 'anker-solix'],
  },
  {
    id: 'us-ca',
    name: '米カリフォルニア州',
    code: 'US-CA',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '1,200W免除 / 蓄電併用',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['1,200W級届出免除の推進', '売電単価低下による蓄電池併用の主流化'],
    bottlenecks: ['電力会社による買い取り単価削減'],
    powerLimit: '1,200W',
    connectionMethod: 'コンセント直結 / 蓄電自己消費',
    connectionMethodEn: 'Plug-in / storage self-consumption',
    tenantRights: '規約・HOA協議が残る',
    tenantRightsEn: 'Rules / HOA consent often required',
    regulation: '1,200Wまで届出免除。ただし売電単価が低いため蓄電併用が主流。',
    regulationEn:
      'Permit-exempt up to 1,200W. Low export rates make storage pairing mainstream.',
    costRange: '$900〜$2,000（蓄電込み）',
    paybackYears: '6〜10年（自己消費率が鍵）',
    baseLoadCoverage: '蓄電経由で夕方ピークを含む部分自給',
    incentives: '蓄電インセンティブ（枠・所得要件あり）',
    antiIslanding: '認証スマートインバータ準拠機器',
    meterRequirement: '売電契約・スマートインバータ要件',
    windSafety: '沿岸強風・山火事煙害時の点検推奨',
    mountingRules: 'バルコニー設置は都市・HOA条例を確認',
    summary:
      '1,200Wまで届出免除が進む一方、売電単価が低く蓄電自己消費が主流化。',
    coordinates: [-119.4, 36.7],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles', 'anker-solix'],
  },
  {
    id: 'us-co',
    name: '米コロラド州',
    code: 'US-CO',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '1,200W許認可免除',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['ユタ州テンプレート追認', '脱炭素コミュニティ自律'],
    powerLimit: '1,200W',
    connectionMethod: 'コンセント直結（系統協議免除）',
    connectionMethodEn: 'Plug-in (interconnection study waived)',
    tenantRights: '州法でプラグイン容認（HOAは別途）',
    tenantRightsEn: 'State plug-in allowance (HOA may still apply)',
    regulation: 'ユタ型プラグイン免除の州法追認',
    regulationEn: 'Utah-template plug-in exemption',
    costRange: '$400〜$900（1,200W級キット）',
    paybackYears: '4〜7年',
    baseLoadCoverage: '昼間ベースロードの約65〜85%相殺',
    incentives: '連邦ITC・コミュニティ再エネ助成（枠あり）',
    antiIslanding: '認証マイクロインバータ＋プラグ抜去時停止',
    meterRequirement: '上限内は系統協議免除',
    windSafety: '高地突風・降雪荷重へのクランプ耐性要',
    mountingRules: '手すりクランプ中心・HOA規約確認',
    summary:
      'ユタ州の1,200W免除テンプレートを追認し、脱炭素コミュニティ自律を軸にプラグイン導入を拡大。',
    coordinates: [-105.7, 39.5],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles'],
  },
  {
    id: 'us-wa',
    name: '米ワシントン州',
    code: 'US-WA',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '1,200W許認可免除',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['再エネ権利拡大', '1200W免除法導入'],
    powerLimit: '1,200W',
    connectionMethod: 'コンセント直結（系統協議免除）',
    connectionMethodEn: 'Plug-in (interconnection study waived)',
    tenantRights: '州法でプラグイン容認（HOAは別途）',
    tenantRightsEn: 'State plug-in allowance (HOA may still apply)',
    regulation: '1200Wプラグイン免除法',
    regulationEn: '1,200W plug-in exemption statute',
    costRange: '$400〜$900（1,200W級キット）',
    paybackYears: '5〜7年',
    baseLoadCoverage: '昼間ベースロードの約60〜80%相殺',
    incentives: '州再エネ権利・連邦ITC併用',
    antiIslanding: '認証マイクロインバータ＋プラグ抜去時停止',
    meterRequirement: '上限内は系統協議免除',
    windSafety: '沿岸強風時の固定確認義務',
    mountingRules: '手すりクランプ中心・賃貸規約確認',
    summary:
      '再エネ権利拡大の一環として1,200W免除法を導入。西海岸でユタ追随の先進州の一つ。',
    coordinates: [-120.7, 47.7],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles'],
  },
  {
    id: 'us-or',
    name: '米オレゴン州',
    code: 'US-OR',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '1,200W許認可免除',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['西海岸プラグイン法制化推進'],
    powerLimit: '1,200W',
    connectionMethod: 'コンセント直結（系統協議免除）',
    connectionMethodEn: 'Plug-in (interconnection study waived)',
    tenantRights: '州法でプラグイン容認（HOAは別途）',
    tenantRightsEn: 'State plug-in allowance (HOA may still apply)',
    regulation: '西海岸型プラグイン免除',
    regulationEn: 'West Coast plug-in exemption',
    costRange: '$400〜$900（1,200W級キット）',
    paybackYears: '5〜7年',
    baseLoadCoverage: '昼間ベースロードの約60〜80%相殺',
    incentives: '州・自治体の再エネ助成（枠あり）',
    antiIslanding: '認証マイクロインバータ＋プラグ抜去時停止',
    meterRequirement: '上限内は系統協議免除',
    windSafety: '沿岸・峡谷風へのクランプ二重化推奨',
    mountingRules: '手すりクランプ中心・賃貸規約確認',
    summary:
      '西海岸プラグイン法制化の一角として1,200W免除を推進。ユタ州モデルの追随州。',
    coordinates: [-120.5, 43.8],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles'],
  },
  {
    id: 'us-az',
    name: '米アリゾナ州',
    code: 'US-AZ',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '1,200W許認可免除',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['日照量全米屈指', '家庭用自給推進'],
    powerLimit: '1,200W',
    connectionMethod: 'コンセント直結（系統協議免除）',
    connectionMethodEn: 'Plug-in (interconnection study waived)',
    tenantRights: '州法でプラグイン容認（HOAは別途）',
    tenantRightsEn: 'State plug-in allowance (HOA may still apply)',
    regulation: 'プラグイン免除・家庭用自給推進',
    regulationEn: 'Plug-in exemption / household self-supply',
    costRange: '$400〜$850（1,200W級キット）',
    paybackYears: '3〜5年（高日照）',
    baseLoadCoverage: '昼間ベースロードの約80〜100%相殺',
    incentives: '連邦ITC・ピーク料金回避メリット大',
    antiIslanding: '認証マイクロインバータ＋プラグ抜去時停止',
    meterRequirement: '上限内は系統協議免除',
    windSafety: '砂塵・高温下の配線保護',
    mountingRules: '手すりクランプ中心・HOA景観規約確認',
    summary:
      '日照量全米屈指を背景に家庭用自給を推進。ユタ追随で1,200Wプラグイン免除を導入。',
    coordinates: [-111.0, 34.0],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles', 'anker-solix'],
  },
  {
    id: 'us-me',
    name: '米メイン州',
    code: 'US-ME',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '1,200W許認可免除',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['北東部での許認可免除'],
    powerLimit: '1,200W',
    connectionMethod: 'コンセント直結（系統協議免除）',
    connectionMethodEn: 'Plug-in (interconnection study waived)',
    tenantRights: '州法でプラグイン容認（HOAは別途）',
    tenantRightsEn: 'State plug-in allowance (HOA may still apply)',
    regulation: '北東部プラグイン許認可免除',
    regulationEn: 'Northeast plug-in permitting exemption',
    costRange: '$450〜$950（1,200W級キット）',
    paybackYears: '5〜8年',
    baseLoadCoverage: '昼間ベースロードの約50〜70%相殺',
    incentives: '州再エネ助成・連邦ITC',
    antiIslanding: '認証マイクロインバータ＋プラグ抜去時停止',
    meterRequirement: '上限内は系統協議免除',
    windSafety: '沿岸暴風・積雪荷重への耐性要',
    mountingRules: '手すりクランプ中心・冬季出仕舞い推奨',
    summary:
      '北東部で許認可免除を先行導入。ユタ州モデルを東海岸側で追認した先進州の一つ。',
    coordinates: [-69.4, 45.2],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles'],
  },
  {
    id: 'us-mn',
    name: '米ミネソタ州',
    code: 'US-MN',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '1,200W許認可免除',
    systemModel: 'plug_1200w',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['寒冷地分散EMS推進'],
    powerLimit: '1,200W（大型冷蔵庫・空調の負荷相殺）',
    connectionMethod: 'コンセント直結（系統協議免除）',
    connectionMethodEn: 'Plug-in (interconnection study waived)',
    tenantRights: '1,200Wまで免除',
    tenantRightsEn: 'Exempt up to 1,200W',
    regulation: '1,200Wまで免除 — プラグイン免除・分散EMS推進',
    regulationEn: 'Exempt up to 1,200W — plug-in exemption / distributed EMS',
    costRange: '$450〜$950（1,200W級キット）',
    paybackYears: '5〜8年',
    baseLoadCoverage: '昼間ベースロードの約55〜75%相殺',
    incentives: '州分散EMS・連邦ITC',
    antiIslanding: '認証マイクロインバータ＋プラグ抜去時停止',
    meterRequirement: '上限内は系統協議免除',
    windSafety: '厳冬・着氷時の固定確認義務',
    mountingRules: '手すりクランプ中心・積雪クリアランス確保',
    summary:
      '寒冷地分散EMS推進の一環として1,200Wプラグイン免除を導入。中西部のユタ追随州。',
    coordinates: [-94.6, 46.7],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles'],
  },
  {
    id: 'us-tx',
    name: '米テキサス州',
    code: 'US-TX',
    

/* … truncated (201722 bytes total) … */
```

### `features/basin-dam/data.ts`

```typescript
// Mock for basin-dag-flow-visualizer / orifice-paddy-dam-node. Static — no API.

import type { NetworkEdge, NetworkNode, NetworkNodeStatus } from "@/features/network/data"

export type { NetworkNodeStatus }

type BasinSeed = Omit<NetworkNode, "sublabel" | "levelPct" | "status"> & {
  baseLevelPct: number
  role: "storage" | "hydro" | "downstream"
}

/** AgriDam 流域トポロジーを supply→convert→consume の3列に写像（デモ用） */
const BASIN_SEEDS: BasinSeed[] = [
  {
    id: "valley",
    label: "上流谷戸・貯水",
    kind: "supply",
    icon: "droplets",
    baseLevelPct: 64,
    role: "storage",
  },
  {
    id: "paddy",
    label: "水田オリフィス群",
    kind: "supply",
    icon: "sprout",
    baseLevelPct: 46,
    role: "storage",
  },
  {
    id: "hydro",
    label: "水路マイクロ水力",
    kind: "supply",
    icon: "droplets",
    baseLevelPct: 38,
    role: "hydro",
  },
  {
    id: "weir",
    label: "第1分水工",
    kind: "convert",
    icon: "droplets",
    baseLevelPct: 58,
    role: "storage",
  },
  {
    id: "pond",
    label: "中央調整池",
    kind: "convert",
    icon: "battery-charging",
    baseLevelPct: 61,
    role: "storage",
  },
  {
    id: "pump",
    label: "南部排水機場",
    kind: "convert",
    icon: "droplets",
    baseLevelPct: 38,
    role: "storage",
  },
  {
    id: "outlet",
    label: "本川・放流口",
    kind: "consume",
    icon: "droplets",
    baseLevelPct: 24,
    role: "downstream",
  },
  {
    id: "town",
    label: "下流の集落",
    kind: "consume",
    icon: "building-2",
    baseLevelPct: 20,
    role: "downstream",
  },
  {
    id: "home",
    label: "家庭（見回り）",
    kind: "consume",
    icon: "home",
    baseLevelPct: 18,
    role: "downstream",
  },
]

export const BASIN_EDGES: NetworkEdge[] = [
  { from: "valley", to: "weir" },
  { from: "paddy", to: "weir" },
  { from: "weir", to: "pond" },
  { from: "pond", to: "pump" },
  { from: "pump", to: "outlet" },
  { from: "pump", to: "town" },
  { from: "hydro", to: "home" },
  { from: "pond", to: "home" },
]

export const BASIN_LABEL = "流域・田んぼダムモデル"
export const BASIN_DESCRIPTION =
  "上流谷戸から水田オリフィス・分水工を経て本川へ流れる水系と、水路マイクロ水力をDAGでつなぎます。降雨を動かすと貯留と生活実感が変わります。"

export const BASIN_RAIN_MIN = 0
export const BASIN_RAIN_MAX = 80
export const BASIN_RAIN_DEFAULT = 28

export type BasinRainSummary = {
  system: "平常" | "注意" | "警戒"
  message: string
  poolCups: number
  riskReductionPct: number
  nightPatrolNeeded: boolean
}

function levelForRain(baseLevelPct: number, rainMmH: number): number {
  const factor = rainMmH / BASIN_RAIN_MAX
  return Math.min(99, Math.round(baseLevelPct + factor * (100 - baseLevelPct) * 0.56))
}

function statusForLevel(levelPct: number, rainMmH: number): NetworkNodeStatus {
  if (rainMmH > 58 || levelPct >= 72) return "watch"
  if (rainMmH > 38 && levelPct >= 58) return "watch"
  return "normal"
}

function basinSublabel(
  seed: BasinSeed,
  levelPct: number,
  rainMmH: number,
  summary: BasinRainSummary
): string {
  if (seed.role === "hydro") {
    const ledHours = Math.max(0.5, Math.round((1.2 + (1 - rainMmH / BASIN_RAIN_MAX) * 2.4) * 10) / 10)
    return `いま水路で LED約${ledHours}時間分`
  }
  if (seed.role === "downstream") {
    if (seed.id === "home") {
      return summary.nightPatrolNeeded ? "今夜の水路見回り：推奨" : "今夜の水路見回り：不要"
    }
    if (seed.id === "town") {
      return `氾濫リスク目安 −${summary.riskReductionPct}%`
    }
    return `水位感 ${levelPct}% · ${summary.system}`
  }
  if (seed.id === "paddy") {
    return `プール換算 ${summary.poolCups}杯 · 貯留 ${levelPct}%`
  }
  return `貯留 ${levelPct}% · ${statusForLevel(levelPct, rainMmH) === "watch" ? "注意" : "平常"}`
}

/** 降雨強度(mm/h)から流域ノードの貯留表示を更新する純関数 */
export function basinNodesForRain(rainMmH: number): NetworkNode[] {
  const clamped = Math.min(BASIN_RAIN_MAX, Math.max(BASIN_RAIN_MIN, rainMmH))
  const summary = basinRainSummary(clamped)
  return BASIN_SEEDS.map((seed) => {
    const levelPct = levelForRain(seed.baseLevelPct, clamped)
    const status = statusForLevel(levelPct, clamped)
    return {
      id: seed.id,
      label: seed.label,
      kind: seed.kind,
      icon: seed.icon,
      levelPct,
      status,
      sublabel: basinSublabel(seed, levelPct, clamped, summary),
    }
  })
}

/** 市民向けの降雨サマリー（生活実感換算つき） */
export function basinRainSummary(rainMmH: number): BasinRainSummary {
  const clamped = Math.min(BASIN_RAIN_MAX, Math.max(BASIN_RAIN_MIN, rainMmH))
  const system: BasinRainSummary["system"] =
    clamped > 58 ? "警戒" : clamped > 38 ? "注意" : "平常"
  const poolCups = Math.round((0.3 + (clamped / BASIN_RAIN_MAX) * 1.4) * 10) / 10
  const riskReductionPct = Math.round(8 + (1 - clamped / BASIN_RAIN_MAX) * 18)
  const nightPatrolNeeded = clamped > 58

  const message =
    system === "警戒"
      ? "排水能力の確認が必要です。オリフィス群はピークカット中です。"
      : system === "注意"
        ? "一部圃場で注意が必要です。事前排水の余裕を見てください。"
        : "全系統は安定しています。今夜の水路見回りは不要です。"

  return { system, message, poolCups, riskReductionPct, nightPatrolNeeded }
}

export type BasinFieldTone = "normal" | "watch" | "done"

export type BasinField = {
  id: string
  name: string
  crop: string
  baseMoisture: number
  defaultOrifice: boolean
}

export type BasinFieldStatus = {
  id: string
  name: string
  crop: string
  moisture: number
  tone: BasinFieldTone
  statusLabel: string
  orificeInstalled: boolean
}

export const BASIN_FIELDS: BasinField[] = [
  { id: "n1", name: "北部第1圃場", crop: "稲作", baseMoisture: 42, defaultOrifice: true },
  { id: "n2", name: "北部第2圃場", crop: "稲作", baseMoisture: 48, defaultOrifice: true },
  { id: "c3", name: "中央第3圃場", crop: "大豆", baseMoisture: 36, defaultOrifice: false },
  { id: "s1", name: "南部第1圃場", crop: "野菜", baseMoisture: 28, defaultOrifice: true },
  { id: "s2", name: "南部第2圃場", crop: "麦", baseMoisture: 40, defaultOrifice: false },
  { id: "c1", name: "中央第1圃場", crop: "稲作", baseMoisture: 34, defaultOrifice: true },
]

/** 降雨とオリフィス有無から圃場の含水・状態を求める純関数 */
export function fieldStatusForRain(
  field: BasinField,
  rainMmH: number,
  orificeInstalled: boolean,
  preDrained = false
): BasinFieldStatus {
  const clamped = Math.min(BASIN_RAIN_MAX, Math.max(BASIN_RAIN_MIN, rainMmH))
  const factor = clamped / BASIN_RAIN_MAX
  const rise = factor * (orificeInstalled ? 18 : 42)
  let moisture = Math.min(95, Math.round(field.baseMoisture + rise))
  if (preDrained) {
    moisture = Math.max(12, Math.round(moisture * 0.55))
  }

  let tone: BasinFieldTone = "normal"
  let statusLabel = orificeInstalled ? "堰板セット済" : "堰板なし"

  if (preDrained && moisture < 30) {
    tone = "done"
    statusLabel = "事前排水済"
  } else if (!orificeInstalled && clamped > 38) {
    tone = "watch"
    statusLabel = "見回り注意"
  } else if (moisture >= 72) {
    tone = "watch"
    statusLabel = "貯留高め"
  }

  return {
    id: field.id,
    name: field.name,
    crop: field.crop,
    moisture,
    tone,
    statusLabel,
    orificeInstalled,
  }
}

export function fieldsForRain(
  rainMmH: number,
  orificeById: Record<string, boolean>,
  preDrained = false
): BasinFieldStatus[] {
  return BASIN_FIELDS.map((field) =>
    fieldStatusForRain(field, rainMmH, orificeById[field.id] ?? field.defaultOrifice, preDrained)
  )
}

/** オリフィス装着率が高いほど生活実感を少し良くする（デモ用） */
export function basinRainSummaryWithOrifices(
  rainMmH: number,
  orificeById: Record<string, boolean>
): BasinRainSummary {
  const base = basinRainSummary(rainMmH)
  const installed = BASIN_FIELDS.filter((f) => orificeById[f.id] ?? f.defaultOrifice).length
  const coverage = installed / BASIN_FIELDS.length
  const poolCups = Math.round((base.poolCups * (0.85 + coverage * 0.35)) * 10) / 10
  const riskReductionPct = Math.min(28, Math.round(base.riskReductionPct + coverage * 6))
  const nightPatrolNeeded = base.nightPatrolNeeded && coverage < 0.67

  let message = base.message
  if (coverage >= 0.8 && base.system !== "警戒") {
    message = "オリフィス群が十分です。今夜の水路見回りは不要です。"
  } else if (coverage < 0.5 && rainMmH > 38) {
    message = "堰板未設置の圃場があります。板を挿すだけで見回り負荷を下げられます。"
  }

  return {
    ...base,
    poolCups,
    riskReductionPct,
    nightPatrolNeeded,
    message,
    system: nightPatrolNeeded && base.system === "平常" ? "注意" : base.system,
  }
}

// —— 横型流域 DAG（AgriDam 座標ベース） ——

export type BasinDagNode = {
  id: string
  code: string
  name: string
  type: string
  x: number
  y: number
  capacity: number
  baseLevel: number
  status: NetworkNodeStatus
  level: number
}

const BASIN_DAG_SEEDS: Omit<BasinDagNode, "level" | "status">[] = [
  { id: "A", code: "A", name: "上流貯水池", type: "貯水池", x: 100, y: 82, capacity: 82, baseLevel: 64 },
  { id: "B", code: "B", name: "北部水田群", type: "圃場群", x: 100, y: 220, capacity: 68, baseLevel: 46 },
  { id: "C", code: "C", name: "第1分水工", type: "分水工", x: 310, y: 150, capacity: 92, baseLevel: 58 },
  { id: "D", code: "D", name: "中央調整池", type: "調整池", x: 520, y: 150, capacity: 76, baseLevel: 61 },
  { id: "E", code: "E", name: "南部排水機場", type: "排水機場", x: 730, y: 150, capacity: 89, baseLevel: 38 },
  { id: "F", code: "F", name: "沿岸放流口", type: "放流口", x: 930, y: 150, capacity: 95, baseLevel: 24 },
]

export const BASIN_DAG_EDGES: { from: string; to: string }[] = [
  { from: "A", to: "C" },
  { from: "B", to: "C" },
  { from: "C", to: "D" },
  { from: "D", to: "E" },
  { from: "E", to: "F" },
]

export function dagNodesForRain(rainMmH: number): BasinDagNode[] {
  const clamped = Math.min(BASIN_RAIN_MAX, Math.max(BASIN_RAIN_MIN, rainMmH))
  return BASIN_DAG_SEEDS.map((seed) => {
    const level = levelForRain(seed.baseLevel, clamped)
    return {
      ...seed,
      level,
      status: statusForLevel(level, clamped),
    }
  })
}

// —— 市民向け安全状況 ——

export type CitizenSafety = {
  system: BasinRainSummary["system"]
  headline: string
  riverLevel: "安全" | "注意" | "警戒"
  rainLabel: string
  drainageLabel: "稼働中" | "要確認"
  patrolLabel: string
  updatedAt: string
}

export function citizenSafetyFromState(
  summary: BasinRainSummary,
  rainMmH: number,
  orificeById: Record<string, boolean>
): CitizenSafety {
  const installed = BASIN_FIELDS.filter((f) => orificeById[f.id] ?? f.defaultOrifice).length
  const coverage = installed / BASIN_FIELDS.length
  const riverLevel: CitizenSafety["riverLevel"] =
    summary.system === "警戒" ? "警戒" : summary.system === "注意" ? "注意" : "安全"
  const drainageLabel: CitizenSafety["drainageLabel"] =
    coverage >= 0.5 && summary.system !== "警戒" ? "稼働中" : "要確認"
  const headline =
    summary.system === "平常"
      ? "現在、流域管理区域の水位・排水設備は安定しています。"
      : summary.system === "注意"
        ? "一部で注意が必要ですが、オリフィス群がピークを抑えています。"
        : "降雨が強く、排水能力の確認が必要です。見回りを検討してください。"

  return {
    system: summary.system,
    headline,
    riverLevel,
    rainLabel: `${rainMmH} mm/h`,
    drainageLabel,
    patrolLabel: summary.nightPatrolNeeded ? "今夜の見回り：推奨" : "今夜の見回り：不要",
    updatedAt: "デモ 14:31",
  }
}

// —— 発電・蓄電（生活実感付き） ——

export type BasinEnergySnapshot = {
  ledHours: number
  macbookCharges: number
  batteryPct: number
  batteryGoalPct: number
  todayKwhDemo: number
  chartPath: string
  chartFillPath: string
}

/** 24h 発電カーブの固定パス（原型 MiniChart）。雨量で縦スケールのみ変化 */
const CHART_LINE =
  "M0 108 C35 104 38 82 72 88 S110 65 143 76 S180 52 212 68 S246 26 280 50 S319 45 348 60 S385 30 416 44 S454 22 500 32"

export function basinEnergyForRain(rainMmH: number): BasinEnergySnapshot {
  const clamped = Math.min(BASIN_RAIN_MAX, Math.max(BASIN_RAIN_MIN, rainMmH))
  const sunFactor = 1 - (clamped / BASIN_RAIN_MAX) * 0.45
  const ledHours = Math.max(0.5, Math.round((2.8 * sunFactor + 0.6) * 10) / 10)
  const macbookCharges = Math.max(0.5, Math.round(ledHours * 0.55 * 10) / 10)
  const batteryPct = Math.min(95, Math.round(62 + sunFactor * 22))
  const todayKwhDemo = Math.round(4.2 * sunFactor * 10) / 10

  return {
    ledHours,
    macbookCharges,
    batteryPct,
    batteryGoalPct: 82,
    todayKwhDemo,
    chartPath: CHART_LINE,
    chartFillPath: `${CHART_LINE} L500 130 L0 130Z`,
  }
}
```

### `features/ecosystem/data.ts`

```typescript
// Mock for 2-axis ecosystem directory (region × form factor). Static — no backend.

import type { CountryCode } from '@/lib/country-codes'

export type RegionScope = 'all' | 'japan' | 'global'
export type FormFactor = 'all' | 'balcony' | 'non-balcony'
export type ActorCategory = 'corporate' | 'npo' | 'coop' | 'ecosystem'
export type ActorRegion = 'japan' | 'global'
export type ActorFormFactor = 'balcony' | 'non-balcony'

export type CategoryLabelId =
  | 'pluginStorage'
  | 'citizenPractice'
  | 'coopPower'
  | 'p2pAggregation'
  | 'policyNetwork'
  | 'standardsCommons'
  | 'microinverter'
  | 'energyCoopUnion'
  | 'perovskite'
  | 'megaSolarPpa'

export type ActorTagId =
  | 'portablePower'
  | 'rentalFriendly'
  | 'diySolar'
  | 'citizenParticipation'
  | 'balconyGuide'
  | 'groupBuying'
  | 'coop'
  | 'directEnergy'
  | 'surplusReturn'
  | 'p2pTrading'
  | 'climateTech'
  | 'dispatchAi'
  | 'regionalCommons'
  | 'disasterMicrogrid'
  | 'municipalityLink'
  | 'eu800w'
  | 'pluginPv'
  | 'openStandard'
  | 'microinverter'
  | 'gridAutonomy'
  | 'distributedEms'
  | 'energyDemocracy'
  | 'citizenEquity'
  | 'microgrid'
  | 'perovskite'
  | 'lightweightFilm'
  | 'concentratedPpa'
  | 'utilityScale'

export type EcosystemCareerId = 'productHardware' | 'communityPolicy' | 'uxLivedData'

export interface FundamentalMetrics {
  ticker?: string
  marketCap?: string
  powerSource: string
  innovationType: 'disruptive' | 'sustaining'
  decentralizedFit: 'High' | 'Mid' | 'Low'
  bosRatio?: string
  financialHealth: string
}

export type EcosystemActor = {
  id: string
  category: ActorCategory
  categoryLabel: CategoryLabelId
  region: ActorRegion
  formFactor: ActorFormFactor
  tags: ActorTagId[]
  countryCodes?: CountryCode[]
  metrics?: { id: string }[]
  fundamental?: FundamentalMetrics
  linkUrl?: string
}

/** Locale-independent actors. Labels: `ecosystem.actors.*` / `ecosystem.categoryLabels.*`. */
export const ECOSYSTEM_ACTORS: readonly EcosystemActor[] = [
  {
    id: 'anker-solix-jp',
    category: 'corporate',
    categoryLabel: 'pluginStorage',
    region: 'japan',
    formFactor: 'balcony',
    tags: ['portablePower', 'rentalFriendly', 'diySolar'],
    countryCodes: ['JP'],
    metrics: [{ id: 'storageCapacity' }],
    fundamental: {
      powerSource: 'プラグイン蓄電',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '5% (完全工事不要)',
      financialHealth: 'コンシューマー流通基盤',
    },
  },
  {
    id: 'balcony-solar-action-jp',
    category: 'npo',
    categoryLabel: 'citizenPractice',
    region: 'japan',
    formFactor: 'balcony',
    tags: ['citizenParticipation', 'balconyGuide', 'groupBuying'],
    countryCodes: ['JP'],
    metrics: [{ id: 'households' }],
    fundamental: {
      powerSource: 'プラグインPV実践',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '5%',
      financialHealth: '市民実践・共同購入基盤',
    },
  },
  {
    id: 'seikatsu-club-energy',
    category: 'coop',
    categoryLabel: 'coopPower',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['coop', 'groupBuying', 'directEnergy', 'surplusReturn'],
    countryCodes: ['JP'],
    metrics: [{ id: 'partnerPlants' }],
    fundamental: {
      powerSource: '市民協同電力',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '20%',
      financialHealth: '組合員剰余還元・地域循環',
    },
  },
  {
    id: 'digital-grid-jp',
    category: 'corporate',
    categoryLabel: 'p2pAggregation',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['p2pTrading', 'climateTech', 'dispatchAi'],
    countryCodes: ['JP'],
    metrics: [{ id: 'monthlyVolume' }],
    fundamental: {
      powerSource: 'P2P電力取引',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: 'N/A (プラットフォーム)',
      financialHealth: '民間取引拡大',
    },
  },
  {
    id: 'community-power-jp',
    category: 'npo',
    categoryLabel: 'policyNetwork',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['regionalCommons', 'disasterMicrogrid', 'municipalityLink'],
    countryCodes: ['JP'],
    fundamental: {
      powerSource: '地域政策・コモンズ',
      innovationType: 'disruptive',
      decentralizedFit: 'Mid',
      bosRatio: 'N/A',
      financialHealth: '自治体連携・地域循環',
    },
  },
  {
    id: 'sekisui-chemical',
    category: 'corporate',
    categoryLabel: 'perovskite',
    region: 'japan',
    formFactor: 'balcony',
    tags: ['perovskite', 'lightweightFilm', 'rentalFriendly'],
    countryCodes: ['JP'],
    metrics: [{ id: 'filmThroughput' }],
    fundamental: {
      ticker: '4204',
      marketCap: '規模拡大中',
      powerSource: 'ペロブスカイト',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '10% (軽量・工事レス)',
      financialHealth: 'FCF潤沢・量産投資',
    },
  },
  {
    id: 'west-holdings',
    category: 'corporate',
    categoryLabel: 'megaSolarPpa',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['concentratedPpa', 'utilityScale'],
    countryCodes: ['JP'],
    metrics: [{ id: 'ppaCapacity' }],
    fundamental: {
      ticker: '1407',
      powerSource: '太陽光/集中PPA',
      innovationType: 'sustaining',
      decentralizedFit: 'Low',
      bosRatio: '28% (造成・架台依存)',
      financialHealth: '安定配当',
    },
  },
  {
    id: 'balkonkraftwerk-alliance-eu',
    category: 'ecosystem',
    categoryLabel: 'standardsCommons',
    region: 'global',
    formFactor: 'balcony',
    tags: ['eu800w', 'pluginPv', 'openStandard'],
    countryCodes: ['DE'],
    metrics: [{ id: 'euInstalls' }],
    fundamental: {
      powerSource: 'プラグインPV規格',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '5%',
      financialHealth: '欧州規格コモンズ',
    },
  },
  {
    id: 'enphase-energy',
    category: 'corporate',
    categoryLabel: 'microinverter',
    region: 'global',
    formFactor: 'non-balcony',
    tags: ['microinverter', 'gridAutonomy', 'distributedEms'],
    countryCodes: ['US', 'DE'],
    metrics: [{ id: 'globalInstalls' }],
    fundamental: {
      ticker: 'ENPH',
      powerSource: 'マイクロインバータ',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '15%',
      financialHealth: '高営業利益率',
    },
  },
  {
    id: 'rescoop-eu',
    category: 'coop',
    categoryLabel: 'energyCoopUnion',
    region: 'global',
    formFactor: 'non-balcony',
    tags: ['energyDemocracy', 'citizenEquity', 'microgrid'],
    countryCodes: ['EU'],
    metrics: [{ id: 'members' }],
    fundamental: {
      powerSource: '市民エネルギー協同組合連合',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '15%',
      financialHealth: '欧州市民共同出資',
    },
  },
] as const

/** Locale-independent ecosystem layers. Labels: `ecosystem.layers.areas.*`. */
export const ECOSYSTEM_CAREERS: readonly EcosystemCareerId[] = [
  'productHardware',
  'communityPolicy',
  'uxLivedData',
] as const

export function filterActors(
  actors: readonly EcosystemActor[],
  region: RegionScope,
  formFactor: FormFactor
): EcosystemActor[] {
  return actors.filter((actor) => {
    const regionOk = region === 'all' || actor.region === region
    const formOk = formFactor === 'all' || actor.formFactor === formFactor
    return regionOk && formOk
  })
}

export function filterActorsByCountry(actors: EcosystemActor[], code?: CountryCode): EcosystemActor[] {
  if (!code) return actors
  return actors.filter((a) => a.countryCodes?.includes(code))
}
```

### `features/living-sense/data.ts`

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
```

### `features/network/data.ts`

```typescript
// Mock for react-flow-visualizer / modular-microgrid-vn. Static — no API.

export type NetworkLocale = "ja" | "en"

export type NetworkModel = "yamanashi" | "fukushima"

/** Japan RE map filter / pin category */
export type ModelCategory = "p2g" | "vpp" | "microgrid" | "self-line"

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
  modelCategory: ModelCategory
  scaleLabel: string
  scaleLabelEn?: string
  /** Demo self-sufficiency ratio (0–100) */
  selfSufficiencyPct: number
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
  connection: string
  tenantRight: string
  regulation: string
}

export type Country = {
  id: string
  name: string
  nameEn: string
  subtitle: string
  subtitleEn: string
  category: string
  categoryEn: string
  region: "europe" | "asia" | "others"
  details: CountryDetails
  detailsEn: CountryDetails
}

export type MapRegionTab = "all" | "europe" | "asia" | "others"

export const MAP_REGION_TABS: Record<
  MapRegionTab,
  { ja: string; en: string }
> = {
  all: { ja: "全域", en: "Global" },
  europe: { ja: "欧州", en: "Europe" },
  asia: { ja: "アジア", en: "Asia" },
  others: { ja: "他地域", en: "Others" },
}

export const NETWORK_UI = {
  progress: { ja: "社会実装進展度", en: "Implementation Progress" },
  capacityLimit: { ja: "認可上限", en: "Allowed Capacity Limit" },
  payback: { ja: "回収年数", en: "Payback Period" },
  tabPolicy: { ja: "制度・賃貸", en: "Policy & Tenancy" },
  tabLife: { ja: "生活・経済", en: "Daily Life & Economy" },
  tabSafety: { ja: "安全・退避", en: "Safety & Resilience" },
  connectionType: { ja: "接続方式", en: "Connection Type" },
  plugInDirect: { ja: "コンセント直結（プラグイン）", en: "Plug-in Direct Connection" },
  tenantRight: { ja: "賃貸設置権", en: "Tenant Installation Right" },
  legallyGuaranteed: { ja: "法的に権利保障", en: "Legally Guaranteed" },
  regulation: { ja: "準拠法規", en: "Regulatory Standard" },
  meterReq: { ja: "メーター要件", en: "Meter Requirements" },
  lastUpdated: { ja: "更新日", en: "Last updated" },
  watch: { ja: "注意", en: "Watch" },
  networkTab: { ja: "ネットワーク", en: "Network" },
  rankingTab: { ja: "都道府県番付", en: "Prefecture Ranking" },
  dayMode: { ja: "日中余剰モード", en: "Daytime Surplus Mode" },
  nightMode: { ja: "夜間供給モード", en: "Night Supply Mode" },
  dayModeHint: { ja: "蓄電・水素生成", en: "Storage & H₂ generation" },
  nightModeHint: { ja: "放電・供給", en: "Discharge & supply" },
  flowSection: { ja: "ネットワーク系統フロー", en: "Network System Flow" },
  stageGeneration: { ja: "01. GENERATION", en: "01. GENERATION" },
  stageBuffer: { ja: "02. BUFFER & CONVERSION", en: "02. BUFFER & CONVERSION" },
  stageConsume: { ja: "03. LOCAL CONSUMPTION", en: "03. LOCAL CONSUMPTION" },
  methodP2g: { ja: "P2G水素循環", en: "P2G Hydrogen Cycle" },
  methodVpp: { ja: "系統協調型VPP", en: "Grid-coordinated VPP" },
  methodMicrogrid: { ja: "マイクログリッド自営線", en: "Microgrid Private Line" },
  methodSelfLine: { ja: "自営線マイクログリッド", en: "Self-owned Line Microgrid" },
  selfSufficiency: { ja: "自給率", en: "Self-sufficiency" },
  gridLinked: { ja: "系統協調連系", en: "Grid-coordinated" },
  gridIsland: { ja: "島運用可", en: "Islandable" },
  kindSupply: { ja: "供給ノード", en: "Supply Node" },
  kindConvert: { ja: "変換・蓄電ノード", en: "Conversion / Storage Node" },
  kindConsume: { ja: "消費ノード", en: "Consumption Node" },
  basinSupply: { ja: "上流・貯留", en: "Upstream / Storage" },
  basinConvert: { ja: "調整・排水", en: "Control / Drainage" },
  basinConsume: { ja: "下流・受益", en: "Downstream / Beneficiary" },
  offGridNote: {
    ja: "(オフグリッド(逆潮流不可))",
    en: "(Off-grid / No reverse flow)",
  },
  badge800W: { ja: "800Wプラグ公認", en: "800W Plug-in Certified" },
  badge600W: { ja: "600W / 家電製品区分", en: "600W / Appliance Category" },
  badgeOffGrid: { ja: "オフグリッド蓄電型", en: "Off-grid Storage Type" },
  badgeNec: { ja: "NEC/電気工事規程", en: "NEC / Electrical Code" },
  japanMapTitle: { ja: "地域再エネ日本マップ", en: "Japan Regional RE Map" },
  japanMapFilterAll: { ja: "全モデル", en: "All models" },
  japanMapFilterP2g: { ja: "P2G水素", en: "P2G Hydrogen" },
  japanMapFilterVpp: { ja: "広域VPP", en: "Regional VPP" },
  japanMapFilterMicrogrid: { ja: "マイクログリッド", en: "Microgrid" },
  japanMapFilterSelfLine: { ja: "自営線", en: "Self-owned line" },
  japanMapZoomIn: { ja: "拡大", en: "Zoom in" },
  japanMapZoomOut: { ja: "縮小", en: "Zoom out" },
  japanMapReset: { ja: "表示をリセット", en: "Reset view" },
  japanMapFilterAria: { ja: "モデル種別フィルタ", en: "Model category filter" },
  japanMapRegionAria: { ja: "地方別", en: "Region" },
  japanMapRegionAll: { ja: "全地方", en: "All regions" },
  japanMapRegionTohoku: { ja: "東北", en: "Tohoku" },
  japanMapRegionKanto: { ja: "関東", en: "Kanto" },
  japanMapRegionChubu: { ja: "中部", en: "Chubu" },
  japanMapRegionKansai: { ja: "関西", en: "Kansai" },
  japanMapRegionKyushu: { ja: "九州", en: "Kyushu" },
  japanMapAttribution: {
    ja: "地図: 地球地図日本",
    en: "Map: Global Map Japan",
  },
} as const

export function uiText(
  key: keyof typeof NETWORK_UI,
  locale: NetworkLocale
): string {
  return NETWORK_UI[key][locale]
}

export function pickLocale<T extends { ja: string; en: string }>(
  entry: T,
  locale: NetworkLocale
): string {
  return entry[locale]
}

export function localizedNode(
  node: NetworkNode,
  locale: NetworkLocale
): Pick<NetworkNode, "label" | "sublabel"> {
  return locale === "en"
    ? {
        label: node.labelEn ?? node.label,
        sublabel: node.sublabelEn ?? node.sublabel,
      }
    : { label: node.label, sublabel: node.sublabel }
}

export function localizedModel(
  config: NetworkModelConfig,
  locale: NetworkLocale
): { label: string; description: string } {
  return locale === "en"
    ? {
        label: config.labelEn ?? config.label,
        description: config.descriptionEn ?? config.description,
      }
    : { label: config.label, description: config.description }
}

export function localizedCountry(
  country: Country,
  locale: NetworkLocale
): {
  name: string
  subtitle: string
  category: string
  details: CountryDetails
} {
  return locale === "en"
    ? {
        name: country.nameEn,
        subtitle: country.subtitleEn,
        category: country.categoryEn,
        details: country.detailsEn,
      }
    : {
        name: country.name,
        subtitle: country.subtitle,
        category: country.category,
        details: country.details,
      }
}

export const COUNTRIES: Country[] = [
  {
    id: "de",
    name: "ドイツ",
    nameEn: "Germany",
    subtitle: "800Wプラグ公認",
    subtitleEn: "800W Plug-in Certified",
    category: "800Wプラグ公認",
    categoryEn: "800W Plug-in Certified",
    region: "europe",
    details: {
      system: "コンセント直結（プラグイン）",
      legal: "法的に権利保障",
      meter: "双方向スマートメーター推奨",
      payback: "約4–6年",
      summary:
        "連邦ネットワーク庁(MaStR)への登録のみで無届連系可能。賃貸でもバルコニー設置の権利が法で保障されています。",
      connection: "コンセント直結（プラグイン）",
      tenantRight: "法的に権利保障",
      regulation: "EEG / VDE-AR-N 4105",
    },
    detailsEn: {
      system: "Plug-in Direct Connection",
      legal: "Legally Guaranteed",
      meter: "Bidirectional smart meter recommended",
      payback: "Approx. 4–6 years",
      summary:
        "Grid connection is allowed with registration alone via the Federal Network Agency (MaStR). Tenants have a legally guaranteed right to install balcony PV.",
      connection: "Plug-in Direct Connection",
      tenantRight: "Legally Guaranteed",
      regulation: "EEG / VDE-AR-N 4105",
    },
  },
  {
    id: "at",
    name: "オーストリア",
    nameEn: "Austria",
    subtitle: "800Wプラグ公認",
    subtitleEn: "800W Plug-in Certified",
    category: "800Wプラグ公認",
    categoryEn: "800W Plug-in Certified",
    region: "europe",
    details: {
      system: "コンセント直結（プラグイン）",
      legal: "法的に権利保障",
      meter: "標準メーター可",
      payback: "約5–7年",
      summary:
        "プラグイン型小型PVが公認され、届出簡素化が進んでいます。集合住宅でも導入しやすい制度設計です。",
      connection: "コンセント直結（プラグイン）",
      tenantRight: "法的に権利保障",
      regulation: "ElWOG / OVE 規格",
    },
    detailsEn: {
      system: "Plug-in Direct Connection",
      legal: "Legally Guaranteed",
      meter: "Standard meter acceptable",
      payback: "Approx. 5–7 years",
      summary:
        "Plug-in small-scale PV is certified, with simplified notification. Policies make apartment installation comparatively easy.",
      connection: "Plug-in Direct Connection",
      tenantRight: "Legally Guaranteed",
      regulation: "ElWOG / OVE standards",
    },
  },
  {
    id: "it",
    name: "イタリア",
    nameEn: "Italy",
    subtitle: "800Wプラグ公認",
    subtitleEn: "800W Plug-in Certified",
    category: "800Wプラグ公認",
    categoryEn: "800W Plug-in Certified",
    region: "europe",
    details: {
      system: "コンセント直結（プラグイン）",
      legal: "条件付きで可",
      meter: "交換が必要な場合あり",
      payback: "約5–8年",
      summary:
        "「Plug & Play」枠で小型PVが認められる地域が拡大。自治体・配電会社の手続き差に注意が必要です。",
      connection: "コンセント直結（プラグイン）",
      tenantRight: "条件付きで可",
      regulation: "CEI 0-21",
    },
    detailsEn: {
      system: "Plug-in Direct Connection",
      legal: "Allowed under conditions",
      meter: "Replacement may be required",
      payback: "Approx. 5–8 years",
      summary:
        "Plug & Play small PV is expanding regionally. Procedures still vary by municipality and DSO.",
      connection: "Plug-in Direct Connection",
      tenantRight: "Allowed under conditions",
      regulation: "CEI 0-21",
    },
  },
  {
    id: "uk",
    name: "イギリス",
    nameEn: "United Kingdom (UK)",
    subtitle: "600W / 家電製品区分",
    subtitleEn: "600W / Appliance Category",
    category: "600W / 家電製品区分",
    categoryEn: "600W / Appliance Category",
    region: "europe",
    details: {
      system: "コンセント直結（プラグイン）",
      legal: "家電製品として扱い",
      meter: "標準メーター可",
      payback: "約6–9年",
      summary:
        "一定容量以下は家電製品区分として扱われ、導入ハードルが低い一方、出力上限は厳しめです。",
      connection: "コンセント直結（プラグイン）",
      tenantRight: "賃貸契約次第",
      regulation: "G98 / BS 7671",
    },
    detailsEn: {
      system: "Plug-in Direct Connection",
      legal: "Treated as appliance",
      meter: "Standard meter acceptable",
      payback: "Approx. 6–9 years",
      summary:
        "Below a set capacity, units are treated as appliances with a lower barrier—but output limits are relatively strict.",
      connection: "Plug-in Direct Connection",
      tenantRight: "Depends on tenancy agreement",
      regulation: "G98 / BS 7671",
    },
  },
  {
    id: "fr",
    name: "フランス",
    nameEn: "France",
    subtitle: "800Wプラグ公認",
    subtitleEn: "800W Plug-in Certified",
    category: "800Wプラグ公認",
    categoryEn: "800W Plug-in Certified",
    region: "europe",
    details: {
      system: "コンセント直結（プラグイン）",
      legal: "届出簡素化",
      meter: "Linky連携推奨",
      payback: "約5–8年",
      summary:
        "自己消費型の小型PVが推進され、プラグイン製品の流通も増加しています。",
      connection: "コンセント直結（プラグイン）",
      tenantRight: "条件付きで可",
      regulation: "Enedis / NF C 15-100",
    },
    detailsEn: {
      system: "Plug-in Direct Connection",
      legal: "Simplified notification",
      meter: "Linky integration recommended",
      payback: "Approx. 5–8 years",
      summary:
        "Self-consumption small PV is promoted, and plug-in products are increasingly available.",
      connection: "Plug-in Direct Connection",
      tenantRight: "Allowed under conditions",
      regulation: "Enedis / NF C 15-100",
    },
  },
  {
    id: "be",
    name: "ベルギー",
    nameEn: "Belgium",
    subtitle: "600W / 家電製品区分",
    subtitleEn: "600W / Appliance Category",
    category: "600W / 家電製品区分",
    categoryEn: "600W / Appliance Category",
    region: "europe",
    details: {
      system: "コンセント直結（プラグイン）",
      legal: "地域差あり",
      meter: "地域により異なる",
      payback: "約6–10年",
      summary:
        "連邦・地域で規制が分かれ、容量・届出要件に差があります。導入前の地域確認が重要です。",
      connection: "コンセント直結（プラグイン）",
      tenantRight: "賃貸契約次第",
      regulation: "地域配電規程",
    },
    detailsEn: {
      system: "Plug-in Direct Connection",
      legal: "Varies by region",
      meter: "Varies by region",
      payback: "Approx. 6–10 years",
      summary:
        "Rules split between federal and regional levels; capacity and notification differ. Check local rules before installing.",
      connection: "Plug-in Direct Connection",
      tenantRight: "Depends on tenancy agreement",
      regulation: "Regional distribution codes",
    },
  },
  {
    id: "ch",
    name: "スイス",
    nameEn: "Switzerland",
    subtitle: "600W / 家電製品区分",
    subtitleEn: "600W / Appliance Category",
    category: "600W / 家電製品区分",
    categoryEn: "600W / Appliance Category",
    region: "europe",
    details: {
      system: "コンセント直結（プラグイン）",
      legal: "カントンにより異なる",
      meter: "標準メーター可",
      payback: "約6–9年",
      summary:
        "小型プラグインPVが認められる州が増えていますが、カントン単位の差が大きいです。",
      connection: "コンセント直結（プラグイン）",
      tenantRight: "賃貸契約次第",
      regulation: "NIN / カントン規程",
    },
    detailsEn: {
      system: "Plug-in Direct Connection",
      legal: "Varies by canton",
      meter: "Standard meter acceptable",
      payback: "Approx. 6–9 years",
      summary:
        "More cantons allow small plug-in PV, but rules still differ significantly by canton.",
      connection: "Plug-in Direct Connection",
      tenantRight: "Depends on tenancy agreement",
      regulation: "NIN / cantonal codes",
    },
  },
  {
    id: "cn",
    name: "中国",
    nameEn: "China",
    subtitle: "オフグリッド蓄電型",
    subtitleEn: "Off-grid Storage Type",
    category: "オフグリッド蓄電型",
    categoryEn: "Off-grid Storage Type",
    region: "asia",
    details: {
      system: "オフグリッド蓄電型",
      legal: "系統連系は制限的",
      meter: "逆潮流不可が一般的",
      payback: "約3–6年",
      summary:
        "都市部ではオフグリッド・蓄電一体型が多く、逆潮流を伴わない運用が主流です。",
      connection: "オフグリッド蓄電型",
      tenantRight: "物件・管理規約次第",
      regulation: "地方電力・製品安全規格",
    },
    detailsEn: {
      system: "Off-grid Storage Type",
      legal: "Grid connection is restrictive",
      meter: "No reverse flow is typical",
      payback: "Approx. 3–6 years",
      summary:
        "In cities, off-grid storage-integrated systems are common; operation without reverse flow is the mainstream.",
      connection: "Off-grid Storage Type",
      tenantRight: "Depends on property / HOA rules",
      regulation: "Local utility & product safety standards",
    },
  },
  {
    id: "jp",
    name: "日本",
    nameEn: "Japan",
    subtitle: "(オフグリッド(逆潮流不可))",
    subtitleEn: "(Off-grid / No reverse flow)",
    category: "オフグリッド蓄電型",
    categoryEn: "Off-grid Storage Type",
    region: "asia",
    details: {
      system: "オフグリッド蓄電型",
      legal: "系統連系は電気工事士・届出が必要",
      meter: "逆潮流不可（オフグリッド想定）",
      payback: "約7–12年",
      summary:
        "ベランダ向けはオフグリッド・コンセント給電型が現実的。正式連系は工事・手続き負担が大きいです。",
      connection: "オフグリッド蓄電型",
      tenantRight: "賃貸契約・管理規約次第",
      regulation: "電気事業法 / 電気設備技術基準",
    },
    detailsEn: {
      system: "Off-grid Storage Type",
      legal: "Grid tie needs licensed work & notification",
      meter: "No reverse flow (off-grid assumed)",
      payback: "Approx. 7–12 years",
      summary:
        "For balconies, off-grid plug-fed systems are realistic. Formal grid connection still means heavy works and paperwork.",
      connection: "Off-grid Storage Type",
      tenantRight: "Depends on lease / building rules",
      regulation: "Electricity Business Act / Technical Standards",
    },
  },
  {
    id: "us",
    name: "アメリカ",
    nameEn: "United States (US)",
    subtitle: "NEC/電気工事規程",
    subtitleEn: "NEC / Electrical Code",
    category: "NEC/電気工事規程",
    categoryEn: "NEC / Electrical Code",
    region: "others",
    details: {
      system: "工事接続が基本",
      legal: "州・自治体で大きく異なる",
      meter: "ネッティング制度は州次第",
      payback: "約6–12年",
      summary:
        "プラグイン連系は一般的でなく、NEC準拠の電気工事と許可が前提になるケースが多いです。",
      connection: "工事接続が基本",
      tenantRight: "賃貸では制限的",
      regulation: "NEC / 州電気規程",
    },
    detailsEn: {
      system: "Hardwired connection typical",
      legal: "Varies widely by state / locality",
      meter: "Net metering depends on state",
      payback: "Approx. 6–12 years",
      summary:
        "Plug-in grid tie is uncommon; NEC-compliant electrical work and permits are often required.",
      connection: "Hardwired connection typical",
      tenantRight: "Restrictive for renters",
      regulation: "NEC / state electrical codes",
    },
  },
]

export const NETWORK_MODELS: Record<NetworkModel, NetworkModelConfig> = {
  yamanashi: {
    label: "山梨 P2G 水素モデル",
    labelEn: "Yamanashi P2G Hydrogen Model",
    description:
      "北杜のメガソーラー余剰電力を米倉山のP2Gプラントで水素に変換し、地域に供給します。",
    descriptionEn:
      "Surplus power from Hokuto mega-solar is converted to hydrogen at the Yume-sakura P2G plant and supplied locally.",
    coordinates: [138.4239, 35.8667],
    regionName: "山梨県 北杜市",
    regionNameEn: "Hokuto, Yamanashi",
    modelCategory: "p2g",
    scaleLabel: "12.4MW / P2G",
    scaleLabelEn: "12.4MW / P2G",
    selfSufficiencyPct: 78,
    nodes: [
      {
        id: "solar",
        label: "メガソーラー(北杜)",
        labelEn: "Mega-solar (Hokuto)",
        sublabel: "出力 12.4MW",
        sublabelEn: "Output 12.4MW",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "hydro",
        label: "小水力",
        labelEn: "Small hydro",
        sublabel: "出力 1.8MW",
        sublabelEn: "Output 1.8MW",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "p2g",
        label: "水電解P2G水素プラント",
        labelEn: "Electrolysis P2G Hydrogen Plant",
        sublabel: "米倉山 / 変換効率 68%",
        sublabelEn: "Yume-sakura / Efficiency 68%",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "storage",
        label: "定置型蓄電池",
        labelEn: "Stationary Battery",
        sublabel: "容量 4.2MWh",
        sublabelEn: "Capacity 4.2MWh",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "city",
        label: "地元スマートシティ",
        labelEn: "Local Smart City",
        sublabel: "世帯数 3,200",
        sublabelEn: "3,200 households",
        kind: "consume",
        icon: "building-2",
      },
      {
        id: "station",
        label: "水素ステーション",
        labelEn: "Hydrogen Station",
        sublabel: "供給 320kg/日",
        sublabelEn: "Supply 320kg/day",
        kind: "consume",
        icon: "fuel",
      },
      {
        id: "home",
        label: "家庭",
        labelEn: "Homes",
        sublabel: "接続 8,600件",
        sublabelEn: "8,600 connections",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "solar", to: "p2g" },
      { from: "solar", to: "storage" },
      { from: "hydro", to: "storage" },
      { from: "p2g", to: "station" },
      { from: "storage", to: "city" },
      { from: "storage", to: "home" },
    ],
  },
  fukushima: {
    label: "福島 広域VPPモデル",
    labelEn: "Fukushima Regional VPP Model",
    description:
      "郡山の風力とメガソーラーを束ね、広域VPP(バーチャルパワープラント)として需給を最適化します。",
    descriptionEn:
      "Wind and mega-solar around Koriyama are aggregated into a regional VPP (virtual power plant) to optimize supply and demand.",
    coordinates: [140.3595, 37.4005],
    regionName: "福島県 郡山市",
    regionNameEn: "Koriyama, Fukushima",
    modelCategory: "vpp",
    scaleLabel: "22.6MW / VPP",
    scaleLabelEn: "22.6MW / VPP",
    selfSufficiencyPct: 64,
    nodes: [
      {
        id: "wind",
        label: "風力(郡山)",
        labelEn: "Wind (Koriyama)",
        sublabel: "出力 22.6MW",
        sublabelEn: "Output 22.6MW",
        kind: "supply",
        icon: "wind",
      },
      {
        id: "solar",
        label: "メガソーラー",
        labelEn: "Mega-solar",
        sublabel: "出力 9.1MW",
        sublabelEn: "Output 9.1MW",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "hydro",
        label: "小水力",
        labelEn: "Small hydro",
        sublabel: "出力 2.3MW",
        sublabelEn: "Output 2.3MW",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "storage",
        label: "定置型蓄電池",
        labelEn: "Stationary Battery",
        sublabel: "VPP統合 / 6.8MWh",
        sublabelEn: "VPP integrated / 6.8MWh",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "city",
        label: "地元スマートシティ",
        labelEn: "Local Smart City",
        sublabel: "世帯数 5,400",
        sublabelEn: "5,400 households",
        kind: "consume",
        icon: "building-2",
      },
      {
        id: "home",
        label: "家庭",
        labelEn: "Homes",
        sublabel: "接続 14,200件",
        sublabelEn: "14,200 connections",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "wind", to: "storage" },
      { from: "solar", to: "storage" },
      { from: "hydro", to: "storage" },
      { from: "storage", to: "city" },
      { from: "storage", to: "home" },
    ],
  },
}

export function matchesModelCategory(
  category: ModelCategory,
  filter: ModelCategory | "all"
): boolean {
  return filter === "all" || category === filter
}

export function categoryColor(category: ModelCategory): string {
  switch (category) {
    case "p2g":
      return "#10b981"
    case "vpp":
      return "#3b82f6"
    case "microgrid":
      return "#8b5cf6"
    case "self-line":
      return "#f59e0b"
    default:
      return "#6b7280"
  }
}

export function networkMethodKey(
  category: ModelCategory
): "methodP2g" | "methodVpp" | "methodMicrogrid" | "methodSelfLine" {
  switch (category) {
    case "p2g":
      return "methodP2g"
    case "vpp":
      return "methodVpp"
    case "microgrid":
      return "methodMicrogrid"
    case "self-line":
      return "methodSelfLine"
  }
}

export function localizedMapSite(
  config: NetworkModelConfig,
  locale: NetworkLocale
): { regionName: string; scaleLabel: string; label: string } {
  return locale === "en"
    ? {
        regionName: config.regionNameEn ?? config.regionName,
        scaleLabel: config.scaleLabelEn ?? config.scaleLabel,
        label: config.labelEn ?? config.label,
      }
    : {
        regionName: config.regionName,
        scaleLabel: config.scaleLabel,
        label: config.label,
      }
}
```

### `features/ranking/data.ts`

```typescript
// Mock for balcony solar world implementation & ecosystem. Static — no backend.

export type WorldTimelineId = 'until2020' | 'from2021' | 'from2023' | 'current'

export type WorldTagId = 'regulatoryRelief' | 'legislationTrend' | 'offGrid'

export type WorldRegionId = 'germanyEu' | 'unitedStates' | 'africaDeveloping'

export type WorldBulletId =
  | 'clearOutputCap'
  | 'rentalMultifamily'
  | 'applianceValue'
  | 'stateInterconnection'
  | 'rentalIncentives'
  | 'rooftopDifferentiation'
  | 'appliancePower'
  | 'microgridLink'
  | 'coopNgo'

export type WorldRegion = {
  id: WorldRegionId
  tags: WorldTagId[]
  bullets: WorldBulletId[]
}

/** Locale-independent timeline period keys. Labels: `worldPv.timeline.*`. */
export const WORLD_TIMELINE: readonly WorldTimelineId[] = [
  'until2020',
  'from2021',
  'from2023',
  'current',
] as const

/** Locale-independent region cards. Labels: `worldPv.regions.*` / `worldPv.tags.*`. */
export const WORLD_REGIONS: readonly WorldRegion[] = [
  {
    id: 'germanyEu',
    tags: ['regulatoryRelief'],
    bullets: ['clearOutputCap', 'rentalMultifamily', 'applianceValue'],
  },
  {
    id: 'unitedStates',
    tags: ['legislationTrend'],
    bullets: ['stateInterconnection', 'rentalIncentives', 'rooftopDifferentiation'],
  },
  {
    id: 'africaDeveloping',
    tags: ['offGrid'],
    bullets: ['appliancePower', 'microgridLink', 'coopNgo'],
  },
] as const
```

### `features/shell/components/app-shell.tsx`

```tsx
"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Sun, Network, Globe2, Leaf, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { RegionHeader } from "./region-header"
import { BalconyView, WorldImplementationView } from "@/features/balcony-pv/components/balcony-view"
import { NetworkView } from "@/features/network"
import { REGIONS } from "@/lib/regions"

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
              ? "flex flex-col overflow-hidden px-0 pb-16 pt-0 lg:pb-0"
              : "px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8"
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

