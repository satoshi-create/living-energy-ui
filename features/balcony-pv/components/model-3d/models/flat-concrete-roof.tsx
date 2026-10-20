'use client'

import { FlatConcreteRoofShell } from '../roofs/flat-concrete-roof'
import { FlatRoofPanel, FlatRoofPergola } from '../solar/flat-roof-solar'

/** `flat-concrete-roof`: 屋上フラットスラブ＋パーゴラ架台。 */
export function FlatConcreteRoofModel() {
  return (
    <group position={[0, -0.2, 0]}>
      <FlatConcreteRoofShell />
      <FlatRoofPergola />
      <FlatRoofPanel />
    </group>
  )
}
