// Mock for react-flow-visualizer / modular-microgrid-vn. Static — no API.

export type NetworkLocale = "ja" | "en"

export type NetworkModel = "yamanashi" | "fukushima"

/** Japan RE map filter / pin category */
export type ModelCategory = "p2g" | "vpp" | "microgrid" | "self-line"

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
  modelCategory: ModelCategory
  scaleLabel: string
  scaleLabelEn?: string
  /** Demo self-sufficiency ratio (0–100) */
  selfSufficiencyPct: number
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
  methodP2g: { ja: "P2G水素循環", en: "P2G Hydrogen Cycle" },
  methodVpp: { ja: "系統協調型VPP", en: "Grid-coordinated VPP" },
  methodMicrogrid: { ja: "マイクログリッド自営線", en: "Microgrid Private Line" },
  methodSelfLine: { ja: "自営線マイクログリッド", en: "Self-owned Line Microgrid" },
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
  japanMapFilterAll: { ja: "全モデル", en: "All models" },
  japanMapFilterP2g: { ja: "P2G水素", en: "P2G Hydrogen" },
  japanMapFilterVpp: { ja: "広域VPP", en: "Regional VPP" },
  japanMapFilterMicrogrid: { ja: "マイクログリッド", en: "Microgrid" },
  japanMapFilterSelfLine: { ja: "自営線", en: "Self-owned line" },
  japanMapZoomIn: { ja: "拡大", en: "Zoom in" },
  japanMapZoomOut: { ja: "縮小", en: "Zoom out" },
  japanMapReset: { ja: "表示をリセット", en: "Reset view" },
  japanMapFilterAria: { ja: "モデル種別フィルタ", en: "Model category filter" },
  japanMapRegionAria: { ja: "地方別", en: "Region" },
  japanMapRegionAll: { ja: "全地方", en: "All regions" },
  japanMapRegionTohoku: { ja: "東北", en: "Tohoku" },
  japanMapRegionKanto: { ja: "関東", en: "Kanto" },
  japanMapRegionChubu: { ja: "中部", en: "Chubu" },
  japanMapRegionKansai: { ja: "関西", en: "Kansai" },
  japanMapRegionKyushu: { ja: "九州", en: "Kyushu" },
  japanMapAttribution: {
    ja: "地図: 地球地図日本",
    en: "Map: Global Map Japan",
  },
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
  yamanashi: {
    label: "山梨 P2G 水素モデル",
    labelEn: "Yamanashi P2G Hydrogen Model",
    description:
      "北杜のメガソーラー余剰電力を米倉山のP2Gプラントで水素に変換し、地域に供給します。",
    descriptionEn:
      "Surplus power from Hokuto mega-solar is converted to hydrogen at the Yume-sakura P2G plant and supplied locally.",
    coordinates: [138.4239, 35.8667],
    regionName: "山梨県 北杜市",
    regionNameEn: "Hokuto, Yamanashi",
    modelCategory: "p2g",
    scaleLabel: "12.4MW / P2G",
    scaleLabelEn: "12.4MW / P2G",
    selfSufficiencyPct: 78,
    nodes: [
      {
        id: "solar",
        label: "メガソーラー(北杜)",
        labelEn: "Mega-solar (Hokuto)",
        sublabel: "出力 12.4MW",
        sublabelEn: "Output 12.4MW",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "hydro",
        label: "小水力",
        labelEn: "Small hydro",
        sublabel: "出力 1.8MW",
        sublabelEn: "Output 1.8MW",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "p2g",
        label: "水電解P2G水素プラント",
        labelEn: "Electrolysis P2G Hydrogen Plant",
        sublabel: "米倉山 / 変換効率 68%",
        sublabelEn: "Yume-sakura / Efficiency 68%",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "storage",
        label: "定置型蓄電池",
        labelEn: "Stationary Battery",
        sublabel: "容量 4.2MWh",
        sublabelEn: "Capacity 4.2MWh",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "city",
        label: "地元スマートシティ",
        labelEn: "Local Smart City",
        sublabel: "世帯数 3,200",
        sublabelEn: "3,200 households",
        kind: "consume",
        icon: "building-2",
      },
      {
        id: "station",
        label: "水素ステーション",
        labelEn: "Hydrogen Station",
        sublabel: "供給 320kg/日",
        sublabelEn: "Supply 320kg/day",
        kind: "consume",
        icon: "fuel",
      },
      {
        id: "home",
        label: "家庭",
        labelEn: "Homes",
        sublabel: "接続 8,600件",
        sublabelEn: "8,600 connections",
        kind: "consume",
        icon: "home",
      },
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
    labelEn: "Fukushima Regional VPP Model",
    description:
      "郡山の風力とメガソーラーを束ね、広域VPP(バーチャルパワープラント)として需給を最適化します。",
    descriptionEn:
      "Wind and mega-solar around Koriyama are aggregated into a regional VPP (virtual power plant) to optimize supply and demand.",
    coordinates: [140.3595, 37.4005],
    regionName: "福島県 郡山市",
    regionNameEn: "Koriyama, Fukushima",
    modelCategory: "vpp",
    scaleLabel: "22.6MW / VPP",
    scaleLabelEn: "22.6MW / VPP",
    selfSufficiencyPct: 64,
    nodes: [
      {
        id: "wind",
        label: "風力(郡山)",
        labelEn: "Wind (Koriyama)",
        sublabel: "出力 22.6MW",
        sublabelEn: "Output 22.6MW",
        kind: "supply",
        icon: "wind",
      },
      {
        id: "solar",
        label: "メガソーラー",
        labelEn: "Mega-solar",
        sublabel: "出力 9.1MW",
        sublabelEn: "Output 9.1MW",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "hydro",
        label: "小水力",
        labelEn: "Small hydro",
        sublabel: "出力 2.3MW",
        sublabelEn: "Output 2.3MW",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "storage",
        label: "定置型蓄電池",
        labelEn: "Stationary Battery",
        sublabel: "VPP統合 / 6.8MWh",
        sublabelEn: "VPP integrated / 6.8MWh",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "city",
        label: "地元スマートシティ",
        labelEn: "Local Smart City",
        sublabel: "世帯数 5,400",
        sublabelEn: "5,400 households",
        kind: "consume",
        icon: "building-2",
      },
      {
        id: "home",
        label: "家庭",
        labelEn: "Homes",
        sublabel: "接続 14,200件",
        sublabelEn: "14,200 connections",
        kind: "consume",
        icon: "home",
      },
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

export function matchesModelCategory(
  category: ModelCategory,
  filter: ModelCategory | "all"
): boolean {
  return filter === "all" || category === filter
}

export function categoryColor(category: ModelCategory): string {
  switch (category) {
    case "p2g":
      return "#10b981"
    case "vpp":
      return "#3b82f6"
    case "microgrid":
      return "#8b5cf6"
    case "self-line":
      return "#f59e0b"
    default:
      return "#6b7280"
  }
}

export function networkMethodKey(
  category: ModelCategory
): "methodP2g" | "methodVpp" | "methodMicrogrid" | "methodSelfLine" {
  switch (category) {
    case "p2g":
      return "methodP2g"
    case "vpp":
      return "methodVpp"
    case "microgrid":
      return "methodMicrogrid"
    case "self-line":
      return "methodSelfLine"
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
