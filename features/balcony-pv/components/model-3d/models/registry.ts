import type { ComponentType } from 'react'
import type { Surface3dModelId } from '../../../data'
import { HaussmannBalconetModel } from './haussmann-balconet'
import { ConcreteParapetModel } from './concrete-parapet'
import { JapaneseEvacuationBalconyModel } from './japanese-evacuation-balcony'
import { JapaneseStandardRoofModel } from './japanese-standard-roof'
import { EuropeanSteepRoofModel } from './european-steep-roof'
import { FlatConcreteRoofModel } from './flat-concrete-roof'
import { UkJulietBalconyModel } from './uk-juliet-balcony'
import { UkRecessedBalconyModel } from './uk-recessed-balcony'
import { UkRoofTerraceModel } from './uk-roof-terrace'
import { UkPitchedGableModel } from './uk-pitched-gable'
import { UkPitchedMansardDormerModel } from './uk-pitched-mansard-dormer'

/**
 * `Surface3dModelId` → 実際の3Dモデル組み立てコンポーネント。
 * data.ts の型にキー漏れがあれば TypeScript が検出する。
 */
export const MODEL_REGISTRY: Record<Surface3dModelId, ComponentType> = {
  'haussmann-balconet': HaussmannBalconetModel,
  'concrete-parapet': ConcreteParapetModel,
  'japanese-evacuation-balcony': JapaneseEvacuationBalconyModel,
  'japanese-kawara-roof': JapaneseStandardRoofModel,
  'french-mansard-roof': EuropeanSteepRoofModel,
  'flat-concrete-roof': FlatConcreteRoofModel,
  'uk-juliet-balcony': UkJulietBalconyModel,
  'uk-recessed-balcony': UkRecessedBalconyModel,
  'uk-roof-terrace': UkRoofTerraceModel,
  'uk-pitched-gable': UkPitchedGableModel,
  'uk-pitched-mansard-dormer': UkPitchedMansardDormerModel,
}
