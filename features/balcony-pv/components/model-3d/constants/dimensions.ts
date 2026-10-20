/**
 * 3Dモデルの基準寸法（メートル）。
 * メッシュの position / rotation / scale は各モデルファイル側に保持し、
 * ここでは設計図（施工手順書）に転記できる代表寸法のみを管理する。
 */
import { Shape } from 'three'

/** 日本の避難バルコニー（JIS手すり・隔て板・避難ハッチ）。 */
export const JAPANESE_BALCONY_DIMS = {
  slab: { width: 2.8, thickness: 0.15, depth: 1.55 },
  railing: { height: 1.1, z: 0.7, balusterPitch: 0.115, postXs: [-1.3, -0.42, 0.42, 1.3] },
  egress: { width: 0.6, depth: 1.25 },
} as const

/** ドイツ式コンクリート腰壁バルコニー。 */
export const GERMAN_BALCONY_DIMS = {
  slab: { width: 2.7, thickness: 0.12, depth: 1.65, z: 0.05 },
  parapet: { width: 2.4, height: 1.0, thickness: 0.22, z: 0.72 },
  cap: { width: 2.44, thickness: 0.03, depth: 0.26, y: 1.01 },
  panel: { width: 1.5, height: 0.72, thickness: 0.035, z: 0.88 },
} as const

/** パリ・オスマニアン様式の浅いバルコネット。 */
export const FRENCH_BALCONY_DIMS = {
  wall: { width: 2.8, height: 2.3, thickness: 0.18, z: -0.72 },
  slab: { width: 2.0, thickness: 0.12, depth: 0.85, z: -0.22 },
  railing: { width: 1.96, height: 0.95, z: 0.18 },
} as const

/** 日本式切妻瓦屋根（棟高 = 軒高0.9 + 0.55）。 */
export const JAPANESE_ROOF_DIMS = {
  body: { width: 2.2, height: 0.9, depth: 1.6 },
  gable: { halfDepth: 0.8, rise: 0.55 },
  slopeRun: 0.95,
  eaveHeight: 0.9,
  roofBoard: { width: 2.4, length: 1.15, thickness: 0.04 },
  ridgeY: 1.46,
} as const

/** 欧州の急勾配切妻屋根。 */
export const EUROPEAN_ROOF_DIMS = {
  body: { width: 2.2, height: 0.8, depth: 1.6 },
  gable: { halfDepth: 0.8, rise: 0.95 },
  roofBoardLength: 1.28,
  ridgeY: 1.76,
} as const

/** 屋上のフラットコンクリートスラブ＋ルーフトップテラス。 */
export const FLAT_ROOF_DIMS = {
  body: { width: 2.4, height: 0.9, depth: 2.0 },
  slab: { width: 2.44, thickness: 0.08, depth: 2.04, topY: 0.96 },
  parapet: { height: 0.25, thickness: 0.06, capThickness: 0.02 },
  deck: { width: 2.3, depth: 1.9, thickness: 0.03 },
  penthouse: { width: 0.75, height: 0.85, depth: 0.65, x: 0.75, z: -0.6 },
  pergola: { postH: 0.85, width: 1.5, depth: 1.3, tiltDeg: 10 },
} as const

/** UK切妻テラスハウスの勾配（45°）。 */
export const UK_GABLE_PITCH_RAD = (45 * Math.PI) / 180

/** 日本式切妻の妻壁（三角形）断面。底辺 Z = ±0.8、頂点 Y = +0.55。 */
export const JAPANESE_GABLE_WALL_SHAPE = (() => {
  const shape = new Shape()
  shape.moveTo(-0.8, 0)
  shape.lineTo(0.8, 0)
  shape.lineTo(0, 0.55)
  shape.closePath()
  return shape
})()

/** 欧州急勾配切妻の妻壁（三角形）断面。底辺 Z = ±0.8、頂点 Y = +0.95。 */
export const EUROPEAN_GABLE_WALL_SHAPE = (() => {
  const shape = new Shape()
  shape.moveTo(-0.8, 0)
  shape.lineTo(0.8, 0)
  shape.lineTo(0, 0.95)
  shape.closePath()
  return shape
})()
