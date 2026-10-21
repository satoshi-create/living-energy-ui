import type { SolarCellTypeId } from '../../solar-cell-data'
import type { CellViewAngle } from './constants/camera'

export type { CellViewAngle }

export type Cell3DModelProps = {
  type: SolarCellTypeId
  interactive?: boolean
  className?: string
  /** 観察角度プリセット（度）。未指定時は表面30°の静止表示。 */
  viewAngle?: CellViewAngle
}
