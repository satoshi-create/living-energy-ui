// Mock for balcony solar world implementation. Static — no backend.

export type WorldTimelineId = 'until2020' | 'from2021' | 'from2023' | 'present'

export type WorldTagId = 'regulatoryRelief' | 'legislationTrend' | 'offGrid'

export type WorldRegionId = 'germanyEu' | 'unitedStates' | 'africaDeveloping'

export type WorldBulletId = 'cap800w' | 'rentalHousing' | 'livedExperience' | 'stateRules' | 'offGridFirst'

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
  'present',
] as const

/** Locale-independent region cards. Labels: `worldPv.regions.*` / `worldPv.tags.*`. */
export const WORLD_REGIONS: readonly WorldRegion[] = [
  {
    id: 'germanyEu',
    tags: ['regulatoryRelief', 'legislationTrend'],
    bullets: ['cap800w', 'rentalHousing', 'livedExperience'],
  },
  {
    id: 'unitedStates',
    tags: ['legislationTrend'],
    bullets: ['stateRules', 'rentalHousing', 'livedExperience'],
  },
  {
    id: 'africaDeveloping',
    tags: ['offGrid'],
    bullets: ['offGridFirst', 'rentalHousing', 'livedExperience'],
  },
] as const
