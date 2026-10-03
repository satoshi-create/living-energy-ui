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

export interface CountryPvDetail {
  id: string
  name: string
  code: CountryCode
  rating: string // 例: "★★★★★"
  status: 'legal_plug' | 'appliance_notified' | 'storage_only' | 'strict_code'
  statusLabel: string
  powerLimit: string
  connectionMethod: string
  tenantRights: string
  regulation: string
  costRange: string
  paybackYears: string
  baseLoadCoverage: string
  incentives: string
  antiIslanding: string
  meterRequirement: string
  windSafety: string
  mountingRules: string
  summary: string
  coordinates: string
  lastUpdated: string
  // 地図描画用座標
  x: number
  y: number
  labelDx: number
  labelDy: number
}

/** @deprecated Prefer CountryPvDetail */
export type CountryPvStatus = CountryPvDetail

export function getCountryPvByCode(code: CountryCode): CountryPvDetail | undefined {
  return WORLD_BALCONY_PV_COUNTRIES.find((c) => c.code === code)
}

/** Sidebar field keys; labels: `balconyPv.world.fields.*`. */
export const COUNTRY_PV_SIDEBAR_FIELDS = [
  { key: 'powerLimit', labelKey: 'powerLimit' },
  { key: 'regulation', labelKey: 'regulation' },
  { key: 'tenantRights', labelKey: 'tenantRights' },
  { key: 'connectionMethod', labelKey: 'connectionMethod' },
  { key: 'lastUpdated', labelKey: 'lastUpdated' },
] as const satisfies readonly { key: keyof CountryPvDetail; labelKey: string }[]

