'use client'

import {
  UkPitchedGableRoofPlanes,
  UkPitchedGableShell,
} from '../roofs/uk-roofs'
import { UkGableClampMounts } from '../solar/uk-pv'

/** `uk-pitched-gable`: 45°勾配のスレート切妻屋根。 */
export function UkPitchedGableModel() {
  return (
    <group>
      <UkPitchedGableShell />
      <UkPitchedGableRoofPlanes />
      <UkGableClampMounts />
    </group>
  )
}
