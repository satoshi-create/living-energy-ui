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