export const WORLD_BALCONY_PV_COUNTRIES: CountryPvDetail[] = [
  {
    id: 'germany',
    name: 'ドイツ',
    code: 'DE',
    rating: '★★★★★',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    tenantRights: '法的に権利保障',
    regulation: 'Solarpaket I / MaStR',
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
    coordinates: '51.1657, 10.4515',
    lastUpdated: '2026-09-30',
    x: 480,
    y: 145,
    labelDx: 12,
    labelDy: -8,
  },
  {
    id: 'austria',
    name: 'オーストリア',
    code: 'AT',
    rating: '★★★★★',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    tenantRights: '法的に権利保障',
    regulation: 'TOR Erzeuger Typ A / E-Control',
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
    coordinates: '47.5162, 14.5501',
    lastUpdated: '2026-09-30',
    x: 505,
    y: 165,
    labelDx: 14,
    labelDy: 4,
  },
  {
    id: 'italy',
    name: 'イタリア',
    code: 'IT',
    rating: '★★★★☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    tenantRights: '法的に権利保障',
    regulation: 'ARERA Delibera 315/2020/R/eel',
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
    coordinates: '41.8719, 12.5674',
    lastUpdated: '2026-09-30',
    x: 495,
    y: 195,
    labelDx: 14,
    labelDy: 16,
  },
  {
    id: 'uk',
    name: 'イギリス',
    code: 'GB',
    rating: '★★★★☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    tenantRights: '規約・協議要',
    regulation: 'ENA EREC G98 / BS 1363',
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
    coordinates: '55.3781, -3.4360',
    lastUpdated: '2026-09-30',
    x: 435,
    y: 135,
    labelDx: -85,
    labelDy: -12,
  },
  {
    id: 'france',
    name: 'フランス',
    code: 'FR',
    rating: '★★★★☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    tenantRights: '規約・協議要',
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
    coordinates: '46.2276, 2.2137',
    lastUpdated: '2026-09-30',
    x: 445,
    y: 170,
    labelDx: -80,
    labelDy: 4,
  },
  {
    id: 'belgium',
    name: 'ベルギー',
    code: 'BE',
    rating: '★★★☆☆',
    status: 'legal_plug',
    statusLabel: '800Wプラグ公認',
    powerLimit: '800W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    tenantRights: '規約・協議要',
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
    coordinates: '50.5039, 4.4699',
    lastUpdated: '2026-09-30',
    x: 462,
    y: 152,
    labelDx: -85,
    labelDy: -2,
  },
  {
    id: 'switzerland',
    name: 'スイス',
    code: 'CH',
    rating: '★★★☆☆',
    status: 'appliance_notified',
    statusLabel: '600W/家電製品区分',
    powerLimit: '600W',
    connectionMethod: 'コンセント直結 (プラグイン)',
    tenantRights: '規約・協議要',
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
    coordinates: '46.8182, 8.2275',
    lastUpdated: '2026-09-30',
    x: 472,
    y: 172,
    labelDx: -80,
    labelDy: 18,
  },
  {
    id: 'china',
    name: '中国',
    code: 'CN',
    rating: '★★☆☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    powerLimit: '800W',
    connectionMethod: 'オフグリッド蓄電 / マイクロインバータ系統工事',
    tenantRights: '原則不可',
    regulation: '国家標準 GB/T',
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
    coordinates: '35.8617, 104.1954',
    lastUpdated: '2026-09-30',
    x: 740,
    y: 185,
    labelDx: 14,
    labelDy: 4,
  },
  {
    id: 'japan',
    name: '日本',
    code: 'JP',
    rating: '★★☆☆☆',
    status: 'storage_only',
    statusLabel: 'オフグリッド蓄電型',
    powerLimit: 'オフグリッド (逆潮流不可)',
    connectionMethod: 'オフグリッド蓄電',
    tenantRights: '原則不可',
    regulation: '電気事業法 / 内線規程',
    costRange: '10〜18万円 (ポータブル電源込み)',
    paybackYears: '10年以上 (蓄電投資が主体)',
    baseLoadCoverage: 'ポータブル電源経由で夜間家電・スマホ等の部分自給',
    incentives: '一部自治体の防災蓄電池購入補助',
    antiIslanding: 'JET認証（系統連系用は別途協議要）',
    meterRequirement: '逆潮流禁止（逆電力継電器RPRなしの直結不可）',
    windSafety: '台風時の出仕舞い（室内完全退避）必須 / 落下防止基準厳格',
    mountingRules: '管理規約でベランダ手すり私物設置禁止が一般的',
    summary:
      '内線規程・系統連系の壁によりコンセント直結は未認可。ポータブル電源直結の蓄電自給が主流。',
    coordinates: '36.2048, 138.2529',
    lastUpdated: '2026-09-30',
    x: 840,
    y: 195,
    labelDx: 14,
    labelDy: 4,
  },
  {
    id: 'usa',
    name: 'アメリカ',
    code: 'US',
    rating: '★☆☆☆☆',
    status: 'strict_code',
    statusLabel: 'NEC/電気工事規程',
    powerLimit: 'オフグリッド (逆潮流不可)',
    connectionMethod: 'オフグリッド蓄電',
    tenantRights: '規約・協議要',
    regulation: 'NEC Article 690 / UL 1741',
    costRange: '$800〜$1,500 (蓄電オフグリッドキット)',
    paybackYears: '回収困難 (屋根置き連系が主流)',
    baseLoadCoverage: '部分オフグリッド利用 (アウトドア・停電対策)',
    incentives: '連邦税額控除(ITC 30%)は屋根工事連動が主',
    antiIslanding: 'UL 1741 SB / NEC Rapid Shutdown (急速遮断)',
    meterRequirement: 'ユーティリティ連系協議・専門電気工事士の接続必須',
    windSafety: 'ハリケーン・竜巻地域での剛体耐風基準 (110mph以上)',
    mountingRules: 'コンセント直結は違法配線扱い / HOA(住民組合)の規約規制',
    summary:
      'NECの急速遮断(Rapid Shutdown)要件によりコンセント直結は原則不可。蓄電型オフグリッドキットが主流。',
    coordinates: '37.0902, -95.7129',
    lastUpdated: '2026-09-30',
    x: 215,
    y: 170,
    labelDx: -90,
    labelDy: 4,
  },
]
