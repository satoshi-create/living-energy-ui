// Mock for living-sense-ui. Static — no backend or external API calls.

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
