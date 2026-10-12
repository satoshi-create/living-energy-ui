// Mock for react-flow-visualizer / modular-microgrid-vn. Static — no API.

export type NetworkLocale = "ja" | "en"

/** Japan map site id — sourced from Notion「再生可能エネルギーの導入事例（日本）」 */
export type NetworkModel =
  | "ichinoseki-solar-sharing"
  | "goto-tidal"
  | "goto-floating-wind"
  | "kairyu-ocean-current"
  | "fh2r"
  | "gifu-biomass"
  | "yumesakura-p2g"
  | "choshi-offshore-wind"
  | "tomakomai-biomass"
  | "kumejima-otec"
  | "katatsumuri-geothermal"
  | "wasabizawa-geothermal"
  | "nagayoshigawa-hydro"
  | "hiratsuka-wave"

/** Japan RE map filter / pin category (再エネ種別) */
export type ModelCategory =
  | "solar"
  | "wind"
  | "ocean"
  | "biomass"
  | "geothermal"
  | "hydro"
  | "hydrogen"

/** Macro region for map camera / filter */
export type MapRegionFocus =
  | "all"
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "kyushu"
  | "okinawa"
  | "ocean"

/** ステータス（Notion select） */
export type CaseStatus =
  | "commercial"
  | "demo"
  | "planning"
  | "construction"

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
  /** Primary pin color / filter category */
  modelCategory: ModelCategory
  /** All RE types on the case (Notion multi_select) */
  energyTypes: ModelCategory[]
  mapRegion: Exclude<MapRegionFocus, "all">
  caseStatus: CaseStatus
  scaleLabel: string
  scaleLabelEn?: string
  /** Demo self-sufficiency ratio (0–100); omit when not meaningful */
  selfSufficiencyPct?: number
  partners?: string
  partnersEn?: string
  paradigmPoint: string
  paradigmPointEn?: string
  sourceUrl?: string | null
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
  methodSolar: { ja: "太陽光・ソーラーシェアリング", en: "Solar / agrivoltaics" },
  methodWind: { ja: "風力発電", en: "Wind power" },
  methodOcean: { ja: "海洋エネルギー", en: "Ocean energy" },
  methodBiomass: { ja: "バイオマス発電", en: "Biomass power" },
  methodGeothermal: { ja: "地熱発電", en: "Geothermal power" },
  methodHydro: { ja: "中小水力発電", en: "Small hydro" },
  methodHydrogen: { ja: "水素・P2G", en: "Hydrogen / P2G" },
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
  japanMapFilterAll: { ja: "全種別", en: "All types" },
  japanMapFilterSolar: { ja: "太陽光", en: "Solar" },
  japanMapFilterWind: { ja: "風力", en: "Wind" },
  japanMapFilterOcean: { ja: "海洋", en: "Ocean" },
  japanMapFilterBiomass: { ja: "バイオマス", en: "Biomass" },
  japanMapFilterGeothermal: { ja: "地熱", en: "Geothermal" },
  japanMapFilterHydro: { ja: "中小水力", en: "Small hydro" },
  japanMapFilterHydrogen: { ja: "水素", en: "Hydrogen" },
  japanMapZoomIn: { ja: "拡大", en: "Zoom in" },
  japanMapZoomOut: { ja: "縮小", en: "Zoom out" },
  japanMapReset: { ja: "表示をリセット", en: "Reset view" },
  japanMapFilterAria: { ja: "再エネ種別フィルタ", en: "RE type filter" },
  japanMapRegionAria: { ja: "地方別", en: "Region" },
  japanMapRegionAll: { ja: "全地方", en: "All regions" },
  japanMapRegionHokkaido: { ja: "北海道", en: "Hokkaido" },
  japanMapRegionTohoku: { ja: "東北", en: "Tohoku" },
  japanMapRegionKanto: { ja: "関東", en: "Kanto" },
  japanMapRegionChubu: { ja: "中部", en: "Chubu" },
  japanMapRegionKansai: { ja: "関西", en: "Kansai" },
  japanMapRegionKyushu: { ja: "九州", en: "Kyushu" },
  japanMapRegionOkinawa: { ja: "沖縄", en: "Okinawa" },
  japanMapRegionOcean: { ja: "海洋", en: "Offshore" },
  japanMapAttribution: {
    ja: "地図: 地球地図日本 / 事例: Notion導入事例DB",
    en: "Map: Global Map Japan / Cases: Notion RE DB",
  },
  caseStatus: { ja: "ステータス", en: "Status" },
  casePartners: { ja: "参画・出資", en: "Partners" },
  caseParadigm: {
    ja: "新旧パラダイムからみたポイント",
    en: "Old vs new power-system lens",
  },
  caseSource: { ja: "参考リンク", en: "Source" },
  caseEnergyTypes: { ja: "再エネ種別", en: "RE types" },
  statusCommercial: { ja: "商用運転", en: "Commercial" },
  statusDemo: { ja: "実証事業", en: "Demonstration" },
  statusPlanning: { ja: "計画段階", en: "Planning" },
  statusConstruction: { ja: "建設中", en: "Under construction" },
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
  "ichinoseki-solar-sharing": {
    label: "一関市吉高太陽光発電所（ソーラーシェアリング）",
    labelEn: "Ichinoseki Yoshitaka Solar (agrivoltaics)",
    description:
      "農業と発電を重ねるソーラーシェアリング。太陽光由来の電力・水素活用で、土地リソースを地域内で最適化します。",
    descriptionEn:
      "Agrivoltaics stacking farming and generation. Solar power and hydrogen use optimize local land resources.",
    coordinates: [141.13, 38.93],
    regionName: "岩手県 一関市",
    regionNameEn: "Ichinoseki, Iwate",
    modelCategory: "hydrogen",
    energyTypes: ["hydrogen", "solar"],
    mapRegion: "tohoku",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · 水素/太陽光",
    scaleLabelEn: "Commercial · H₂/Solar",
    partners: "リニューアブル・ジャパン、東急不動産 等",
    partnersEn: "Renewable Japan, Tokyu Land, et al.",
    paradigmPoint: "土地の多目的利用: 農業と発電の共生による地域リソースの最適化。",
    paradigmPointEn:
      "Multi-use land: co-locating farming and generation to optimize regional resources.",
    sourceUrl: "http://solar-sharing.net/archives/598",
    nodes: [
      {
        id: "solar",
        label: "ソーラーシェアリング",
        labelEn: "Agrivoltaics array",
        sublabel: "営農と発電の共生",
        sublabelEn: "Farming + generation",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "h2",
        label: "水素活用",
        labelEn: "Hydrogen use",
        sublabel: "再エネ由来水素",
        sublabelEn: "RE-derived hydrogen",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "farm",
        label: "地域・営農",
        labelEn: "Local farming",
        sublabel: "土地の多目的利用",
        sublabelEn: "Multi-use land",
        kind: "consume",
        icon: "sprout",
      },
    ],
    edges: [
      { from: "solar", to: "h2" },
      { from: "solar", to: "farm" },
      { from: "h2", to: "farm" },
    ],
  },
  "goto-tidal": {
    label: "五島市奈留瀬戸 潮流発電装置",
    labelEn: "Goto Narushima tidal generator",
    description:
      "潮の満ち引きという周期的な物理現象を電源化する潮流発電の実証。予測精度の高い海洋再エネです。",
    descriptionEn:
      "Tidal demonstration that turns predictable ebb-and-flow physics into power—highly forecastable ocean RE.",
    coordinates: [128.93, 32.84],
    regionName: "長崎県 五島市",
    regionNameEn: "Goto, Nagasaki",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "kyushu",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "九電みらいエナジー 等",
    partnersEn: "Kyuden Mirai Energy, et al.",
    paradigmPoint:
      "周期的エネルギー: 潮の満ち引きという確実な物理現象に基づく、予測精度の高い再エネ。",
    paradigmPointEn:
      "Periodic energy: tidal cycles make this ocean RE highly predictable.",
    sourceUrl: null,
    nodes: [
      {
        id: "tidal",
        label: "潮流発電装置",
        labelEn: "Tidal generator",
        sublabel: "奈留瀬戸",
        sublabelEn: "Narushima Strait",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "grid",
        label: "離島系統",
        labelEn: "Island grid",
        sublabel: "地域供給",
        sublabelEn: "Local supply",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "tidal", to: "grid" }],
  },
  "goto-floating-wind": {
    label: "五島市沖 商用浮体式洋上ウィンドファーム",
    labelEn: "Goto commercial floating offshore wind",
    description:
      "水深の深い海域でも発電できる浮体式洋上風力。日本の地理的制約を突破するフロンティアです。",
    descriptionEn:
      "Floating offshore wind for deeper waters—pushing past Japan’s geographic constraints.",
    coordinates: [128.7, 32.7],
    regionName: "長崎県 五島市沖",
    regionNameEn: "Off Goto, Nagasaki",
    modelCategory: "wind",
    energyTypes: ["wind"],
    mapRegion: "kyushu",
    caseStatus: "planning",
    scaleLabel: "計画段階 · 風力",
    scaleLabelEn: "Planning · Wind",
    partners: "戸田建設コンソーシアム、INPEX",
    partnersEn: "Toda Construction consortium, INPEX",
    paradigmPoint:
      "フロンティア拡大: 水深の深い海域での発電を可能にし、日本の地理的制約を突破。",
    paradigmPointEn:
      "Frontier expansion: generation in deeper seas beyond Japan’s land/grid limits.",
    sourceUrl:
      "https://www.toda.co.jp/business/ecology/special/offshorewind/index.html",
    nodes: [
      {
        id: "wind",
        label: "浮体式洋上風力",
        labelEn: "Floating offshore wind",
        sublabel: "五島市沖",
        sublabelEn: "Off Goto",
        kind: "supply",
        icon: "wind",
      },
      {
        id: "island",
        label: "離島・地域需要",
        labelEn: "Island demand",
        sublabel: "基幹電源化",
        sublabelEn: "Toward baseload role",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [{ from: "wind", to: "island" }],
  },
  "kairyu-ocean-current": {
    label: "海流発電実証機「かいりゅう」",
    labelEn: "Kairyu ocean-current demo",
    description:
      "黒潮など季節変動の少ない海流を利用する実証機。極めて安定した新世代の海洋電源を狙います。",
    descriptionEn:
      "Demo turbine using steady currents like the Kuroshio—aiming for highly stable ocean power.",
    coordinates: [130.0, 30.0],
    regionName: "黒潮海域（海洋）",
    regionNameEn: "Kuroshio waters (offshore)",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "ocean",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "IHI、NEDO",
    partnersEn: "IHI, NEDO",
    paradigmPoint:
      "予測可能性: 季節変動の少ない黒潮等の海流を利用した、極めて安定した新世代電源。",
    paradigmPointEn:
      "Predictability: Kuroshio-class currents offer unusually stable next-gen power.",
    sourceUrl: null,
    nodes: [
      {
        id: "current",
        label: "海流タービン",
        labelEn: "Ocean-current turbine",
        sublabel: "かいりゅう",
        sublabelEn: "Kairyu",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "demo",
        label: "実証評価",
        labelEn: "Demo evaluation",
        sublabel: "NEDO連携",
        sublabelEn: "NEDO partnership",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "current", to: "demo" }],
  },
  fh2r: {
    label: "福島水素エネルギー研究フィールド (FH2R)",
    labelEn: "Fukushima Hydrogen Energy Research Field (FH2R)",
    description:
      "再エネ由来の大規模グリーン水素で、変動する太陽光を水素という「物理パケット」に変換し供給網を構築します。",
    descriptionEn:
      "Large-scale green hydrogen from RE—turning variable solar into a physical energy packet for supply networks.",
    coordinates: [141.0, 37.48],
    regionName: "福島県 浪江町",
    regionNameEn: "Namie, Fukushima",
    modelCategory: "hydrogen",
    energyTypes: ["hydrogen", "solar"],
    mapRegion: "tohoku",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 水素/太陽光",
    scaleLabelEn: "Demo · H₂/Solar",
    partners: "NEDO・参画企業コンソーシアム",
    partnersEn: "NEDO & industry consortium",
    paradigmPoint:
      "大規模グリーン水素: 再エネ由来水素による大規模な脱炭素エネルギー供給網の構築。",
    paradigmPointEn:
      "Large-scale green hydrogen: RE-derived H₂ building a decarbonized supply network.",
    sourceUrl: "https://www.nedo.go.jp/news/press/AA5_101293.html",
    selfSufficiencyPct: 64,
    nodes: [
      {
        id: "solar",
        label: "メガソーラー",
        labelEn: "Mega-solar",
        sublabel: "再エネ電源",
        sublabelEn: "RE supply",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "electrolysis",
        label: "水電解水素プラント",
        labelEn: "Electrolysis plant",
        sublabel: "グリーン水素製造",
        sublabelEn: "Green H₂ production",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "storage",
        label: "水素貯蔵",
        labelEn: "Hydrogen storage",
        sublabel: "時間シフト",
        sublabelEn: "Time shifting",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "demand",
        label: "地域・産業需要",
        labelEn: "Local / industry demand",
        sublabel: "脱炭素供給",
        sublabelEn: "Decarbonized supply",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [
      { from: "solar", to: "electrolysis" },
      { from: "electrolysis", to: "storage" },
      { from: "storage", to: "demand" },
    ],
  },
  "gifu-biomass": {
    label: "岐阜バイオマスパワー発電所",
    labelEn: "Gifu Biomass Power Plant",
    description:
      "林業と連携したバイオマス発電。24時間安定した再エネとして地域産業とエネルギーを垂直統合します。",
    descriptionEn:
      "Forestry-linked biomass—24/7 renewable power vertically integrating regional industry and energy.",
    coordinates: [136.72, 35.39],
    regionName: "岐阜県",
    regionNameEn: "Gifu Prefecture",
    modelCategory: "biomass",
    energyTypes: ["biomass"],
    mapRegion: "chubu",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · バイオマス",
    scaleLabelEn: "Commercial · Biomass",
    partners: "バイオマスエナジー東海、岐阜バイオマスパワー",
    partnersEn: "Biomass Energy Tokai, Gifu Biomass Power",
    paradigmPoint:
      "産業連携: 林業とエネルギー産業の垂直統合による地域経済の活性化。",
    paradigmPointEn:
      "Industry linkage: vertical integration of forestry and energy for local economies.",
    sourceUrl: "http://www.bio-gifu.co.jp/",
    nodes: [
      {
        id: "fuel",
        label: "木質バイオマス",
        labelEn: "Woody biomass",
        sublabel: "地域林産資源",
        sublabelEn: "Regional forest resources",
        kind: "supply",
        icon: "sprout",
      },
      {
        id: "plant",
        label: "バイオマス発電",
        labelEn: "Biomass plant",
        sublabel: "ベースロード",
        sublabelEn: "Baseload",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "region",
        label: "地域需要",
        labelEn: "Regional demand",
        sublabel: "産業・生活",
        sublabelEn: "Industry & homes",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [
      { from: "fuel", to: "plant" },
      { from: "plant", to: "region" },
    ],
  },
  "yumesakura-p2g": {
    label: "米倉山 P2G システム実証研究",
    labelEn: "Yumesakura P2G demonstration",
    description:
      "変動する太陽光を水素に変換（P2G）し、時間・場所の制約を超えて地域にエネルギーを届けます。",
    descriptionEn:
      "Converts variable solar to hydrogen (P2G), delivering energy beyond time and place constraints.",
    coordinates: [138.68, 35.6],
    regionName: "山梨県 甲府市（米倉山）",
    regionNameEn: "Kofu (Yumesakura), Yamanashi",
    modelCategory: "hydrogen",
    energyTypes: ["hydrogen", "solar"],
    mapRegion: "chubu",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 水素/太陽光",
    scaleLabelEn: "Demo · H₂/Solar",
    selfSufficiencyPct: 78,
    partners: "山梨県、東レ、東京電力HD、東光高岳、NEDO",
    partnersEn: "Yamanashi Pref., Toray, TEPCO HD, TAKAOKA TOKO, NEDO",
    paradigmPoint:
      "エネルギー貯蔵: 変動性の高い再エネを水素に変換（P2G）し、時間・場所の制約を克服。",
    paradigmPointEn:
      "Energy storage: P2G turns variable RE into hydrogen, overcoming time/place limits.",
    sourceUrl: null,
    nodes: [
      {
        id: "solar",
        label: "太陽光（米倉山）",
        labelEn: "Solar (Yumesakura)",
        sublabel: "変動電源",
        sublabelEn: "Variable supply",
        kind: "supply",
        icon: "sun-medium",
      },
      {
        id: "p2g",
        label: "水電解P2G",
        labelEn: "Electrolysis P2G",
        sublabel: "電力→水素",
        sublabelEn: "Power → H₂",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "storage",
        label: "水素・蓄電バッファ",
        labelEn: "H₂ / battery buffer",
        sublabel: "時間シフト",
        sublabelEn: "Time shifting",
        kind: "convert",
        icon: "battery-charging",
      },
      {
        id: "station",
        label: "水素利用",
        labelEn: "Hydrogen use",
        sublabel: "モビリティ・熱",
        sublabelEn: "Mobility & heat",
        kind: "consume",
        icon: "fuel",
      },
      {
        id: "home",
        label: "地域需要",
        labelEn: "Local demand",
        sublabel: "家庭・施設",
        sublabelEn: "Homes & facilities",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "solar", to: "p2g" },
      { from: "solar", to: "storage" },
      { from: "p2g", to: "station" },
      { from: "storage", to: "home" },
    ],
  },
  "choshi-offshore-wind": {
    label: "銚子沖洋上ウィンドファーム",
    labelEn: "Choshi offshore wind farm",
    description:
      "海洋空間を使った大規模洋上風力。中央集権型グリッドに匹敵する再エネ供給を目指します。",
    descriptionEn:
      "Large offshore wind using ocean space—aiming for RE supply at central-grid scale.",
    coordinates: [140.89, 35.73],
    regionName: "千葉県 銚子沖",
    regionNameEn: "Off Choshi, Chiba",
    modelCategory: "wind",
    energyTypes: ["wind"],
    mapRegion: "kanto",
    caseStatus: "planning",
    scaleLabel: "計画段階 · 風力",
    scaleLabelEn: "Planning · Wind",
    partners:
      "東京電力、オーステッド、三菱商事、シーテック、Amazon、GE Renewable Energy、NEDO",
    partnersEn:
      "TEPCO, Ørsted, Mitsubishi Corp, C-Tech, Amazon, GE Renewable Energy, NEDO",
    paradigmPoint:
      "大規模電源化: 海洋空間を利用した、中央集権型グリッドに匹敵する大規模再エネ供給。",
    paradigmPointEn:
      "Utility-scale supply: ocean space enabling RE at central-grid magnitude.",
    sourceUrl: "https://www.chsow.co.jp/",
    nodes: [
      {
        id: "wind",
        label: "洋上風力",
        labelEn: "Offshore wind",
        sublabel: "銚子沖",
        sublabelEn: "Off Choshi",
        kind: "supply",
        icon: "wind",
      },
      {
        id: "grid",
        label: "系統・需要地",
        labelEn: "Grid / demand hubs",
        sublabel: "首都圏連携",
        sublabelEn: "Greater Tokyo link",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "wind", to: "grid" }],
  },
  "tomakomai-biomass": {
    label: "苫小牧バイオマス発電所",
    labelEn: "Tomakomai Biomass Power Plant",
    description:
      "未利用間伐材を活かす地産地消型ベースロード。森林整備とエネルギーを循環させます。",
    descriptionEn:
      "Local baseload from unused thinnings—circulating forest stewardship into energy.",
    coordinates: [141.61, 42.63],
    regionName: "北海道 苫小牧市",
    regionNameEn: "Tomakomai, Hokkaido",
    modelCategory: "biomass",
    energyTypes: ["biomass"],
    mapRegion: "hokkaido",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · バイオマス",
    scaleLabelEn: "Commercial · Biomass",
    partners: "三井物産、イワクラ、住友林業 等",
    partnersEn: "Mitsui & Co., Iwakura, Sumitomo Forestry, et al.",
    paradigmPoint:
      "地域資源循環: 未利用間伐材の活用による、地産地消型のベースロード電源。",
    paradigmPointEn:
      "Local resource loops: unused thinnings as community-scale baseload.",
    sourceUrl: null,
    nodes: [
      {
        id: "forest",
        label: "間伐材・林地残材",
        labelEn: "Thinnings / residues",
        sublabel: "森林整備と連携",
        sublabelEn: "Linked to forestry",
        kind: "supply",
        icon: "sprout",
      },
      {
        id: "plant",
        label: "バイオマス発電",
        labelEn: "Biomass plant",
        sublabel: "地産地消ベースロード",
        sublabelEn: "Local baseload",
        kind: "convert",
        icon: "flame",
      },
      {
        id: "city",
        label: "苫小牧・地域需要",
        labelEn: "Tomakomai demand",
        sublabel: "市戦略と連携",
        sublabelEn: "City RE strategy",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [
      { from: "forest", to: "plant" },
      { from: "plant", to: "city" },
    ],
  },
  "kumejima-otec": {
    label: "海洋温度差発電（久米島）",
    labelEn: "OTEC (Kumejima)",
    description:
      "表層と深層の温度差を使うOTEC。24時間稼働しうる究極の安定型海洋再エネです。",
    descriptionEn:
      "OTEC using surface–deep temperature gaps—an ultra-stable, potentially 24/7 ocean RE.",
    coordinates: [126.8, 26.34],
    regionName: "沖縄県 久米島",
    regionNameEn: "Kumejima, Okinawa",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "okinawa",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "沖縄県、IHIプラント建設、ゼネシス 等",
    partnersEn: "Okinawa Pref., IHI Plant Construction, Xenesys, et al.",
    paradigmPoint:
      "24時間稼働: 表層と深層の温度差を利用した、究極の安定型再エネ（OTEC）。",
    paradigmPointEn:
      "24/7 potential: OTEC from surface–deep temperature difference—ultra-stable RE.",
    sourceUrl: null,
    nodes: [
      {
        id: "otec",
        label: "OTECプラント",
        labelEn: "OTEC plant",
        sublabel: "温度差発電",
        sublabelEn: "Thermal gradient",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "island",
        label: "離島需要",
        labelEn: "Island demand",
        sublabel: "久米島",
        sublabelEn: "Kumejima",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [{ from: "otec", to: "island" }],
  },
  "katatsumuri-geothermal": {
    label: "かたつむり山発電所（仮称）",
    labelEn: "Katatsumuri-yama geothermal (provisional)",
    description:
      "化石燃料開発の掘削・探査技術を地熱へ転用する建設中プロジェクト。純国産の安定電源を増やします。",
    descriptionEn:
      "Under-construction project reusing oil/gas drilling skills for geothermal—growing stable domestic power.",
    coordinates: [140.72, 39.16],
    regionName: "秋田県 湯沢市",
    regionNameEn: "Yuzawa, Akita",
    modelCategory: "geothermal",
    energyTypes: ["geothermal"],
    mapRegion: "tohoku",
    caseStatus: "construction",
    scaleLabel: "建設中 · 地熱",
    scaleLabelEn: "Building · Geothermal",
    partners: "出光興産、INPEX、三井石油開発",
    partnersEn: "Idemitsu, INPEX, MOECO",
    paradigmPoint:
      "資源開発の転換: 化石燃料開発の技術（掘削・探査）を地熱というクリーンエネルギーへ転用。",
    paradigmPointEn:
      "Resource pivot: oil/gas drilling & exploration skills applied to geothermal.",
    sourceUrl:
      "https://www.inpex.com/business/project/katatsumuri-yama.html",
    nodes: [
      {
        id: "geo",
        label: "地熱井・蒸気",
        labelEn: "Geothermal wells",
        sublabel: "かたつむり山",
        sublabelEn: "Katatsumuri-yama",
        kind: "supply",
        icon: "flame",
      },
      {
        id: "plant",
        label: "地熱発電所",
        labelEn: "Geothermal plant",
        sublabel: "建設中",
        sublabelEn: "Under construction",
        kind: "convert",
        icon: "building-2",
      },
      {
        id: "grid",
        label: "系統・地域",
        labelEn: "Grid / region",
        sublabel: "ベースロード",
        sublabelEn: "Baseload",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "geo", to: "plant" },
      { from: "plant", to: "grid" },
    ],
  },
  "wasabizawa-geothermal": {
    label: "山葵沢地熱発電所",
    labelEn: "Wasabizawa Geothermal Power Station",
    description:
      "天候に左右されない純国産ベースロード。地熱の安定性が地域の電力の安心感につながります。",
    descriptionEn:
      "Weather-independent domestic baseload—geothermal stability as regional power security.",
    coordinates: [140.75, 39.05],
    regionName: "秋田県 湯沢市",
    regionNameEn: "Yuzawa, Akita",
    modelCategory: "geothermal",
    energyTypes: ["geothermal"],
    mapRegion: "tohoku",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · 地熱",
    scaleLabelEn: "Commercial · Geothermal",
    partners: "電源開発、三菱マテリアル、三菱ガス化学",
    partnersEn: "J-POWER, Mitsubishi Materials, Mitsubishi Gas Chemical",
    paradigmPoint:
      "安定性: 天候に左右されない、純国産の強力なベースロード電源。",
    paradigmPointEn:
      "Stability: weather-independent, strong domestic baseload.",
    sourceUrl: "https://yuzawa-geothermal.com/wasabizawa-power-station/",
    nodes: [
      {
        id: "geo",
        label: "地熱資源",
        labelEn: "Geothermal resource",
        sublabel: "山葵沢",
        sublabelEn: "Wasabizawa",
        kind: "supply",
        icon: "flame",
      },
      {
        id: "plant",
        label: "地熱発電所",
        labelEn: "Geothermal plant",
        sublabel: "商用運転",
        sublabelEn: "Commercial",
        kind: "convert",
        icon: "building-2",
      },
      {
        id: "grid",
        label: "系統・地域需要",
        labelEn: "Grid / local demand",
        sublabel: "ベースロード供給",
        sublabelEn: "Baseload supply",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "geo", to: "plant" },
      { from: "plant", to: "grid" },
    ],
  },
  "nagayoshigawa-hydro": {
    label: "永吉川水力発電所",
    labelEn: "Nagayoshi-gawa hydro plant",
    description:
      "地域金融機関や地元企業が支えるコミュニティ主導の小水力。分散型投資のモデルです。",
    descriptionEn:
      "Community-led small hydro backed by local banks and firms—a distributed investment model.",
    coordinates: [130.4, 31.63],
    regionName: "鹿児島県 日置市",
    regionNameEn: "Hioki, Kagoshima",
    modelCategory: "hydro",
    energyTypes: ["hydro"],
    mapRegion: "kyushu",
    caseStatus: "commercial",
    scaleLabel: "商用運転 · 中小水力",
    scaleLabelEn: "Commercial · Small hydro",
    partners: "日置市、鹿児島銀行、地元企業等",
    partnersEn: "Hioki City, Kagoshima Bank, local firms",
    paradigmPoint:
      "分散型投資: 地域金融機関や地元企業による、コミュニティ主導の小規模分散型電源。",
    paradigmPointEn:
      "Distributed investment: community-led small power backed by local finance.",
    sourceUrl: null,
    nodes: [
      {
        id: "hydro",
        label: "小水力",
        labelEn: "Small hydro",
        sublabel: "永吉川",
        sublabelEn: "Nagayoshi River",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "community",
        label: "地域エネルギー会社",
        labelEn: "Local energy company",
        sublabel: "コミュニティ主導",
        sublabelEn: "Community-led",
        kind: "convert",
        icon: "building-2",
      },
      {
        id: "home",
        label: "地域需要",
        labelEn: "Local demand",
        sublabel: "地産地消",
        sublabelEn: "Local consumption",
        kind: "consume",
        icon: "home",
      },
    ],
    edges: [
      { from: "hydro", to: "community" },
      { from: "community", to: "home" },
    ],
  },
  "hiratsuka-wave": {
    label: "平塚波力発電所",
    labelEn: "Hiratsuka wave power plant",
    description:
      "沿岸の波エネルギーを直接回収する都市近接型の分散電源。エッジで再エネを取り込む実証です。",
    descriptionEn:
      "Coastal wave energy harvested near the city—edge-side RE demonstration.",
    coordinates: [139.35, 35.33],
    regionName: "神奈川県 平塚市",
    regionNameEn: "Hiratsuka, Kanagawa",
    modelCategory: "ocean",
    energyTypes: ["ocean"],
    mapRegion: "kanto",
    caseStatus: "demo",
    scaleLabel: "実証事業 · 海洋",
    scaleLabelEn: "Demo · Ocean",
    partners: "東京大学生産技術研究所グループ 等",
    partnersEn: "Univ. of Tokyo IIS group, et al.",
    paradigmPoint:
      "エッジ利用: 沿岸部の波エネルギーを直接回収する、都市近接型の分散電源。",
    paradigmPointEn:
      "Edge harvest: coastal wave energy as near-city distributed power.",
    sourceUrl: null,
    nodes: [
      {
        id: "wave",
        label: "波力発電",
        labelEn: "Wave power",
        sublabel: "平塚沿岸",
        sublabelEn: "Hiratsuka coast",
        kind: "supply",
        icon: "droplets",
      },
      {
        id: "lab",
        label: "実証・研究需要",
        labelEn: "Demo / research load",
        sublabel: "都市近接",
        sublabelEn: "Near-city",
        kind: "consume",
        icon: "building-2",
      },
    ],
    edges: [{ from: "wave", to: "lab" }],
  },
}

export function matchesModelCategory(
  config: Pick<NetworkModelConfig, "modelCategory" | "energyTypes">,
  filter: ModelCategory | "all"
): boolean {
  if (filter === "all") return true
  return (
    config.modelCategory === filter || config.energyTypes.includes(filter)
  )
}

export function categoryColor(category: ModelCategory): string {
  switch (category) {
    case "solar":
      return "#f59e0b"
    case "wind":
      return "#3b82f6"
    case "ocean":
      return "#06b6d4"
    case "biomass":
      return "#84cc16"
    case "geothermal":
      return "#f97316"
    case "hydro":
      return "#6366f1"
    case "hydrogen":
      return "#10b981"
    default:
      return "#6b7280"
  }
}

export function networkMethodKey(
  category: ModelCategory
):
  | "methodSolar"
  | "methodWind"
  | "methodOcean"
  | "methodBiomass"
  | "methodGeothermal"
  | "methodHydro"
  | "methodHydrogen" {
  switch (category) {
    case "solar":
      return "methodSolar"
    case "wind":
      return "methodWind"
    case "ocean":
      return "methodOcean"
    case "biomass":
      return "methodBiomass"
    case "geothermal":
      return "methodGeothermal"
    case "hydro":
      return "methodHydro"
    case "hydrogen":
      return "methodHydrogen"
  }
}

export function caseStatusKey(
  status: CaseStatus
):
  | "statusCommercial"
  | "statusDemo"
  | "statusPlanning"
  | "statusConstruction" {
  switch (status) {
    case "commercial":
      return "statusCommercial"
    case "demo":
      return "statusDemo"
    case "planning":
      return "statusPlanning"
    case "construction":
      return "statusConstruction"
  }
}

export function energyTypeFilterKey(
  category: ModelCategory
):
  | "japanMapFilterSolar"
  | "japanMapFilterWind"
  | "japanMapFilterOcean"
  | "japanMapFilterBiomass"
  | "japanMapFilterGeothermal"
  | "japanMapFilterHydro"
  | "japanMapFilterHydrogen" {
  switch (category) {
    case "solar":
      return "japanMapFilterSolar"
    case "wind":
      return "japanMapFilterWind"
    case "ocean":
      return "japanMapFilterOcean"
    case "biomass":
      return "japanMapFilterBiomass"
    case "geothermal":
      return "japanMapFilterGeothermal"
    case "hydro":
      return "japanMapFilterHydro"
    case "hydrogen":
      return "japanMapFilterHydrogen"
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
