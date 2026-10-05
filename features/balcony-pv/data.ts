// Mock for balcony-plug-in-pv. Heuristic stand-in for suncalc-js-engine.

import type { CountryCode } from '@/lib/country-codes'

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

/** Continental / macro region for world-map focus filters. */
export type RegionCategory = 'europe' | 'asia' | 'africa' | 'north_america' | 'other'

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

export interface CountryPvDetail {
  id: string
  name: string
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
  /** Locale-independent bottleneck keys or short JA demo phrases. */
  bottlenecks?: string[]
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
  if (country.parentId === 'usa' || country.id.startsWith('us-') || country.id === 'usa') {
    return 'north_america'
  }
  if (
    ['nigeria', 'ethiopia', 'kenya', 'za', 'za-cpt', 'rw', 'tz', 'ug', 'sn'].includes(country.id)
  ) {
    return 'africa'
  }
  if (['china', 'japan', 'au', 'vn', 'in', 'sg', 'tw'].includes(country.id)) return 'asia'
  if (
    ['germany', 'austria', 'italy', 'uk', 'france', 'belgium', 'switzerland'].includes(country.id)
  ) {
    return 'europe'
  }
  return 'other'
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
}

/** Product category for global hardware vendors (display labels). */
export type GlobalPvVendorCategory =
  | 'マイクロインバータ'
  | 'ベランダ蓄電キット'
  | 'ポータブル電源'
  | '家庭用蓄電'

/** Global hardware vendor card for the major-vendors sidebar. */
export type GlobalPvVendor = {
  id: AdoptedVendorId
  name: string
  nameJa: string
  hqCountry: string
  category: GlobalPvVendorCategory
  description: string
  keyProducts: string[]
  /** WORLD_BALCONY_PV_COUNTRIES ids where the vendor is suited / deployed. */
  targetRegionIds: string[]
  url: string
}

