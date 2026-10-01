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

export type EcosystemOrgId = 'ankerSolix' | 'enphase' | 'energyCoop' | 'climateNpo'

export type EcosystemTagId =
  | 'pluginStorage'
  | 'microinverter'
  | 'cooperative'
  | 'advocacy'

export type EcosystemOrg = {
  id: EcosystemOrgId
  tags: EcosystemTagId[]
}

export type EcosystemCareerId = 'productHardware' | 'communityPolicy' | 'uxLivedData'

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

/** Locale-independent org cards. Labels: `ecosystem.orgs.*` / `ecosystem.tags.*`. */
export const ECOSYSTEM_ORGS: readonly EcosystemOrg[] = [
  { id: 'ankerSolix', tags: ['pluginStorage'] },
  { id: 'enphase', tags: ['microinverter'] },
  { id: 'energyCoop', tags: ['cooperative'] },
  { id: 'climateNpo', tags: ['advocacy'] },
] as const

/** Locale-independent career areas. Labels: `ecosystem.careers.areas.*`. */
export const ECOSYSTEM_CAREERS: readonly EcosystemCareerId[] = [
  'productHardware',
  'communityPolicy',
  'uxLivedData',
] as const
