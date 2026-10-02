// Mock for 2-axis ecosystem directory (region × form factor). Static — no backend.

import type { CountryCode } from '@/lib/country-codes'

export type RegionScope = 'all' | 'japan' | 'global'
export type FormFactor = 'all' | 'balcony' | 'non-balcony'
export type ActorCategory = 'corporate' | 'npo' | 'coop' | 'ecosystem'
export type ActorRegion = 'japan' | 'global'
export type ActorFormFactor = 'balcony' | 'non-balcony'

export type CategoryLabelId =
  | 'pluginStorage'
  | 'citizenPractice'
  | 'coopPower'
  | 'p2pAggregation'
  | 'policyNetwork'
  | 'standardsCommons'
  | 'microinverter'
  | 'energyCoopUnion'
  | 'perovskite'
  | 'megaSolarPpa'

export type ActorTagId =
  | 'portablePower'
  | 'rentalFriendly'
  | 'diySolar'
  | 'citizenParticipation'
  | 'balconyGuide'
  | 'groupBuying'
  | 'coop'
  | 'directEnergy'
  | 'surplusReturn'
  | 'p2pTrading'
  | 'climateTech'
  | 'dispatchAi'
  | 'regionalCommons'
  | 'disasterMicrogrid'
  | 'municipalityLink'
  | 'eu800w'
  | 'pluginPv'
  | 'openStandard'
  | 'microinverter'
  | 'gridAutonomy'
  | 'distributedEms'
  | 'energyDemocracy'
  | 'citizenEquity'
  | 'microgrid'
  | 'perovskite'
  | 'lightweightFilm'
  | 'concentratedPpa'
  | 'utilityScale'

export type EcosystemCareerId = 'productHardware' | 'communityPolicy' | 'uxLivedData'

export interface FundamentalMetrics {
  ticker?: string
  marketCap?: string
  powerSource: string
  innovationType: 'disruptive' | 'sustaining'
  decentralizedFit: 'High' | 'Mid' | 'Low'
  bosRatio?: string
  financialHealth: string
}

export type EcosystemActor = {
  id: string
  category: ActorCategory
  categoryLabel: CategoryLabelId
  region: ActorRegion
  formFactor: ActorFormFactor
  tags: ActorTagId[]
  countryCodes?: CountryCode[]
  metrics?: { id: string }[]
  fundamental?: FundamentalMetrics
  linkUrl?: string
}

