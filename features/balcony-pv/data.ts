// Mock for balcony-plug-in-pv. Heuristic stand-in for suncalc-js-engine.

import type { CountryCode } from '@/lib/country-codes'
import type { WorldMacroRegion } from '@/lib/regions'

export type Direction = 'south' | 'southeast' | 'southwest' | 'east' | 'west'
export type RailingType = 'grid' | 'glass' | 'concrete'

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
  if (['china', 'japan', 'au', 'vn', 'in', 'sg', 'tw', 'nz'].includes(country.id)) {
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
}

/** Product category for global hardware vendors (display labels). */
export type GlobalPvVendorCategory =
  | 'マイクロインバータ'
  | 'ベランダ蓄電キット'
  | 'ポータブル電源'
  | '家庭用蓄電'
  | 'オフグリッドSHS'
  | 'PAYGフィンテック'

/** Global hardware vendor card for the major-vendors sidebar. */
export type GlobalPvVendor = {
  id: AdoptedVendorId
  name: string
  nameJa: string
  /** 本社所在地（国・都市の表示ラベル）。 */
  hqCountry: string
  hqCountryEn?: string
  /**
   * 本社・発祥のマクロ地域。
   * 主要企業一覧の「地域」フィルターは既定でこの値で絞り込む。
   */
  headquartersRegion: RegionCategory
  category: GlobalPvVendorCategory
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
]

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
    rating: '★★☆☆☆',
    status: 'strict_code',
    statusLabel: 'NEC/オフグリッド蓄電',
    systemModel: 'nec_strict',
    regionCategory: 'americas',
    parentId: 'usa',
    keyDrivers: ['寒波・熱波時の系統遮断自衛'],
    bottlenecks: ['プラグイン直結未公認', 'オフグリッド蓄電依存'],
    powerLimit: 'オフグリッド (逆潮流不可)',
    connectionMethod: 'オフグリッド蓄電',
    connectionMethodEn: 'Off-grid storage',
    tenantRights: '規約・HOA協議要',
    tenantRightsEn: 'Rules / HOA consent required',
    regulation: 'ERCOT管轄規程 / NEC Article 690',
    regulationEn: 'ERCOT rules / NEC Article 690',
    costRange: '$800〜$1,500（蓄電オフグリッドキット）',
    paybackYears: '回収困難（停電自衛が主目的）',
    baseLoadCoverage: '停電時バックアップ・部分自給',
    incentives: '連邦ITCは屋根連系連動が主',
    antiIslanding: 'UL 1741 / NEC Rapid Shutdown',
    meterRequirement: 'ユーティリティ連系協議・電気工事必須',
    windSafety: 'ハリケーン・竜巻地域の剛体耐風基準',
    mountingRules: 'コンセント直結は未公認 / HOA規約規制',
    summary:
      'ERCOT管轄とNEC 690によりプラグイン直結は未公認。寒波・熱波時の系統遮断自衛としてオフグリッド蓄電が現実解。',
    coordinates: [-99.9, 31.9],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['tesla-energy', 'ecoflow'],
  },
  {
    id: 'us-fl',
    name: '米フロリダ州',
    code: 'US-FL',
    rating: '★☆☆☆☆',
    status: 'strict_code',
    statusLabel: 'NEC/厳格規程',
    systemModel: 'nec_strict',
    regionCategory: 'americas',
    parentId: 'usa',
    bottlenecks: ['大手電力会社(FPL等)の規制圧力', '中間販売・高額ローン構造'],
    powerLimit: 'オフグリッド (逆潮流不可)',
    connectionMethod: 'オフグリッド蓄電',
    connectionMethodEn: 'Off-grid storage',
    tenantRights: '規約・HOA協議要',
    tenantRightsEn: 'Rules / HOA consent required',
    regulation: 'NEC 690 / UL 1741',
    regulationEn: 'NEC 690 / UL 1741',
    costRange: '$1,000〜$2,500（訪問販売ローン込みで高騰しやすい）',
    paybackYears: '回収困難（中間マージン大）',
    baseLoadCoverage: 'ハリケーン停電時の部分バックアップ',
    incentives: '連邦ITCは屋根連系連動が主',
    antiIslanding: 'UL 1741 SB / NEC Rapid Shutdown',
    meterRequirement: 'ユーティリティ連系協議・電気工事必須',
    windSafety: 'ハリケーン地域の剛体耐風・退避基準',
    mountingRules: 'コンセント直結は違法配線扱い / HOA規制',
    summary:
      'NEC 690と大手電力(FPL等)の規制圧力が強く、中間販売・高額ローン構造が残る。プラグイン直結は事実上困難。',
    coordinates: [-81.5, 27.6],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'tesla-energy'],
  },
  {
    id: 'us-ny',
    name: '米ニューヨーク州',
    code: 'US-NY',
    rating: '★★☆☆☆',
    status: 'strict_code',
    statusLabel: 'NEC/防火・連系規制',
    systemModel: 'nec_strict',
    regionCategory: 'americas',
    parentId: 'usa',
    bottlenecks: ['集合住宅防火規制', '系統連系手続きの長期化'],
    powerLimit: 'オフグリッド (逆潮流不可)',
    connectionMethod: 'オフグリッド蓄電',
    connectionMethodEn: 'Off-grid storage',
    tenantRights: '賃貸・協同組合の承認が障壁',
    tenantRightsEn: 'Lease / co-op approval is a barrier',
    regulation: 'NYC建築・防火基準 / NEC 690',
    regulationEn: 'NYC building & fire codes / NEC 690',
    costRange: '$900〜$1,800（蓄電オフグリッドキット）',
    paybackYears: '回収困難（手続きコスト大）',
    baseLoadCoverage: '部分オフグリッド・停電対策',
    incentives: '州・市の再エネ助成は屋根連系中心',
    antiIslanding: 'UL 1741 / NEC Rapid Shutdown',
    meterRequirement: '系統連系手続きが長期化しがち',
    windSafety: '高層ビル風・落下防止基準厳格',
    mountingRules: '集合住宅の防火・外観規制が強い',
    summary:
      'NYC建築・防火基準とNEC 690により集合住宅でのプラグイン直結は困難。連系手続きの長期化も障壁。',
    coordinates: [-74.0, 40.7],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'enphase'],
  },
  {
    id: 'nigeria',
    name: 'ナイジェリア',
    code: 'NG',
    rating: '★★★★☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'africa',
    keyDrivers: [
      'DARESプログラム推進',
      '都市停電自衛とオフグリッド蓄電の拡大',
      'ディーゼル発電機コスト回避',
    ],
    bottlenecks: ['鉛蓄電池排除・品質基準適合', '粗悪品配線による火災', 'NEMSA規制の執行ギャップ'],
    powerLimit: '世帯向け蓄電キット / 生活照明〜小型家電',
    connectionMethod: 'オフグリッド蓄電 / PAYGキット',
    connectionMethodEn: 'Off-grid storage / PAYG kits',
    tenantRights: '集合住宅規約は物件次第',
    tenantRightsEn: 'Depends on building rules',
    regulation: '地方電化庁（REA）/ DARES — オフグリッド品質・鉛蓄電池排除を推進',
    regulationEn: 'REA / DARES — off-grid quality & lead-acid phase-out',
    costRange: '$150〜$800（キット規模による）',
    paybackYears: '1〜3年（停電・燃料費との比較）',
    baseLoadCoverage: '照明・通信・小型家電・空間冷却の停電回避',
    incentives: 'DARES・民間PAYG／再生バッテリー流通',
    antiIslanding: '系統非連系が前提（逆潮流なし）',
    meterRequirement: '系統連系は原則対象外',
    windSafety: 'Harmattan粉塵・屋外配線の保護',
    mountingRules: '屋上・中庭の簡易架台が中心（ベランダ文化は限定的）',
    summary:
      'REA主導のDARESでオフグリッド蓄電型電化を推進。鉛蓄電池排除と品質基準適合が主要課題。Sun King・d.light等のSHSが都市停電自衛を支える。',
    coordinates: [3.4, 6.5],
    lastUpdated: '2026-10-05',
    adoptedVendors: ['ecoflow', 'anker-solix', 'sun-king', 'dlight'],
  },
  {
    id: 'ethiopia',
    name: 'エチオピア',
    code: 'ET',
    rating: '★★★☆☆',
    status: 'productive_offgrid',
    statusLabel: '太陽光灌漑オフグリッド',
    systemModel: 'productive_offgrid',
    regionCategory: 'africa',
    keyDrivers: ['ナイル水力に依存しない農村電化', '地下水灌漑の生産性向上', '国内パネル工場誘致'],
    bottlenecks: ['農村約8割への送電網不足', '資金調達・高金利', '保守・技能人材の偏在'],
    powerLimit: '太陽光揚水ポンプ / 生活照明キット',
    connectionMethod: '生産活動オフグリッド（揚水・灌漑）',
    connectionMethodEn: 'Productive off-grid (pumping / irrigation)',
    tenantRights: '村落・協同組合単位の導入が主',
    tenantRightsEn: 'Village / cooperative deployment',
    regulation: '農村電化・灌漑プログラム',
    regulationEn: 'Rural electrification & irrigation programs',
    costRange: 'ポンプセット単位（助成・融資併用）',
    paybackYears: '作物収益次第（3〜8年）',
    baseLoadCoverage: '灌漑・加工の昼間電力を太陽光で賄う',
    incentives: '国内パネル製造誘致・開発援助案件',
    antiIslanding: '系統非連系（マイクログリッド／単独）',
    meterRequirement: '送電未到達地域ではメーター前提なし',
    windSafety: '高原の突風・粉塵対策',
    mountingRules: '農地隣接の地上架台が中心',
    summary:
      'ドルファノ地区などに代表される太陽光灌漑が、送電未到達の農村で生産型オフグリッドとして定着しつつある。',
    coordinates: [38.7, 9.0],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow'],
  },
  {
    id: 'kenya',
    name: 'ケニア',
    code: 'KE',
    rating: '★★★★☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'africa',
    keyDrivers: [
      '脱ケロシン達成・エネルギーのはしご上昇',
      'M-Pesa連動PAYGによる非消費層の電化',
      '農作物コールドチェーン不足の解消',
    ],
    bottlenecks: ['資本コスト（金利が他地域の3〜7倍）', '地方物流・保守網', '冷却倉庫の初期投資'],
    powerLimit: 'SHS蓄電キット / 生活〜小型家電',
    connectionMethod: 'オフグリッド蓄電 / PAYG SHS',
    connectionMethodEn: 'Off-grid storage / PAYG SHS',
    tenantRights: '世帯・小規模事業者の自己所有が主',
    tenantRightsEn: 'Mostly household / SME ownership',
    regulation: 'GOGLA品質枠組み / EPRA — オフグリッド蓄電・PayGo電化',
    regulationEn: 'GOGLA quality framework / EPRA — off-grid storage & PayGo',
    costRange: 'キット数千円台〜倉庫は事業投資',
    paybackYears: 'PayGo分割で体感回収を短縮',
    baseLoadCoverage: '照明・充電から農産保冷まで段階拡大',
    incentives: 'PayGo・炭素・開発金融のブレンデッドファイナンス',
    antiIslanding: '系統非連系キットが大半',
    meterRequirement: '連系型は都市部の高電費回避用途に限定',
    windSafety: '赤道直下の強日射・降雨排水設計',
    mountingRules: '屋根置きキット／冷却倉庫の地上設置',
    summary:
      '脱ケロシンを達成し、GOGLA/EPRA枠のもとエネルギーのはしごを上昇。M-KOPA・Sun King・d.lightがPAYG蓄電型SHSの先進市場を形成。',
    coordinates: [36.8, -1.3],
    lastUpdated: '2026-10-05',
    adoptedVendors: ['ecoflow', 'anker-solix', 'mkopa', 'sun-king', 'dlight'],
  },
  {
    id: 'za',
    name: '南アフリカ',
    code: 'ZA',
    rating: '★★★★☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電 / SSEG',
    systemModel: 'offgrid_storage',
    regionCategory: 'africa',
    keyDrivers: [
      '国営Eskomの老朽化と慢性的な計画停電（ロードシェディング）への自衛',
      '都市部住宅・商業施設でのハイブリッド蓄電・屋根/ベランダソーラー爆発的普及',
    ],
    bottlenecks: ['系統連系承認の遅延', '所得格差による導入二極化'],
    powerLimit: 'SSEG規模（世帯〜小規模商業）',
    connectionMethod: 'ハイブリッド蓄電 / SSEG連系',
    connectionMethodEn: 'Hybrid storage / SSEG interconnection',
    tenantRights: '物件・自治体条例による',
    tenantRightsEn: 'Varies by property / municipal bylaws',
    regulation: 'Eskom計画停電規制 / SSEG（小規模分散発電）規程',
    regulationEn: 'Eskom load-shedding rules / SSEG regulations',
    costRange: '蓄電込みキット（所得層で二極化）',
    paybackYears: '3〜7年（停電回避・燃料費比較）',
    baseLoadCoverage: 'ロードシェディング時の家庭・店舗バックアップ',
    incentives: '自治体SSEG登録・民間蓄電キット流通',
    antiIslanding: 'SSEG連系時はユーティリティ規程準拠',
    meterRequirement: '系統連系はSSEG承認・メーター要件あり',
    windSafety: '高原・沿岸風への架台固定',
    mountingRules: '屋根置き／ベランダ蓄電キットが中心',
    summary:
      'Eskomの慢性的ロードシェディングを背景に、都市部でハイブリッド蓄電と屋根/ベランダソーラーが急拡大。SSEG規程と連系承認遅延が導入の鍵。',
    coordinates: [28.0, -26.2],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix', 'hoymiles'],
  },
  {
    id: 'rw',
    name: 'ルワンダ',
    code: 'RW',
    rating: '★★★★☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'africa',
    keyDrivers: [
      '官民連携・PAYG電化モデル',
      '山岳地帯での系統敷設回避',
      'モバイルマネー連動SHSの全土普及',
    ],
    bottlenecks: ['農村部の購買力限界', '外貨為替リスク'],
    powerLimit: '家庭用ソーラーホームシステム（SHS）蓄電',
    connectionMethod: 'オフグリッド蓄電 / PayGo',
    connectionMethodEn: 'Off-grid storage / PayGo',
    tenantRights: '世帯自己所有・PayGo契約が主',
    tenantRightsEn: 'Mostly household ownership / PayGo contracts',
    regulation: 'REG — 官民連携PAYG電化 / 国家電化戦略',
    regulationEn: 'REG — PPP PAYG electrification / national plan',
    costRange: 'PayGo分割のSHSキット',
    paybackYears: 'PayGo分割で体感回収を短縮',
    baseLoadCoverage: '照明・充電・小型家電の生活電源',
    incentives: 'オフグリッド助成・モバイルマネー連動PayGo',
    antiIslanding: '系統非連系が前提',
    meterRequirement: '系統連系は原則対象外',
    windSafety: '山岳突風・豪雨排水設計',
    mountingRules: '屋根置きキット中心',
    summary:
      'REG主導の官民連携とPAYG電化モデルにより、オフグリッド蓄電型SHSが全土に普及。農村購買力と為替リスクがボトルネック。',
    coordinates: [30.1, -1.9],
    lastUpdated: '2026-10-05',
    adoptedVendors: ['ecoflow', 'anker-solix', 'mkopa'],
  },
  {
    id: 'tz',
    name: 'タンザニア',
    code: 'TZ',
    rating: '★★★☆☆',
    status: 'productive_offgrid',
    statusLabel: 'コミュニティミニグリッド',
    systemModel: 'productive_offgrid',
    regionCategory: 'africa',
    keyDrivers: [
      'ビクトリア湖・インド洋島嶼部や孤立農村での民間コミュニティミニグリッド展開',
      '農業一次加工・水運向け電力自給',
    ],
    bottlenecks: ['民間ミニグリッド事業者の採算性・初期投資回収', '送電線到達時の二重投資リスク'],
    powerLimit: 'コミュニティミニグリッド（kW〜数十kW級）',
    connectionMethod: '生産型オフグリッド / コミュニティミニグリッド',
    connectionMethodEn: 'Productive off-grid / community minigrid',
    tenantRights: '村落・コミュニティ契約が主',
    tenantRightsEn: 'Village / community contracts',
    regulation: 'ミニグリッド規制フレームワーク（EWURA）',
    regulationEn: 'Minigrid regulatory framework (EWURA)',
    costRange: '事業者投資＋利用者料金モデル',
    paybackYears: '事業採算次第（送電到達リスクあり）',
    baseLoadCoverage: '照明・加工・水運向け昼間〜夜間電力',
    incentives: '民間ミニグリッド事業者・開発金融',
    antiIslanding: '系統非連系／到達時の切替リスク',
    meterRequirement: 'ミニグリッド内メーターまたは従量課金',
    windSafety: '沿岸・湖岸の強風・塩害対策',
    mountingRules: 'コミュニティ共用架台・地上設置が中心',
    summary:
      '孤立農村・島嶼部で民間コミュニティミニグリッドが展開。農業加工・水運の電力自給が駆動力だが、採算と送電到達時の二重投資が課題。',
    coordinates: [35.7, -6.2],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow'],
  },
  {
    id: 'ug',
    name: 'ウガンダ',
    code: 'UG',
    rating: '★★★☆☆',
    status: 'micro_solar_kit',
    statusLabel: '生活キット / 難民居住区',
    systemModel: 'micro_solar_kit',
    regionCategory: 'africa',
    keyDrivers: [
      '豊富な水力発電グリッドの外側にある広大な農村・難民居住区での生活照明キット・自律給電',
    ],
    bottlenecks: ['初期購入資金（ファイナンス）アクセスの不足', '流通網の末端コスト'],
    powerLimit: '生活照明・充電キット規模',
    connectionMethod: 'オフグリッド生活キット',
    connectionMethodEn: 'Off-grid life-power kits',
    tenantRights: '世帯・居住区単位の自己所有が主',
    tenantRightsEn: 'Mostly household / settlement ownership',
    regulation: 'ERA分散電源ガイドライン',
    regulationEn: 'ERA distributed generation guidelines',
    costRange: '低価格キット〜PayGo分割',
    paybackYears: '燃料・照明費比較で短期体感',
    baseLoadCoverage: '照明・通信充電の生活電源',
    incentives: '民間PayGo・人道支援・開発案件',
    antiIslanding: '系統非連系が前提',
    meterRequirement: '系統連系は原則対象外',
    windSafety: '赤道直下の強日射・降雨排水',
    mountingRules: '屋根・簡易架台のキット設置',
    summary:
      '水力グリッド外側の農村・難民居住区で生活照明キットと自律給電が広がる。ファイナンスアクセスと末端流通コストが導入の壁。',
    coordinates: [32.6, 0.3],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix'],
  },
  {
    id: 'sn',
    name: 'セネガル',
    code: 'SN',
    rating: '★★★☆☆',
    status: 'productive_offgrid',
    statusLabel: '太陽光灌漑オフグリッド',
    systemModel: 'productive_offgrid',
    regionCategory: 'africa',
    keyDrivers: [
      '高騰するディーゼル燃料からの脱却',
      'サヘル地域における太陽光地下水揚水・農業灌漑ポンプの共同利用',
    ],
    bottlenecks: ['設備の保守メンテナンス技術者不足', '砂塵による発電効率低下'],
    powerLimit: '灌漑ポンプ・共同利用規模',
    connectionMethod: '生産型オフグリッド（揚水・灌漑）',
    connectionMethodEn: 'Productive off-grid (pumping / irrigation)',
    tenantRights: '村落・協同組合単位の導入が主',
    tenantRightsEn: 'Village / cooperative deployment',
    regulation: 'ASER農村電化プログラム',
    regulationEn: 'ASER rural electrification program',
    costRange: 'ポンプセット単位（共同利用・助成併用）',
    paybackYears: 'ディーゼル燃料費比較（3〜8年）',
    baseLoadCoverage: '地下水揚水・灌漑の昼間電力',
    incentives: 'ASER農村電化・開発援助案件',
    antiIslanding: '系統非連系（単独／共同ミニ系統）',
    meterRequirement: '送電未到達地域ではメーター前提なし',
    windSafety: 'サヘル砂塵・高温下のパネル保護',
    mountingRules: '農地隣接の地上架台・共同ポンプ場',
    summary:
      'ディーゼル脱却とサヘル地域の太陽光揚水・灌漑共同利用が駆動力。保守人材不足と砂塵による効率低下がボトルネック。',
    coordinates: [-17.4, 14.7],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow'],
  },
  {
    id: 'au',
    name: 'オーストラリア',
    nameEn: 'Australia',
    code: 'AU',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: 'プラグイン / 蓄電併用',
    systemModel: 'net_metering',
    regionCategory: 'asia-oceania',
    keyDrivers: [
      '戸建てソーラー普及後の賃貸・集合住宅テナント（Solar Split）格差解消',
      '系統電気代高騰への対抗・可搬式プラグイン導入',
    ],
    keyDriversEn: [
      'Closing the Solar Split gap for renters and multifamily tenants after rooftop solar took off',
      'Portable plug-in installs as a hedge against soaring grid tariffs',
    ],
    bottlenecks: ['配電事業者（DNSP）による輸出制限（ゼロエクスポート制約）'],
    bottlenecksEn: ['DNSP export limits (zero-export constraints)'],
    powerLimit: '約1,000W（DNSP協議）',
    connectionMethod: 'コンセント直結 / 蓄電併用',
    connectionMethodEn: 'Plug-in / Storage Hybrid',
    tenantRights: '公認・テナント推奨',
    tenantRightsEn: 'Permitted / Tenant friendly',
    regulation: '集合住宅の余剰相殺権利を保障。系統混雑時の出力制御あり。',
    regulationEn:
      'Guarantees surplus-offset rights for multifamily tenants. Export may be curtailed when the grid is congested.',
    costRange: 'A$600〜A$1,500（キット規模による）',
    paybackYears: '4〜7年',
    baseLoadCoverage: '昼間ベースロードの約60〜85%相殺',
    incentives: '州・テナント向け太陽光権利枠組み',
    antiIslanding: '認証インバータ準拠',
    meterRequirement: '配電会社協議・余剰出力制限あり',
    windSafety: '沿岸強風・サイクロン地域は固定・退避確認',
    mountingRules: '手すりクランプ中心・賃貸規約確認',
    summary:
      '集合住宅・賃貸テナントの電力自給権を確立し、高騰する系統電気代に対抗する可搬プラグインが拡大。',
    coordinates: [151.2, -33.8],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles', 'anker-solix'],
  },
  {
    id: 'vn',
    name: 'ベトナム',
    nameEn: 'Vietnam',
    code: 'VN',
    rating: '★★★☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia-oceania',
    keyDrivers: [
      '系統送電線の容量パンクに伴うFIT売電全面停止',
      'ハノイ・ホーチミン都市部集合住宅での逆潮流防止インバーター＋蓄電自給',
    ],
    keyDriversEn: [
      'FIT export halt after transmission capacity bottlenecks',
      'Zero-export inverters + storage self-supply in Hanoi/HCMC multifamily housing',
    ],
    bottlenecks: ['モンスーン特有の暴風・台風対策', '系統連系未認可による自立蓄電限定'],
    bottlenecksEn: [
      'Monsoon storm and typhoon hardening',
      'Self-supply only — grid export still unauthorized',
    ],
    powerLimit: 'オフグリッド自給規模',
    connectionMethod: 'オフグリッド蓄電（逆潮流防止）',
    connectionMethodEn: 'Off-grid storage (zero-export)',
    tenantRights: '系統連系不可（自家消費限定）',
    tenantRightsEn: 'Self-consumption only (No export)',
    regulation: '新電力直接取引（DPPA） / 屋根上自給指針',
    regulationEn: 'DPPA / Rooftop self-consumption guidelines',
    costRange: '蓄電込みキット（世帯規模）',
    paybackYears: '3〜6年（停電・売電停止との比較）',
    baseLoadCoverage: '昼間自家消費・停電時バックアップ',
    incentives: 'DPPA・都市部自給実証',
    antiIslanding: '逆潮流防止インバータ前提',
    meterRequirement: '系統連系は原則不可（自家消費限定）',
    windSafety: 'モンスーン暴風・台風時の出仕舞い必須',
    mountingRules: '集合住宅ベランダ・壁面の簡易架台',
    summary:
      '送電線パンクによる売電停止を受け、都市部住宅で逆潮流防止インバーターを用いた自衛オフグリッドが急増。',
    coordinates: [105.8, 21.0],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix', 'hoymiles'],
  },
  {
    id: 'in',
    name: 'インド',
    nameEn: 'India',
    code: 'IN',
    rating: '★★★★☆',
    status: 'micro_solar_kit',
    statusLabel: '生活キット / 小型プラグイン',
    systemModel: 'micro_solar_kit',
    regionCategory: 'asia-oceania',
    keyDrivers: [
      '1,000万世帯への屋根上・小型ソーラー導入を支援する巨大国策',
      '都市部の頻発停電（ロードシェディング）対策・バルコニー分散自衛',
    ],
    keyDriversEn: [
      'National scheme supporting rooftop/small solar for 10 million households',
      'Urban load-shedding defense via balcony distributed self-supply',
    ],
    bottlenecks: ['集合住宅屋根の共有権問題', '粗悪品の流入防止'],
    bottlenecksEn: [
      'Shared-roof rights in multifamily buildings',
      'Keeping counterfeit kits out of the market',
    ],
    powerLimit: '800W / 家電区分',
    connectionMethod: 'マイクロソーラーキット / 小型プラグイン',
    connectionMethodEn: 'Micro solar kit / compact plug-in',
    tenantRights: '国策助成対象',
    tenantRightsEn: 'Subsidized National Scheme',
    regulation: 'PM-Surya Ghar: Muft Bijli Yojana',
    regulationEn: 'PM-Surya Ghar: Muft Bijli Yojana',
    costRange: '国策助成込みキット（規模による）',
    paybackYears: '2〜5年（停電・電気代比較）',
    baseLoadCoverage: '照明・家電の部分自給・停電回避',
    incentives: 'PM-Surya Ghar国策助成',
    antiIslanding: 'キット種別による（連系／オフグリッド混在）',
    meterRequirement: '助成・配電規則に依存',
    windSafety: 'モンスーン豪雨・強風時の固定確認',
    mountingRules: 'バルコニー・窓際キット設置が中心',
    summary:
      '1,000万世帯を支援する国策PM-Surya Gharを背景に、都市停電対策と連動した小型バルコニー導入が進む。',
    coordinates: [77.2, 28.6],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
  {
    id: 'sg',
    name: 'シンガポール',
    nameEn: 'Singapore',
    code: 'SG',
    rating: '★★★☆☆',
    status: 'plug_exemption',
    statusLabel: '高層都市BIPV',
    systemModel: 'plug_600w',
    regionCategory: 'asia-oceania',
    keyDrivers: [
      '人口の8割が暮らすHDB公営住宅での垂直ベランダ・壁面BIPV（建材一体型）実証',
      '狭小国土における都市空間活用',
    ],
    keyDriversEn: [
      'Vertical balcony/facade BIPV pilots for HDB homes housing ~80% of residents',
      'Maximizing scarce urban land',
    ],
    bottlenecks: ['高層建築の強風圧・防火基準の極めて厳格な審査'],
    bottlenecksEn: ['Extremely strict high-rise wind-load and fire-code review'],
    powerLimit: '600W（建材一体型）',
    connectionMethod: '垂直ベランダ / 壁面BIPV',
    connectionMethodEn: 'Vertical balcony / facade BIPV',
    tenantRights: 'EMA・HDB審査要',
    tenantRightsEn: 'EMA / HDB Approval required',
    regulation: 'EMA分散型電源接続規程 / HDB安全・防火基準',
    regulationEn: 'EMA distributed generation rules / HDB safety & fire codes',
    costRange: 'BIPV実証・建材一体型（審査コスト込み）',
    paybackYears: '6〜10年（実証段階）',
    baseLoadCoverage: '昼間ベースロードの部分相殺',
    incentives: '都市BIPV実証・HDB連携案件',
    antiIslanding: 'EMA接続規程準拠',
    meterRequirement: 'EMA・HDB審査後の接続',
    windSafety: '高層風圧・耐風設計必須',
    mountingRules: 'HDB防火・落下防止基準を満たす建材一体設置',
    summary:
      '人口の8割が暮らす高層HDB公営住宅において、厳格な耐風圧・防火基準を満たす垂直ベランダBIPVを実証。',
    coordinates: [103.8, 1.3],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['hoymiles', 'enphase'],
  },
  {
    id: 'tw',
    name: '台湾',
    nameEn: 'Taiwan',
    code: 'TW',
    rating: '★★★☆☆',
    status: 'storage_only',
    statusLabel: '防災オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia-oceania',
    keyDrivers: [
      '台風常襲・地震多発地域でのベランダ可搬蓄電システム（防災・自給ハイブリッド）',
      '集合住宅コミュニティ主導のDIY展開',
    ],
    keyDriversEn: [
      'Portable balcony storage hybrids for typhoon- and quake-prone regions',
      'Community-led DIY rollout in multifamily housing',
    ],
    bottlenecks: ['電力会社（台電）の系統直結規制', 'マンション管理規約の合意形成'],
    bottlenecksEn: [
      'Taipower rules blocking direct grid tie',
      'Condo association consent',
    ],
    powerLimit: 'ポータブル蓄電池・自給（300W〜800W目安）',
    connectionMethod: 'オフグリッド蓄電（防災ハイブリッド）',
    connectionMethodEn: 'Off-grid storage (disaster-resilience hybrid)',
    tenantRights: '自家消費限定（逆潮流不可）',
    tenantRightsEn: 'Self-consumption only',
    regulation: '台電の逆潮流規制（蓄電・自家消費限定）',
    regulationEn: 'Taipower reverse-flow rules (storage / self-consumption only)',
    costRange: 'ポータブル電源込みキット',
    paybackYears: '回収困難（防災BCPが主目的）',
    baseLoadCoverage: '台風・震災時の生活継続・部分自給',
    incentives: '自治体防災蓄電補助（枠あり）',
    antiIslanding: '台電系連技術要件（直結は原則不可）',
    meterRequirement: '逆潮流不可・自家消費限定',
    windSafety: '台風時の出仕舞い（室内退避）必須',
    mountingRules: '出窓・ベランダの可搬設置・管理規約合意要',
    summary:
      '台風・震災時のBCP（事業・生活継続）を見据え、集合住宅の出窓やベランダでの防災蓄電ハイブリッドが浸透。',
    coordinates: [121.5, 25.0],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix'],
  },
  {
    id: 'nz',
    name: 'ニュージーランド',
    code: 'NZ',
    rating: '★★★★☆',
    status: 'legal_plug',
    statusLabel: '系統連系（ネットメータリング）',
    systemModel: 'plug_800w',
    regionCategory: 'asia-oceania',
    keyDrivers: [
      '230V網とスマートメーター100%普及による双方向余剰相殺（ネットメータリング）の完全定着',
    ],
    bottlenecks: ['配電事業者（Lines Companies）ごとの接続申請手続の差分'],
    powerLimit: '約1,000W（小規模連系枠）',
    connectionMethod: 'コンセント直結（ネットメータリング）',
    connectionMethodEn: 'Plug-in (net metering)',
    tenantRights: '公認・メーター自動相殺',
    tenantRightsEn: 'Permitted / Net Metering',
    regulation: 'スマートメーターによる余剰相殺が定着。配電会社ごとの申請手続に差あり。',
    regulationEn:
      'Smart-meter surplus offset is standard. Application steps still differ by lines company.',
    costRange: 'NZ$600〜NZ$1,200（キット規模による）',
    paybackYears: '4〜7年',
    baseLoadCoverage: '昼間ベースロードの約60〜85%相殺',
    incentives: 'ネットメータリングによる余剰相殺',
    antiIslanding: '認証インバータ準拠',
    meterRequirement: 'スマートメーターによる双方向相殺（ほぼ全戸）',
    windSafety: '強風時の固定確認・沿岸耐風',
    mountingRules: '手すりクランプ中心・賃貸規約確認',
    summary:
      'スマートメーターの普及率がほぼ100%に達し、230V高電圧網での小規模逆潮流が日常的に相殺（ネットメータリング）されている。',
    coordinates: [174.7, -41.3],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['enphase', 'hoymiles'],
  },
  {
    id: 'za-cpt',
    name: 'ケープタウン（南ア）',
    nameEn: 'Cape Town (South Africa)',
    code: 'ZA-CPT',
    rating: '★★★★★',
    status: 'plug_exemption',
    statusLabel: '市連系（Cash for Power公認）',
    systemModel: 'net_metering',
    regionCategory: 'africa',
    keyDrivers: [
      '計画停電（ロードシェディング）克服のための市主導売電買い取り（Cash for Power）',
      '市民の送電網への逆潮流を公認・推奨',
    ],
    keyDriversEn: [
      'City-led Cash for Power buyback to beat load-shedding',
      'Official encouragement of citizen reverse flow onto the grid',
    ],
    bottlenecks: [
      '双方向スマートメーター設置費用の自己負担',
      '貧困層居住区とのインフラ格差',
    ],
    bottlenecksEn: [
      'Bidirectional smart-meter install cost borne by households',
      'Infrastructure gaps vs. lower-income neighborhoods',
    ],
    powerLimit: '1,200W級（SSEG規程）',
    connectionMethod: '市連系（Cash for Power公認）',
    connectionMethodEn: 'Municipal grid (Cash for Power)',
    tenantRights: '市公認売電（Cash for Power）',
    tenantRightsEn: 'Municipal feed-in (Cash for Power)',
    regulation: '市公認売電（Cash for Power）— SSEG小規模分散発電規程',
    regulationEn: 'Municipal feed-in (Cash for Power) — SSEG rules',
    costRange: '蓄電・メーター込みキット（所得層で差）',
    paybackYears: '3〜6年（停電回避・売電併用）',
    baseLoadCoverage: 'ロードシェディング時バックアップ＋余剰売電',
    incentives: 'Cash for Power による余剰電力買収',
    antiIslanding: 'SSEG連系時は市ユーティリティ規程準拠',
    meterRequirement: '双方向スマートメーター（設置費用は自己負担）',
    windSafety: '沿岸強風への架台固定',
    mountingRules: '屋根／ベランダ設置・市SSEG登録',
    summary:
      '深刻な計画停電を克服するため、ケープタウン市が市民からの逆潮流を公式に買い取る「Cash for Power」を推進。',
    coordinates: [18.4, -33.9],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix', 'hoymiles'],
  },
  {
    id: 'br',
    name: 'ブラジル',
    code: 'BR',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: '系統連系（ネット相殺型）',
    systemModel: 'net_metering',
    regionCategory: 'americas',
    keyDrivers: [
      '高騰する系統電気代に対する電気代相殺（ネットメータリング）の急拡大',
      '南米最大の小規模分散型ソーラー市場',
    ],
    bottlenecks: ['送電系統への接続枠課金（Fio B）の段階的導入による採算性変動'],
    powerLimit: '1,200W級（分散発電枠）',
    connectionMethod: '系統連系（ネット相殺型）',
    connectionMethodEn: 'Grid net billing',
    tenantRights: '連邦法で権利保障',
    tenantRightsEn: 'Federal Net Metering Law',
    regulation: '小規模分散法により、余剰電力を翌月の電気代から相殺可能。',
    regulationEn:
      'Under the small distributed-generation law, surplus power can offset next month’s bill.',
    costRange: 'キット規模による（市場急拡大中）',
    paybackYears: '3〜7年（接続枠課金の段階導入で変動）',
    baseLoadCoverage: '昼間ベースロードのネット相殺',
    incentives: 'ネットメータリング（小規模分散法）',
    antiIslanding: '分散発電法に基づく連系規程',
    meterRequirement: '双方向メーター・配電事業者接続',
    windSafety: '熱帯強風・豪雨時の固定確認',
    mountingRules: '屋根／ベランダ設置・配電事業者接続手続',
    summary:
      '高い電気代を背景に、小規模分散法で家庭用ソーラーの余剰相殺を保障し市場が急拡大。',
    coordinates: [-46.6, -23.5],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['hoymiles', 'anker-solix'],
  },
]

