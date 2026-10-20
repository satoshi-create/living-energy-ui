'use client'

import {
  JapaneseRoofBody,
  JapaneseRoofPlanes,
} from '../roofs/japanese-roof'

/** `japanese-kawara-roof`: 日本式切妻瓦屋根。 */
export function JapaneseStandardRoofModel() {
  return (
    <group>
      <JapaneseRoofBody />
      <JapaneseRoofPlanes />
    </group>
  )
}