/** Major global hardware vendors (阳台 / plug-in / storage kit makers). */
export const GLOBAL_PV_VENDORS: GlobalPvVendor[] = [
  {
    id: 'enphase',
    name: 'Enphase Energy',
    nameJa: 'エンフェーズ・エナジー',
    hqCountry: 'アメリカ合衆国',
    category: 'マイクロインバータ',
    description:
      'マイクロインバータとプラグイン対応機器で米欧のベランダ・小規模PV市場を牽引。州別プラグイン免除との相性が高い。',
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
    url: 'https://enphase.com/',
  },
  {
    id: 'hoymiles',
    name: 'Hoymiles',
    nameJa: 'ホイマイルズ',
    hqCountry: '中国',
    category: 'マイクロインバータ',
    description:
      '欧州ベランダPV向けマイクロインバータの主要輸出メーカー。800W/1,200W級プラグインキットの心臓部として広く流通。',
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
    url: 'https://www.hoymiles.com/',
  },
  {
    id: 'anker-solix',
    name: 'Anker Solix',
    nameJa: 'アンカー・ソリックス',
    hqCountry: '中国',
    category: 'ベランダ蓄電キット',
    description:
      'ベランダ向け蓄電・プラグインキットを量販チャネルで展開。欧州の800W公認市場とアジアのオフグリッド蓄電需要の双方に適合。',
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
    url: 'https://www.anker.com/solix',
  },
  {
    id: 'ecoflow',
    name: 'EcoFlow',
    nameJa: 'エコフロー',
    hqCountry: '中国',
    category: 'ポータブル電源',
    description:
      'ポータブル電源とベランダ蓄電キットで、系統直結が難しい市場（日本・NEC厳格州・停電自衛市場）の自給ルートを担う。',
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
    url: 'https://www.ecoflow.com/',
  },
  {
    id: 'tesla-energy',
    name: 'Tesla Energy',
    nameJa: 'テスラ・エナジー',
    hqCountry: 'アメリカ合衆国',
    category: '家庭用蓄電',
    description:
      '家庭用蓄電と屋根連系ソリューション。米国内のNEC厳格州ではオフグリッド／バックアップ寄りの選択肢として位置づけられる。',
    keyProducts: ['Powerwall', 'Solar Roof', 'Backup Gateway'],
    targetRegionIds: ['usa', 'us-tx', 'us-fl'],
    url: 'https://www.tesla.com/energy',
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
    id: 'gogla-ke',
    name: 'GOGLA',
    type: 'npo',
    countryId: 'kenya',
    role: '独立分散型ソーラー（Off-Grid Solar）普及を推進する世界的な業界団体',
    roleEn: 'Global industry association advancing off-grid solar',
    url: 'https://www.gogla.org/',
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
    code: 'CN',
    rating: '★★☆☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia',
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
    code: 'JP',
    rating: '★★☆☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia',
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
    code: 'US',
    rating: '★★☆☆☆',
    status: 'strict_code',
    statusLabel: '州別制度（連邦NEC＋州法）',
    systemModel: 'nec_strict',
    gridCategory: 'grid_no_plug',
    regionCategory: 'north_america',
    keyDrivers: ['州ごとの規制改革', '電気代高騰', '停電・レジリエンス'],
    bottlenecks: ['連邦NEC 690の急速遮断', '州間格差', '訪問販売の高額マージン'],
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    regionCategory: 'north_america',
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
    rating: '★★☆☆☆',
    status: 'micro_solar_kit',
    statusLabel: '都市停電自衛 / E-waste再生',
    systemModel: 'micro_solar_kit',
    regionCategory: 'africa',
    keyDrivers: ['都市部の慢性的系統停電', 'ディーゼル発電機コスト回避', 'E-wasteバッテリー再生'],
    bottlenecks: ['粗悪品配線による火災', 'NEMSA規制・認証の執行ギャップ', 'E-waste廃棄物処理'],
    powerLimit: '太陽光揚水ポンプ / 生活照明キット',
    connectionMethod: 'オフグリッド蓄電 / 再生バッテリーキット',
    connectionMethodEn: 'Off-grid storage / recycled-battery kits',
    tenantRights: '集合住宅規約は物件次第',
    tenantRightsEn: 'Depends on building rules',
    regulation: 'NEMSA / 配電会社ルール',
    regulationEn: 'NEMSA / disco rules',
    costRange: '$150〜$800（キット規模による）',
    paybackYears: '1〜3年（停電・燃料費との比較）',
    baseLoadCoverage: '照明・通信・小型家電の停電回避',
    incentives: '民間ペイアスユーゴー／再生バッテリー流通',
    antiIslanding: '系統非連系が前提（逆潮流なし）',
    meterRequirement: '系統連系は原則対象外',
    windSafety: 'Harmattan粉塵・屋外配線の保護',
    mountingRules: '屋上・中庭の簡易架台が中心（ベランダ文化は限定的）',
    summary:
      '都市停電への自衛需要が強く、Quadloop等のE-waste再生バッテリーが生活電源キットを支える。粗悪品火災が最大のリスク。',
    coordinates: [3.4, 6.5],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix'],
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
    status: 'micro_solar_kit',
    statusLabel: '生活キット / コールドチェーン',
    systemModel: 'micro_solar_kit',
    regionCategory: 'africa',
    keyDrivers: ['高電費への対抗', 'BOP生活電源の普及', '農作物コールドチェーン不足の解消'],
    bottlenecks: ['資本コスト（金利が他地域の3〜7倍）', '地方物流・保守網', '冷却倉庫の初期投資'],
    powerLimit: '太陽光揚水ポンプ / 生活照明キット',
    connectionMethod: 'マイクロキット + 生産オフグリッド',
    connectionMethodEn: 'Micro kits + productive off-grid',
    tenantRights: '世帯・小規模事業者の自己所有が主',
    tenantRightsEn: 'Mostly household / SME ownership',
    regulation: '配電・品質規制 + 民間PayGo',
    regulationEn: 'Disco / quality rules + private PayGo',
    costRange: 'キット数千円台〜倉庫は事業投資',
    paybackYears: 'PayGo分割で体感回収を短縮',
    baseLoadCoverage: '照明・充電から農産保冷まで段階拡大',
    incentives: 'PayGo・炭素・開発金融のブレンデッドファイナンス',
    antiIslanding: '系統非連系キットが大半',
    meterRequirement: '連系型は都市部の高電費回避用途に限定',
    windSafety: '赤道直下の強日射・降雨排水設計',
    mountingRules: '屋根置きキット／冷却倉庫の地上設置',
    summary:
      'Sun Kingの約730万台キットとSoulfreshの太陽光冷却倉庫が、高電費・コールドチェーン不足に同時に応える先進市場。',
    coordinates: [36.8, -1.3],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix'],
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
    status: 'micro_solar_kit',
    statusLabel: '生活キット / PayGo',
    systemModel: 'micro_solar_kit',
    regionCategory: 'africa',
    keyDrivers: [
      '山岳地帯での系統敷設回避',
      'モバイルマネー連動Pay-As-You-Go（従量課金）による家庭用ソーラーキット（SHS）の全土普及',
    ],
    bottlenecks: ['農村部の購買力限界', '外貨為替リスク'],
    powerLimit: '家庭用ソーラーホームシステム（SHS）',
    connectionMethod: 'オフグリッド生活キット / PayGo',
    connectionMethodEn: 'Off-grid life kits / PayGo',
    tenantRights: '世帯自己所有・PayGo契約が主',
    tenantRightsEn: 'Mostly household ownership / PayGo contracts',
    regulation: '国家電化戦略（NEP） / オフグリッド助成枠組み',
    regulationEn: 'National Electrification Plan (NEP) / off-grid subsidy framework',
    costRange: 'PayGo分割のSHSキット',
    paybackYears: 'PayGo分割で体感回収を短縮',
    baseLoadCoverage: '照明・充電・小型家電の生活電源',
    incentives: 'オフグリッド助成・モバイルマネー連動PayGo',
    antiIslanding: '系統非連系が前提',
    meterRequirement: '系統連系は原則対象外',
    windSafety: '山岳突風・豪雨排水設計',
    mountingRules: '屋根置きキット中心',
    summary:
      '山岳地帯の系統敷設回避とPayGo連動SHSにより、家庭用ソーラーキットが全土に普及。農村購買力と為替リスクがボトルネック。',
    coordinates: [30.1, -1.9],
    lastUpdated: '2026-10-04',
    adoptedVendors: ['ecoflow', 'anker-solix'],
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
    code: 'AU',
    rating: '★★★★☆',
    status: 'plug_exemption',
    statusLabel: 'プラグイン / 蓄電併用',
    systemModel: 'net_metering',
    regionCategory: 'asia',
    keyDrivers: [
      '戸建てソーラー普及後の賃貸・集合住宅テナント（Solar Split）格差解消',
      '系統電気代高騰への対抗・可搬式プラグイン導入',
    ],
    bottlenecks: ['配電事業者（DNSP）による輸出制限（ゼロエクスポート制約）'],
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
    code: 'VN',
    rating: '★★★☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia',
    keyDrivers: [
      '系統送電線の容量パンクに伴うFIT売電全面停止',
      'ハノイ・ホーチミン都市部集合住宅での逆潮流防止インバーター＋蓄電自給',
    ],
    bottlenecks: ['モンスーン特有の暴風・台風対策', '系統連系未認可による自立蓄電限定'],
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
    code: 'IN',
    rating: '★★★★☆',
    status: 'micro_solar_kit',
    statusLabel: '生活キット / 小型プラグイン',
    systemModel: 'micro_solar_kit',
    regionCategory: 'asia',
    keyDrivers: [
      '1,000万世帯への屋根上・小型ソーラー導入を支援する巨大国策',
      '都市部の頻発停電（ロードシェディング）対策・バルコニー分散自衛',
    ],
    bottlenecks: ['集合住宅屋根の共有権問題', '粗悪品の流入防止'],
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
    code: 'SG',
    rating: '★★★☆☆',
    status: 'plug_exemption',
    statusLabel: '高層都市BIPV',
    systemModel: 'plug_600w',
    regionCategory: 'asia',
    keyDrivers: [
      '人口の8割が暮らすHDB公営住宅での垂直ベランダ・壁面BIPV（建材一体型）実証',
      '狭小国土における都市空間活用',
    ],
    bottlenecks: ['高層建築の強風圧・防火基準の極めて厳格な審査'],
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
    code: 'TW',
    rating: '★★★☆☆',
    status: 'storage_only',
    statusLabel: '防災オフグリッド蓄電型',
    systemModel: 'offgrid_storage',
    regionCategory: 'asia',
    keyDrivers: [
      '台風常襲・地震多発地域でのベランダ可搬蓄電システム（防災・自給ハイブリッド）',
      '集合住宅コミュニティ主導のDIY展開',
    ],
    bottlenecks: ['電力会社（台電）の系統直結規制', 'マンション管理規約の合意形成'],
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
    regionCategory: 'other',
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
    bottlenecks: [
      '双方向スマートメーター設置費用の自己負担',
      '貧困層居住区とのインフラ格差',
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
    regionCategory: 'other',
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

/** 国・州単位の法制化マイルストーン。 */
export type MovementMilestone = {
  id: string
  /** `YYYY-MM` */
  date: string
  /** WORLD_BALCONY_PV_COUNTRIES の id */
  regionId: string
  regionName: string
  /** 法制化・制度変更の要約 */
  summary: string
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
        summary: 'ESTI 指針により定格600Wまでの差込式を家電区分で容認。',
      },
      {
        id: 'de-2020-diy',
        date: '2020-03',
        regionId: 'germany',
        regionName: 'ドイツ',
        summary: '市民DIY・Stecker-Solar 運動が拡大。600W枠の事実上の運用が先行。',
      },
      {
        id: 'at-2021-tor',
        date: '2021-09',
        regionId: 'austria',
        regionName: 'オーストリア',
        summary: 'TOR Erzeuger Typ A で小型発電の簡易接続枠が整備。',
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
        summary: 'ARERA Delibera 315/2020 — 350W以下届出不要、800Wまで簡易手続。',
      },
      {
        id: 'de-2022-crisis',
        date: '2022-09',
        regionId: 'germany',
        regionName: 'ドイツ',
        summary: 'エネルギー危機下でバルコニーPV需要急増。VAT軽減議論が加速。',
      },
      {
        id: 'fr-2022-cacsi',
        date: '2022-11',
        regionId: 'france',
        regionName: 'フランス',
        summary: 'Enedis CACSI オンライン申告が定着し、量販キット流通が拡大。',
      },
      {
        id: 'uk-2023-g98',
        date: '2023-01',
        regionId: 'uk',
        regionName: 'イギリス',
        summary: 'ENA G98 事後通知枠で800W級プラグインが明確化。',
      },
      {
        id: 'be-2023-c10',
        date: '2023-06',
        regionId: 'belgium',
        regionName: 'ベルギー',
        summary: 'Synergrid C10/11 とスマートメーター前提のプラグイン連系が広がる。',
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
        summary: 'Solarpaket 議論開始。賃貸人設置権と800W枠の法制化が本格化。',
      },
      {
        id: 'de-2024-800w',
        date: '2024-05',
        regionId: 'germany',
        regionName: 'ドイツ',
        summary: '800Wプラグ公認・MaStR簡易登録が定着。普及が欧州の基準点に。',
      },
      {
        id: 'at-2024-800w',
        date: '2024-07',
        regionId: 'austria',
        regionName: 'オーストリア',
        summary: '800W家電区分・E-Control 登録のみで即日運用が標準化。',
      },
      {
        id: 'ch-2024-600w',
        date: '2024-09',
        regionId: 'switzerland',
        regionName: 'スイス',
        summary: 'NIV / ESTI 600W家電区分がカントン横断で周知。',
      },
      {
        id: 'fr-2024-enedis',
        date: '2024-10',
        regionId: 'france',
        regionName: 'フランス',
        summary: 'CACSI 無料申告とホームセンター流通で800W級が大衆化。',
      },
      {
        id: 'it-2025-arera',
        date: '2025-01',
        regionId: 'italy',
        regionName: 'イタリア',
        summary: 'ARERA 枠の運用定着。日照優位で回収年数が短縮。',
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
        summary: '全米初の1,200Wプラグイン系統協議完全免除法が成立。',
      },
      {
        id: 'us-ca-2025',
        date: '2025-06',
        regionId: 'us-ca',
        regionName: 'カリフォルニア州',
        summary: '1,200W届出免除を推進。売電単価低下で蓄電併用が主流化。',
      },
      {
        id: 'us-az-2025',
        date: '2025-08',
        regionId: 'us-az',
        regionName: 'アリゾナ州',
        summary: '高日照を背景にユタ型1,200W免除を追認。',
      },
      {
        id: 'us-co-2025',
        date: '2025-09',
        regionId: 'us-co',
        regionName: 'コロラド州',
        summary: 'ユタテンプレート追認。コミュニティ再エネと連動。',
      },
      {
        id: 'us-wa-2025',
        date: '2025-10',
        regionId: 'us-wa',
        regionName: 'ワシントン州',
        summary: '再エネ権利拡大の一環として1,200W免除法を導入。',
      },
      {
        id: 'us-or-2025',
        date: '2025-11',
        regionId: 'us-or',
        regionName: 'オレゴン州',
        summary: '西海岸型プラグイン免除を州法で整備。',
      },
      {
        id: 'us-me-2026',
        date: '2026-01',
        regionId: 'us-me',
        regionName: 'メイン州',
        summary: '北東部で許認可免除を先行導入。',
      },
      {
        id: 'us-mn-2026',
        date: '2026-02',
        regionId: 'us-mn',
        regionName: 'ミネソタ州',
        summary: '寒冷地分散EMS推進と1,200W免除を連動。',
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
