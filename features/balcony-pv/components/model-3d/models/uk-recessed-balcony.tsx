'use client'

import { UkRecessedShell } from '../architecture/uk-balcony-shells'
import { UkRecessedRailing } from '../railings/uk-railings'
import { UkRecessedSolarTable } from '../solar/uk-pv'

/** `uk-recessed-balcony`: 側壁に囲まれたロッジア型バルコニー。 */
export function UkRecessedBalconyModel() {
  return (
    <group>
      <UkRecessedShell />
      <UkRecessedRailing />
      <UkRecessedSolarTable />
    </group>
  )
}
