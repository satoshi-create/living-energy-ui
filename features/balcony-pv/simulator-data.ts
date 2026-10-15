// Simulator / surface-typology mock for balcony-plug-in-pv (cold path).
// Heuristic stand-in for suncalc-js-engine.

import type { PvHistoryStream } from './history-data'

export type Direction = 'south' | 'southeast' | 'southwest' | 'east' | 'west'
export type RailingType = 'grid' | 'glass' | 'concrete'

/**
 * UK / multi-rain balcony form factors (locale-independent).
 * Labels: `balconyPv.balconyType.*`.
 */
export type BalconyType = 'standard' | 'juliet' | 'recessed' | 'roof_terrace'

/**
 * UK roof form factors for terrace-house / mansard contexts (locale-independent).
 * Labels: `balconyPv.roofType.*`.
 */
export type RoofType = 'flat' | 'pitched_gable' | 'pitched_mansard_dormer'

/** Direct / diffuse irradiance split for a receiving surface (sums ≈ 1). */
export interface SurfaceIrradianceParams {
  /** Default receiving area (m²). */
  receivingAreaM2: number
  /** Default tilt from horizontal (degrees). */
  tiltDeg: number
  /** Direct-beam irradiance share (0–1). */
  directRatio: number
  /** Diffuse-sky irradiance share (0–1). */
  diffuseRatio: number
}

export type BalconyTypePreset = { value: BalconyType } & SurfaceIrradianceParams
export type RoofTypePreset = { value: RoofType } & SurfaceIrradianceParams

/** Locale-independent kit label keys under `balconyPv.kit`. */
export type KitPanelKey = 'panelDefault' | 'panelMid' | 'panelLight'
export type KitStorageKey = 'storageDefault' | 'storageMid' | 'storageLight'

/** Locale-independent direction keys. Labels live in messages under `common.directions`. */
export const DIRECTIONS: readonly Direction[] = [
  'south',
  'southeast',
  'southwest',
  'east',
  'west',
] as const

/** Locale-independent railing keys. Labels: `balconyPv.railing.*`. */
export const RAILING_TYPES: { value: RailingType }[] = [
  { value: 'grid' },
  { value: 'glass' },
  { value: 'concrete' },
]

/**
 * UK balcony selector presets: cantilever / Juliet / recessed loggia / roof terrace.
 * Irradiance ratios reflect typical UK overcast (higher diffuse) vs clear-beam days.
 */
export const BALCONY_TYPES: readonly BalconyTypePreset[] = [
  {
    value: 'standard',
    receivingAreaM2: 4.5,
    tiltDeg: 0,
    directRatio: 0.45,
    diffuseRatio: 0.55,
  },
  {
    // Juliet: no deck — rail / French-door glazing as primary surface
    value: 'juliet',
    receivingAreaM2: 2.2,
    tiltDeg: 90,
    directRatio: 0.35,
    diffuseRatio: 0.65,
  },
  {
    // Recessed / loggia: side-wall shading → more diffuse, smaller effective area
    value: 'recessed',
    receivingAreaM2: 3.8,
    tiltDeg: 0,
    directRatio: 0.28,
    diffuseRatio: 0.72,
  },
  {
    // Roof terrace on flat roof deck
    value: 'roof_terrace',
    receivingAreaM2: 12,
    tiltDeg: 5,
    directRatio: 0.5,
    diffuseRatio: 0.5,
  },
] as const

/**
 * UK roof selector presets: flat / pitched gable (terrace house) / mansard+dormer.
 */
export const ROOF_TYPES: readonly RoofTypePreset[] = [
  {
    value: 'flat',
    receivingAreaM2: 18,
    tiltDeg: 5,
    directRatio: 0.48,
    diffuseRatio: 0.52,
  },
  {
    // Pitched gable — slate / clay tile terrace-house slopes
    value: 'pitched_gable',
    receivingAreaM2: 14,
    tiltDeg: 40,
    directRatio: 0.42,
    diffuseRatio: 0.58,
  },
  {
    // Mansard / dormer — steep outer pitch + dormer cheeks
    value: 'pitched_mansard_dormer',
    receivingAreaM2: 10,
    tiltDeg: 55,
    directRatio: 0.38,
    diffuseRatio: 0.62,
  },
] as const

export function getBalconyTypePreset(type: BalconyType): BalconyTypePreset {
  return BALCONY_TYPES.find((p) => p.value === type) ?? BALCONY_TYPES[0]
}