/**
 * 全登録地域エイリアス（ランキング・一覧用）。
 * 実装データの正本は WORLD_BALCONY_PV_COUNTRIES。
 */
export const PV_REGIONS = WORLD_BALCONY_PV_COUNTRIES

/** maturityScore 降順（★5 → ★1）の地域一覧。 */
export function getPvRegionsByMaturityDesc(): CountryPvDetail[] {
  return [...PV_REGIONS].sort((a, b) => getMaturityScore(b) - getMaturityScore(a))
}

/** 欧米普及ムーブメントのフェーズ ID（ロケール非依存）。 */
export type MovementHistoryPhaseId =
  | 'guerrilla'
  | 'energyCrisis'
  | 'euDomino'
  | 'usSpread'

/** 壁をこじ開けた非営利団体・民間企業などの突破アクション。 */
export type MilestoneKeyActorKind = 'npo' | 'company'

export type MilestoneKeyActor = {
  name: string
  nameEn?: string
  /** 例: "🧪 工学安全立証" | "🛡️ 市民権利擁護" | "🌐 国際品質標準" | "🏢 量産・PAYG" */
  roleBadge: string
  roleBadgeEn?: string
  /** 立ち向かった規制・電力会社の防壁 */
  barrier: string
  barrierEn?: string
  /** 勝ち取った成果・法制化 */
  achievement: string
  achievementEn?: string
  url?: string
  /** 省略時は非営利・業界団体扱い。`company` で企業ハイライト色調 */
  kind?: MilestoneKeyActorKind
}

