// Mock prefecture ranking. Static — no backend or external API calls.

export type EnergyMix = {
  solar: number
  wind: number
  hydro: number
  biomass: number
}

export type BanzukeSide = 'east' | 'west'
export type BanzukeTitle = 'yokozuna' | 'ozeki' | 'sekiwake' | 'komusubi'

export type PrefectureRank = {
  rank: number
  /** Locale-independent sumo rank ID. Labels: `common.banzuke.title.*` */
  title: BanzukeTitle
  /** Locale-independent side ID. Labels: `common.banzuke.side.*` */
  side?: BanzukeSide
  prefecture: string
  selfSufficiency: number
  solarKw: number
  yoyGrowth: number
  mix: EnergyMix
}

export const PREFECTURE_RANKINGS: PrefectureRank[] = [
  {
    rank: 1,
    title: 'yokozuna',
    side: 'east',
    prefecture: '山梨県',
    selfSufficiency: 48.2,
    solarKw: 182000,
    yoyGrowth: 12.4,
    mix: { solar: 70, wind: 5, hydro: 25, biomass: 0 },
  },
  {
    rank: 1,
    title: 'yokozuna',
    side: 'west',
    prefecture: '秋田県',
    selfSufficiency: 45.1,
    solarKw: 96000,
    yoyGrowth: 9.8,
    mix: { solar: 15, wind: 65, hydro: 20, biomass: 0 },
  },
  {
    rank: 2,
    title: 'ozeki',
    side: 'east',
    prefecture: '福島県',
    selfSufficiency: 41.8,
    solarKw: 214000,
    yoyGrowth: 15.2,
    mix: { solar: 50, wind: 30, hydro: 15, biomass: 5 },
  },
  {
    rank: 2,
    title: 'ozeki',
    side: 'west',
    prefecture: '長野県',
    selfSufficiency: 39.6,
    solarKw: 143000,
    yoyGrowth: 8.1,
    mix: { solar: 45, wind: 5, hydro: 45, biomass: 5 },
  },
  {
    rank: 3,
    title: 'sekiwake',
    side: 'east',
    prefecture: '大分県',
    selfSufficiency: 34.5,
    solarKw: 88000,
    yoyGrowth: 6.3,
    mix: { solar: 40, wind: 5, hydro: 25, biomass: 30 },
  },
  {
    rank: 3,
    title: 'sekiwake',
    side: 'west',
    prefecture: '鹿児島県',
    selfSufficiency: 33.1,
    solarKw: 121000,
    yoyGrowth: 7.5,
    mix: { solar: 55, wind: 10, hydro: 15, biomass: 20 },
  },
  {
    rank: 4,
    title: 'komusubi',
    side: 'east',
    prefecture: '岩手県',
    selfSufficiency: 29.7,
    solarKw: 76000,
    yoyGrowth: 5.9,
    mix: { solar: 30, wind: 40, hydro: 25, biomass: 5 },
  },
  {
    rank: 4,
    title: 'komusubi',
    side: 'west',
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

const BANZUKE_TITLES: BanzukeTitle[] = ['yokozuna', 'ozeki', 'sekiwake', 'komusubi']

// Re-sorts the banzuke by the selected metric and reassigns sumo-style
// rank titles and east/west sides based on the new order.
export function rankPrefectures(metric: RankingMetric): PrefectureRank[] {
  const sorted = [...PREFECTURE_RANKINGS].sort((a, b) => b[metric] - a[metric])
  return sorted.map((entry, index) => ({
    ...entry,
    rank: Math.floor(index / 2) + 1,
    title: BANZUKE_TITLES[Math.floor(index / 2)] ?? BANZUKE_TITLES[BANZUKE_TITLES.length - 1],
    side: index % 2 === 0 ? 'east' : 'west',
  }))
}
