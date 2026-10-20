/** 太陽電池セル模型の基準寸法（メートル）。 */
export const SILICON_PANEL_DIMS = {
  rows: 4,
  cols: 6,
  cellW: 0.28,
  cellH: 0.22,
  gap: 0.02,
  /** ~35mm相当の視覚厚み */
  frameDepth: 0.14,
  frameBezel: 0.1,
} as const

export const THIN_FILM_PANEL_DIMS = {
  width: 1.6,
  height: 0.95,
  depth: 0.028,
  edge: 0.0045,
} as const

export const PEROVSKITE_PANEL_DIMS = {
  /** 視覚上 1mm未満の超薄フィルム */
  thickness: 0.0035,
  height: 0.78,
  width: 0.48,
  /** 静止時の折り角（rad） */
  staticFold: 0.55,
} as const

export const ETFE_PANEL_DIMS = {
  width: 1.55,
  height: 0.9,
  thickness: 0.012,
  grommetR: 0.028,
  cellW: 0.26,
  cellH: 0.24,
  gap: 0.03,
} as const

/** セル模型を載せるステージの持ち上げ量。 */
export const CELL_STAGE_LIFT = 0.15

/** 表示台座・避難動線ガイドの基準高さ。 */
export const CELL_PEDESTAL_Y = -0.85
export const CELL_EGRESS_Y = -0.82
