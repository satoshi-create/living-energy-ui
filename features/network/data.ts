// Mock for react-flow-visualizer / modular-microgrid-vn. Static — no API.

export type NetworkModel = "yamanashi" | "fukushima"

export type NetworkNodeStatus = "normal" | "watch"

export type NetworkNode = {
  id: string
  label: string
  sublabel: string
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
  description: string
  nodes: NetworkNode[]
  edges: NetworkEdge[]
}

export const NETWORK_MODELS: Record<NetworkModel, NetworkModelConfig> = {
  yamanashi: {
    label: "山梨 P2G 水素モデル",
    description: "北杜のメガソーラー余剰電力を米倉山のP2Gプラントで水素に変換し、地域に供給します。",
    nodes: [
      { id: "solar", label: "メガソーラー(北杜)", sublabel: "出力 12.4MW", kind: "supply", icon: "sun-medium" },
      { id: "hydro", label: "小水力", sublabel: "出力 1.8MW", kind: "supply", icon: "droplets" },
      { id: "p2g", label: "水電解P2G水素プラント", sublabel: "米倉山 / 変換効率 68%", kind: "convert", icon: "flame" },
      { id: "storage", label: "定置型蓄電池", sublabel: "容量 4.2MWh", kind: "convert", icon: "battery-charging" },
      { id: "city", label: "地元スマートシティ", sublabel: "世帯数 3,200", kind: "consume", icon: "building-2" },
      { id: "station", label: "水素ステーション", sublabel: "供給 320kg/日", kind: "consume", icon: "fuel" },
      { id: "home", label: "家庭", sublabel: "接続 8,600件", kind: "consume", icon: "home" },
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
    description: "郡山の風力とメガソーラーを束ね、広域VPP(バーチャルパワープラント)として需給を最適化します。",
    nodes: [
      { id: "wind", label: "風力(郡山)", sublabel: "出力 22.6MW", kind: "supply", icon: "wind" },
      { id: "solar", label: "メガソーラー", sublabel: "出力 9.1MW", kind: "supply", icon: "sun-medium" },
      { id: "hydro", label: "小水力", sublabel: "出力 2.3MW", kind: "supply", icon: "droplets" },
      { id: "storage", label: "定置型蓄電池", sublabel: "VPP統合 / 6.8MWh", kind: "convert", icon: "battery-charging" },
      { id: "city", label: "地元スマートシティ", sublabel: "世帯数 5,400", kind: "consume", icon: "building-2" },
      { id: "home", label: "家庭", sublabel: "接続 14,200件", kind: "consume", icon: "home" },
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