/** Locale-independent actors. Labels: `ecosystem.actors.*` / `ecosystem.categoryLabels.*`. */
export const ECOSYSTEM_ACTORS: readonly EcosystemActor[] = [
  {
    id: 'anker-solix-jp',
    category: 'corporate',
    categoryLabel: 'pluginStorage',
    region: 'japan',
    formFactor: 'balcony',
    tags: ['portablePower', 'rentalFriendly', 'diySolar'],
    countryCodes: ['JP'],
    metrics: [{ id: 'storageCapacity' }],
    fundamental: {
      powerSource: 'プラグイン蓄電',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '5% (完全工事不要)',
      financialHealth: 'コンシューマー流通基盤',
    },
  },
  {
    id: 'balcony-solar-action-jp',
    category: 'npo',
    categoryLabel: 'citizenPractice',
    region: 'japan',
    formFactor: 'balcony',
    tags: ['citizenParticipation', 'balconyGuide', 'groupBuying'],
    countryCodes: ['JP'],
    metrics: [{ id: 'households' }],
    fundamental: {
      powerSource: 'プラグインPV実践',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '5%',
      financialHealth: '市民実践・共同購入基盤',
    },
  },
  {
    id: 'seikatsu-club-energy',
    category: 'coop',
    categoryLabel: 'coopPower',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['coop', 'groupBuying', 'directEnergy', 'surplusReturn'],
    countryCodes: ['JP'],
    metrics: [{ id: 'partnerPlants' }],
    fundamental: {
      powerSource: '市民協同電力',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '20%',
      financialHealth: '組合員剰余還元・地域循環',
    },
  },
  {
    id: 'digital-grid-jp',
    category: 'corporate',
    categoryLabel: 'p2pAggregation',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['p2pTrading', 'climateTech', 'dispatchAi'],
    countryCodes: ['JP'],
    metrics: [{ id: 'monthlyVolume' }],
    fundamental: {
      powerSource: 'P2P電力取引',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: 'N/A (プラットフォーム)',
      financialHealth: '民間取引拡大',
    },
  },
  {
    id: 'community-power-jp',
    category: 'npo',
    categoryLabel: 'policyNetwork',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['regionalCommons', 'disasterMicrogrid', 'municipalityLink'],
    countryCodes: ['JP'],
    fundamental: {
      powerSource: '地域政策・コモンズ',
      innovationType: 'disruptive',
      decentralizedFit: 'Mid',
      bosRatio: 'N/A',
      financialHealth: '自治体連携・地域循環',
    },
  },
  {
    id: 'sekisui-chemical',
    category: 'corporate',
    categoryLabel: 'perovskite',
    region: 'japan',
    formFactor: 'balcony',
    tags: ['perovskite', 'lightweightFilm', 'rentalFriendly'],
    countryCodes: ['JP'],
    metrics: [{ id: 'filmThroughput' }],
    fundamental: {
      ticker: '4204',
      marketCap: '規模拡大中',
      powerSource: 'ペロブスカイト',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '10% (軽量・工事レス)',
      financialHealth: 'FCF潤沢・量産投資',
    },
  },
  {
    id: 'west-holdings',
    category: 'corporate',
    categoryLabel: 'megaSolarPpa',
    region: 'japan',
    formFactor: 'non-balcony',
    tags: ['concentratedPpa', 'utilityScale'],
    countryCodes: ['JP'],
    metrics: [{ id: 'ppaCapacity' }],
    fundamental: {
      ticker: '1407',
      powerSource: '太陽光/集中PPA',
      innovationType: 'sustaining',
      decentralizedFit: 'Low',
      bosRatio: '28% (造成・架台依存)',
      financialHealth: '安定配当',
    },
  },
  {
    id: 'balkonkraftwerk-alliance-eu',
    category: 'ecosystem',
    categoryLabel: 'standardsCommons',
    region: 'global',
    formFactor: 'balcony',
    tags: ['eu800w', 'pluginPv', 'openStandard'],
    countryCodes: ['DE'],
    metrics: [{ id: 'euInstalls' }],
    fundamental: {
      powerSource: 'プラグインPV規格',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '5%',
      financialHealth: '欧州規格コモンズ',
    },
  },
  {
    id: 'enphase-energy',
    category: 'corporate',
    categoryLabel: 'microinverter',
    region: 'global',
    formFactor: 'non-balcony',
    tags: ['microinverter', 'gridAutonomy', 'distributedEms'],
    countryCodes: ['US', 'DE'],
    metrics: [{ id: 'globalInstalls' }],
    fundamental: {
      ticker: 'ENPH',
      powerSource: 'マイクロインバータ',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '15%',
      financialHealth: '高営業利益率',
    },
  },
  {
    id: 'rescoop-eu',
    category: 'coop',
    categoryLabel: 'energyCoopUnion',
    region: 'global',
    formFactor: 'non-balcony',
    tags: ['energyDemocracy', 'citizenEquity', 'microgrid'],
    countryCodes: ['EU'],
    metrics: [{ id: 'members' }],
    fundamental: {
      powerSource: '市民エネルギー協同組合連合',
      innovationType: 'disruptive',
      decentralizedFit: 'High',
      bosRatio: '15%',
      financialHealth: '欧州市民共同出資',
    },
  },
] as const

/** Locale-independent ecosystem layers. Labels: `ecosystem.layers.areas.*`. */
export const ECOSYSTEM_CAREERS: readonly EcosystemCareerId[] = [
  'productHardware',
  'communityPolicy',
  'uxLivedData',
] as const

export function filterActors(
  actors: readonly EcosystemActor[],
  region: RegionScope,
  formFactor: FormFactor
): EcosystemActor[] {
  return actors.filter((actor) => {
    const regionOk = region === 'all' || actor.region === region
    const formOk = formFactor === 'all' || actor.formFactor === formFactor
    return regionOk && formOk
  })
}

export function filterActorsByCountry(actors: EcosystemActor[], code?: CountryCode): EcosystemActor[] {
  if (!code) return actors
  return actors.filter((a) => a.countryCodes?.includes(code))
}
