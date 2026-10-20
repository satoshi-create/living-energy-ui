export type CellViewAngle = 0 | 30 | 90

/** パネルは +Z 向き。カメラは +Z 半球に置き、セル面が読める角度を維持する。 */
export const CELL_CAMERA_TARGET: [number, number, number] = [0, 0.1, 0]

export const CELL_CAMERA_BY_ANGLE: Record<
  CellViewAngle,
  { position: [number, number, number] }
> = {
  0: { position: [0, 1.1, 4.4] },
  /** Oblique front overview — list cards and detail default. */
  30: { position: [2.2, 1.7, 3.8] },
  90: { position: [4.0, 1.5, 1.2] },
}