export function getRoofTypePreset(type: RoofType): RoofTypePreset {
  return ROOF_TYPES.find((p) => p.value === type) ?? ROOF_TYPES[0]
}

// ---------------------------------------------------------------------------
// Typology-first surface master (建築形態が第一級エンティティ)
// i18n: `balconyPv.typologies.*`
// ---------------------------------------------------------------------------

/** Architectural balcony / roof receiving-surface typology (locale-independent). */
export type SurfaceTypology =
  | 'egress_cantilever'
  | 'precast_parapet'
  | 'recessed_loggia'
  | 'glass_railing'
  | 'access_gallery'
  | 'mansard_dormer'
  | 'japanese_tiled_roof'
  | 'flat_roof_terrace'
  | 'pitched_gable_terrace'

/** Biomimetic / living-furniture mount family suited to a typology. */
export type BiomimeticMechanism =
  | 'nastic_origami'
  | 'flexible_perovskite'
  | 'clamp_mount'
  | 'catenary_hook'

/** Receiving-surface optical / irradiance character (locale-independent). */
export type OpticalProfile = 'diffuse_dominant' | 'direct_beam' | 'high_altitude'

/** Locale-independent typical-region keys under `balconyPv.typologies.regions.*`. */
export type TypicalRegionKey =
  | 'urban_europe'
  | 'historic_district'
  | 'multifamily_general'
  | 'multifamily_egress'
  | 'central_europe_stock'
  | 'tiled_pitch_roofs'
  | 'flat_deck_roofs'
  | 'terrace_house_roofs'
  | 'rental_facades'

/** Recommended mount / fix method for a receiving surface (locale-independent). */
export type SurfaceMountMethod =
  | 'clamp_no_drill'
  | 'freestanding_furniture'
  | 'vertical_rail_hook'
  | 'louver_hanger'
  | 'tile_hook'

export interface SurfaceMountOption {
  mountMethod: SurfaceMountMethod
  /** i18n key under `balconyPv.mount.*` (e.g. `mount.clamp_no_drill`). */
  labelKey: string
}

export interface PrevalentCountry {
  code: string
  /** i18n key under `balconyPv.countries.*` (e.g. `countries.fr`). */
  nameKey: string
}

/**
 * Deployable panel tilt / stow posture (locale-independent).
 * Labels: `balconyPv.tiltMode.*`.
 */
export type PanelTiltMode = 'horizontal' | 'optimal_tilt' | 'vertical' | 'retracted'

export interface PanelTiltOption {
  id: PanelTiltMode
  /** Degrees from horizontal when deployed (`retracted` is 0° + stowed pose). */
  tiltDeg: number
  /** i18n key under `balconyPv.tiltMode.*`. */
  labelKey: string
}

/** Master of install-style (variable tilt / 出仕舞い) options. */
export const PANEL_TILT_OPTIONS: readonly PanelTiltOption[] = [
  { id: 'horizontal', tiltDeg: 0, labelKey: 'tiltMode.horizontal' },
  { id: 'optimal_tilt', tiltDeg: 30, labelKey: 'tiltMode.optimal_tilt' },
  { id: 'vertical', tiltDeg: 90, labelKey: 'tiltMode.vertical' },
  { id: 'retracted', tiltDeg: 0, labelKey: 'tiltMode.retracted' },
] as const

export function getPanelTiltOption(mode: PanelTiltMode): PanelTiltOption {
  return PANEL_TILT_OPTIONS.find((o) => o.id === mode) ?? PANEL_TILT_OPTIONS[0]
}

/** Efficiency / safety trade-offs for each install-style (demo heuristic). */
export interface TiltMetric {
  annualEfficiencyPct: number
  /** Season / irradiance fit (display copy). */
  winterAdvantage: string
  /** Wind-load character (display copy). */
  windRisk: string
  /** One-line living / install trade-off hint. */
  summary: string
  /** Optional progress caption (e.g. winter relative note). */
  efficiencyNote?: string
}

/**
 * Angle-wise generation & safety metrics keyed by PanelTiltMode.
 * Relative annual efficiency vs optimal_tilt = 100%.
 */
