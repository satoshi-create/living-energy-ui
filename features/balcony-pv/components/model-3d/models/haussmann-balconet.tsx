'use client'

import { HaussmannAnnotations } from '../annotations/haussmann-annotations'
import { HaussmannBalconyShell } from '../architecture/haussmann-shell'
import { HaussmannRailing } from '../railings/haussmann-railing'
import { HaussmannLouverPv } from '../solar/haussmann-louver-pv'

/** `haussmann-balconet`: パリ・オスマニアン様式のバルコネット。 */
export function HaussmannBalconetModel() {
  return (
    <group>
      <HaussmannBalconyShell />
      <HaussmannRailing />
      <HaussmannLouverPv />
      <HaussmannAnnotations />
    </group>
  )
}
