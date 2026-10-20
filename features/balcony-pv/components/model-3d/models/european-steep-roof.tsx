'use client'

import {
  EuropeanRoofBody,
  EuropeanRoofPlanes,
} from '../roofs/european-steep-roof'

/** `french-mansard-roof`: 欧州の急勾配切妻屋根。 */
export function EuropeanSteepRoofModel() {
  return (
    <group>
      <EuropeanRoofBody />
      <EuropeanRoofPlanes />
    </group>
  )
}