export const TILT_METRICS: Record<PanelTiltMode, TiltMetric> = {
  optimal_tilt: {
    annualEfficiencyPct: 100,
    winterAdvantage: 'Annual peak',
    windRisk: 'Medium',
    summary:
      'Latitude-matched tilt for peak annual yield—balanced living path and wind load.',
    efficiencyNote: 'Annual baseline',
  },
  horizontal: {
    annualEfficiencyPct: 84,
    winterAdvantage: 'Diffuse / flat lay',
    windRisk: 'Caution (uplift from below)',
    summary:
      'Flat lay for floor / furniture mounts. Picks up overcast diffuse light, but watch uplift and egress occupancy.',
    efficiencyNote: 'Diffuse-friendly',
  },
  vertical: {
    annualEfficiencyPct: 72,
    winterAdvantage: 'Strong in winter mornings/evenings',
    windRisk: 'Safer (sheds wind)',
    summary:
      'Vertical mounts shed wind along the wall and catch low winter sun efficiently.',
    efficiencyNote: 'Winter often >90%',
  },
  retracted: {
    annualEfficiencyPct: 0,
    winterAdvantage: 'Avoids external loads',
    windRisk: 'Fully avoided',
    summary:
      'Stow posture stops generation to prioritize typhoon / gust loads and a clear escape path.',
    efficiencyNote: 'Generation off',
  },
}

export function getTiltMetric(mode: PanelTiltMode): TiltMetric {
  return TILT_METRICS[mode]
}

/** Daily balcony use pattern (locale-independent). Labels: `balconyPv.livingHabit.*`. */
export type LivingHabit =
  | 'laundry_drying'
  | 'view_preservation_terrace'
  | 'outdoor_unit_service'

/** Weather / season scenario (locale-independent). Labels: `balconyPv.weather.*`. */
export type WeatherCondition = 'clear' | 'overcast_tsuyu' | 'typhoon_alert'

export type CulturalConstraintKind = 'egress_path_60cm' | 'hatch_no_go'

export interface CulturalConstraint {
  kind: CulturalConstraintKind
  /** Demo penalty when PV/furniture occupies the zone (0–1). */
  occupancyPenalty: number
}

export interface LivingContext {
  habit: LivingHabit
  weather: WeatherCondition
}

export const DEFAULT_LIVING_CONTEXT: LivingContext = {
  habit: 'laundry_drying',
  weather: 'clear',
}

export interface LivingContextModifiers {
  directRatioMul: number
  diffuseRatioMul: number
  /** 1 = no laundry shade, lower = more panel shading. */
  laundryShadeFactor: number
  lifeComplianceBase: number
}

const WEATHER_MODIFIERS: Record<WeatherCondition, Omit<LivingContextModifiers, 'laundryShadeFactor' | 'lifeComplianceBase'>> = {
  clear: { directRatioMul: 1, diffuseRatioMul: 1 },
  overcast_tsuyu: { directRatioMul: 0.72, diffuseRatioMul: 1.18 },
  typhoon_alert: { directRatioMul: 0, diffuseRatioMul: 0 },
}

const HABIT_MODIFIERS: Record<
  LivingHabit,
  Pick<LivingContextModifiers, 'laundryShadeFactor' | 'lifeComplianceBase'>
> = {
  laundry_drying: { laundryShadeFactor: 0.88, lifeComplianceBase: 78 },
  view_preservation_terrace: { laundryShadeFactor: 1, lifeComplianceBase: 85 },
  outdoor_unit_service: { laundryShadeFactor: 1, lifeComplianceBase: 72 },
}

/** Default cultural constraints for egress-heavy typologies (demo). */
export const TYPOLOGY_CULTURAL_CONSTRAINTS: Partial<
  Record<SurfaceTypology, CulturalConstraint[]>
> = {
  egress_cantilever: [{ kind: 'egress_path_60cm', occupancyPenalty: 0.35 }],
  access_gallery: [
    { kind: 'egress_path_60cm', occupancyPenalty: 0.4 },
    { kind: 'hatch_no_go', occupancyPenalty: 0.5 },
  ],
}

export function getLivingContextModifiers(ctx: LivingContext): LivingContextModifiers {
  const weather = WEATHER_MODIFIERS[ctx.weather]
  const habit = HABIT_MODIFIERS[ctx.habit]
  return {
    directRatioMul: weather.directRatioMul,
    diffuseRatioMul: weather.diffuseRatioMul,
    laundryShadeFactor: habit.laundryShadeFactor,
    lifeComplianceBase: habit.lifeComplianceBase,
  }
}

