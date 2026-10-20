'use client'

import { ConcreteParapetAnnotations } from '../annotations/concrete-parapet-annotations'
import { ConcreteParapetShell } from '../architecture/concrete-parapet-shell'
import { GermanLifestyleProps } from '../architecture/lifestyle-props'
import {
  GermanInverterSystem,
  GermanPanelMount,
  GermanWallOutlet,
} from '../solar/german-pv-system'

/** `concrete-parapet`: ドイツ式コンクリート腰壁バルコニー。 */
export function ConcreteParapetModel() {
  return (
    <group>
      <ConcreteParapetShell />
      <GermanInverterSystem />
      <ConcreteParapetAnnotations />
      <GermanWallOutlet />
      <GermanPanelMount />
      <GermanLifestyleProps />
    </group>
  )
}
