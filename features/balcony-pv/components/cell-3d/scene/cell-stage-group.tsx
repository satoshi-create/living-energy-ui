'use client'

import type { SolarCellTypeId } from '../../../data'
import { CELL_STAGE_LIFT } from '../constants/dimensions'
import { CellMesh } from '../panels/cell-mesh'

/** パネル本体をステージ高さまで持ち上げて配置する。 */
export function CellStageGroup({
  type,
  animateFold,
}: {
  type: SolarCellTypeId
  animateFold: boolean
}) {
  return (
    <group position={[0, CELL_STAGE_LIFT, 0]}>
      <CellMesh type={type} animateFold={animateFold} />
    </group>
  )
}
