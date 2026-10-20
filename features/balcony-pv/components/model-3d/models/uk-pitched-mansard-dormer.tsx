'use client'

import {
  UkMansardDormerShell,
  UkMansardRoofPlanes,
} from '../roofs/uk-roofs'
import { UkMansardLouverPv } from '../solar/uk-pv'

/** `uk-pitched-mansard-dormer`: 急勾配マンサード＋ドーマー。 */
export function UkPitchedMansardDormerModel() {
  return (
    <group>
      <UkMansardDormerShell />
      <UkMansardRoofPlanes />
      <UkMansardLouverPv />
    </group>
  )
}
