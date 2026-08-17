// Mock data for the Living Energy UI prototype.
// All values are static/simulated — no backend or external API calls.

export type Region = {
  id: string
  label: string
  prefecture: string
}

export const REGIONS: Region[] = [
  { id: 'hokuto', label: '山梨県 北杜市', prefecture: '山梨県' },
  { id: 'setagaya', label: '東京都 世田谷区', prefecture: '東京都' },
  { id: 'koriyama', label: '福島県 郡山市', prefecture: '福島県' },
  { id: 'akita', label: '秋田県 秋田市', prefecture: '秋田県' },
]

export type WeatherState = {
  label: string
  icon: 'sun' | 'cloud-sun' | 'cloud'
  irradiance: number // W/m^2
}

export const WEATHER: WeatherState = {
  label: '快晴',
  icon: 'sun',
  irradiance: 850,
}

export type LivingCard = {
  id: string
  icon: 'laptop' | 'fan' | 'coffee' | 'smartphone'
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

export type Direction = '南' | '南東' | '南西' | '東' | '西'
export type RailingType = 'grid' | 'glass' | 'concrete'

export const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: '南', label: '南向き' },
  { value: '南東', label: '南東' },
  { value: '南西', label: '南西' },
  { value: '東', label: '東' },
  { value: '西', label: '西' },
]

export const RAILING_TYPES: { value: RailingType; label: string }[] = [
  { value: 'grid', label: '格子スチール' },
  { value: 'glass', label: 'ガラス' },
  { value: 'concrete', label: 'コンクリート壁' },
]

