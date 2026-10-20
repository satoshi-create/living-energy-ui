'use client'

import { JapaneseBalconyAnnotations } from '../annotations/japanese-balcony-annotations'
import { JapaneseBalconyFixtures } from '../architecture/japanese-balcony-fixtures'
import { JapaneseBalconyShell } from '../architecture/japanese-balcony-shell'
import { JapaneseRailing } from '../railings/japanese-railing'
import {
  JapanesePowerSystem,
  JapaneseRailPvMount,
} from '../solar/japanese-pv-system'

/** `japanese-evacuation-balcony`: 日本式避難バルコニー。 */
export function JapaneseEvacuationBalconyModel() {
  return (
    <group>
      <JapaneseBalconyShell />
      <JapaneseRailing />
      <JapaneseBalconyFixtures />
      <JapaneseRailPvMount />
      <JapanesePowerSystem />
      <JapaneseBalconyAnnotations />
    </group>
  )
}