export function applyWeatherToIrradiance(
  params: SurfaceIrradianceParams,
  weather: WeatherCondition,
): SurfaceIrradianceParams {
  const { directRatioMul, diffuseRatioMul } = WEATHER_MODIFIERS[weather]
  const direct = Math.min(1, params.directRatio * directRatioMul)
  const diffuse = Math.min(1, params.diffuseRatio * diffuseRatioMul)
  const sum = direct + diffuse || 1
  return {
    ...params,
    directRatio: direct / sum,
    diffuseRatio: diffuse / sum,
  }
}

export interface ResolvedLivingMetrics {
  lifeCompliancePct: number
  displayEfficiencyPct: number
}

export function resolveLivingMetrics(
  ctx: LivingContext,
  tiltMode: PanelTiltMode,
  typologyId?: SurfaceTypology,
): ResolvedLivingMetrics {
  const tilt = getTiltMetric(tiltMode)
  const mods = getLivingContextModifiers(ctx)

  if (ctx.weather === 'typhoon_alert' || tiltMode === 'retracted') {
    return { lifeCompliancePct: 100, displayEfficiencyPct: 0 }
  }

  let life = mods.lifeComplianceBase

  if (ctx.habit === 'laundry_drying') {
    const laundryPenalty =
      tiltMode === 'horizontal' ? 8 : tiltMode === 'optimal_tilt' ? 5 : 2
    life -= laundryPenalty
  }
  if (ctx.habit === 'outdoor_unit_service') {
    life -= tiltMode === 'vertical' ? 4 : 10
  }
  if (ctx.habit === 'view_preservation_terrace' && tiltMode === 'optimal_tilt') {
    life -= 6
  }

  if (typologyId) {
    const constraints = TYPOLOGY_CULTURAL_CONSTRAINTS[typologyId]
    if (constraints?.length) {
      const penalty =
        constraints.reduce((s, c) => s + c.occupancyPenalty, 0) * 12
      life -= tiltMode === 'horizontal' ? penalty : penalty * 0.55
    }
  }

  let displayEfficiencyPct = tilt.annualEfficiencyPct
  if (ctx.weather === 'overcast_tsuyu') {
    const diffuseBoost =
      tiltMode === 'horizontal' ? 1.06 : tiltMode === 'vertical' ? 0.98 : 1
    displayEfficiencyPct = Math.min(
      100,
      Math.round(tilt.annualEfficiencyPct * diffuseBoost * mods.laundryShadeFactor),
    )
  } else {
    displayEfficiencyPct = Math.round(
      tilt.annualEfficiencyPct * mods.laundryShadeFactor,
    )
  }

  return {
    lifeCompliancePct: Math.round(Math.min(100, Math.max(0, life))),
    displayEfficiencyPct,
  }
}

export function getTypologyCulturalConstraints(
  id: SurfaceTypology,
): CulturalConstraint[] {
  return TYPOLOGY_CULTURAL_CONSTRAINTS[id] ?? []
}

export interface SurfaceTypologyDetail {
  id: SurfaceTypology
  category: 'balcony' | 'roof'
  /** i18n key under `balconyPv.typologies.<id>.name` (short path stored). */
  nameKey: string
  defaultTiltDeg: number
  irradiance: SurfaceIrradianceParams
  /** Optical / beam character of the receiving geometry. */
  opticalProfile: OpticalProfile
  /** Secondary context only — not card identity (i18n via `regions.*`). */
  typicalRegions: TypicalRegionKey[]
  /** Countries where this form is mainly seen (i18n via `countries.*`). */
  prevalentCountries: PrevalentCountry[]
  /** Recommended fix methods for install-job support. */
  mountOptions: SurfaceMountOption[]
  /** 出仕舞い（強風時退避機構）が必要か */
  requiresDeShimai: boolean
  /** i18n key under `balconyPv.typologies.<id>.constraints`. */
  constraintsKey: string
  biomimeticSuitability: {
    mechanism: BiomimeticMechanism
    /** 出仕舞い（退避機構）が必須か */
    deShimaiRequired: boolean
    descriptionKey: string
  }
  /** Install-style modes the form can physically support. */
  supportedTiltModes?: PanelTiltMode[]
  /** Initial install-style when the typology is selected. */
  defaultTiltMode?: PanelTiltMode
  /** Optimal cell chemistry stream for this building form. */
  recommendedCellStream: PvHistoryStream
  /** Display badge for the recommended cell (JA). */
  recommendedCellBadgeJa: string
  /** Display badge for the recommended cell (EN). */
  recommendedCellBadgeEn: string
}

