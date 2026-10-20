'use client'

import type { SolarCellTypeId } from '../../../data'
import { CompoundThinFilmPanel } from './compound-thin-film-panel'
import { EtfeFlexiblePanel } from './etfe-flexible-panel'
import { PerovskiteFilmPanel } from './perovskite-film-panel'
import { SiliconPanel } from './silicon-panel'

/** 太陽電池タイプIDに応じたパネルメッシュを選択する。 */
export function CellMesh({
  type,
  animateFold,
}: {
  type: SolarCellTypeId
  animateFold: boolean
}) {
  switch (type) {
    case 'rigid_silicon':
      return <SiliconPanel />
    case 'bipv_thin_film':
      return <CompoundThinFilmPanel />
    case 'etfe_flexible_silicon':
      return <EtfeFlexiblePanel />
    case 'origami_perovskite':
      return <PerovskiteFilmPanel animateFold={animateFold} />
  }
}
