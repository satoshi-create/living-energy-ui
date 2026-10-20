'use client'

import { UkRoofTerraceShell } from '../architecture/uk-balcony-shells'
import { UkRoofTerracePergola } from '../solar/uk-pv'

/** `uk-roof-terrace`: 広いフラットデッキ＋パーゴラ架台。 */
export function UkRoofTerraceModel() {
  return (
    <group>
      <UkRoofTerraceShell />
      <UkRoofTerracePergola />
    </group>
  )
}