/** 国・州単位の法制化マイルストーン。 */
export type MovementMilestone = {
  id: string
  /** `YYYY-MM` */
  date: string
  /** WORLD_BALCONY_PV_COUNTRIES の id */
  regionId: string
  regionName: string
  regionNameEn?: string
  /** 法制化・制度変更の要約 */
  summary: string
  summaryEn?: string
  /** 制度改革を押し通した非営利団体などの突破アクション */
  keyActor?: MilestoneKeyActor
}

/** 普及ムーブメントの1フェーズ。 */
export type MovementHistoryPhase = {
  id: MovementHistoryPhaseId
  /** その期に地図強調する国・州 id */
  targetRegionIds: string[]
  milestones: MovementMilestone[]
}

/**
 * 欧米の普及ムーブメント（欧州国別・北米州別タイムライン）。
 * 表示ラベルは messages `worldPv.movementHistory.phases.*`、詳細は milestones。
 */
export const MOVEMENT_HISTORY_PHASES: MovementHistoryPhase[] = [
  {
    id: 'guerrilla',
    targetRegionIds: ['germany', 'switzerland', 'austria'],
    milestones: [
      {
        id: 'ch-2019-esti',
        date: '2019-06',
        regionId: 'switzerland',
        regionName: 'スイス',
        regionNameEn: 'Switzerland',
        summary: 'ESTI 指針により定格600Wまでの差込式を家電区分で容認。',
        summaryEn: 'ESTI guidance accepts plug-in systems up to 600W rated as appliance-class.',
      },
      {
        id: 'de-2020-diy',
        date: '2020-03',
        regionId: 'germany',
        regionName: 'ドイツ',
        regionNameEn: 'Germany',
        summary: '市民DIY・Stecker-Solar 運動が拡大。600W枠の事実上の運用が先行。',
        summaryEn: 'Citizen DIY and Stecker-Solar movement expands; 600W practice leads ahead of statute.',
        keyActor: {
          name: 'Deutsche Gesellschaft für Sonnenenergie (DGS)',
          roleBadge: '🧪 工学安全立証・規格策定',
          roleBadgeEn: '🧪 Engineering safety proof & standards',
          barrier: '大手電力・VDEによる配線過熱・火災危険論',
          barrierEn: 'Utility/VDE wiring-overheat and fire-risk arguments',
          achievement: '独自安全基準（DGS 0001）策定と600W/800W配線無害性の実証',
          achievementEn: 'DGS 0001 safety standard and proof that 600W/800W wiring stays safe',
          url: 'https://www.dgs.de',
          kind: 'npo',
        },
      },
      {
        id: 'eu-2021-plugin-vendors',
        date: '2021-06',
        regionId: 'germany',
        regionName: 'ドイツ・EU',
        regionNameEn: 'Germany / EU',
        summary:
          'Anker / EcoFlow / Priwatt 等がプラグインキットとベランダ蓄電を量販・ECで一般化。',
        summaryEn:
          'Anker / EcoFlow / Priwatt and peers normalize plug-in kits and balcony storage via retail and e-commerce.',
        keyActor: {
          name: 'Anker / EcoFlow / Priwatt',
          roleBadge: '🏢 量販プラグインキット',
          roleBadgeEn: '🏢 Mass-market plug-in kits',
          barrier: '工事必須・専門業者経由の高コスト導入モデル',
          barrierEn: 'Construction-required, contractor-mediated high-cost install model',
          achievement: 'プラグインキットとバルコニー蓄電池の量販・EC一般化',
          achievementEn: 'Retail/e-commerce normalization of plug-in kits and balcony storage',
          url: 'https://www.anker.com/solix',
          kind: 'company',
        },
      },
      {
        id: 'at-2021-tor',
        date: '2021-09',
        regionId: 'austria',
        regionName: 'オーストリア',
        regionNameEn: 'Austria',
        summary: 'TOR Erzeuger Typ A で小型発電の簡易接続枠が整備。',
        summaryEn: 'TOR Erzeuger Typ A creates a simplified interconnect frame for small generation.',
      },
    ],
  },
  {
    id: 'energyCrisis',
    targetRegionIds: ['germany', 'austria', 'france', 'italy', 'uk', 'belgium'],
    milestones: [
      {
        id: 'it-2020-arera',
        date: '2020-09',
        regionId: 'italy',
        regionName: 'イタリア',
        regionNameEn: 'Italy',
        summary: 'ARERA Delibera 315/2020 — 350W以下届出不要、800Wまで簡易手続。',
        summaryEn: 'ARERA Delibera 315/2020 — no filing ≤350W; simplified process up to 800W.',
      },
      {
        id: 'de-2022-crisis',
        date: '2022-09',
        regionId: 'germany',
        regionName: 'ドイツ',
        regionNameEn: 'Germany',
        summary: 'エネルギー危機下でバルコニーPV需要急増。VAT軽減議論が加速。',
        summaryEn: 'Energy crisis sparks balcony PV demand surge; VAT-relief debates accelerate.',
      },
      {
        id: 'fr-2022-cacsi',
        date: '2022-11',
        regionId: 'france',
        regionName: 'フランス',
        regionNameEn: 'France',
        summary: 'Enedis CACSI オンライン申告が定着し、量販キット流通が拡大。',
        summaryEn: 'Enedis CACSI online filing sticks; retail kit distribution expands.',
      },
      {
        id: 'uk-2023-g98',
        date: '2023-01',
        regionId: 'uk',
        regionName: 'イギリス',
        regionNameEn: 'United Kingdom',
        summary: 'ENA G98 事後通知枠で800W級プラグインが明確化。',
        summaryEn: 'ENA G98 post-install notice frame clarifies 800W-class plug-in.',
      },
      {
        id: 'be-2023-c10',
        date: '2023-06',
        regionId: 'belgium',
        regionName: 'ベルギー',
        regionNameEn: 'Belgium',
        summary: 'Synergrid C10/11 とスマートメーター前提のプラグイン連系が広がる。',
        summaryEn: 'Synergrid C10/11 and smart-meter-based plug-in interconnect spread.',
      },
    ],
  },
  {
    id: 'euDomino',
    targetRegionIds: ['germany', 'austria', 'switzerland', 'france', 'italy', 'uk', 'belgium'],
    milestones: [
      {
        id: 'de-2023-solarpaket',
        date: '2023-05',
        regionId: 'germany',
        regionName: 'ドイツ',
        regionNameEn: 'Germany',
        summary: 'Solarpaket 議論開始。賃貸人設置権と800W枠の法制化が本格化。',
        summaryEn: 'Solarpaket debate begins. Tenant install rights and 800W legalization accelerate.',
      },
      {
        id: 'de-2024-800w',
        date: '2024-05',
        regionId: 'germany',
        regionName: 'ドイツ',
        regionNameEn: 'Germany',
        summary: '800Wプラグ公認・MaStR簡易登録が定着。普及が欧州の基準点に。',
        summaryEn: '800W plug certification and MaStR simple registration stick—Europe’s benchmark.',
        keyActor: {
          name: '欧州プラグインソーラー連盟 (Stecker-Solar)',
          nameEn: 'European Plug-in Solar Alliance (Stecker-Solar)',
          roleBadge: '🛡️ 市民自給権擁護・法制化',
          roleBadgeEn: '🛡️ Citizen self-supply rights & legalization',
          barrier: '賃貸設置禁止規約と旧式逆回転メーターの不正扱い',
          barrierEn: 'Lease install bans and treating legacy reverse-spin meters as fraud',
          achievement: 'Solarpaket I成立（800W公認、賃貸設置権保障、Schuko直結）',
          achievementEn: 'Solarpaket I enacted (800W certified, tenant rights, Schuko plug-in)',
          url: 'https://www.pvplug.de',
        },
      },
      {
        id: 'at-2024-800w',
        date: '2024-07',
        regionId: 'austria',
        regionName: 'オーストリア',
        regionNameEn: 'Austria',
        summary: '800W家電区分・E-Control 登録のみで即日運用が標準化。',
        summaryEn: '800W appliance class + E-Control registration alone becomes same-day standard.',
      },
      {
        id: 'ch-2024-600w',
        date: '2024-09',
        regionId: 'switzerland',
        regionName: 'スイス',
        regionNameEn: 'Switzerland',
        summary: 'NIV / ESTI 600W家電区分がカントン横断で周知。',
        summaryEn: 'NIV / ESTI 600W appliance class is communicated across cantons.',
      },
      {
        id: 'fr-2024-enedis',
        date: '2024-10',
        regionId: 'france',
        regionName: 'フランス',
        regionNameEn: 'France',
        summary: 'CACSI 無料申告とホームセンター流通で800W級が大衆化。',
        summaryEn: 'Free CACSI filing and home-center retail massify 800W-class kits.',
      },
      {
        id: 'it-2025-arera',
        date: '2025-01',
        regionId: 'italy',
        regionName: 'イタリア',
        regionNameEn: 'Italy',
        summary: 'ARERA 枠の運用定着。日照優位で回収年数が短縮。',
        summaryEn: 'ARERA framework operationalizes; strong insolation shortens payback.',
      },
    ],
  },
  {
    id: 'usSpread',
    targetRegionIds: [
      'us-ut',
      'us-ca',
      'us-az',
      'us-co',
      'us-wa',
      'us-or',
      'us-me',
      'us-mn',
    ],
    milestones: [
      {
        id: 'us-ut-2025',
        date: '2025-03',
        regionId: 'us-ut',
        regionName: 'ユタ州',
        regionNameEn: 'Utah',
        summary: '全米初の1,200Wプラグイン系統協議完全免除法が成立。',
        summaryEn: 'First U.S. statute fully waiving interconnect study for 1,200W plug-in.',
        keyActor: {
          name: 'Utah Clean Energy',
          roleBadge: '🛡️ 市民権利擁護',
          roleBadgeEn: '🛡️ Citizen rights advocacy',
          barrier: '系統協議・連系手数料によるプラグイン封鎖',
          barrierEn: 'Interconnect studies and fees blocking plug-in',
          achievement: '全米初の1,200W系統協議完全免除法の成立',
          achievementEn: 'First nationwide 1,200W full interconnect-study waiver statute',
          url: 'https://utahcleanenergy.org',
        },
      },
      {
        id: 'us-ca-2025',
        date: '2025-06',
        regionId: 'us-ca',
        regionName: 'カリフォルニア州',
        regionNameEn: 'California',
        summary: '1,200W届出免除を推進。売電単価低下で蓄電併用が主流化。',
        summaryEn: 'Advances 1,200W permit exemption; low export rates make storage pairing mainstream.',
        keyActor: {
          name: 'CALSSA (California Solar & Storage Association)',
          roleBadge: '⚖️ 自給防衛・蓄電シフト',
          roleBadgeEn: '⚖️ Self-supply defense & storage shift',
          barrier: '電力大手によるNEM 3.0売電単価75%削減と高額な連系工事義務',
          barrierEn: 'Utility NEM 3.0 export-rate cuts (~75%) and costly interconnect mandates',
          achievement: 'プラグイン蓄電・自家消費型（Solar+Storage）の普及標準化',
          achievementEn: 'Normalized plug-in storage / self-consumption (Solar+Storage)',
          url: 'https://calssa.org',
        },
      },
      {
        id: 'us-az-2025',
        date: '2025-08',
        regionId: 'us-az',
        regionName: 'アリゾナ州',
        regionNameEn: 'Arizona',
        summary: '高日照を背景にユタ型1,200W免除を追認。',
        summaryEn: 'Adopts Utah-style 1,200W waiver on top-tier insolation.',
      },
      {
        id: 'us-co-2025',
        date: '2025-09',
        regionId: 'us-co',
        regionName: 'コロラド州',
        regionNameEn: 'Colorado',
        summary: 'ユタテンプレート追認。コミュニティ再エネと連動。',
        summaryEn: 'Adopts Utah template; pairs with community renewables.',
      },
      {
        id: 'us-wa-2025',
        date: '2025-10',
        regionId: 'us-wa',
        regionName: 'ワシントン州',
        regionNameEn: 'Washington',
        summary: '再エネ権利拡大の一環として1,200W免除法を導入。',
        summaryEn: 'Introduces 1,200W waiver as part of expanding renewables rights.',
      },
      {
        id: 'us-or-2025',
        date: '2025-11',
        regionId: 'us-or',
        regionName: 'オレゴン州',
        regionNameEn: 'Oregon',
        summary: '西海岸型プラグイン免除を州法で整備。',
        summaryEn: 'Codifies West Coast-style plug-in exemption in state law.',
      },
      {
        id: 'us-me-2026',
        date: '2026-01',
        regionId: 'us-me',
        regionName: 'メイン州',
        regionNameEn: 'Maine',
        summary: '北東部で許認可免除を先行導入。',
        summaryEn: 'Early Northeast adopter of permitting waivers.',
      },
      {
        id: 'us-mn-2026',
        date: '2026-02',
        regionId: 'us-mn',
        regionName: 'ミネソタ州',
        regionNameEn: 'Minnesota',
        summary: '寒冷地分散EMS推進と1,200W免除を連動。',
        summaryEn: 'Pairs cold-climate distributed EMS with a 1,200W waiver.',
      },
    ],
  },
]

