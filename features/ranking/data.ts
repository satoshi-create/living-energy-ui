// Mock for balcony solar world implementation & ecosystem. Static — no backend.

export type WorldTimelineId = 'until2020' | 'from2021' | 'from2023' | 'current'

export type WorldTagId = 'regulatoryRelief' | 'legislationTrend' | 'offGrid'

export type WorldRegionId = 'germanyEu' | 'unitedStates' | 'africaDeveloping'

export type WorldBulletId =
  | 'clearOutputCap'
  | 'rentalMultifamily'
  | 'applianceValue'
  | 'stateInterconnection'
  | 'rentalIncentives'
  | 'rooftopDifferentiation'
  | 'appliancePower'
  | 'microgridLink'
  | 'coopNgo'

export type WorldRegion = {
  id: WorldRegionId
  tags: WorldTagId[]
  bullets: WorldBulletId[]
}

/** Locale-independent timeline period keys. Labels: `worldPv.timeline.*`. */
export const WORLD_TIMELINE: readonly WorldTimelineId[] = [
  'until2020',
  'from2021',
  'from2023',
  'current',
] as const

/** Locale-independent region cards. Labels: `worldPv.regions.*` / `worldPv.tags.*`. */
export const WORLD_REGIONS: readonly WorldRegion[] = [
  {
    id: 'germanyEu',
    tags: ['regulatoryRelief'],
    bullets: ['clearOutputCap', 'rentalMultifamily', 'applianceValue'],
  },
  {
    id: 'unitedStates',
    tags: ['legislationTrend'],
    bullets: ['stateInterconnection', 'rentalIncentives', 'rooftopDifferentiation'],
  },
  {
    id: 'africaDeveloping',
    tags: ['offGrid'],
    bullets: ['appliancePower', 'microgridLink', 'coopNgo'],
  },
] as const