/** Resolve supported tilt modes with geometry-aware fallback. */
export function resolveSupportedTiltModes(
  detail: SurfaceTypologyDetail,
): PanelTiltMode[] {
  if (detail.supportedTiltModes && detail.supportedTiltModes.length > 0) {
    return [...detail.supportedTiltModes]
  }
  if (detail.defaultTiltDeg >= 80) return ['vertical', 'horizontal', 'retracted']
  if (detail.defaultTiltDeg >= 20) return ['optimal_tilt', 'horizontal', 'retracted']
  return ['horizontal', 'optimal_tilt', 'retracted']
}

/** Resolve default tilt mode with geometry-aware fallback. */
export function resolveDefaultTiltMode(
  detail: SurfaceTypologyDetail,
): PanelTiltMode {
  if (detail.defaultTiltMode) return detail.defaultTiltMode
  if (detail.defaultTiltDeg >= 80) return 'vertical'
  if (detail.defaultTiltDeg >= 20) return 'optimal_tilt'
  return 'horizontal'
}

/**
 * Master catalog: pure architectural form + irradiance geometry first;
 * typical regions and regulations are secondary context only.
 */
export const SURFACE_TYPOLOGIES: readonly SurfaceTypologyDetail[] = [
  {
    id: 'egress_cantilever',
    category: 'balcony',
    nameKey: 'egress_cantilever.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 4.5,
      tiltDeg: 0,
      directRatio: 0.45,
      diffuseRatio: 0.55,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['multifamily_egress', 'multifamily_general'],
    prevalentCountries: [{ code: 'JP', nameKey: 'countries.jp' }],
    mountOptions: [
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: true,
    constraintsKey: 'egress_cantilever.constraints',
    biomimeticSuitability: {
      mechanism: 'nastic_origami',
      deShimaiRequired: true,
      descriptionKey: 'egress_cantilever.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
    recommendedCellStream: 'organic_perovskite',
    recommendedCellBadgeJa: '🌿 ペロブスカイト（出仕舞い家具）',
    recommendedCellBadgeEn: '🌿 Perovskite (stow furniture)',
  },
  {
    id: 'precast_parapet',
    category: 'balcony',
    nameKey: 'precast_parapet.name',
    defaultTiltDeg: 90,
    irradiance: {
      receivingAreaM2: 3.2,
      tiltDeg: 90,
      directRatio: 0.42,
      diffuseRatio: 0.58,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['central_europe_stock', 'multifamily_general'],
    prevalentCountries: [
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'AT', nameKey: 'countries.at' },
    ],
    mountOptions: [
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'precast_parapet.constraints',
    biomimeticSuitability: {
      mechanism: 'clamp_mount',
      deShimaiRequired: false,
      descriptionKey: 'precast_parapet.mechanism',
    },
    supportedTiltModes: ['vertical', 'horizontal', 'retracted'],
    defaultTiltMode: 'vertical',
    recommendedCellStream: 'cigs_cdte',
    recommendedCellBadgeJa: '🛡️ 化合物薄膜（垂直腰壁）',
    recommendedCellBadgeEn: '🛡️ Compound thin-film (vertical parapet)',
  },
  {
    id: 'recessed_loggia',
    category: 'balcony',
    nameKey: 'recessed_loggia.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 3.8,
      tiltDeg: 0,
      directRatio: 0.28,
      diffuseRatio: 0.72,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['multifamily_general', 'urban_europe'],
    prevalentCountries: [
      { code: 'IT', nameKey: 'countries.it' },
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'FR', nameKey: 'countries.fr' },
    ],
    mountOptions: [
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'recessed_loggia.constraints',
    biomimeticSuitability: {
      mechanism: 'clamp_mount',
      deShimaiRequired: false,
      descriptionKey: 'recessed_loggia.mechanism',
    },
    supportedTiltModes: ['horizontal', 'optimal_tilt', 'retracted'],
    defaultTiltMode: 'horizontal',
    recommendedCellStream: 'organic_perovskite',
    recommendedCellBadgeJa: '🌿 ペロブスカイト（散乱光特化）',
    recommendedCellBadgeEn: '🌿 Perovskite (diffuse-optimized)',
  },
  {
    id: 'glass_railing',
    category: 'balcony',
    nameKey: 'glass_railing.name',
    defaultTiltDeg: 90,
    irradiance: {
      receivingAreaM2: 2.4,
      tiltDeg: 90,
      directRatio: 0.36,
      diffuseRatio: 0.64,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['rental_facades', 'multifamily_general', 'urban_europe'],
    prevalentCountries: [
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'GB', nameKey: 'countries.gb' },
      { code: 'FR', nameKey: 'countries.fr' },
      { code: 'JP', nameKey: 'countries.jp' },
    ],
    mountOptions: [
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
      { mountMethod: 'vertical_rail_hook', labelKey: 'mount.vertical_rail_hook' },
      { mountMethod: 'louver_hanger', labelKey: 'mount.louver_hanger' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'glass_railing.constraints',
    biomimeticSuitability: {
      mechanism: 'flexible_perovskite',
      deShimaiRequired: false,
      descriptionKey: 'glass_railing.mechanism',
    },
    supportedTiltModes: ['vertical', 'horizontal', 'retracted'],
    defaultTiltMode: 'vertical',
    recommendedCellStream: 'organic_perovskite',
    recommendedCellBadgeJa: '🌿 ペロブスカイト（超軽量フィルム）',
    recommendedCellBadgeEn: '🌿 Perovskite (ultralight film)',
  },
  {
    id: 'access_gallery',
    category: 'balcony',
    nameKey: 'access_gallery.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 10,
      tiltDeg: 0,
      directRatio: 0.4,
      diffuseRatio: 0.6,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['multifamily_egress', 'multifamily_general'],
    prevalentCountries: [
      { code: 'JP', nameKey: 'countries.jp' },
      { code: 'DE', nameKey: 'countries.de' },
    ],
    mountOptions: [
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: true,
    constraintsKey: 'access_gallery.constraints',
    biomimeticSuitability: {
      mechanism: 'nastic_origami',
      deShimaiRequired: true,
      descriptionKey: 'access_gallery.mechanism',
    },
    supportedTiltModes: ['horizontal', 'optimal_tilt', 'retracted'],
    defaultTiltMode: 'horizontal',
    recommendedCellStream: 'organic_perovskite',
    recommendedCellBadgeJa: '🌿 ペロブスカイト（出仕舞い家具）',
    recommendedCellBadgeEn: '🌿 Perovskite (stow furniture)',
  },
  {
    id: 'mansard_dormer',
    category: 'roof',
    nameKey: 'mansard_dormer.name',
    defaultTiltDeg: 45,
    irradiance: {
      receivingAreaM2: 10,
      tiltDeg: 45,
      directRatio: 0.38,
      diffuseRatio: 0.62,
    },
    opticalProfile: 'diffuse_dominant',
    typicalRegions: ['urban_europe', 'historic_district'],
    prevalentCountries: [
      { code: 'FR', nameKey: 'countries.fr' },
      { code: 'BE', nameKey: 'countries.be' },
    ],
    mountOptions: [
      { mountMethod: 'tile_hook', labelKey: 'mount.tile_hook' },
      { mountMethod: 'louver_hanger', labelKey: 'mount.louver_hanger' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'mansard_dormer.constraints',
    biomimeticSuitability: {
      mechanism: 'flexible_perovskite',
      deShimaiRequired: false,
      descriptionKey: 'mansard_dormer.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
    recommendedCellStream: 'organic_perovskite',
    recommendedCellBadgeJa: '🌿 ペロブスカイト（曲面・軽量追従）',
    recommendedCellBadgeEn: '🌿 Perovskite (curved / light conform)',
  },
  {
    id: 'japanese_tiled_roof',
    category: 'roof',
    nameKey: 'japanese_tiled_roof.name',
    defaultTiltDeg: 30,
    irradiance: {
      receivingAreaM2: 12,
      tiltDeg: 30,
      directRatio: 0.48,
      diffuseRatio: 0.52,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['tiled_pitch_roofs'],
    prevalentCountries: [{ code: 'JP', nameKey: 'countries.jp' }],
    mountOptions: [
      { mountMethod: 'tile_hook', labelKey: 'mount.tile_hook' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'japanese_tiled_roof.constraints',
    biomimeticSuitability: {
      mechanism: 'catenary_hook',
      deShimaiRequired: false,
      descriptionKey: 'japanese_tiled_roof.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
    recommendedCellStream: 'silicon_mainstream',
    recommendedCellBadgeJa: '🏋️ Si主流系（高出力・瓦固定）',
    recommendedCellBadgeEn: '🏋️ Silicon mainstream (high-output tile-mount)',
  },
  {
    id: 'flat_roof_terrace',
    category: 'roof',
    nameKey: 'flat_roof_terrace.name',
    defaultTiltDeg: 0,
    irradiance: {
      receivingAreaM2: 18,
      tiltDeg: 5,
      directRatio: 0.5,
      diffuseRatio: 0.5,
    },
    opticalProfile: 'high_altitude',
    typicalRegions: ['flat_deck_roofs', 'multifamily_general'],
    prevalentCountries: [
      { code: 'DE', nameKey: 'countries.de' },
      { code: 'JP', nameKey: 'countries.jp' },
      { code: 'FR', nameKey: 'countries.fr' },
    ],
    mountOptions: [
      { mountMethod: 'freestanding_furniture', labelKey: 'mount.freestanding_furniture' },
    ],
    requiresDeShimai: true,
    constraintsKey: 'flat_roof_terrace.constraints',
    biomimeticSuitability: {
      mechanism: 'nastic_origami',
      deShimaiRequired: true,
      descriptionKey: 'flat_roof_terrace.mechanism',
    },
    supportedTiltModes: ['horizontal', 'optimal_tilt', 'retracted'],
    defaultTiltMode: 'horizontal',
    recommendedCellStream: 'silicon_mainstream',
    recommendedCellBadgeJa: '🏋️ Si主流系（日除けパーゴラ）',
    recommendedCellBadgeEn: '🏋️ Silicon mainstream (shade pergola)',
  },
  {
    id: 'pitched_gable_terrace',
    category: 'roof',
    nameKey: 'pitched_gable_terrace.name',
    defaultTiltDeg: 45,
    irradiance: {
      receivingAreaM2: 14,
      tiltDeg: 40,
      directRatio: 0.42,
      diffuseRatio: 0.58,
    },
    opticalProfile: 'direct_beam',
    typicalRegions: ['terrace_house_roofs', 'tiled_pitch_roofs'],
    prevalentCountries: [
      { code: 'GB', nameKey: 'countries.gb' },
      { code: 'DE', nameKey: 'countries.de' },
    ],
    mountOptions: [
      { mountMethod: 'tile_hook', labelKey: 'mount.tile_hook' },
      { mountMethod: 'clamp_no_drill', labelKey: 'mount.clamp_no_drill' },
    ],
    requiresDeShimai: false,
    constraintsKey: 'pitched_gable_terrace.constraints',
    biomimeticSuitability: {
      mechanism: 'clamp_mount',
      deShimaiRequired: false,
      descriptionKey: 'pitched_gable_terrace.mechanism',
    },
    supportedTiltModes: ['optimal_tilt', 'horizontal', 'retracted'],
    defaultTiltMode: 'optimal_tilt',
    recommendedCellStream: 'silicon_mainstream',
    recommendedCellBadgeJa: '🏋️ Si主流系（高出力スラブ）',
    recommendedCellBadgeEn: '🏋️ Silicon mainstream (high-output slab)',
  },
] as const

export function getSurfaceTypologyDetail(
  id: SurfaceTypology,
): SurfaceTypologyDetail {
  return SURFACE_TYPOLOGIES.find((t) => t.id === id) ?? SURFACE_TYPOLOGIES[0]
}

/** Typology → legacy balcony selector (undefined when roof-primary). */
const TYPOLOGY_TO_BALCONY: Partial<Record<SurfaceTypology, BalconyType>> = {
  egress_cantilever: 'standard',
  precast_parapet: 'standard',
  access_gallery: 'standard',
  glass_railing: 'juliet',
  recessed_loggia: 'recessed',
  flat_roof_terrace: 'roof_terrace',
}

/** Typology → legacy roof selector (undefined when balcony-primary). */
const TYPOLOGY_TO_ROOF: Partial<Record<SurfaceTypology, RoofType>> = {
  mansard_dormer: 'pitched_mansard_dormer',
  japanese_tiled_roof: 'pitched_gable',
  flat_roof_terrace: 'flat',
  pitched_gable_terrace: 'pitched_gable',
}

const BALCONY_TO_TYPOLOGY: Record<BalconyType, SurfaceTypology> = {
  standard: 'egress_cantilever',
  juliet: 'glass_railing',
  recessed: 'recessed_loggia',
  roof_terrace: 'flat_roof_terrace',
}

const ROOF_TO_TYPOLOGY: Record<RoofType, SurfaceTypology> = {
  flat: 'flat_roof_terrace',
  pitched_gable: 'pitched_gable_terrace',
  pitched_mansard_dormer: 'mansard_dormer',
}

export function typologyToBalconyType(id: SurfaceTypology): BalconyType | undefined {
  return TYPOLOGY_TO_BALCONY[id]
}

export function typologyToRoofType(id: SurfaceTypology): RoofType | undefined {
  return TYPOLOGY_TO_ROOF[id]
}

/** Bridge: balcony selector → primary typology. */
export function balconyTypeToTypology(type: BalconyType): SurfaceTypology {
  return BALCONY_TO_TYPOLOGY[type]
}

/** Bridge: roof selector → primary typology. */
export function roofTypeToTypology(type: RoofType): SurfaceTypology {
  return ROOF_TO_TYPOLOGY[type]
}

/**
 * Irradiance preset for a typology, falling back to legacy balcony/roof tables
 * when a bridge mapping exists.
 */
export function getTypologyIrradiance(id: SurfaceTypology): SurfaceIrradianceParams {
  const detail = getSurfaceTypologyDetail(id)
  const balcony = typologyToBalconyType(id)
  if (balcony && detail.category === 'balcony') {
    const preset = getBalconyTypePreset(balcony)
    return {
      receivingAreaM2: detail.irradiance.receivingAreaM2 || preset.receivingAreaM2,
      tiltDeg: detail.defaultTiltDeg,
      directRatio: detail.irradiance.directRatio,
      diffuseRatio: detail.irradiance.diffuseRatio,
    }
  }
  const roof = typologyToRoofType(id)
  if (roof && detail.category === 'roof') {
    const preset = getRoofTypePreset(roof)
    return {
      receivingAreaM2: detail.irradiance.receivingAreaM2 || preset.receivingAreaM2,
      tiltDeg: detail.defaultTiltDeg,
      directRatio: detail.irradiance.directRatio,
      diffuseRatio: detail.irradiance.diffuseRatio,
    }
  }
  return detail.irradiance
}

// Returns a suitability score (0-100) for the balcony simulator based on
// direction, railing type, time of day, and optional living / weather context.
export function computeBalconyScore(
  direction: Direction,
  railing: RailingType,
  hour: number,
  ctx: LivingContext = DEFAULT_LIVING_CONTEXT,
  tiltMode: PanelTiltMode = 'optimal_tilt',
): number {
  const directionScore: Record<Direction, number> = {
    south: 100,
    southeast: 88,
    southwest: 88,
    east: 68,
    west: 68,
  }
  const railingScore: Record<RailingType, number> = {
    glass: 100,
    grid: 90,
    concrete: 55,
  }
  // Bell curve centered at 12:30 across an 8:00-17:00 window.
  const distanceFromNoon = Math.abs(hour - 12.5)
  const timeScore = Math.max(30, 100 - distanceFromNoon * 12)

  const raw = directionScore[direction] * 0.45 + railingScore[railing] * 0.25 + timeScore * 0.3
  const living = resolveLivingMetrics(ctx, tiltMode, 'egress_cantilever')
  const weatherMul =
    ctx.weather === 'typhoon_alert' ? 0 : ctx.weather === 'overcast_tsuyu' ? 0.92 : 1
  const blended =
    raw * 0.62 +
    living.displayEfficiencyPct * 0.23 +
    living.lifeCompliancePct * 0.15
  return Math.round(Math.min(100, Math.max(0, blended * weatherMul)))
}

/** Life / safety fit for the balcony simulator card (0–100). */
export function computeBalconyLifeCompliance(
  ctx: LivingContext,
  tiltMode: PanelTiltMode = 'optimal_tilt',
): number {
  return resolveLivingMetrics(ctx, tiltMode, 'egress_cantilever').lifeCompliancePct
}

export function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs review'
}

export function recommendedKit(score: number): { panel: KitPanelKey; battery: KitStorageKey } {
  if (score >= 85) return { panel: 'panelDefault', battery: 'storageDefault' }
  if (score >= 70) return { panel: 'panelMid', battery: 'storageMid' }
  return { panel: 'panelLight', battery: 'storageLight' }
}
