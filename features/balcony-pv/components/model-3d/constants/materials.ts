/**
 * 3Dモデルのマテリアル・カラーパレット。
 * 既存ビジュアルを変更しないため、数値はすべて現行値をそのまま転記している。
 */

/** 共通カラー（部位をまたいで使う色のみ）。 */
export const MODEL_COLORS = {
  canvasBackground: '#0f1419',
  ground: '#12181f',
  pvEmerald: '#10b981',
  pvPanelBody: '#1a6b4a',
  pvCellDark: '#0c121e',
  pvCellFace: '#0f172a',
  glass: '#94a3b8',
  glassUk: '#7ec8e8',
  windowFrame: '#334155',
  aluminium: '#94a3b8',
  galvanized: '#64748b',
  darkSteel: '#1e293b',
  iron: '#1f2937',
  cable: '#0f172a',
  annotationBlue: '#38bdf8',
  concrete: '#c4c7c5',
  concreteSlab: '#7a7d7b',
  plaster: '#f8fafc',
} as const

/** 同一パラメータで複数箇所に登場するマテリアル。 */
export const MATERIALS = {
  /** アルミ手すり・笠木（金属光沢あり）。 */
  aluminiumRail: { color: '#94a3b8', metalness: 0.8, roughness: 0.25 },
  /** 亜鉛メッキ鋼（手すり支柱・金物）。 */
  galvanizedSteel: { color: '#64748b', metalness: 0.7, roughness: 0.3 },
  /** 黒皮鉄（パリの錬鉄手すり）。 */
  darkIron: { color: '#1f2937', metalness: 0.8, roughness: 0.3 },
  /** 鋳鉄支柱（パリ手すり）。 */
  castIron: { color: '#111827', metalness: 0.85, roughness: 0.25 },
  /** 太陽光パネル本体（エメラルド）。 */
  pvPanel: { color: '#1a6b4a', metalness: 0.35, roughness: 0.45 },
  /** パネル枠・バックシート。 */
  pvFrame: { color: '#1e293b', metalness: 0.8, roughness: 0.2 },
  /** 透過ガラス（サッシ・手すり）。 */
  clearGlass: {
    color: '#94a3b8',
    metalness: 0.25,
    roughness: 0.1,
    transparent: true,
    opacity: 0.4,
  },
  /** サッシ・ドア枠。 */
  windowFrame: { color: '#334155', metalness: 0.5, roughness: 0.35 },
  /** 屋外配線ケーブル。 */
  cable: { color: '#0f172a', roughness: 0.8 },
  /** コンクリート床スラブ。 */
  concreteSlab: { color: '#7a7d7b', roughness: 0.95 },
  /** コンクリート打放し外壁。 */
  concreteWall: { color: '#c4c7c5', roughness: 0.92 },
  /** ステンレス・アルミ金物。 */
  steelHardware: { color: '#64748b', metalness: 0.85, roughness: 0.2 },
  /** 屋根板（濃灰）。 */
  roofDeck: { color: '#334155', metalness: 0.2, roughness: 0.6 },
  /** 棟包み・軒先（ほぼ黒）。 */
  roofTrim: { color: '#1e293b', roughness: 0.5 },
} as const