// Returns a suitability score (0-100) for the balcony simulator based on
// direction, railing type, and time of day.
export function computeBalconyScore(direction: Direction, railing: RailingType, hour: number): number {
  const directionScore: Record<Direction, number> = {
    南: 100,
    南東: 88,
    南西: 88,
    東: 68,
    西: 68,
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

export function recommendedKit(score: number): { panel: string; battery: string } {
  if (score >= 85) return { panel: '100W折りたたみパネル', battery: '500Whポータブル電源' }
  if (score >= 70) return { panel: '60W折りたたみパネル', battery: '300Whポータブル電源' }
  return { panel: '30W軽量パネル', battery: '150Whモバイル電源' }
}

export type NetworkModel = 'yamanashi' | 'fukushima'

export type NetworkNode = {
  id: string
  label: string
  sublabel: string
  kind: 'supply' | 'convert' | 'consume'
  icon: 'sun-medium' | 'wind' | 'droplets' | 'flame' | 'battery-charging' | 'building-2' | 'home' | 'fuel'
}

export type NetworkEdge = {
  from: string
  to: string
}

export const NETWORK_MODELS: Record<
  NetworkModel,
  { label: string; description: string; nodes: NetworkNode[]; edges: NetworkEdge[] }
> = {
  yamanashi: {
    label: '山梨 P2G 水素モデル',
    description: '北杜のメガソーラー余剰電力を米倉山のP2Gプラントで水素に変換し、地域に供給します。',
    nodes: [
      { id: 'solar', label: 'メガソーラー(北杜)', sublabel: '出力 12.4MW', kind: 'supply', icon: 'sun-medium' },
      { id: 'hydro', label: '小水力', sublabel: '出力 1.8MW', kind: 'supply', icon: 'droplets' },
      { id: 'p2g', label: '水電解P2G水素プラント', sublabel: '米倉山 / 変換効率 68%', kind: 'convert', icon: 'flame' },
      { id: 'storage', label: '定置型蓄電池', sublabel: '容量 4.2MWh', kind: 'convert', icon: 'battery-charging' },
      { id: 'city', label: '地元スマートシティ', sublabel: '世帯数 3,200', kind: 'consume', icon: 'building-2' },
      { id: 'station', label: '水素ステーション', sublabel: '供給 320kg/日', kind: 'consume', icon: 'fuel' },
      { id: 'home', label: '家庭', sublabel: '接続 8,600件', kind: 'consume', icon: 'home' },
    ],
    edges: [
      { from: 'solar', to: 'p2g' },
      { from: 'solar', to: 'storage' },
      { from: 'hydro', to: 'storage' },
      { from: 'p2g', to: 'station' },
      { from: 'storage', to: 'city' },
      { from: 'storage', to: 'home' },
    ],
  },
  fukushima: {
    label: '福島 広域VPPモデル',
    description: '郡山の風力とメガソーラーを束ね、広域VPP(バーチャルパワープラント)として需給を最適化します。',
    nodes: [
      { id: 'wind', label: '風力(郡山)', sublabel: '出力 22.6MW', kind: 'supply', icon: 'wind' },
      { id: 'solar', label: 'メガソーラー', sublabel: '出力 9.1MW', kind: 'supply', icon: 'sun-medium' },
      { id: 'hydro', label: '小水力', sublabel: '出力 2.3MW', kind: 'supply', icon: 'droplets' },
      { id: 'storage', label: '定置型蓄電池', sublabel: 'VPP統合 / 6.8MWh', kind: 'convert', icon: 'battery-charging' },
      { id: 'city', label: '地元スマートシティ', sublabel: '世帯数 5,400', kind: 'consume', icon: 'building-2' },
      { id: 'home', label: '家庭', sublabel: '接続 14,200件', kind: 'consume', icon: 'home' },
    ],
    edges: [
      { from: 'wind', to: 'storage' },
      { from: 'solar', to: 'storage' },
      { from: 'hydro', to: 'storage' },
      { from: 'storage', to: 'city' },
      { from: 'storage', to: 'home' },
    ],
  },
}

export type EnergyMix = {
  solar: number
  wind: number
  hydro: number
  biomass: number
}

export type PrefectureRank = {
  rank: number
  title: string // 横綱, 大関, 関脇, etc.
  side?: '東' | '西'
  prefecture: string
  selfSufficiency: number
  solarKw: number
  yoyGrowth: number
  mix: EnergyMix
}

export const PREFECTURE_RANKINGS: PrefectureRank[] = [
  {
    rank: 1,
    title: '横綱',
    side: '東',
    prefecture: '山梨県',
    selfSufficiency: 48.2,
    solarKw: 182000,
    yoyGrowth: 12.4,
    mix: { solar: 70, wind: 5, hydro: 25, biomass: 0 },
  },
  {
    rank: 1,
    title: '横綱',
    side: '西',
    prefecture: '秋田県',
    selfSufficiency: 45.1,
    solarKw: 96000,
    yoyGrowth: 9.8,
    mix: { solar: 15, wind: 65, hydro: 20, biomass: 0 },
  },
  {
    rank: 2,
    title: '大関',
    side: '東',
    prefecture: '福島県',
    selfSufficiency: 41.8,
    solarKw: 214000,
    yoyGrowth: 15.2,
    mix: { solar: 50, wind: 30, hydro: 15, biomass: 5 },
  },
  {
    rank: 2,
    title: '大関',
    side: '西',
    prefecture: '長野県',
    selfSufficiency: 39.6,
    solarKw: 143000,
    yoyGrowth: 8.1,
    mix: { solar: 45, wind: 5, hydro: 45, biomass: 5 },
  },
  {
    rank: 3,
    title: '関脇',
    side: '東',
    prefecture: '大分県',
    selfSufficiency: 34.5,
    solarKw: 88000,
    yoyGrowth: 6.3,
    mix: { solar: 40, wind: 5, hydro: 25, biomass: 30 },
  },
  {
    rank: 3,
    title: '関脇',
    side: '西',
    prefecture: '鹿児島県',
    selfSufficiency: 33.1,
    solarKw: 121000,
    yoyGrowth: 7.5,
    mix: { solar: 55, wind: 10, hydro: 15, biomass: 20 },
  },
  {
    rank: 4,
    title: '小結',
    side: '東',
    prefecture: '岩手県',
    selfSufficiency: 29.7,
    solarKw: 76000,
    yoyGrowth: 5.9,
    mix: { solar: 30, wind: 40, hydro: 25, biomass: 5 },
  },
  {
    rank: 4,
    title: '小結',
    side: '西',
    prefecture: '宮崎県',
    selfSufficiency: 28.3,
    solarKw: 69000,
    yoyGrowth: 4.7,
    mix: { solar: 60, wind: 5, hydro: 20, biomass: 15 },
  },
]

export type RankingMetric = 'selfSufficiency' | 'solarKw' | 'yoyGrowth'

export const RANKING_METRICS: { value: RankingMetric; label: string; unit: string }[] = [
  { value: 'selfSufficiency', label: '再エネ自給率', unit: '%' },
  { value: 'solarKw', label: '太陽光導入量', unit: 'kW' },
  { value: 'yoyGrowth', label: '伸び率(YoY)', unit: '%' },
]

const BANZUKE_TITLES = ['横綱', '大関', '関脇', '小結']

// Re-sorts the banzuke by the selected metric and reassigns sumo-style
// rank titles (横綱・大関・関脇・小結) and 東/西 sides based on the new order.
export function rankPrefectures(metric: RankingMetric): PrefectureRank[] {
  const sorted = [...PREFECTURE_RANKINGS].sort((a, b) => b[metric] - a[metric])
  return sorted.map((entry, index) => ({
    ...entry,
    rank: Math.floor(index / 2) + 1,
    title: BANZUKE_TITLES[Math.floor(index / 2)] ?? BANZUKE_TITLES[BANZUKE_TITLES.length - 1],
    side: index % 2 === 0 ? '東' : '西',
  }))
}