export function getMovementPhaseById(
  id: MovementHistoryPhaseId | null,
): MovementHistoryPhase | undefined {
  if (!id) return undefined
  return MOVEMENT_HISTORY_PHASES.find((p) => p.id === id)
}

/** アフリカ跳躍史フェーズ ID（ロケール非依存）。 */
export type AfricaLeapfrogPhaseId =
  | 'deKerosene'
  | 'paygExplosion'
  | 'shsAppliance'
  | 'productiveUse'

/** アフリカ跳躍史の1フェーズ（欧米伝播史と同型のマイルストーン構造）。 */
export type AfricaLeapfrogPhase = {
  id: AfricaLeapfrogPhaseId
  /** 表示用期間（例: 2010〜2015） */
  period: string
  periodEn?: string
  /** フェーズ見出し */
  title: string
  titleEn?: string
  /** その期に地図強調する国 id */
  targetRegionIds: string[]
  milestones: MovementMilestone[]
}

/**
 * アフリカ・新興国のオフグリッド跳躍史（Leapfrog Revolution）。
 * Lighting Africa → PAYG → SHS家電統合 → 生産電化（PUE）。
 */
export const AFRICA_LEAPFROG_TIMELINE: AfricaLeapfrogPhase[] = [
  {
    id: 'deKerosene',
    period: '2010〜2015',
    periodEn: '2010–2015',
    title: '脱ケロシンとソーラーランタンの夜明け',
    titleEn: 'Kerosene exit & the solar-lantern dawn',
    targetRegionIds: ['kenya', 'nigeria', 'rw', 'ug'],
    milestones: [
      {
        id: 'af-2010-lighting-africa',
        date: '2010-06',
        regionId: 'kenya',
        regionName: 'ケニア',
        regionNameEn: 'Kenya',
        summary: 'Lighting Africa 始動。タスクライト革命でケロシン灯の代替が始まる。',
        summaryEn: 'Lighting Africa launches. Task-light revolution begins replacing kerosene lamps.',
      },
      {
        id: 'af-2012-dlight',
        date: '2012-09',
        regionId: 'kenya',
        regionName: 'ケニア',
        regionNameEn: 'Kenya',
        summary: 'd.light 等のソーラーランタンが量産流通。夜間学習・室内安全が生活実感に。',
        summaryEn: 'd.light and peers mass-distribute solar lanterns—night study and indoor safety become lived experience.',
        keyActor: {
          name: 'd.light',
          roleBadge: '🏢 高耐久ソーラーランタン量産',
          roleBadgeEn: '🏢 Rugged solar-lantern mass production',
          barrier: 'ケロシン灯依存と安価粗悪品による火災・故障リスク',
          barrierEn: 'Kerosene dependence and fire/failure risk from cheap counterfeits',
          achievement: '高耐久ソーラーランタンの量産流通と脱ケロシンの生活実感化',
          achievementEn: 'Mass distribution of rugged solar lanterns and lived kerosene exit',
          url: 'https://www.dlight.com/',
          kind: 'company',
        },
      },
      {
        id: 'af-2014-lantern-wave',
        date: '2014-11',
        regionId: 'nigeria',
        regionName: 'ナイジェリア',
        regionNameEn: 'Nigeria',
        summary: '都市・農村双方でソーラーランタンが拡散。粗悪品排除の品質議論が本格化。',
        summaryEn: 'Solar lanterns spread in cities and villages; quality debates against counterfeits intensify.',
      },
    ],
  },
  {
    id: 'paygExplosion',
    period: '2015〜2020',
    periodEn: '2015–2020',
    title: 'M-Pesa × PAYGによる非消費の爆発的解放',
    titleEn: 'M-Pesa × PAYG unlocking non-consumers',
    targetRegionIds: ['kenya', 'rw', 'ug'],
    milestones: [
      {
        id: 'af-2015-mkopa',
        date: '2015-03',
        regionId: 'kenya',
        regionName: 'ケニア',
        regionNameEn: 'Kenya',
        summary: 'M-KOPA の IoT 遠隔通電と日額小口払いが、非消費層の電化を解放。',
        summaryEn: 'M-KOPA IoT remote energization and daily micro-payments unlock electrification for non-consumers.',
        keyActor: {
          name: 'M-KOPA',
          roleBadge: '🏢 PAYGフィンテック / IoT遠隔通電',
          roleBadgeEn: '🏢 PAYG fintech / IoT remote power',
          barrier: '初期一括購入の資金壁と非銀行層への与信不能',
          barrierEn: 'Upfront purchase barriers and no credit for the unbanked',
          achievement: 'M-Pesa連動IoT遠隔通電と日額マイクロファイナンスによる電化解放',
          achievementEn: 'M-Pesa-linked IoT remote power and daily microfinance unlocking electrification',
          url: 'https://www.m-kopa.com/',
          kind: 'company',
        },
      },
      {
        id: 'af-2017-payg-scale',
        date: '2017-08',
        regionId: 'kenya',
        regionName: 'ケニア',
        regionNameEn: 'Kenya',
        summary: 'M-Pesa 連動 PAYG が東アフリカで標準化。GOGLA が市場データと品質枠を整備。',
        summaryEn: 'M-Pesa-linked PAYG standardizes across East Africa. GOGLA builds market data and quality frameworks.',
        keyActor: {
          name: 'GOGLA',
          roleBadge: '🌐 国際品質標準',
          roleBadgeEn: '🌐 International quality standards',
          barrier: '粗悪品乱立とPAYG契約・課金モデルのばらつき',
          barrierEn: 'Counterfeit flood and fragmented PAYG contract/billing models',
          achievement: 'PAYG標準化と市場データ共有の国際枠組み確立',
          achievementEn: 'International framework for PAYG standards and shared market intelligence',
          url: 'https://www.gogla.org/',
        },
      },
      {
        id: 'af-2019-rw-payg',
        date: '2019-05',
        regionId: 'rw',
        regionName: 'ルワンダ',
        regionNameEn: 'Rwanda',
        summary: 'REG 官民連携で PAYG SHS が全土電化の柱に。山岳部の系統敷設を跳躍。',
        summaryEn: 'REG public–private PAYG SHS becomes a pillar of national electrification—leapfrogging mountain grid build-out.',
      },
    ],
  },
  {
    id: 'shsAppliance',
    period: '2020〜2024',
    periodEn: '2020–2024',
    title: 'SHSと生活家電（DCファン・TV）の統合',
    titleEn: 'SHS meets life appliances (DC fans & TVs)',
    targetRegionIds: ['nigeria', 'kenya', 'rw'],
    milestones: [
      {
        id: 'af-2020-nep-ng',
        date: '2020-06',
        regionId: 'nigeria',
        regionName: 'ナイジェリア',
        regionNameEn: 'Nigeria',
        summary: 'ナイジェリア NEP / DARES で蓄電型 SHS と空間冷却需要が政策の前面に。',
        summaryEn: 'Nigeria NEP / DARES puts storage SHS and space-cooling demand at the policy forefront.',
      },
      {
        id: 'af-2022-sunking-tv',
        date: '2022-04',
        regionId: 'kenya',
        regionName: 'ケニア',
        regionNameEn: 'Kenya',
        summary: 'Sun King 等の SHS が DCファン・TV 一体キットへ拡張。エネルギーのはしご上昇。',
        summaryEn: 'Sun King and peers extend SHS into DC-fan/TV kits—climbing the energy ladder.',
        keyActor: {
          name: 'Sun King',
          roleBadge: '🏢 オフグリッドSHS量産',
          roleBadgeEn: '🏢 Off-grid SHS mass production',
          barrier: '照明止まりの電化と生活家電統合キットの不在',
          barrierEn: 'Lighting-only electrification and missing appliance-integrated kits',
          achievement: 'DCファン・TV一体SHSの量産でエネルギーのはしごを押し上げ',
          achievementEn: 'Mass-produced DC-fan/TV SHS pushing the energy ladder upward',
          url: 'https://sunking.com/',
          kind: 'company',
        },
      },
      {
        id: 'af-2023-epra-quality',
        date: '2023-10',
        regionId: 'kenya',
        regionName: 'ケニア',
        regionNameEn: 'Kenya',
        summary: 'EPRA / GOGLA 品質枠が定着。脱ケロシン後の生活家電統合が本流に。',
        summaryEn: 'EPRA / GOGLA quality frameworks stick. Post-kerosene appliance integration goes mainstream.',
        keyActor: {
          name: 'GOGLA',
          roleBadge: '🌐 国際品質標準',
          roleBadgeEn: '🌐 International quality standards',
          barrier: '品質未検証キットの流入と火災・故障リスク',
          barrierEn: 'Unverified kit inflows and fire/failure risk',
          achievement: 'Verasol品質認証の普及とEPRA連動の品質枠定着',
          achievementEn: 'Verasol certification uptake and EPRA-linked quality frameworks',
          url: 'https://www.gogla.org/',
        },
      },
    ],
  },
  {
    id: 'productiveUse',
    period: '2024〜2026年以降',
    periodEn: '2024–2026+',
    title: '生産の電化（PUE）とソーラー発電機への跳躍',
    titleEn: 'Productive use (PUE) & solar-generator leap',
    targetRegionIds: ['kenya', 'nigeria', 'ethiopia', 'sn', 'ug'],
    milestones: [
      {
        id: 'af-2024-pue-pump',
        date: '2024-03',
        regionId: 'kenya',
        regionName: 'ケニア',
        regionNameEn: 'Kenya',
        summary: '水汲みポンプ・コールドチェーン向け PUE が拡大。生活電化から生産電化へ。',
        summaryEn: 'PUE expands for water pumps and cold chain—from life electrification to productive use.',
      },
      {
        id: 'af-2025-dares-storage',
        date: '2025-06',
        regionId: 'nigeria',
        regionName: 'ナイジェリア',
        regionNameEn: 'Nigeria',
        summary: 'DARES 下で鉛蓄電池排除とポータブル電源級の蓄電キットが都市市場に浸透。',
        summaryEn: 'Under DARES, lead-acid phase-out and portable-power-class storage kits penetrate urban markets.',
      },
      {
        id: 'af-2026-leap-generator',
        date: '2026-01',
        regionId: 'ethiopia',
        regionName: 'エチオピア',
        regionNameEn: 'Ethiopia',
        summary: 'ソーラー発電機・灌漑ポンプがディーゼル代替の跳躍点に。生産オフグリッドが定着。',
        summaryEn: 'Solar generators and irrigation pumps become the diesel-exit leap—productive off-grid takes root.',
      },
    ],
  },
]

