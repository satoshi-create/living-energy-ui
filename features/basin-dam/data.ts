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

