# 本日のセッション前提コンテキスト

- **実行日時（JST）**: 2026/10/13(火) 13:51:41
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

## 存在する主要ファイル一覧（プロジェクトルート基準）

```text
./agri-dam-and-basin-grid/app/globals.css
./agri-dam-and-basin-grid/components.json
./agri-dam-and-basin-grid/next.config.mjs
./agri-dam-and-basin-grid/package.json
./agri-dam-and-basin-grid/postcss.config.mjs
./agri-dam-and-basin-grid/tsconfig.json
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

// ---------------------------------------------------------------------------
// Typology-first surface master (建築形態が第一級エンティティ)
// i18n: `balconyPv.typologies.*`
// ---------------------------------------------------------------------------

/** Architectural balcony / roof receiving-surface typology (locale-independent). */
export type SurfaceTypology =
  | 'egress_cantilever'
  | 'precast_parapet'
  | 'recessed_loggia'
  | 'glass_railing'
  | 'access_gallery'
  | 'mansard_dormer'
  | 'japanese_tiled_roof'
  | 'flat_roof_terrace'
  | 'pitched_gable_terrace'

/** Biomimetic / living-furniture mount family suited to a typology. */
export type BiomimeticMechanism =
  | 'nastic_origami'
  | 'flexible_perovskite'
  | 'clamp_mount'
  | 'catenary_hook'

/** Receiving-surface optical / irradiance character (locale-independent). */
export type OpticalProfile = 'diffuse_dominant' | 'direct_beam' | 'high_altitude'

/** Locale-independent typical-region keys under `balconyPv.typologies.regions.*`. */
export type TypicalRegionKey =
  | 'urban_europe'
  | 'historic_district'
  | 'multifamily_general'
  | 'multifamily_egress'
  | 'central_europe_stock'
  | 'tiled_pitch_roofs'
  | 'flat_deck_roofs'
  | 'terrace_house_roofs'
  | 'rental_facades'

/** Recommended mount / fix method for a receiving surface (locale-independent). */
export type SurfaceMountMethod =
  | 'clamp_no_drill'
  | 'freestanding_furniture'
  | 'vertical_rail_hook'
  | 'louver_hanger'
  | 'tile_hook'

export interface SurfaceMountOption {
  mountMethod: SurfaceMountMethod
  /** i18n key under `balconyPv.mount.*` (e.g. `mount.clamp_no_drill`). */
  labelKey: string
}

export interface PrevalentCountry {
  code: string
  /** i18n key under `balconyPv.countries.*` (e.g. `countries.fr`). */
  nameKey: string
}

/**
 * Deployable panel tilt / stow posture (locale-independent).
 * Labels: `balconyPv.tiltMode.*`.
 */
export type PanelTiltMode = 'horizontal' | 'optimal_tilt' | 'vertical' | 'retracted'

export interface PanelTiltOption {
  id: PanelTiltMode
  /** Degrees from horizontal when deployed (`retracted` is 0° + stowed pose). */
  tiltDeg: number
  /** i18n key under `balconyPv.tiltMode.*`. */
  labelKey: string
}

/** Master of install-style (variable tilt / 出仕舞い) options. */
export const PANEL_TILT_OPTIONS: readonly PanelTiltOption[] = [
  { id: 'horizontal', tiltDeg: 0, labelKey: 'tiltMode.horizontal' },
  { id: 'optimal_tilt', tiltDeg: 30, labelKey: 'tiltMode.optimal_tilt' },
  { id: 'vertical', tiltDeg: 90, labelKey: 'tiltMode.vertical' },
  { id: 'retracted', tiltDeg: 0, labelKey: 'tiltMode.retracted' },
] as const

export function getPanelTiltOption(mode: PanelTiltMode): PanelTiltOption {
  return PANEL_TILT_OPTIONS.find((o) => o.id === mode) ?? PANEL_TILT_OPTIONS[0]
}

/** Efficiency / safety trade-offs for each install-style (demo heuristic). */
export interface TiltMetric {
  annualEfficiencyPct: number
  /** Season / irradiance fit (display copy). */
  winterAdvantage: string
  /** Wind-load character (display copy). */
  windRisk: string
  /** One-line living / install trade-off hint. */
  summary: string
  /** Optional progress caption (e.g. winter relative note). */
  efficiencyNote?: string
}

/**
 * Angle-wise generation & safety metrics keyed by PanelTiltMode.
 * Relative annual efficiency vs optimal_tilt = 100%.
 */
export const TILT_METRICS: Record<PanelTiltMode, TiltMetric> = {
  optimal_tilt: {
    annualEfficiencyPct: 100,
    winterAdvantage: '年間ピーク',
    windRisk: '中',
    summary:
      '緯度相当の傾斜で年間発電のピークを狙う。生活動線と風圧のバランスが取りやすい基準姿勢。',
    efficiencyNote: '年間基準',
  },
  horizontal: {
    annualEfficiencyPct: 84,
    winterAdvantage: '散乱光・平置き',
    windRisk: '注意（下からの風圧大）',
    summary:
      '床置き・家具型に向く平置き。曇天の散乱光は拾いやすいが、下からの風圧と避難動線の占有に注意。',
    efficiencyNote: '散乱光向き',
  },
  vertical: {
    annualEfficiencyPct: 72,
    winterAdvantage: '冬季・朝夕に強い',
    windRisk: '安全（風を受け流す）',
    summary:
      '垂直設置は風を壁面で受け流し、冬の低い太陽光を効率的に捉えます。',
    efficiencyNote: '冬期は90%超',
  },
  retracted: {
    annualEfficiencyPct: 0,
    winterAdvantage: '外力回避',
    windRisk: '完全回避',
    summary:
      '出仕舞いで発電は止める代わりに、台風・突風時の外力と避難路を完全に優先する退避姿勢。',
    efficiencyNote: '発電オフ',
  },
}

export function getTiltMetric(mode: PanelTiltMode): TiltMetric {
  return TILT_METRICS[mode]
}

/** Daily balcony use pattern (locale-independent). Labels: `balconyPv.livingHabit.*`. */
export type LivingHabit =
  | 'laundry_drying'
  | 'view_preservation_terrace'
  | 'outdoor_unit_service'

/** Weather / season scenario (locale-independent). Labels: `balconyPv.weather.*`. */
export type WeatherCondition = 'clear' | 'overcast_tsuyu' | 'typhoon_alert'

export type CulturalConstraintKind = 'egress_path_60cm' | 'hatch_no_go'

export interface CulturalConstraint {
  kind: CulturalConstraintKind
  /** Demo penalty when PV/furniture occupies the zone (0–1). */
  occupancyPenalty: number
}

export interface LivingContext {
  habit: LivingHabit
  weather: WeatherCondition
}

export const DEFAULT_LIVING_CONTEXT: LivingContext = {
  habit: 'laundry_drying',
  weather: 'clear',
}

export interface LivingContextModifiers {
  directRatioMul: number
  diffuseRatioMul: number
  /** 1 = no laundry shade, lower = more panel shading. */
  laundryShadeFactor: number
  lifeComplianceBase: number
}

const WEATHER_MODIFIERS: Record<WeatherCondition, Omit<LivingContextModifiers, 'laundryShadeFactor' | 'lifeComplianceBase'>> = {
  clear: { directRatioMul: 1, diffuseRatioMul: 1 },
  overcast_tsuyu: { directRatioMul: 0.72, diffuseRatioMul: 1.18 },
  typhoon_alert: { directRatioMul: 0, diffuseRatioMul: 0 },
}

const HABIT_MODIFIERS: Record<
  LivingHabit,
  Pick<LivingContextModifiers, 'laundryShadeFactor' | 'lifeComplianceBase'>
> = {
  laundry_drying: { laundryShadeFactor: 0.88, lifeComplianceBase: 78 },
  view_preservation_terrace: { laundryShadeFactor: 1, lifeComplianceBase: 85 },
  outdoor_unit_service: { laundryShadeFactor: 1, lifeComplianceBase: 72 },
}

/** Default cultural constraints for egress-heavy typologies (demo). */
export const TYPOLOGY_CULTURAL_CONSTRAINTS: Partial<
  Record<SurfaceTypology, CulturalConstraint[]>
> = {
  egress_cantilever: [{ kind: 'egress_path_60cm', occupancyPenalty: 0.35 }],
  access_gallery: [
    { kind: 'egress_path_60cm', occupancyPenalty: 0.4 },
    { kind: 'hatch_no_go', occupancyPenalty: 0.5 },
  ],
}

export function getLivingContextModifiers(ctx: LivingContext): LivingContextModifiers {
  const weather = WEATHER_MODIFIERS[ctx.weather]
  const habit = HABIT_MODIFIERS[ctx.habit]
  return {
    directRatioMul: weather.directRatioMul,
    diffuseRatioMul: weather.diffuseRatioMul,
    laundryShadeFactor: habit.laundryShadeFactor,
    lifeComplianceBase: habit.lifeComplianceBase,
  }
}

export function applyWeatherToIrradiance(
  params: SurfaceIrradianceParams,
  weather: WeatherCondition,
): SurfaceIrradianceParams {
  const { directRatioMul, diffuseRatioMul } = WEATHER_MODIFIERS[weather]
  const direct = Math.min(1, params.directRatio * directRatioMul)
  const diffuse = Math.min(1, params.diffuseRatio * diffuseRatioMul)
  const sum = direct + diffuse || 1
  return {
    ...params,
    directRatio: direct / sum,
    diffuseRatio: diffuse / sum,
  }
}

export interface ResolvedLivingMetrics {
  lifeCompliancePct: number
  displayEfficiencyPct: number
}

export function resolveLivingMetrics(
  ctx: LivingContext,
  tiltMode: PanelTiltMode,
  typologyId?: SurfaceTypology,
): ResolvedLivingMetrics {
  const tilt = getTiltMetric(tiltMode)
  const mods = getLivingContextModifiers(ctx)

  if (ctx.weather === 'typhoon_alert' || tiltMode === 'retracted') {
    return { lifeCompliancePct: 100, displayEfficiencyPct: 0 }
  }

  let life = mods.lifeComplianceBase

  if (ctx.habit === 'laundry_drying') {
    const laundryPenalty =
      tiltMode === 'horizontal' ? 8 : tiltMode === 'optimal_tilt' ? 5 : 2
    life -= laundryPenalty
  }
  if (ctx.habit === 'outdoor_unit_service') {
    life -= tiltMode === 'vertical' ? 4 : 10
  }
  if (ctx.habit === 'view_preservation_terrace' && tiltMode === 'optimal_tilt') {
    life -= 6
  }

  if (typologyId) {
    const constraints = TYPOLOGY_CULTURAL_CONSTRAINTS[typologyId]
    if (constraints?.length) {
      const penalty =
        constraints.reduce((s, c) => s + c.occupancyPenalty, 0) * 12
      life -= tiltMode === 'horizontal' ? penalty : penalty * 0.55
    }
  }

  let displayEfficiencyPct = tilt.annualEfficiencyPct
  if (ctx.weather === 'overcast_tsuyu') {
    const diffuseBoost =
      tiltMode === 'horizontal' ? 1.06 : tiltMode === 'vertical' ? 0.98 : 1
    displayEfficiencyPct = Math.min(
      100,
      Math.round(tilt.annualEfficiencyPct * diffuseBoost * mods.laundryShadeFactor),
    )
  } else {
    displayEfficiencyPct = Math.round(
      tilt.annualEfficiencyPct * mods.laundryShadeFactor,
    )
  }

  return {
    lifeCompliancePct: Math.round(Math.min(100, Math.max(0, life))),
    displayEfficiencyPct,
  }
}

export function getTypologyCulturalConstraints(
  id: SurfaceTypology,
): CulturalConstraint[] {
  return TYPOLOGY_CULTURAL_CONSTRAINTS[id] ?? []
}

export interface SurfaceTypologyDetail {
  id: SurfaceTypology
  category: 'balcony' | 'roof'
  /** i18n key under `balconyPv.typologies.<id>.name` (short path stored). */
  nameKey: string
  defaultTiltDeg: number
  irradiance: SurfaceIrradianceParams
  /** Optical / beam character of the receiving geometry. */
  opticalProfile: OpticalProfile
  /** Secondary context only — not card identity (i18n via `regions.*`). */
  typicalRegions: TypicalRegionKey[]
  /** Countries where this form is mainly seen (i18n via `countries.*`). */
  prevalentCountries: PrevalentCountry[]
  /** Recommended fix methods for install-job support. */
  mountOptions: SurfaceMountOption[]
  /** 出仕舞い（強風時退避機構）が必要か */
  requiresDeShimai: boolean
  /** i18n key under `balconyPv.typologies.<id>.constraints`. */
  constraintsKey: string
  biomimeticSuitability: {
    mechanism: BiomimeticMechanism
    /** 出仕舞い（退避機構）が必須か */
    deShimaiRequired: boolean
    descriptionKey: string
  }
  /** Install-style modes the form can physically support. */
  supportedTiltModes?: PanelTiltMode[]
  /** Initial install-style when the typology is selected. */
  defaultTiltMode?: PanelTiltMode
}

/** Resolve supported tilt modes with geometry-aware fallback. */
export function resolveSupportedTiltModes(
  detail: SurfaceTypologyDetail,
): PanelTiltMode[] {
  if (detail.supportedTiltModes && detail.supportedTiltModes.length > 0) {
    return [...detail.supportedTiltModes]
  }
  if (detail.defaultTiltDeg >= 80) return ['vertical', 'horizontal', 'retracted']
  if (detail.defaultTiltDeg >= 20) return ['optimal_tilt', 'horizontal', 'retracted']
  return ['horizontal', 'optimal_tilt', 'retracted']
}

/** Resolve default tilt mode with geometry-aware fallback. */
export function resolveDefaultTiltMode(
  detail: SurfaceTypologyDetail,
): PanelTiltMode {
  if (detail.defaultTiltMode) return detail.defaultTiltMode
  if (detail.defaultTiltDeg >= 80) return 'vertical'
  if (detail.defaultTiltDeg >= 20) return 'optimal_tilt'
  return 'horizontal'
}

/**
 * Master catalog: pure architectural form + irradiance geometry first;
 * typical regions and regulations are secondary context only.
 */
export const SURFACE_TYPOLOGIES: readonly SurfaceTypologyDetail[] = [
  {
    id: 'egress_cantilever',
    category: 'balcony',
    nameKey: 'egress_cantilever.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 4.5,
      tiltDeg: 0,
      directRatio: 0.45,
      diffuseRatio: 0.55,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['multifamily_egress', 'multifamily_general'],
    prevalentCountries: [{ code: 'JP', nameKey: 'countries.jp' }],
    mountOptions: [
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: true,
    constraintsKey: 'egress_cantilever.constraints',
    biomimeticSuitability: {
      mechanism: 'nastic_origami',
      deShimaiRequired: true,
      descriptionKey: 'egress_cantilever.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
  },
  {
    id: 'precast_parapet',
    category: 'balcony',
    nameKey: 'precast_parapet.name',
    defaultTiltDeg: 90,
    irradiance: {
      receivingAreaM2: 3.2,
      tiltDeg: 90,
      directRatio: 0.42,
      diffuseRatio: 0.58,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['central_europe_stock', 'multifamily_general'],
    prevalentCountries: [
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'AT', nameKey: 'countries.at' },
    ],
    mountOptions: [
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'precast_parapet.constraints',
    biomimeticSuitability: {
      mechanism: 'clamp_mount',
      deShimaiRequired: false,
      descriptionKey: 'precast_parapet.mechanism',
    },
    supportedTiltModes: ['vertical', 'horizontal', 'retracted'],
    defaultTiltMode: 'vertical',
  },
  {
    id: 'recessed_loggia',
    category: 'balcony',
    nameKey: 'recessed_loggia.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 3.8,
      tiltDeg: 0,
      directRatio: 0.28,
      diffuseRatio: 0.72,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['multifamily_general', 'urban_europe'],
    prevalentCountries: [
      { code: 'IT', nameKey: 'countries.it' },
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'FR', nameKey: 'countries.fr' },
    ],
    mountOptions: [
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'recessed_loggia.constraints',
    biomimeticSuitability: {
      mechanism: 'clamp_mount',
      deShimaiRequired: false,
      descriptionKey: 'recessed_loggia.mechanism',
    },
    supportedTiltModes: ['horizontal', 'optimal_tilt', 'retracted'],
    defaultTiltMode: 'horizontal',
  },
  {
    id: 'glass_railing',
    category: 'balcony',
    nameKey: 'glass_railing.name',
    defaultTiltDeg: 90,
    irradiance: {
      receivingAreaM2: 2.4,
      tiltDeg: 90,
      directRatio: 0.36,
      diffuseRatio: 0.64,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['rental_facades', 'multifamily_general', 'urban_europe'],
    prevalentCountries: [
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'GB', nameKey: 'countries.gb' },
      { code: 'FR', nameKey: 'countries.fr' },
      { code: 'JP', nameKey: 'countries.jp' },
    ],
    mountOptions: [
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
      { mountMethod: 'vertical_rail_hook', labelKey: 'mount.vertical_rail_hook' },
      { mountMethod: 'louver_hanger', labelKey: 'mount.louver_hanger' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'glass_railing.constraints',
    biomimeticSuitability: {
      mechanism: 'flexible_perovskite',
      deShimaiRequired: false,
      descriptionKey: 'glass_railing.mechanism',
    },
    supportedTiltModes: ['vertical', 'horizontal', 'retracted'],
    defaultTiltMode: 'vertical',
  },
  {
    id: 'access_gallery',
    category: 'balcony',
    nameKey: 'access_gallery.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 10,
      tiltDeg: 0,
      directRatio: 0.4,
      diffuseRatio: 0.6,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['multifamily_egress', 'multifamily_general'],
    prevalentCountries: [
      { code: 'JP', nameKey: 'countries.jp' },
      { code: 'DE', nameKey: 'countries.de' },
    ],
    mountOptions: [
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: true,
    constraintsKey: 'access_gallery.constraints',
    biomimeticSuitability: {
      mechanism: 'nastic_origami',
      deShimaiRequired: true,
      descriptionKey: 'access_gallery.mechanism',
    },
    supportedTiltModes: ['horizontal', 'optimal_tilt', 'retracted'],
    defaultTiltMode: 'horizontal',
  },
  {
    id: 'mansard_dormer',
    category: 'roof',
    nameKey: 'mansard_dormer.name',
    defaultTiltDeg: 45,
    irradiance: {
      receivingAreaM2: 10,
      tiltDeg: 45,
      directRatio: 0.38,
      diffuseRatio: 0.62,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['urban_europe', 'historic_district'],
    prevalentCountries: [
      { code: 'FR', nameKey: 'countries.fr' },
      { code: 'BE', nameKey: 'countries.be' },
    ],
    mountOptions: [
      { mountMethod: 'tile_hook', labelKey: 'mount.tile_hook' },
      { mountMethod: 'louver_hanger', labelKey: 'mount.louver_hanger' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'mansard_dormer.constraints',
    biomimeticSuitability: {
      mechanism: 'flexible_perovskite',
      deShimaiRequired: false,
      descriptionKey: 'mansard_dormer.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
  },
  {
    id: 'japanese_tiled_roof',
    category: 'roof',
    nameKey: 'japanese_tiled_roof.name',
    defaultTiltDeg: 30,
    irradiance: {
      receivingAreaM2: 12,
      tiltDeg: 30,
      directRatio: 0.48,
      diffuseRatio: 0.52,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['tiled_pitch_roofs'],
    prevalentCountries: [{ code: 'JP', nameKey: 'countries.jp' }],
    mountOptions: [
      { mountMethod: 'tile_hook', labelKey: 'mount.tile_hook' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'japanese_tiled_roof.constraints',
    biomimeticSuitability: {
      mechanism: 'catenary_hook',
      deShimaiRequired: false,
      descriptionKey: 'japanese_tiled_roof.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
  },
  {
    id: 'flat_roof_terrace',
    category: 'roof',
    nameKey: 'flat_roof_terrace.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 18,
      tiltDeg: 5,
      directRatio: 0.5,
      diffuseRatio: 0.5,
    },
    opticalProfile: 'high_altitude',
    typicalRegions: ['flat_deck_roofs', 'multifamily_general'],
    prevalentCountries: [
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'JP', nameKey: 'countries.jp' },
      { code: 'FR', nameKey: 'countries.fr' },
    ],
    mountOptions: [
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
    ],
    requiresDeShimai: true,
    constraintsKey: 'flat_roof_terrace.constraints',
    biomimeticSuitability: {
      mechanism: 'nastic_origami',
      deShimaiRequired: true,
      descriptionKey: 'flat_roof_terrace.mechanism',
    },
    supportedTiltModes: ['horizontal', 'optimal_tilt', 'retracted'],
    defaultTiltMode: 'horizontal',
  },
  {
    id: 'pitched_gable_terrace',
    category: 'roof',
    nameKey: 'pitched_gable_terrace.name',
    defaultTiltDeg: 45,
    irradiance: {
      receivingAreaM2: 14,
      tiltDeg: 40,
      directRatio: 0.42,
      diffuseRatio: 0.58,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['terrace_house_roofs', 'tiled_pitch_roofs'],
    prevalentCountries: [
      { code: 'GB', nameKey: 'countries.gb' },
      { code: 'DE', nameKey: 'countries.de' },
    ],
    mountOptions: [
      { mountMethod: 'tile_hook', labelKey: 'mount.tile_hook' },
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'pitched_gable_terrace.constraints',
    biomimeticSuitability: {
      mechanism: 'clamp_mount',
      deShimaiRequired: false,
      descriptionKey: 'pitched_gable_terrace.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
  },
] as const

export function getSurfaceTypologyDetail(
  id: SurfaceTypology,
): SurfaceTypologyDetail {
  return SURFACE_TYPOLOGIES.find((t) => t.id === id) ?? SURFACE_TYPOLOGIES[0]
}

/** Typology → legacy balcony selector (undefined when roof-primary). */
const TYPOLOGY_TO_BALCONY: Partial<Record<SurfaceTypology, BalconyType>> = {
  egress_cantilever: 'standard',
  precast_parapet: 'standard',
  access_gallery: 'standard',
  glass_railing: 'juliet',
  recessed_loggia: 'recessed',
  flat_roof_terrace: 'roof_terrace',
}

/** Typology → legacy roof selector (undefined when balcony-primary). */
const TYPOLOGY_TO_ROOF: Partial<Record<SurfaceTypology, RoofType>> = {
  mansard_dormer: 'pitched_mansard_dormer',
  japanese_tiled_roof: 'pitched_gable',
  flat_roof_terrace: 'flat',
  pitched_gable_terrace: 'pitched_gable',
}

const BALCONY_TO_TYPOLOGY: Record<BalconyType, SurfaceTypology> = {
  standard: 'egress_cantilever',
  juliet: 'glass_railing',
  recessed: 'recessed_loggia',
  roof_terrace: 'flat_roof_terrace',
}

const ROOF_TO_TYPOLOGY: Record<RoofType, SurfaceTypology> = {
  flat: 'flat_roof_terrace',
  pitched_gable: 'pitched_gable_terrace',
  pitched_mansard_dormer: 'mansard_dormer',
}

export function typologyToBalconyType(id: SurfaceTypology): BalconyType | undefined {
  return TYPOLOGY_TO_BALCONY[id]
}

export function typologyToRoofType(id: SurfaceTypology): RoofType | undefined {
  return TYPOLOGY_TO_ROOF[id]
}

/** Bridge: balcony selector → primary typology. */
export function balconyTypeToTypology(type: BalconyType): SurfaceTypology {
  return BALCONY_TO_TYPOLOGY[type]
}

/** Bridge: roof selector → primary typology. */
export function roofTypeToTypology(type: RoofType): SurfaceTypology {
  return ROOF_TO_TYPOLOGY[type]
}

/**
 * Irradiance preset for a typology, falling back to legacy balcony/roof tables
 * when a bridge mapping exists.
 */
export function getTypologyIrradiance(id: SurfaceTypology): SurfaceIrradianceParams {
  const detail = getSurfaceTypologyDetail(id)
  const balcony = typologyToBalconyType(id)
  if (balcony && detail.category === 'balcony') {
    const preset = getBalconyTypePreset(balcony)
    return {
      receivingAreaM2: detail.irradiance.receivingAreaM2 || preset.receivingAreaM2,
      tiltDeg: detail.defaultTiltDeg,
      directRatio: detail.irradiance.directRatio,
      diffuseRatio: detail.irradiance.diffuseRatio,
    }
  }
  const roof = typologyToRoofType(id)
  if (roof && detail.category === 'roof') {
    const preset = getRoofTypePreset(roof)
    return {
      receivingAreaM2: detail.irradiance.receivingAreaM2 || preset.receivingAreaM2,
      tiltDeg: detail.defaultTiltDeg,
      directRatio: detail.irradiance.directRatio,
      diffuseRatio: detail.irradiance.diffuseRatio,
    }
  }
  return detail.irradiance
}

// Returns a suitability score (0-100) for the balcony simulator based on
// direction, railing type, time of day, and optional living / weather context.
export function computeBalconyScore(
  direction: Direction,
  railing: RailingType,
  hour: number,
  ctx: LivingContext = DEFAULT_LIVING_CONTEXT,
  tiltMode: PanelTiltMode = 'optimal_tilt',
): number {
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
  const living = resolveLivingMetrics(ctx, tiltMode, 'egress_cantilever')
  const weatherMul =
    ctx.weather === 'typhoon_alert' ? 0 : ctx.weather === 'overcast_tsuyu' ? 0.92 : 1
  const blended =
    raw * 0.62 +
    living.displayEfficiencyPct * 0.23 +
    living.lifeCompliancePct * 0.15
  return Math.round(Math.min(100, Math.max(0, blended * weatherMul)))
}

/** Life / safety fit for the balcony simulator card (0–100). */
export function computeBalconyLifeCompliance(
  ctx: LivingContext,
  tiltMode: PanelTiltMode = 'optimal_tilt',
): number {
  return resolveLivingMetrics(ctx, tiltMode, 'egress_cantilever').lifeCompliancePct
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
  | 'jackery'
  | 'tesla-energy'
  | 'mkopa'
  | 'sun-king'
  | 'dlight'
  | 'priwatt'
  | 'yuma'
  | 'solaredge'
  | 'sunrun'
  | 'goodleap'

/** Country-level history milestone (balcony / rooftop / plug-in PV). */
export interface CountryTimelineMilestone {
  date: string // e.g. "2014-12", "2020-03", "2024-05"
  category: 'policy' | 'civil-movement' | 'grid-rule' | 'urban-housing'
  titleJa: string
  titleEn: string
  descriptionJa: string
  descriptionEn: string
  orgName?: string
  orgUrl?: string
  breakthrough?: string // barrier overcome / contested issue
  outcome?: string // win / adoption result
}

/** Phase grouping for a country's renewable / balcony-PV history. */
export interface CountryTimelinePhase {
  period: string // e.g. "2010年代半ば〜2020", "2024〜2026"
  phaseTitleJa: string
  phaseTitleEn: string
  milestones: CountryTimelineMilestone[]
}

/** Local-first / OSS tools for autonomous energy control (EMS, firmware, automation). */
export interface OssProject {
  id: string
  name: string
  category: 'ems' | 'firmware' | 'automation' | 'protocol' | 'community'
  descriptionJa: string
  descriptionEn: string
  repoUrl?: string
  siteUrl?: string
  starsOrBadge?: string
  /** Job hired (e.g. cloud-off, fully local control). */
  keyJobJa: string
  keyJobEn: string
  compatibleHardwareJa?: string
  compatibleHardwareEn?: string
}

/**
 * Globally useful OSS / software for living-scale energy autonomy
 * (no central grid SCADA / vendor cloud dependency).
 */
export const COMMON_OSS_PROJECTS: OssProject[] = [
  {
    id: 'home-assistant',
    name: 'Home Assistant',
    category: 'ems',
    descriptionJa:
      'ローカル完結のホームオートメーション基盤。発電・蓄電・家電をMQTT等で束ね、クラウドなしで需給と生活動線を可視化・制御できる。',
    descriptionEn:
      'Local-first home automation that ties generation, storage, and appliances via MQTT—visualize and control supply/demand without a vendor cloud.',
    siteUrl: 'https://www.home-assistant.io/',
    repoUrl: 'https://github.com/home-assistant/core',
    starsOrBadge: 'EMS',
    keyJobJa: 'クラウド不要・ローカル完結のエネルギー需給・家電連動ダッシュボード',
    keyJobEn: 'Cloud-free local energy dashboard with appliance automation',
    compatibleHardwareJa: 'ESP32, MQTT機器, スマートプラグ, ポータブル電源',
    compatibleHardwareEn: 'ESP32, MQTT devices, smart plugs, portable power stations',
  },
  {
    id: 'opendtu',
    name: 'OpenDTU',
    category: 'firmware',
    descriptionJa:
      'Hoymilesマイクロインバータ向けオープンファームウェア。メーカークラウドを介さずESP32で発電データを取得しMQTT公開する。',
    descriptionEn:
      'Open firmware for Hoymiles microinverters—read production on ESP32 and publish MQTT without the vendor cloud.',
    repoUrl: 'https://github.com/tbnobody/OpenDTU',
    starsOrBadge: 'Firmware',
    keyJobJa: 'Hoymiles製マイクロインバータの独自クラウドを解雇し、ESP32で完全ローカルMQTT制御',
    keyJobEn: 'Fire Hoymiles vendor cloud; full local MQTT control via ESP32',
    compatibleHardwareJa: 'Hoymiles, ESP32',
    compatibleHardwareEn: 'Hoymiles, ESP32',
  },
  {
    id: 'ahoydtu',
    name: 'AhoyDTU',
    category: 'firmware',
    descriptionJa:
      'NRF24L01+とESP8266/ESP32でHoymilesインバータと直接通信するDIYプロトコル実装。ベランダ発電のローカル監視に使う。',
    descriptionEn:
      'DIY protocol stack using NRF24L01+ and ESP8266/ESP32 to talk directly to Hoymiles inverters for local balcony monitoring.',
    repoUrl: 'https://github.com/lumapu/ahoy',
    starsOrBadge: 'Firmware',
    keyJobJa: 'NRF24L01+ / ESP8266/ESP32によるHoymilesインバータDIY通信プロトコル',
    keyJobEn: 'DIY Hoymiles inverter protocol via NRF24L01+ / ESP8266/ESP32',
    compatibleHardwareJa: 'Hoymiles, NRF24L01+, ESP8266, ESP32',
    compatibleHardwareEn: 'Hoymiles, NRF24L01+, ESP8266, ESP32',
  },
  {
    id: 'solar-assistant',
    name: 'Solar-Assistant',
    category: 'ems',
    descriptionJa:
      'オフグリッドインバータ・蓄電池向けのスタンドアロン監視OS。Deye等を常時ローカルで見える化し、クラウド依存を避けられる。',
    descriptionEn:
      'Standalone monitoring OS for off-grid inverters and batteries (e.g. Deye)—always-on local visibility without cloud lock-in.',
    siteUrl: 'https://solar-assistant.io/',
    starsOrBadge: 'EMS',
    keyJobJa: 'オフグリッドインバータ・蓄電池（Deye等）の常時スタンドアロン監視OS',
    keyJobEn: 'Always-on standalone monitoring OS for off-grid inverters & batteries (Deye etc.)',
    compatibleHardwareJa: 'Deye, オフグリッドインバータ, 蓄電池',
    compatibleHardwareEn: 'Deye, off-grid inverters, battery storage',
  },
  {
    id: 'node-red',
    name: 'Node-RED',
    category: 'automation',
    descriptionJa:
      'フローベースの自動化ランタイム。天候・日射予測と連動し、パネル退避や充電閾値など生活者ルールを手元で組める。',
    descriptionEn:
      'Flow-based automation runtime—wire weather/irradiance forecasts to stow rules and charge thresholds on your own hardware.',
    siteUrl: 'https://nodered.org/',
    repoUrl: 'https://github.com/node-red/node-red',
    starsOrBadge: 'Automation',
    keyJobJa: '天候API・日射量予測と連動した自律退避・バッテリー充電閾値のフロー制御',
    keyJobEn: 'Flow control for autonomous stow & battery charge thresholds tied to weather/irradiance APIs',
    compatibleHardwareJa: 'Raspberry Pi, MQTT, Home Assistant連携',
    compatibleHardwareEn: 'Raspberry Pi, MQTT, Home Assistant integrations',
  },
]

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
  /** Historical phases for the country detail Timeline tab. */
  timeline?: CountryTimelinePhase[]
  /** Country-specific OSS / community tools (merged with COMMON_OSS_PROJECTS in the OSS tab). */
  localTools?: OssProject[]
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

// ---------------------------------------------------------------------------
// Market ecosystem / power-flow topology (① plug-in · ② no-export · ③ off-grid)
// ---------------------------------------------------------------------------

/** Locale-independent market-ecosystem model id (maps from GridCategory). */
export type MarketEcosystemModelId =
  | 'grid_plugin_allowed'
  | 'grid_plugin_prohibited'
  | 'offgrid_leapfrog'

/** Circuit geometry for the ecosystem wiring diagram. */
export type EcosystemTopologyShape =
  | 'bifurcation' // ① wall-outlet fork: self-use + bidirectional grid export
  | 'closed_loop' // ② PV→battery→loads loop with zero-export barrier
  | 'standalone' // ③ grid-absent direct PV→battery→loads

/** Grid / pole presence for diagnostic badges. */
export type EcosystemGridPresence = 'present' | 'absent'

/** Outlet plug-in legal regime (locale-independent status). */
export type EcosystemOutletLaw = 'certified' | 'prohibited' | 'n_a'

/** Meter / reverse-flow measurement regime. */
export type EcosystemMeterMode = 'bidirectional' | 'no_reverse' | 'not_required'

/** Environmental preconditions shown above the topology diagram. */
export type EcosystemPrerequisites = {
  grid: {
    status: EcosystemGridPresence
    labelJa: string
    labelEn: string
  }
  outletLaw: {
    status: EcosystemOutletLaw
    labelJa: string
    labelEn: string
  }
  meter: {
    status: EcosystemMeterMode
    labelJa: string
    labelEn: string
  }
}

/** Power-wiring topology for a market model (detail-drawer Ecosystem tab). */
export interface EcosystemToolBinding {
  toolId: string // 'opendtu' | 'ahoydtu' | 'home-assistant' | 'solar-assistant' | 'node-red'
  name: string
  roleJa: string
  roleEn: string
  targetNode: 'conversion' | 'metering' | 'consumption'
}

/** Living-sense appliance chip shown inside self-consumption / load nodes. */
export interface PoweredAppliance {
  icon: string // 'laptop' | 'fridge' | 'wifi' | 'fan' | 'smartphone' | 'pump' | 'lightbulb' 等
  nameJa: string
  nameEn: string
  wattage: string
}

export interface MarketEcosystemTopology {
  modelId: string // e.g. 'grid_plugin_allowed' | 'grid_plugin_prohibited' | 'offgrid_leapfrog'
  titleJa: string
  titleEn: string
  badgeJa: string // e.g. "① 系統連系・プラグイン公認"
  badgeEn: string
  summaryJa: string
  summaryEn: string
  /** Geometric layout key for model-specific SVG wiring. */
  topologyShape: EcosystemTopologyShape
  /** Diagnostic badges: poles / outlet law / meter regime. */
  prerequisites: EcosystemPrerequisites
  wiringFlow: {
    generation: string // e.g. "太陽光パネル (600W/800W)"
    conversion: string // e.g. "マイクロインバータ (+ 蓄電池)"
    connection: string // e.g. "230V壁コンセント直挿し (工事不要)"
    metering: string // e.g. "スマートメーター (逆潮流計測・動的単価連動)"
    consumption: string // e.g. "家庭内自家消費 (余剰は電力網または蓄電池へ)"
  }
  /** English counterparts for `wiringFlow` (locale bind). */
  wiringFlowEn: {
    generation: string
    conversion: string
    connection: string
    metering: string
    consumption: string
  }
  /** Concrete appliances / scenes powered under this market model. */
  poweredAppliances: PoweredAppliance[]
  applianceNoteJa: string
  applianceNoteEn: string
  keyFeaturesJa: string[]
  keyFeaturesEn: string[]
  /** Local OSS / autonomous-control bindings overlaid on hardware nodes. */
  integratedTools: EcosystemToolBinding[]
}

/** GridCategory → MarketEcosystemModelId */
const GRID_CATEGORY_TO_ECOSYSTEM: Record<GridCategory, MarketEcosystemModelId> = {
  grid_plug_in: 'grid_plugin_allowed',
  grid_no_plug: 'grid_plugin_prohibited',
  no_grid_leapfrog: 'offgrid_leapfrog',
}

/** Three market-model power topologies for the Ecosystem diagram. */
export const MARKET_ECOSYSTEM_TOPOLOGIES: MarketEcosystemTopology[] = [
  {
    modelId: 'grid_plugin_allowed',
    titleJa: 'プラグイン公認・系統連系',
    titleEn: 'Certified plug-in · grid-tied',
    badgeJa: '① 系統連系・プラグイン公認',
    badgeEn: '① Grid-tied · plug-in certified',
    summaryJa:
      'ベランダの太陽光を壁コンセントへ直挿しし、家のベースロードを自家消費。余剰はスマートメーター経由で系統へ還流できる公認トポロジー。',
    summaryEn:
      'Balcony PV plugs straight into a wall outlet for baseload self-consumption; surplus can export via a smart meter under certified rules.',
    topologyShape: 'bifurcation',
    prerequisites: {
      grid: {
        status: 'present',
        labelJa: '送電網あり（電柱・配電）',
        labelEn: 'Grid present (poles / distribution)',
      },
      outletLaw: {
        status: 'certified',
        labelJa: 'コンセント直結：公認',
        labelEn: 'Outlet plug-in: certified',
      },
      meter: {
        status: 'bidirectional',
        labelJa: 'メーター：逆潮流計測可能',
        labelEn: 'Meter: bidirectional / export-capable',
      },
    },
    wiringFlow: {
      generation: '太陽光パネル (600W/800W)',
      conversion: 'マイクロインバータ (+ 蓄電池)',
      connection: '230V壁コンセント直挿し (工事不要)',
      metering: 'スマートメーター (逆潮流計測・動的単価連動)',
      consumption: '家庭内自家消費 (余剰は電力網または蓄電池へ)',
    },
    wiringFlowEn: {
      generation: 'Solar Panels (600W / 800W)',
      conversion: 'Microinverter (+ Battery)',
      connection: '230V Wall Outlet Direct Plug-in (No wiring work)',
      metering: 'Smart Meter (Export metering & dynamic tariffs)',
      consumption: 'Home Self-Consumption (Surplus to grid or battery)',
    },
    poweredAppliances: [
      {
        icon: 'fridge',
        nameJa: '大型冷蔵庫',
        nameEn: 'Refrigerator',
        wattage: '100-150W (常時相殺)',
      },
      {
        icon: 'laptop',
        nameJa: 'ノートPC・モニター',
        nameEn: 'Laptop & Monitor',
        wattage: '60-120W',
      },
      {
        icon: 'wifi',
        nameJa: 'Wi-Fiルーター',
        nameEn: 'Wi-Fi Router',
        wattage: '10-20W',
      },
    ],
    applianceNoteJa:
      '待機電力と日中の在宅ワークを相殺。電子レンジ等の大電力は電力網が自動バックアップ。',
    applianceNoteEn:
      'Offsets baseload & daytime work. High-draw appliances seamlessly backed by the grid.',
    keyFeaturesJa: [
      '電気工事士不要・自己責任プラグイン',
      'スマートメーターと連動した動的価格・自動制御',
      '800W/1,200W などの公認上限内で即日導入',
      '余剰電力の系統還流（ネットメータリング/フィードイン）',
    ],
    keyFeaturesEn: [
      'No licensed electrician — self-responsibility plug-in',
      'Dynamic tariffs & automation tied to the smart meter',
      'Same-day install within certified 800W / 1,200W caps',
      'Surplus export via net metering / feed-in',
    ],
    integratedTools: [
      {
        toolId: 'opendtu',
        name: 'OpenDTU',
        roleJa: 'ローカルMQTT取得',
        roleEn: 'Local MQTT readout',
        targetNode: 'conversion',
      },
      {
        toolId: 'home-assistant',
        name: 'Home Assistant',
        roleJa: '動的単価・自動制御',
        roleEn: 'Dynamic tariff & auto control',
        targetNode: 'consumption',
      },
    ],
  },
  {
    modelId: 'grid_plugin_prohibited',
    titleJa: '系統あり・逆潮流禁止 / 蓄電自衛',
    titleEn: 'Grid present · no export / storage self-supply',
    badgeJa: '② 系統あり・逆潮流禁止/蓄電自衛',
    badgeEn: '② Grid present · no export / storage self-supply',
    summaryJa:
      'コンセント連系は禁止または厳格。太陽光→充放電→家電の閉ループで自家消費し、逆潮流ゼロを守る蓄電自衛トポロジー。',
    summaryEn:
      'Outlet tie-in is banned or tightly restricted. A closed PV→battery→loads loop keeps self-supply with zero reverse power flow.',
    topologyShape: 'closed_loop',
    prerequisites: {
      grid: {
        status: 'present',
        labelJa: '送電網あり（電柱・配電）',
        labelEn: 'Grid present (poles / distribution)',
      },
      outletLaw: {
        status: 'prohibited',
        labelJa: 'コンセント直結：禁止',
        labelEn: 'Outlet plug-in: prohibited',
      },
      meter: {
        status: 'no_reverse',
        labelJa: 'メーター：逆回転禁止',
        labelEn: 'Meter: reverse spin banned',
      },
    },
    wiringFlow: {
      generation: '太陽光パネル (ベランダ/ポータブル)',
      conversion: 'オフグリッドインバータ + 蓄電池',
      connection: '分電盤分岐 or 専用電路 (コンセント直挿し不可)',
      metering: '逆潮流防止センサー制御 (外への逆流ゼロ維持)',
      consumption: '生活家電 (PC・空調等で自家消費、余剰は蓄電)',
    },
    wiringFlowEn: {
      generation: 'Solar Panels (Balcony / Portable)',
      conversion: 'Off-grid Inverter + Battery',
      connection: 'Distribution panel branch or dedicated circuit (No outlet plug-in)',
      metering: 'Zero-Export Sensor Control (Zero feed-in maintained)',
      consumption: 'Home Appliances (PC, AC self-use; surplus stored)',
    },
    poweredAppliances: [
      {
        icon: 'laptop',
        nameJa: 'ワークデスク一式',
        nameEn: 'Work Desk Setup',
        wattage: '80-150W',
      },
      {
        icon: 'fan',
        nameJa: 'サーキュレーター',
        nameEn: 'Circulator / Fan',
        wattage: '30-45W',
      },
      {
        icon: 'smartphone',
        nameJa: 'スマホ・小型充電',
        nameEn: 'Smartphones & Tablets',
        wattage: '15-30W',
      },
    ],
    applianceNoteJa:
      'ポータブル電源から個別給電。コンセントへの逆流は防ぎ、夜間利用へシフト。',
    applianceNoteEn:
      'Powered via portable power station. Zero grid feed-in; surplus shifted to night use.',
    keyFeaturesJa: [
      '逆潮流ゼロ・系統保護を最優先',
      '蓄電池で昼間発電を夜間ベースロードへシフト',
      'コンセント直挿し禁止地域でも生活実感の自家消費を確保',
      'EMS/スマートプラグで負荷を発電曲線に追従',
    ],
    keyFeaturesEn: [
      'Zero export & grid protection first',
      'Battery shifts daytime PV to night baseload',
      'Self-consumption without illegal outlet tie-in',
      'EMS / smart plugs follow the generation curve',
    ],
    integratedTools: [
      {
        toolId: 'home-assistant',
        name: 'Home Assistant',
        roleJa: 'スマートプラグゼロ逆流追従',
        roleEn: 'Smart-plug zero-export tracking',
        targetNode: 'consumption',
      },
      {
        toolId: 'node-red',
        name: 'Node-RED',
        roleJa: '気象API連携・退避自動化',
        roleEn: 'Weather API storm-stow automation',
        targetNode: 'conversion',
      },
    ],
  },
  {
    modelId: 'offgrid_leapfrog',
    titleJa: '系統なし / オフグリッド跳躍',
    titleEn: 'No/weak grid · off-grid leapfrog',
    badgeJa: '③ 系統なし/オフグリッド跳躍',
    badgeEn: '③ No/weak grid · off-grid leapfrog',
    summaryJa:
      '中央系統に頼らず、太陽光＋蓄電池＋ローカル制御で照明・灌漑・保冷・通信を賄う自律マイクロ給電トポロジー。',
    summaryEn:
      'Skip the central grid: PV + storage + local control power lighting, irrigation, cold-chain, and connectivity as an autonomous micro-supply.',
    topologyShape: 'standalone',
    prerequisites: {
      grid: {
        status: 'absent',
        labelJa: '電力網なし（電柱・送電線が未整備）',
        labelEn: 'No grid (poles absent)',
      },
      outletLaw: {
        status: 'n_a',
        labelJa: 'コンセント直結：対象外',
        labelEn: 'Outlet plug-in: N/A',
      },
      meter: {
        status: 'not_required',
        labelJa: 'メーター：計測不要',
        labelEn: 'Meter: not required',
      },
    },
    wiringFlow: {
      generation: '太陽光パネル (小規模キット / PayGo対応)',
      conversion: 'オフグリッドインバータ + 蓄電池',
      connection: 'DCバス or 小規模AC分電 (島嶼・村落マイクログリッド)',
      metering: 'PayGo/ローカル計測 · クラウド非依存の自律制御',
      consumption: '生活・生産機器 (照明・井戸ポンプ・保冷等)',
    },
    wiringFlowEn: {
      generation: 'Solar Panels (Pico-kit / PayGo-ready)',
      conversion: 'Off-grid Inverter + Battery',
      connection: 'DC bus or small AC distribution (island / village microgrid)',
      metering: 'PayGo / local metering · cloud-free autonomous control',
      consumption: 'Productive & Living Loads (Lighting, pumps, cold chain)',
    },
    poweredAppliances: [
      {
        icon: 'lightbulb',
        nameJa: 'LED照明群',
        nameEn: 'LED Lights',
        wattage: '5-15W',
      },
      {
        icon: 'pump',
        nameJa: '小型井戸ポンプ',
        nameEn: 'Water Pump',
        wattage: '50-150W (生産型)',
      },
      {
        icon: 'smartphone',
        nameJa: '通信・スマホ充電',
        nameEn: 'Phone Charging',
        wattage: '10-20W',
      },
    ],
    applianceNoteJa:
      '生活の基本照明と農業・保冷の生産活動を電柱なしで即日電化。',
    applianceNoteEn:
      'Immediate standalone electrification for household lighting and productive farm use.',
    keyFeaturesJa: [
      '系統延伸を待たず生活・生産インフラを先に電化',
      'PayGo / マイクロファイナンスと親和',
      'ローカルEMSで需給を自律制御（クラウド不要）',
      '灌漑・保冷など収入直結のプロダクティブユース',
    ],
    keyFeaturesEn: [
      'Electrify livelihoods before grid extension arrives',
      'Fits PayGo / microfinance models',
      'Local EMS for cloud-free autonomous balancing',
      'Productive uses: irrigation, cold-chain, income loads',
    ],
    integratedTools: [
      {
        toolId: 'solar-assistant',
        name: 'Solar-Assistant',
        roleJa: 'クラウド不要スタンドアロン監視',
        roleEn: 'Cloud-free standalone monitoring',
        targetNode: 'conversion',
      },
    ],
  },
]

/** Locale flag for ecosystem wiringFlow resolution (set from UI before read). */
let marketEcosystemUiIsEn = false

/** Sync ecosystem wiringFlow locale (call from view when `locale === "en"`). */
export function setMarketEcosystemUiLocale(isEn: boolean): void {
  marketEcosystemUiIsEn = isEn
}

/** Resolve wiring-flow copy for the active locale. */
export function resolveMarketEcosystemWiringFlow(
  topology: MarketEcosystemTopology,
  isEn: boolean,
): MarketEcosystemTopology['wiringFlow'] {
  return isEn ? topology.wiringFlowEn : topology.wiringFlow
}

// Locale-aware `wiringFlow` so diagram/table consumers see EN without per-call switches.
for (const topo of MARKET_ECOSYSTEM_TOPOLOGIES) {
  const wiringFlowJa = topo.wiringFlow
  Object.defineProperty(topo, 'wiringFlow', {
    configurable: true,
    enumerable: true,
    get() {
      return marketEcosystemUiIsEn ? topo.wiringFlowEn : wiringFlowJa
    },
  })
}

/** Resolve ecosystem model id from a country's grid category. */
export function resolveMarketEcosystemModelId(
  country: CountryPvDetail,
): MarketEcosystemModelId {
  return GRID_CATEGORY_TO_ECOSYSTEM[resolveGridCategory(country)]
}

/** Look up ecosystem topology by model id (or GridCategory alias). */
export function getMarketEcosystemTopology(
  modelId: string,
): MarketEcosystemTopology | undefined {
  const aliases: Record<string, MarketEcosystemModelId> = {
    grid_plug_in: 'grid_plugin_allowed',
    grid_no_plug: 'grid_plugin_prohibited',
    no_grid_leapfrog: 'offgrid_leapfrog',
    grid_plugin_allowed: 'grid_plugin_allowed',
    grid_plugin_prohibited: 'grid_plugin_prohibited',
    offgrid_leapfrog: 'offgrid_leapfrog',
  }
  const resolved = aliases[modelId] ?? modelId
  return MARKET_ECOSYSTEM_TOPOLOGIES.find((t) => t.modelId === resolved)
}

/** Ecosystem topology for a country (defaults to ① plug-in if unknown). */
export function getMarketEcosystemForCountry(
  country: CountryPvDetail,
): MarketEcosystemTopology {
  return (
    getMarketEcosystemTopology(resolveMarketEcosystemModelId(country)) ??
    MARKET_ECOSYSTEM_TOPOLOGIES[0]
  )
}

/** Wiring-step keys shared by the ecosystem node grid / overlays. */
export type EcosystemWiringStepKey = keyof MarketEcosystemTopology['wiringFlow']

/** Locale-resolved OSS overlay for a hardware wiring node. */
export type EcosystemNodeToolDetail = {
  toolId: string
  name: string
  role: string
  capability: string
  targetNode: EcosystemToolBinding['targetNode']
}

/**
 * Resolve `integratedTools` against `COMMON_OSS_PROJECTS` for software-view overlays.
 * Falls back to the binding role when a tool id is missing from the OSS catalog.
 */
export function resolveEcosystemNodeTools(
  topology: MarketEcosystemTopology,
  isEn: boolean,
): EcosystemNodeToolDetail[] {
  return topology.integratedTools.map((binding) => {
    const project = COMMON_OSS_PROJECTS.find((p) => p.id === binding.toolId)
    return {
      toolId: binding.toolId,
      name: binding.name,
      role: isEn ? binding.roleEn : binding.roleJa,
      capability: project
        ? isEn
          ? project.descriptionEn
          : project.descriptionJa
        : isEn
          ? binding.roleEn
          : binding.roleJa,
      targetNode: binding.targetNode,
    }
  })
}

/** Shared emerald / amber / violet accents for ①②③ (map badge ↔ power-flow tabs). */
export const MARKET_ECOSYSTEM_UI_ACCENT: Record<
  MarketEcosystemModelId,
  { badge: string; chip: string; tab: string; tabIdle: string; panel: string }
> = {
  grid_plugin_allowed: {
    badge: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
    chip: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400/60 hover:bg-emerald-500/20',
    tab: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40',
    tabIdle:
      'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-200',
    panel: 'border-emerald-500/40',
  },
  grid_plugin_prohibited: {
    badge: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
    chip: 'border-amber-500/40 bg-amber-500/10 text-amber-200 hover:border-amber-400/60 hover:bg-amber-500/20',
    tab: 'border-amber-500/50 bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40',
    tabIdle:
      'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-amber-500/40 hover:text-amber-200',
    panel: 'border-amber-500/40',
  },
  offgrid_leapfrog: {
    badge: 'border-violet-500/40 bg-violet-500/15 text-violet-300',
    chip: 'border-violet-500/40 bg-violet-500/10 text-violet-200 hover:border-violet-400/60 hover:bg-violet-500/20',
    tab: 'border-violet-500/50 bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40',
    tabIdle:
      'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-violet-500/40 hover:text-violet-200',
    panel: 'border-violet-500/40',
  },
}

/** ISO 3166-1 alpha-2 (or longer codes) → flag emoji. */
export function countryCodeToFlagEmoji(code: string): string {
  const cc = code.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
  if (cc.length !== 2) return '🏳️'
  return Array.from(cc)
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

/**
 * Countries adopting a market ecosystem model (excludes sub-regions with parentId).
 */
export function getCountriesByMarketEcosystemModel(
  modelId: MarketEcosystemModelId,
): CountryPvDetail[] {
  return WORLD_BALCONY_PV_COUNTRIES.filter(
    (c) => !c.parentId && resolveMarketEcosystemModelId(c) === modelId,
  )
}

/** Chip label e.g. `🇩🇪 ドイツ (800W)` / `🇯🇵 日本` / `🇰🇪 ケニア`. */
export function formatMarketEcosystemCountryChip(
  country: CountryPvDetail,
  isEn: boolean,
): string {
  const flag = countryCodeToFlagEmoji(country.code)
  const name = isEn ? (country.nameEn ?? country.name) : country.name
  const model = resolveMarketEcosystemModelId(country)
  if (model === 'grid_plugin_allowed') {
    // Strip JA suffixes like `（家電扱い…）` / `級` — keep numeric W only.
    const watt = country.powerLimit.match(/([\d,]+)\s*W/i)
    if (watt) return `${flag} ${name} (${watt[1]}W)`
  }
  return `${flag} ${name}`
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
  jackery: {
    id: 'jackery',
    name: 'Jackery',
    role: 'ポータブル電源・ソーラーパネル',
    roleEn: 'Portable power stations & solar panels',
    url: 'https://www.jackery.com/',
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
    id: 'jackery',
    name: 'Jackery / 华宝新能',
    nameJa: 'ジャッカリー',
    hqCountry: '中国（深圳）',
    hqCountryEn: 'China (Shenzhen)',
    headquartersRegion: 'asia-oceania',
    category: 'ポータブル電源',
    description:
      '元Appleのバッテリーエンジニアである孫中偉氏が2012年に米国シリコンバレーで設立しましたが、親会社は深セン上場企業の「深圳市华宝新能源（Hello Tech Energy）」であり、実質的な開発・製造・資本の中核は中国です。',
    descriptionEn:
      'Founded in Silicon Valley in 2012 by Zhongwei “Jack” Sun (ex-Apple battery engineer); the parent is Shenzhen-listed Hello Tech Energy (华宝新能), so R&D, manufacturing, and capital are centered in China.',
    keyProducts: ['Explorer series', 'SolarSaga panels', 'Portable power stations'],
    targetRegionIds: [
      'japan',
      'usa',
      'us-ca',
      'us-tx',
      'us-fl',
      'us-ny',
      'germany',
      'uk',
      'france',
      'au',
      'china',
      'tw',
      'sg',
    ],
    targetRegions: ['asia-oceania', 'americas', 'europe'],
    url: 'https://www.jackery.com/',
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
  b

/* … truncated (273600 bytes total) … */
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
  methodSolar: { ja: "太陽光・ソーラーシェアリング", en: "Solar / agrivoltaics" },
  methodWind: { ja: "風力発電", en: "Wind power" },
  methodOcean: { ja: "海洋エネルギー", en: "Ocean energy" },
  methodBiomass: { ja: "バイオマス発電", en: "Biomass power" },
  methodGeothermal: { ja: "地熱発電", en: "Geothermal power" },
  methodHydro: { ja: "中小水力発電", en: "Small hydro" },
  methodHydrogen: { ja: "水素・P2G", en: "Hydrogen / P2G" },
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
  japanMapFilterAll: { ja: "全種別", en: "All types" },
  japanMapFilterSolar: { ja: "太陽光", en: "Solar" },
  japanMapFilterWind: { ja: "風力", en: "Wind" },
  japanMapFilterOcean: { ja: "海洋", en: "Ocean" },
  japanMapFilterBiomass: { ja: "バイオマス", en: "Biomass" },
  japanMapFilterGeothermal: { ja: "地熱", en: "Geothermal" },
  japanMapFilterHydro: { ja: "中小水力", en: "Small hydro" },
  japanMapFilterHydrogen: { ja: "水素", en: "Hydrogen" },
  japanMapZoomIn: { ja: "拡大", en: "Zoom in" },
  japanMapZoomOut: { ja: "縮小", en: "Zoom out" },
  japanMapReset: { ja: "表示をリセット", en: "Reset view" },
  japanMapFilterAria: { ja: "再エネ種別フィルタ", en: "RE type filter" },
  japanMapRegionAria: { ja: "地方別", en: "Region" },
  japanMapRegionAll: { ja: "全地方", en: "All regions" },
  japanMapRegionHokkaido: { ja: "北海道", en: "Hokkaido" },
  japanMapRegionTohoku: { ja: "東北", en: "Tohoku" },
  japanMapRegionKanto: { ja: "関東", en: "Kanto" },
  japanMapRegionChubu: { ja: "中部", en: "Chubu" },
  japanMapRegionKansai: { ja: "関西", en: "Kansai" },
  japanMapRegionKyushu: { ja: "九州", en: "Kyushu" },
  japanMapRegionOkinawa: { ja: "沖縄", en: "Okinawa" },
  japanMapRegionOcean: { ja: "海洋", en: "Offshore" },
  japanMapAttribution: {
    ja: "地図: 地球地図日本 / 事例: Notion導入事例DB",
    en: "Map: Global Map Japan / Cases: Notion RE DB",
  },
  caseStatus: { ja: "ステータス", en: "Status" },
  casePartners: { ja: "参画・出資", en: "Partners" },
  caseParadigm: {
    ja: "新旧パラダイムからみたポイント",
    en: "Old vs new power-system lens",
  },
  caseSource: { ja: "参考リンク", en: "Source" },
  caseEnergyTypes: { ja: "再エネ種別", en: "RE types" },
  statusCommercial: { ja: "商用運転", en: "Commercial" },
  statusDemo: { ja: "実証事業", en: "Demonstration" },
  statusPlanning: { ja: "計画段階", en: "Planning" },
  statusConstruction: { ja: "建設中", en: "Under construction" },
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
  "ichinoseki-solar-sharing": {
    label: "一関市吉高太陽光発電所（ソーラーシェアリング）",
    labelEn: "Ichinoseki Yoshitaka Solar (agrivoltaics)",
    description:
      "農業と発電を重ねるソーラーシェアリング。太陽光由来の電力・水素活用で、土地リソースを地域内で最適化します。",
    descriptionEn:
      "Agrivoltaics stacking farming and generation. Solar power and hydrogen use optimize local land resources.",
    coordinates: [141.13, 38.93],
    regionName: "岩手県 一関市",
    regionNameEn: "Ichinoseki, Iwate",
    modelCategory: "hydrogen",
    energyTypes: ["hydrogen", "solar"],
    mapRegion: "tohoku",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · 水素/太陽光",
    scaleLabelEn: "Commercial · H₂/Solar",
    partners: "リニューアブル・ジャパン、東急不動産 等",
    partnersEn: "Renewable Japan, Tokyu Land, et al.",
    paradigmPoint: "土地の多目的利用: 農業と発電の共生による地域リソースの最適化。",
    paradigmPointEn:
      "Multi-use land: co-locating farming and generation to optimize regional resources.",
    sourceUrl: "http://solar-sharing.net/archives/598",
    nodes: [
      {
        id: "solar",
        label: "ソーラーシェアリング",
        labelEn: "Agrivoltaics array",
        sublabel: "営農と発電の共生",
        sublabelEn: "Farming + generation",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "h2",
        label: "水素活用",
        labelEn: "Hydrogen use",
        sublabel: "再エネ由来水素",
        sublabelEn: "RE-derived hydrogen",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "farm",
        label: "地域・営農",
        labelEn: "Local farming",
        sublabel: "土地の多目的利用",
        sublabelEn: "Multi-use land",
        kind: "consume",
        icon: "sprout",
      },
    ],
    edges: [
      { from: "solar", to: "h2" },
      { from: "solar", to: "farm" },
      { from: "h2", to: "farm" },
    ],
  },
  "goto-tidal": {
    label: "五島市奈留瀬戸 潮流発電装置",
    labelEn: "Goto Narushima tidal generator",
    description:
      "潮の満ち引きという周期的な物理現象を電源化する潮流発電の実証。予測精度の高い海洋再エネです。",
    descriptionEn:
      "Tidal demonstration that turns predictable ebb-and-flow physics into power—highly forecastable ocean RE.",
    coordinates: [128.93, 32.84],
    regionName: "長崎県 五島市",
    regionNameEn: "Goto, Nagasaki",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "kyushu",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "九電みらいエナジー 等",
    partnersEn: "Kyuden Mirai Energy, et al.",
    paradigmPoint:
      "周期的エネルギー: 潮の満ち引きという確実な物理現象に基づく、予測精度の高い再エネ。",
    paradigmPointEn:
      "Periodic energy: tidal cycles make this ocean RE highly predictable.",
    sourceUrl: null,
    nodes: [
      {
        id: "tidal",
        label: "潮流発電装置",
        labelEn: "Tidal generator",
        sublabel: "奈留瀬戸",
        sublabelEn: "Narushima Strait",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "grid",
        label: "離島系統",
        labelEn: "Island grid",
        sublabel: "地域供給",
        sublabelEn: "Local supply",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "tidal", to: "grid" }],
  },
  "goto-floating-wind": {
    label: "五島市沖 商用浮体式洋上ウィンドファーム",
    labelEn: "Goto commercial floating offshore wind",
    description:
      "水深の深い海域でも発電できる浮体式洋上風力。日本の地理的制約を突破するフロンティアです。",
    descriptionEn:
      "Floating offshore wind for deeper waters—pushing past Japan’s geographic constraints.",
    coordinates: [128.7, 32.7],
    regionName: "長崎県 五島市沖",
    regionNameEn: "Off Goto, Nagasaki",
    modelCategory: "wind",
    energyTypes: ["wind"],
    mapRegion: "kyushu",
    caseStatus: "planning",
    scaleLabel: "計画段階 · 風力",
    scaleLabelEn: "Planning · Wind",
    partners: "戸田建設コンソーシアム、INPEX",
    partnersEn: "Toda Construction consortium, INPEX",
    paradigmPoint:
      "フロンティア拡大: 水深の深い海域での発電を可能にし、日本の地理的制約を突破。",
    paradigmPointEn:
      "Frontier expansion: generation in deeper seas beyond Japan’s land/grid limits.",
    sourceUrl:
      "https://www.toda.co.jp/business/ecology/special/offshorewind/index.html",
    nodes: [
      {
        id: "wind",
        label: "浮体式洋上風力",
        labelEn: "Floating offshore wind",
        sublabel: "五島市沖",
        sublabelEn: "Off Goto",
        kind: "supply",
        icon: "wind",
      },
      {
        id: "island",
        label: "離島・地域需要",
        labelEn: "Island demand",
        sublabel: "基幹電源化",
        sublabelEn: "Toward baseload role",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [{ from: "wind", to: "island" }],
  },
  "kairyu-ocean-current": {
    label: "海流発電実証機「かいりゅう」",
    labelEn: "Kairyu ocean-current demo",
    description:
      "黒潮など季節変動の少ない海流を利用する実証機。極めて安定した新世代の海洋電源を狙います。",
    descriptionEn:
      "Demo turbine using steady currents like the Kuroshio—aiming for highly stable ocean power.",
    coordinates: [130.0, 30.0],
    regionName: "黒潮海域（海洋）",
    regionNameEn: "Kuroshio waters (offshore)",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "ocean",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "IHI、NEDO",
    partnersEn: "IHI, NEDO",
    paradigmPoint:
      "予測可能性: 季節変動の少ない黒潮等の海流を利用した、極めて安定した新世代電源。",
    paradigmPointEn:
      "Predictability: Kuroshio-class currents offer unusually stable next-gen power.",
    sourceUrl: null,
    nodes: [
      {
        id: "current",
        label: "海流タービン",
        labelEn: "Ocean-current turbine",
        sublabel: "かいりゅう",
        sublabelEn: "Kairyu",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "demo",
        label: "実証評価",
        labelEn: "Demo evaluation",
        sublabel: "NEDO連携",
        sublabelEn: "NEDO partnership",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "current", to: "demo" }],
  },
  fh2r: {
    label: "福島水素エネルギー研究フィールド (FH2R)",
    labelEn: "Fukushima Hydrogen Energy Research Field (FH2R)",
    description:
      "再エネ由来の大規模グリーン水素で、変動する太陽光を水素という「物理パケット」に変換し供給網を構築します。",
    descriptionEn:
      "Large-scale green hydrogen from RE—turning variable solar into a physical energy packet for supply networks.",
    coordinates: [141.0, 37.48],
    regionName: "福島県 浪江町",
    regionNameEn: "Namie, Fukushima",
    modelCategory: "hydrogen",
    energyTypes: ["hydrogen", "solar"],
    mapRegion: "tohoku",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 水素/太陽光",
    scaleLabelEn: "Demo · H₂/Solar",
    partners: "NEDO・参画企業コンソーシアム",
    partnersEn: "NEDO & industry consortium",
    paradigmPoint:
      "大規模グリーン水素: 再エネ由来水素による大規模な脱炭素エネルギー供給網の構築。",
    paradigmPointEn:
      "Large-scale green hydrogen: RE-derived H₂ building a decarbonized supply network.",
    sourceUrl: "https://www.nedo.go.jp/news/press/AA5_101293.html",
    selfSufficiencyPct: 64,
    nodes: [
      {
        id: "solar",
        label: "メガソーラー",
        labelEn: "Mega-solar",
        sublabel: "再エネ電源",
        sublabelEn: "RE supply",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "electrolysis",
        label: "水電解水素プラント",
        labelEn: "Electrolysis plant",
        sublabel: "グリーン水素製造",
        sublabelEn: "Green H₂ production",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "storage",
        label: "水素貯蔵",
        labelEn: "Hydrogen storage",
        sublabel: "時間シフト",
        sublabelEn: "Time shifting",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "demand",
        label: "地域・産業需要",
        labelEn: "Local / industry demand",
        sublabel: "脱炭素供給",
        sublabelEn: "Decarbonized supply",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [
      { from: "solar", to: "electrolysis" },
      { from: "electrolysis", to: "storage" },
      { from: "storage", to: "demand" },
    ],
  },
  "gifu-biomass": {
    label: "岐阜バイオマスパワー発電所",
    labelEn: "Gifu Biomass Power Plant",
    description:
      "林業と連携したバイオマス発電。24時間安定した再エネとして地域産業とエネルギーを垂直統合します。",
    descriptionEn:
      "Forestry-linked biomass—24/7 renewable power vertically integrating regional industry and energy.",
    coordinates: [136.72, 35.39],
    regionName: "岐阜県",
    regionNameEn: "Gifu Prefecture",
    modelCategory: "biomass",
    energyTypes: ["biomass"],
    mapRegion: "chubu",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · バイオマス",
    scaleLabelEn: "Commercial · Biomass",
    partners: "バイオマスエナジー東海、岐阜バイオマスパワー",
    partnersEn: "Biomass Energy Tokai, Gifu Biomass Power",
    paradigmPoint:
      "産業連携: 林業とエネルギー産業の垂直統合による地域経済の活性化。",
    paradigmPointEn:
      "Industry linkage: vertical integration of forestry and energy for local economies.",
    sourceUrl: "http://www.bio-gifu.co.jp/",
    nodes: [
      {
        id: "fuel",
        label: "木質バイオマス",
        labelEn: "Woody biomass",
        sublabel: "地域林産資源",
        sublabelEn: "Regional forest resources",
        kind: "supply",
        icon: "sprout",
      },
      {
        id: "plant",
        label: "バイオマス発電",
        labelEn: "Biomass plant",
        sublabel: "ベースロード",
        sublabelEn: "Baseload",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "region",
        label: "地域需要",
        labelEn: "Regional demand",
        sublabel: "産業・生活",
        sublabelEn: "Industry & homes",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [
      { from: "fuel", to: "plant" },
      { from: "plant", to: "region" },
    ],
  },
  "yumesakura-p2g": {
    label: "米倉山 P2G システム実証研究",
    labelEn: "Yumesakura P2G demonstration",
    description:
      "変動する太陽光を水素に変換（P2G）し、時間・場所の制約を超えて地域にエネルギーを届けます。",
    descriptionEn:
      "Converts variable solar to hydrogen (P2G), delivering energy beyond time and place constraints.",
    coordinates: [138.68, 35.6],
    regionName: "山梨県 甲府市（米倉山）",
    regionNameEn: "Kofu (Yumesakura), Yamanashi",
    modelCategory: "hydrogen",
    energyTypes: ["hydrogen", "solar"],
    mapRegion: "chubu",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 水素/太陽光",
    scaleLabelEn: "Demo · H₂/Solar",
    selfSufficiencyPct: 78,
    partners: "山梨県、東レ、東京電力HD、東光高岳、NEDO",
    partnersEn: "Yamanashi Pref., Toray, TEPCO HD, TAKAOKA TOKO, NEDO",
    paradigmPoint:
      "エネルギー貯蔵: 変動性の高い再エネを水素に変換（P2G）し、時間・場所の制約を克服。",
    paradigmPointEn:
      "Energy storage: P2G turns variable RE into hydrogen, overcoming time/place limits.",
    sourceUrl: null,
    nodes: [
      {
        id: "solar",
        label: "太陽光（米倉山）",
        labelEn: "Solar (Yumesakura)",
        sublabel: "変動電源",
        sublabelEn: "Variable supply",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "p2g",
        label: "水電解P2G",
        labelEn: "Electrolysis P2G",
        sublabel: "電力→水素",
        sublabelEn: "Power → H₂",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "storage",
        label: "水素・蓄電バッファ",
        labelEn: "H₂ / battery buffer",
        sublabel: "時間シフト",
        sublabelEn: "Time shifting",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "station",
        label: "水素利用",
        labelEn: "Hydrogen use",
        sublabel: "モビリティ・熱",
        sublabelEn: "Mobility & heat",
        kind: "consume",
        icon: "fuel",
      },
      {
        id: "home",
        label: "地域需要",
        labelEn: "Local demand",
        sublabel: "家庭・施設",
        sublabelEn: "Homes & facilities",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "solar", to: "p2g" },
      { from: "solar", to: "storage" },
      { from: "p2g", to: "station" },
      { from: "storage", to: "home" },
    ],
  },
  "choshi-offshore-wind": {
    label: "銚子沖洋上ウィンドファーム",
    labelEn: "Choshi offshore wind farm",
    description:
      "海洋空間を使った大規模洋上風力。中央集権型グリッドに匹敵する再エネ供給を目指します。",
    descriptionEn:
      "Large offshore wind using ocean space—aiming for RE supply at central-grid scale.",
    coordinates: [140.89, 35.73],
    regionName: "千葉県 銚子沖",
    regionNameEn: "Off Choshi, Chiba",
    modelCategory: "wind",
    energyTypes: ["wind"],
    mapRegion: "kanto",
    caseStatus: "planning",
    scaleLabel: "計画段階 · 風力",
    scaleLabelEn: "Planning · Wind",
    partners:
      "東京電力、オーステッド、三菱商事、シーテック、Amazon、GE Renewable Energy、NEDO",
    partnersEn:
      "TEPCO, Ørsted, Mitsubishi Corp, C-Tech, Amazon, GE Renewable Energy, NEDO",
    paradigmPoint:
      "大規模電源化: 海洋空間を利用した、中央集権型グリッドに匹敵する大規模再エネ供給。",
    paradigmPointEn:
      "Utility-scale supply: ocean space enabling RE at central-grid magnitude.",
    sourceUrl: "https://www.chsow.co.jp/",
    nodes: [
      {
        id: "wind",
        label: "洋上風力",
        labelEn: "Offshore wind",
        sublabel: "銚子沖",
        sublabelEn: "Off Choshi",
        kind: "supply",
        icon: "wind",
      },
      {
        id: "grid",
        label: "系統・需要地",
        labelEn: "Grid / demand hubs",
        sublabel: "首都圏連携",
        sublabelEn: "Greater Tokyo link",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "wind", to: "grid" }],
  },
  "tomakomai-biomass": {
    label: "苫小牧バイオマス発電所",
    labelEn: "Tomakomai Biomass Power Plant",
    description:
      "未利用間伐材を活かす地産地消型ベースロード。森林整備とエネルギーを循環させます。",
    descriptionEn:
      "Local baseload from unused thinnings—circulating forest stewardship into energy.",
    coordinates: [141.61, 42.63],
    regionName: "北海道 苫小牧市",
    regionNameEn: "Tomakomai, Hokkaido",
    modelCategory: "biomass",
    energyTypes: ["biomass"],
    mapRegion: "hokkaido",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · バイオマス",
    scaleLabelEn: "Commercial · Biomass",
    partners: "三井物産、イワクラ、住友林業 等",
    partnersEn: "Mitsui & Co., Iwakura, Sumitomo Forestry, et al.",
    paradigmPoint:
      "地域資源循環: 未利用間伐材の活用による、地産地消型のベースロード電源。",
    paradigmPointEn:
      "Local resource loops: unused thinnings as community-scale baseload.",
    sourceUrl: null,
    nodes: [
      {
        id: "forest",
        label: "間伐材・林地残材",
        labelEn: "Thinnings / residues",
        sublabel: "森林整備と連携",
        sublabelEn: "Linked to forestry",
        kind: "supply",
        icon: "sprout",
      },
      {
        id: "plant",
        label: "バイオマス発電",
        labelEn: "Biomass plant",
        sublabel: "地産地消ベースロード",
        sublabelEn: "Local baseload",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "city",
        label: "苫小牧・地域需要",
        labelEn: "Tomakomai demand",
        sublabel: "市戦略と連携",
        sublabelEn: "City RE strategy",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [
      { from: "forest", to: "plant" },
      { from: "plant", to: "city" },
    ],
  },
  "kumejima-otec": {
    label: "海洋温度差発電（久米島）",
    labelEn: "OTEC (Kumejima)",
    description:
      "表層と深層の温度差を使うOTEC。24時間稼働しうる究極の安定型海洋再エネです。",
    descriptionEn:
      "OTEC using surface–deep temperature gaps—an ultra-stable, potentially 24/7 ocean RE.",
    coordinates: [126.8, 26.34],
    regionName: "沖縄県 久米島",
    regionNameEn: "Kumejima, Okinawa",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "okinawa",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "沖縄県、IHIプラント建設、ゼネシス 等",
    partnersEn: "Okinawa Pref., IHI Plant Construction, Xenesys, et al.",
    paradigmPoint:
      "24時間稼働: 表層と深層の温度差を利用した、究極の安定型再エネ（OTEC）。",
    paradigmPointEn:
      "24/7 potential: OTEC from surface–deep temperature difference—ultra-stable RE.",
    sourceUrl: null,
    nodes: [
      {
        id: "otec",
        label: "OTECプラント",
        labelEn: "OTEC plant",
        sublabel: "温度差発電",
        sublabelEn: "Thermal gradient",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "island",
        label: "離島需要",
        labelEn: "Island demand",
        sublabel: "久米島",
        sublabelEn: "Kumejima",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [{ from: "otec", to: "island" }],
  },
  "katatsumuri-geothermal": {
    label: "かたつむり山発電所（仮称）",
    labelEn: "Katatsumuri-yama geothermal (provisional)",
    description:
      "化石燃料開発の掘削・探査技術を地熱へ転用する建設中プロジェクト。純国産の安定電源を増やします。",
    descriptionEn:
      "Under-construction project reusing oil/gas drilling skills for geothermal—growing stable domestic power.",
    coordinates: [140.72, 39.16],
    regionName: "秋田県 湯沢市",
    regionNameEn: "Yuzawa, Akita",
    modelCategory: "geothermal",
    energyTypes: ["geothermal"],
    mapRegion: "tohoku",
    caseStatus: "construction",
    scaleLabel: "建設中 · 地熱",
    scaleLabelEn: "Building · Geothermal",
    partners: "出光興産、INPEX、三井石油開発",
    partnersEn: "Idemitsu, INPEX, MOECO",
    paradigmPoint:
      "資源開発の転換: 化石燃料開発の技術（掘削・探査）を地熱というクリーンエネルギーへ転用。",
    paradigmPointEn:
      "Resource pivot: oil/gas drilling & exploration skills applied to geothermal.",
    sourceUrl:
      "https://www.inpex.com/business/project/katatsumuri-yama.html",
    nodes: [
      {
        id: "geo",
        label: "地熱井・蒸気",
        labelEn: "Geothermal wells",
        sublabel: "かたつむり山",
        sublabelEn: "Katatsumuri-yama",
        kind: "supply",
        icon: "flame",
      },
      {
        id: "plant",
        label: "地熱発電所",
        labelEn: "Geothermal plant",
        sublabel: "建設中",
        sublabelEn: "Under construction",
        kind: "convert",
        icon: "building-2",
      },
      {
        id: "grid",
        label: "系統・地域",
        labelEn: "Grid / region",
        sublabel: "ベースロード",
        sublabelEn: "Baseload",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "geo", to: "plant" },
      { from: "plant", to: "grid" },
    ],
  },
  "wasabizawa-geothermal": {
    label: "山葵沢地熱発電所",
    labelEn: "Wasabizawa Geothermal Power Station",
    description:
      "天候に左右されない純国産ベースロード。地熱の安定性が地域の電力の安心感につながります。",
    descriptionEn:
      "Weather-independent domestic baseload—geothermal stability as regional power security.",
    coordinates: [140.75, 39.05],
    regionName: "秋田県 湯沢市",
    regionNameEn: "Yuzawa, Akita",
    modelCategory: "geothermal",
    energyTypes: ["geothermal"],
    mapRegion: "tohoku",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · 地熱",
    scaleLabelEn: "Commercial · Geothermal",
    partners: "電源開発、三菱マテリアル、三菱ガス化学",
    partnersEn: "J-POWER, Mitsubishi Materials, Mitsubishi Gas Chemical",
    paradigmPoint:
      "安定性: 天候に左右されない、純国産の強力なベースロード電源。",
    paradigmPointEn:
      "Stability: weather-independent, strong domestic baseload.",
    sourceUrl: "https://yuzawa-geothermal.com/wasabizawa-power-station/",
    nodes: [
      {
        id: "geo",
        label: "地熱資源",
        labelEn: "Geothermal resource",
        sublabel: "山葵沢",
        sublabelEn: "Wasabizawa",
        kind: "supply",
        icon: "flame",
      },
      {
        id: "plant",
        label: "地熱発電所",
        labelEn: "Geothermal plant",
        sublabel: "商用運転",
        sublabelEn: "Commercial",
        kind: "convert",
        icon: "building-2",
      },
      {
        id: "grid",
        label: "系統・地域需要",
        labelEn: "Grid / local demand",
        sublabel: "ベースロード供給",
        sublabelEn: "Baseload supply",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "geo", to: "plant" },
      { from: "plant", to: "grid" },
    ],
  },
  "nagayoshigawa-hydro": {
    label: "永吉川水力発電所",
    labelEn: "Nagayoshi-gawa hydro plant",
    description:
      "地域金融機関や地元企業が支えるコミュニティ主導の小水力。分散型投資のモデルです。",
    descriptionEn:
      "Community-led small hydro backed by local banks and firms—a distributed investment model.",
    coordinates: [130.4, 31.63],
    regionName: "鹿児島県 日置市",
    regionNameEn: "Hioki, Kagoshima",
    modelCategory: "hydro",
    energyTypes: ["hydro"],
    mapRegion: "kyushu",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · 中小水力",
    scaleLabelEn: "Commercial · Small hydro",
    partners: "日置市、鹿児島銀行、地元企業等",
    partnersEn: "Hioki City, Kagoshima Bank, local firms",
    paradigmPoint:
      "分散型投資: 地域金融機関や地元企業による、コミュニティ主導の小規模分散型電源。",
    paradigmPointEn:
      "Distributed investment: community-led small power backed by local finance.",
    sourceUrl: null,
    nodes: [
      {
        id: "hydro",
        label: "小水力",
        labelEn: "Small hydro",
        sublabel: "永吉川",
        sublabelEn: "Nagayoshi River",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "community",
        label: "地域エネルギー会社",
        labelEn: "Local energy company",
        sublabel: "コミュニティ主導",
        sublabelEn: "Community-led",
        kind: "convert",
        icon: "building-2",
      },
      {
        id: "home",
        label: "地域需要",
        labelEn: "Local demand",
        sublabel: "地産地消",
        sublabelEn: "Local consumption",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "hydro", to: "community" },
      { from: "community", to: "home" },
    ],
  },
  "hiratsuka-wave": {
    label: "平塚波力発電所",
    labelEn: "Hiratsuka wave power plant",
    description:
      "沿岸の波エネルギーを直接回収する都市近接型の分散電源。エッジで再エネを取り込む実証です。",
    descriptionEn:
      "Coastal wave energy harvested near the city—edge-side RE demonstration.",
    coordinates: [139.35, 35.33],
    regionName: "神奈川県 平塚市",
    regionNameEn: "Hiratsuka, Kanagawa",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "kanto",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "東京大学生産技術研究所グループ 等",
    partnersEn: "Univ. of Tokyo IIS group, et al.",
    paradigmPoint:
      "エッジ利用: 沿岸部の波エネルギーを直接回収する、都市近接型の分散電源。",
    paradigmPointEn:
      "Edge harvest: coastal wave energy as near-city distributed power.",
    sourceUrl: null,
    nodes: [
      {
        id: "wave",
        label: "波力発電",
        labelEn: "Wave power",
        sublabel: "平塚沿岸",
        sublabelEn: "Hiratsuka coast",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "lab",
        label: "実証・研究需要",
        labelEn: "Demo / research load",
        sublabel: "都市近接",
        sublabelEn: "Near-city",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "wave", to: "lab" }],
  },
}

export function matchesModelCategory(
  config: Pick<NetworkModelConfig, "modelCategory" | "energyTypes">,
  filter: ModelCategory | "all"
): boolean {
  if (filter === "all") return true
  return (
    config.modelCategory === filter || config.energyTypes.includes(filter)
  )
}

export function categoryColor(category: ModelCategory): string {
  switch (category) {
    case "solar":
      return "#f59e0b"
    case "wind":
      return "#3b82f6"
    case "ocean":
      return "#06b6d4"
    case "biomass":
      return "#84cc16"
    case "geothermal":
      return "#f97316"
    case "hydro":
      return "#6366f1"
    case "hydrogen":
      return "#10b981"
    default:
      return "#6b7280"
  }
}

export function networkMethodKey(
  category: ModelCategory
):
  | "methodSolar"
  | "methodWind"
  | "methodOcean"
  | "methodBiomass"
  | "methodGeothermal"
  | "methodHydro"
  | "methodHydrogen" {
  switch (category) {
    case "solar":
      return "methodSolar"
    case "wind":
      return "methodWind"
    case "ocean":
      return "methodOcean"
    case "biomass":
      return "methodBiomass"
    case "geothermal":
      return "methodGeothermal"
    case "hydro":
      return "methodHydro"
    case "hydrogen":
      return "methodHydrogen"
  }
}

export function caseStatusKey(
  status: CaseStatus
):
  | "statusCommercial"
  | "statusDemo"
  | "statusPlanning"
  | "statusConstruction" {
  switch (status) {
    case "commercial":
      return "statusCommercial"
    case "demo":
      return "statusDemo"
    case "planning":
      return "statusPlanning"
    case "construction":
      return "statusConstruction"
  }
}

export function energyTypeFilterKey(
  category: ModelCategory
):
  | "japanMapFilterSolar"
  | "japanMapFilterWind"
  | "japanMapFilterOcean"
  | "japanMapFilterBiomass"
  | "japanMapFilterGeothermal"
  | "japanMapFilterHydro"
  | "japanMapFilterHydrogen" {
  switch (category) {
    case "solar":
      return "japanMapFilterSolar"
    case "wind":
      return "japanMapFilterWind"
    case "ocean":
      return "japanMapFilterOcean"
    case "biomass":
      return "japanMapFilterBiomass"
    case "geothermal":
      return "japanMapFilterGeothermal"
    case "hydro":
      return "japanMapFilterHydro"
    case "hydrogen":
      return "japanMapFilterHydrogen"
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