export function getAfricaLeapfrogPhaseById(
  id: AfricaLeapfrogPhaseId | null,
): AfricaLeapfrogPhase | undefined {
  if (!id) return undefined
  return AFRICA_LEAPFROG_TIMELINE.find((p) => p.id === id)
}

/** アジア・オセアニア転換史フェーズ ID（ロケール非依存）。 */
export type AsiaOceaniaPhaseId =
  | 'exportAndStorage'
  | 'tenantSelfSupply'
  | 'nationalSchemes'
  | 'urbanNetMetering'

/** アジア・オセアニア転換史の1フェーズ（欧米・アフリカと同型構造）。 */
export type AsiaOceaniaPhase = {
  id: AsiaOceaniaPhaseId
  /** 表示用期間（例: 2020〜2023） */
  period: string
  periodEn?: string
  /** フェーズ見出し */
  title: string
  titleEn?: string
  /** その期に地図強調する国 id */
  targetRegionIds: string[]
  milestones: MovementMilestone[]
}

/**
 * アジア・オセアニアの転換史（枠組み定義・初期データ）。
 * 蓄電自給 → 賃貸テナント権 → 国策キット → 都市ネットメータリング／BIPV。
 */
export const ASIA_OCEANIA_TRANSITION_TIMELINE: AsiaOceaniaPhase[] = [
  {
    id: 'exportAndStorage',
    period: '2019〜2022',
    periodEn: '2019–2022',
    title: '機器輸出拠点とオフグリッド蓄電の定着',
    titleEn: 'Export hubs & off-grid storage take root',
    targetRegionIds: ['china', 'japan', 'tw'],
    milestones: [
      {
        id: 'ao-2019-cn-export',
        date: '2019-08',
        regionId: 'china',
        regionName: '中国',
        regionNameEn: 'China',
        summary:
          'マイクロインバータ・ベランダ蓄電キットの輸出拠点として世界供給を担い、国内集合住宅でも実証が始まる。',
        summaryEn:
          'Becomes a global supply hub for microinverters and balcony storage kits; domestic multifamily pilots begin.',
      },
      {
        id: 'ao-2021-jp-storage',
        date: '2021-06',
        regionId: 'japan',
        regionName: '日本',
        regionNameEn: 'Japan',
        summary:
          '内線規程によりコンセント直結は不可。ポータブル電源での自給ルートが合法な主流として定着。',
        summaryEn:
          'Indoor wiring rules ban outlet plug-in. Portable-power self-supply becomes the lawful mainstream path.',
      },
      {
        id: 'ao-2022-tw-bcp',
        date: '2022-09',
        regionId: 'tw',
        regionName: '台湾',
        regionNameEn: 'Taiwan',
        summary: '台風・震災BCPを軸に、ベランダ可搬蓄電ハイブリッドが集合住宅で広がる。',
        summaryEn: 'Typhoon/quake BCP drives portable balcony storage hybrids across multifamily housing.',
      },
    ],
  },
  {
    id: 'tenantSelfSupply',
    period: '2022〜2024',
    periodEn: '2022–2024',
    title: '賃貸・集合住宅テナントの自給権',
    titleEn: 'Tenant self-supply rights in rentals & multifamily',
    targetRegionIds: ['au', 'vn', 'nz'],
    milestones: [
      {
        id: 'ao-2022-au-split',
        date: '2022-11',
        regionId: 'au',
        regionName: 'オーストラリア',
        regionNameEn: 'Australia',
        summary:
          '戸建てソーラー普及後の賃貸格差（Solar Split）解消へ、可搬プラグインとテナント権利枠が議論の前面に。',
        summaryEn:
          'Portable plug-in and tenant rights frameworks move front-and-center to close the post-rooftop Solar Split.',
        keyActor: {
          name: 'Clean Energy Council (CEC)',
          roleBadge: '🌐 系統規格・接続認証',
          roleBadgeEn: '🌐 Grid standards & interconnect certification',
          barrier: '戸建て普及後の系統逆潮限制約と賃貸テナントの自給格差',
          barrierEn: 'Export limits after rooftop boom and renter self-supply gaps',
          achievement: '動的出力制御（Dynamic Export）の標準化と賃貸向け可搬プラグイン検証',
          achievementEn: 'Dynamic Export standardization and portable plug-in trials for renters',
          url: 'https://www.cleanenergycouncil.org.au/',
        },
      },
      {
        id: 'ao-2023-vn-zeroexport',
        date: '2023-05',
        regionId: 'vn',
        regionName: 'ベトナム',
        regionNameEn: 'Vietnam',
        summary: 'FIT売電停止後、都市部で逆潮流防止インバータ＋蓄電自給が急増。',
        summaryEn: 'After FIT export halt, urban zero-export inverters + storage self-supply surge.',
        keyActor: {
          name: 'Hoymiles（ホイマイルズ）',
          nameEn: 'Hoymiles',
          roleBadge: '🏢 マイクロインバータ',
          roleBadgeEn: '🏢 Microinverters',
          barrier: '系統逆潮流禁止下の過負荷リスクと高電圧アーク火災',
          barrierEn: 'Overload risk and high-voltage arc fire under export bans',
          achievement: 'ゼロエクスポート（逆潮流防止）連動低圧インバータの世界標準化',
          achievementEn: 'Global standardization of zero-export-linked low-voltage inverters',
          url: 'https://www.hoymiles.com/',
          kind: 'company',
        },
      },
      {
        id: 'ao-2024-nz-net',
        date: '2024-03',
        regionId: 'nz',
        regionName: 'ニュージーランド',
        regionNameEn: 'New Zealand',
        summary: 'スマートメーター普及を背景に、小規模ネットメータリングが日常運用として定着。',
        summaryEn: 'With smart-meter coverage, small-scale net metering becomes everyday practice.',
      },
    ],
  },
  {
    id: 'nationalSchemes',
    period: '2023〜2025',
    periodEn: '2023–2025',
    title: '国策キットと都市停電対策',
    titleEn: 'National kits & urban outage defense',
    targetRegionIds: ['in', 'sg', 'japan'],
    milestones: [
      {
        id: 'ao-2024-in-surya',
        date: '2024-02',
        regionId: 'in',
        regionName: 'インド',
        regionNameEn: 'India',
        summary:
          'PM-Surya Ghar により1,000万世帯向け屋根上・小型ソーラー支援が始動。バルコニー分散も連動。',
        summaryEn:
          'PM-Surya Ghar launches rooftop/small-solar support for 10M households—balcony distributed installs follow.',
        keyActor: {
          name: 'Tata Power Solar',
          roleBadge: '🏭 屋根上分散キット量産',
          roleBadgeEn: '🏭 Rooftop distributed kit mass production',
          barrier: '都市部テナントの調達摩擦と初期費用',
          barrierEn: 'Urban tenant procurement friction and upfront cost',
          achievement: 'PM-Surya Ghar連動の標準バルコニー・小型キット普及',
          achievementEn: 'Standard balcony/compact kits tied to PM-Surya Ghar',
          url: 'https://www.tatapowersolar.com/',
          kind: 'company',
        },
      },
      {
        id: 'ao-2024-sg-bipv',
        date: '2024-08',
        regionId: 'sg',
        regionName: 'シンガポール',
        regionNameEn: 'Singapore',
        summary: 'HDB公営高層住宅で垂直ベランダ・壁面BIPV実証が本格化。',
        summaryEn: 'Vertical balcony/facade BIPV pilots ramp up in HDB high-rises.',
        keyActor: {
          name: 'HDB都市実証コンソーシアム',
          nameEn: 'HDB urban pilot consortium',
          roleBadge: '📜 自律給電・BIPV安全枠',
          roleBadgeEn: '📜 Autonomous supply & BIPV safety framework',
          barrier: '内線規程による直結禁止と公営高層住宅の防火基準',
          barrierEn: 'Outlet-tie bans under wiring rules and public high-rise fire codes',
          achievement: 'ポータブル電源オフグリッド自給枠の定着と垂直壁面実証推進',
          achievementEn: 'Portable off-grid self-supply norms and vertical facade pilots',
          url: 'https://www.hdb.gov.sg/',
        },
      },
      {
        id: 'ao-2025-jp-municipal',
        date: '2025-04',
        regionId: 'japan',
        regionName: '日本',
        regionNameEn: 'Japan',
        summary: '自治体防災蓄電補助と管理規約の緊張のなか、オフグリッド自給がローエンド解として拡大。',
        summaryEn: 'Municipal disaster-storage grants vs. condo rules—off-grid self-supply expands as the low-end path.',
        keyActor: {
          name: 'JPEA（太陽光発電協会）',
          nameEn: 'JPEA (Japan Photovoltaic Energy Association)',
          roleBadge: '📜 自律給電・BIPV安全枠',
          roleBadgeEn: '📜 Autonomous supply & BIPV safety framework',
          barrier: '内線規程による直結禁止と公営高層住宅の防火基準',
          barrierEn: 'Outlet-tie bans under wiring rules and public high-rise fire codes',
          achievement: 'ポータブル電源オフグリッド自給枠の定着と垂直壁面実証推進',
          achievementEn: 'Portable off-grid self-supply norms and vertical facade pilots',
          url: 'https://www.jpea.gr.jp/',
        },
      },
    ],
  },
  {
    id: 'urbanNetMetering',
    period: '2025〜2026年以降',
    periodEn: '2025–2026+',
    title: '都市ネット相殺と地域間の制度収束',
    titleEn: 'Urban net metering & institutional convergence',
    targetRegionIds: ['au', 'nz', 'in', 'sg', 'tw', 'vn'],
    milestones: [
      {
        id: 'ao-2025-au-dnsp',
        date: '2025-06',
        regionId: 'au',
        regionName: 'オーストラリア',
        regionNameEn: 'Australia',
        summary: 'DNSPのゼロエクスポート制約下でも、蓄電併用プラグインが賃貸市場で拡大。',
        summaryEn: 'Even under DNSP zero-export limits, storage-paired plug-in expands in the rental market.',
      },
      {
        id: 'ao-2026-in-balcony',
        date: '2026-01',
        regionId: 'in',
        regionName: 'インド',
        regionNameEn: 'India',
        summary: '国策助成と都市停電対策が結びつき、バルコニー小型キットが都市部で実装加速。',
        summaryEn: 'National subsidies meet urban outage defense—balcony compact kits accelerate in cities.',
      },
      {
        id: 'ao-2026-sg-ema',
        date: '2026-03',
        regionId: 'sg',
        regionName: 'シンガポール',
        regionNameEn: 'Singapore',
        summary: 'EMA接続規程とHDB防火基準を満たす都市BIPVが標準化の段階へ。',
        summaryEn: 'Urban BIPV meeting EMA interconnect and HDB fire codes moves toward standardization.',
      },
    ],
  },
]

export function getAsiaOceaniaPhaseById(
  id: AsiaOceaniaPhaseId | null,
): AsiaOceaniaPhase | undefined {
  if (!id) return undefined
  return ASIA_OCEANIA_TRANSITION_TIMELINE.find((p) => p.id === id)
}
