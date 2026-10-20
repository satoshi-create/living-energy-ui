'use client'

import { UkJulietShell } from '../architecture/uk-balcony-shells'
import { UkJulietRailing } from '../railings/uk-railings'
import { UkJulietLouverPv } from '../solar/uk-pv'

/** `uk-juliet-balcony`: デッキなし・窓面ルーバー集光のジュリエットバルコニー。 */
export function UkJulietBalconyModel() {
  return (
    <group>
      <UkJulietShell />
      <UkJulietRailing />
      <UkJulietLouverPv />
    </group>
  )
}
