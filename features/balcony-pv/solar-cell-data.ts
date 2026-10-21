import type { SurfaceTypology } from './simulator-data'

// ---------------------------------------------------------------------------
// ベランダソーラー生活実装 — 4大セル／パネル・タイポロジー
// （抽象素材論 → 避難動線・出仕舞いを含む Good Enough 実装軸）
// ---------------------------------------------------------------------------

/** Locale-independent solar cell / panel typology for balcony living. */
export type SolarCellTypeId =
  | 'rigid_silicon'
  | 'bipv_thin_film'
  | 'etfe_flexible_silicon'
  | 'origami_perovskite'

/**
 * @deprecated Suitability framing removed — use `categoryBadgeJa` / physical fields.
 * Kept so existing type re-exports keep compiling.
 */
export type BalconyFitStatus = 'n/a'

/** 開発史スイムレーンへの橋渡し（タイムライン用・3系統） */
export type SolarCellHistoryStreamId =
  | 'silicon_mainstream'
  | 'cigs_cdte'
  | 'organic_perovskite'

export type SolarCellFlexibility =
  | 'rigid'
  | 'semi-rigid'
  | 'flexible-etfe'
  | 'flexible-origami'

/**
 * Neutral physical + cross-link fields for the four panel typologies.
 * List cards use roleTitle / roleSubtitle / suitableSurfaceLabels / countries only
 * (see SolarCellTypeDetail); other badges/meters stay detail-sidebar-only.
 */
export interface SolarCellTypology {
  id: SolarCellTypeId
  nameJa: string
  categoryBadgeJa: string
  suitableSurfaceIds: string[]
  /** Suitable 3D surfaces (list-card chips). */
  suitableSurfaceLabels: { id: string; labelJa: string; labelEn: string }[]
  /** Key deployment countries (list-card chips). */
  representativeCountryCodes: string[]
  weightDescription: string
  thicknessDescription: string
  retractionMechanismJa: string
  lightAbsorptionJa: string
}

/** Consumer-facing surface titles aligned with renewed 3D form names (JA). */
const SURFACE_LABEL_JA: Record<SurfaceTypology, string> = {
  egress_cantilever: '一般的な集合住宅のベランダ（マンション・団地）',
  precast_parapet: 'コンクリート腰壁のあるベランダ',
  recessed_loggia: 'くぼんだ形のバルコニー',
  glass_railing: 'ガラス手すりのあるベランダ',
  access_gallery: 'マンションの共用廊下',
  mansard_dormer: '欧州の標準的な急勾配屋根（45°〜60°）',
  japanese_tiled_roof: '日本の標準的な戸建て屋根（スレート／ガルバリウム鋼板）',
  flat_roof_terrace: '平らな屋上（テラス付き）',
  pitched_gable_terrace: '連棟住宅の勾配屋根',
}

/** Consumer-facing surface titles aligned with `messages/en.json` typologies (EN). */
const SURFACE_LABEL_EN: Record<SurfaceTypology, string> = {
  egress_cantilever: 'Standard Apartment / Housing Complex Balcony',
  precast_parapet: 'Balcony with a concrete waist wall',
  recessed_loggia: 'Recessed balcony (set into the building)',
  glass_railing: 'Balcony with a glass railing',
  access_gallery: 'Shared corridor of an apartment building',
  mansard_dormer: 'Standard European steep-pitch roof (45°–60°)',
  japanese_tiled_roof: 'Standard Japanese house roof (slate / galvalume)',
  flat_roof_terrace: 'Flat rooftop with a terrace',
  pitched_gable_terrace: 'Pitched roof of a terraced house',
}

function surfaceLinkLabels(
  ids: readonly SurfaceTypology[],
): { id: string; labelJa: string; labelEn: string }[] {
  return ids.map((id) => ({
    id,
    labelJa: SURFACE_LABEL_JA[id] ?? id,
    labelEn: SURFACE_LABEL_EN[id] ?? id,
  }))
}

export interface SolarCellTypeDetail extends SolarCellTypology {
  nameEn: string
  categoryBadgeEn: string
  weightThicknessJa: string
  weightThicknessEn: string
  egressDeShimaiJa: string
  egressDeShimaiEn: string
  retractionMechanismEn: string
  lightAbsorptionEn: string
  descriptionJa: string
  descriptionEn: string
  /** ピーク出力ゲージ（0–100） */
  peakPowerScore: number
  /** 避難動線60cmクリア指標（0–100） */
  egressClearanceScore: number
  /** 身軽さ・設置容易度（0–100） */
  agilityScore: number
  firedElementJa: string
  firedElementEn: string
  shortBadgeJa: string
  shortBadgeEn: string
  roleTitleJa: string
  roleTitleEn: string
  roleSubtitleJa: string
  roleSubtitleEn: string
  generationShortJa: string
  generationShortEn: string
  thicknessMm: string
  flexibility: SolarCellFlexibility
  lightBadgeJa: string
  lightBadgeEn: string
  useCaseJa: string
  useCaseEn: string
  badgeClass: string
  accentBorderClass: string
  viewAngleLabels: [string, string, string]
  viewAngleLabelsEn: [string, string, string]
  environmentalFitJa: string
  environmentalFitEn: string
  cellStructureJa: string
  cellStructureEn: string
  primaryTypologyId: SurfaceTypology
  recommendedTypologyIds: SurfaceTypology[]
  historyStreamId: SolarCellHistoryStreamId
}

export const SOLAR_CELL_TYPE_IDS: readonly SolarCellTypeId[] = [
  'rigid_silicon',
  'bipv_thin_film',
  'etfe_flexible_silicon',
  'origami_perovskite',
] as const

export const SOLAR_CELL_TYPES: Record<SolarCellTypeId, SolarCellTypeDetail> = {
  rigid_silicon: {
    id: 'rigid_silicon',
    nameJa: '高出力・瓦固定パネル',
    nameEn: 'High-output tile-mount panel',
    categoryBadgeJa: '屋根・剛体架台用',
    categoryBadgeEn: 'Roof / rigid rack',
    suitableSurfaceIds: [
      'japanese_tiled_roof',
      'pitched_gable_terrace',
    ],
    suitableSurfaceLabels: surfaceLinkLabels([
      'japanese_tiled_roof',
      'pitched_gable_terrace',
    ]),
    representativeCountryCodes: ['DE', 'AU', 'US'],
    weightDescription: '21.0kg',
    thicknessDescription: '~35mm',
    retractionMechanismJa: '出仕舞い不可（固定式）',
    retractionMechanismEn: 'No stow-away (fixed mount)',
    lightAbsorptionJa: '30° 直達光主体',
    lightAbsorptionEn: '30° Direct beam',
    weightThicknessJa: '21.0kg / 約35mm（ガラス・アルミ枠）',
    weightThicknessEn: '21.0kg / ~35mm (glass + Al frame)',
    egressDeShimaiJa: '出仕舞い不可（固定式）',
    egressDeShimaiEn: 'No stow-away (fixed mount)',
    descriptionJa:
      '重い架台・耐風圧前提。ドイツ等で主流だが日本の手すり倒壊・避難路閉塞リスク大。',
    descriptionEn:
      'Heavy racks & wind-load assumed. Mainstream in DE etc., but high rail-collapse / egress-block risk in JP balconies.',
    peakPowerScore: 96,
    egressClearanceScore: 18,
    agilityScore: 22,
    firedElementJa: '燃料補給・遠隔自律電源の制約を解雇',
    firedElementEn: 'Fires fuel-resupply / remote power constraints',
    shortBadgeJa: '重量級高出力',
    shortBadgeEn: 'Heavy yield',
    roleTitleJa: '高出力・瓦固定パネル',
    roleTitleEn: 'High-output tile-mount panel',
    roleSubtitleJa: '固定架台・耐風圧の大黒柱',
    roleSubtitleEn: 'Fixed-rack wind-load workhorse',
    generationShortJa: '第1世代',
    generationShortEn: 'Gen 1',
    thicknessMm: '~35mm (glass + frame)',
    flexibility: 'rigid',
    lightBadgeJa: '30° 直達光主体',
    lightBadgeEn: '30° Direct beam',
    useCaseJa: '勾配屋根・野立て',
    useCaseEn: 'Pitched roof / ground mount',
    badgeClass:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20',
    accentBorderClass: 'border-emerald-500/40',
    viewAngleLabels: ['正面セル格子', '斜めフレーム厚', '側面35mm断面'],
    viewAngleLabelsEn: ['Front cell grid', 'Angled frame depth', '35mm side cut'],
    environmentalFitJa: '直達光・耐風圧前提の屋外定置',
    environmentalFitEn: 'Outdoor fixed mount — direct beam & wind load',
    cellStructureJa: '単結晶Siウェハ + 強化ガラス + アルミフレーム',
    cellStructureEn: 'Mono-Si wafer + tempered glass + aluminum frame',
    primaryTypologyId: 'japanese_tiled_roof',
    recommendedTypologyIds: [
      'japanese_tiled_roof',
      'pitched_gable_terrace',
    ],
    historyStreamId: 'silicon_mainstream',
  },
  bipv_thin_film: {
    id: 'bipv_thin_film',
    nameJa: '手すり一体の発電ガラスパネル',
    nameEn: 'Rail-integrated glass panel',
    categoryBadgeJa: '建材一体ガラス',
    categoryBadgeEn: 'Building-integrated glass',
    suitableSurfaceIds: ['egress_cantilever', 'glass_railing'],
    suitableSurfaceLabels: surfaceLinkLabels(['egress_cantilever', 'glass_railing']),
    representativeCountryCodes: ['DE', 'FR', 'CH'],
    weightDescription: 'Heavy glass BIPV',
    thicknessDescription: '~3–5mm',
    retractionMechanismJa: '常設建材（取り外し不可）',
    retractionMechanismEn: 'Permanent fabric (not removable)',
    lightAbsorptionJa: '垂直壁面受光',
    lightAbsorptionEn: 'Vertical façade capture',
    weightThicknessJa: '重厚ガラス建材 / 約3〜5mm',
    weightThicknessEn: 'Heavy glass BIPV / ~3–5mm',
    egressDeShimaiJa: '常設建材（取り外し不可）',
    egressDeShimaiEn: 'Permanent fabric (not removable)',
    descriptionJa:
      '手すり板そのものを発電ガラス化。欧州美観条例クリアだが既存後付けは困難。',
    descriptionEn:
      'Turns the rail itself into PV glass. Clears EU aesthetics codes; hard to retrofit on existing stock.',
    peakPowerScore: 74,
    egressClearanceScore: 52,
    agilityScore: 48,
    firedElementJa: 'シリコン厚板が置けない垂直・酷暑面の制約を解雇',
    firedElementEn: 'Fires thick-Si limits on hot vertical façades',
    shortBadgeJa: '酷暑耐性',
    shortBadgeEn: 'Heat-tough',
    roleTitleJa: '手すり一体の発電ガラスパネル',
    roleTitleEn: 'Rail-integrated glass panel',
    roleSubtitleJa: '手すり／ファサード建材型',
    roleSubtitleEn: 'Rail / façade building fabric',
    generationShortJa: '第2世代',
    generationShortEn: 'Gen 2',
    thicknessMm: '~3–5mm (glass-integrated)',
    flexibility: 'semi-rigid',
    lightBadgeJa: '垂直壁面受光',
    lightBadgeEn: 'Vertical façade capture',
    useCaseJa: '新築手すり・腰壁建材',
    useCaseEn: 'New-build rail / parapet BIPV',
    badgeClass:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20',
    accentBorderClass: 'border-emerald-500/40',
    viewAngleLabels: ['正面鏡面ガラス', '斜めスペキュラ', 'ガラス切断面'],
    viewAngleLabelsEn: ['Front mirror glass', 'Angled specular', 'Glass cut edge'],
    environmentalFitJa: '酷暑・垂直ファサードでも落ちにくい',
    environmentalFitEn: 'Holds on hot vertical façades',
    cellStructureJa: 'ガラス一体型化合物薄膜（CdTe / CIGS）・フレームレス',
    cellStructureEn: 'Glass-integrated compound thin film (CdTe / CIGS), frameless',
    primaryTypologyId: 'glass_railing',
    recommendedTypologyIds: ['egress_cantilever', 'glass_railing'],
    historyStreamId: 'cigs_cdte',
  },
  etfe_flexible_silicon: {
    id: 'etfe_flexible_silicon',
    nameJa: '超軽量フレキシブルパネル',
    nameEn: 'Ultralight flexible panel',
    categoryBadgeJa: '超軽量フッ素シート',
    categoryBadgeEn: 'Ultralight fluoropolymer sheet',
    suitableSurfaceIds: [
      'egress_cantilever',
      'glass_railing',
      'access_gallery',
    ],
    suitableSurfaceLabels: surfaceLinkLabels([
      'egress_cantilever',
      'glass_railing',
      'access_gallery',
    ]),
    representativeCountryCodes: ['JP', 'DE', 'NL'],
    weightDescription: '2.5kg',
    thicknessDescription: '~2–3mm',
    retractionMechanismJa: '手動取り外し退避',
    retractionMechanismEn: 'Manual detach & stow',
    lightAbsorptionJa: '手すり密着・直達+散乱',
    lightAbsorptionEn: 'Rail-flush · beam + diffuse',
    weightThicknessJa: '2.5kg / 約2〜3mm（ETFEフッ素樹脂シート）',
    weightThicknessEn: '2.5kg / ~2–3mm (ETFE fluoropolymer sheet)',
    egressDeShimaiJa: '手動取り外し退避',
    egressDeShimaiEn: 'Manual detach & stow',
    descriptionJa:
      '強化ガラスを解雇し手すり格子に密着固定。真夏の裏面熱ダレ（-10〜15%）と割り切る現行最適解。',
    descriptionEn:
      'Fires tempered glass; zip-ties to rail grid. Accepts summer back-side heat sag (−10–15%) as the current optimum.',
    peakPowerScore: 78,
    egressClearanceScore: 82,
    agilityScore: 86,
    firedElementJa: '強化ガラス・アルミ枠・重い架台を解雇',
    firedElementEn: 'Fires tempered glass, Al frame & heavy racks',
    shortBadgeJa: '現行Good Enough',
    shortBadgeEn: 'Good Enough now',
    roleTitleJa: '超軽量フレキシブルパネル',
    roleTitleEn: 'Ultralight flexible panel',
    roleSubtitleJa: '2〜3kg・避難動線保持・熱ダレ許容',
    roleSubtitleEn: '2–3kg · egress kept · heat-sag trade-off',
    generationShortJa: '現行解',
    generationShortEn: 'Current',
    thicknessMm: '~2–3mm (ETFE sheet)',
    flexibility: 'flexible-etfe',
    lightBadgeJa: '手すり密着・直達+散乱',
    lightBadgeEn: 'Rail-flush · beam + diffuse',
    useCaseJa: '既存ベランダ手すり格子',
    useCaseEn: 'Existing balcony rail grid',
    badgeClass:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20',
    accentBorderClass: 'border-emerald-500/40',
    viewAngleLabels: ['正面ETFEシート', '斜めハトメ固定', '薄型2mm断面'],
    viewAngleLabelsEn: ['Front ETFE sheet', 'Angled grommet mount', '2mm thin section'],
    environmentalFitJa: '軽量密着・熱ダレを許容する現行解',
    environmentalFitEn: 'Light flush-mount; accepts heat sag',
    cellStructureJa: '単結晶Si + ETFEフッ素樹脂シート（ハトメ／結束バンド固定）',
    cellStructureEn: 'Mono-Si + ETFE fluoropolymer sheet (grommet / zip-tie mount)',
    primaryTypologyId: 'egress_cantilever',
    recommendedTypologyIds: [
      'egress_cantilever',
      'glass_railing',
      'access_gallery',
    ],
    historyStreamId: 'silicon_mainstream',
  },
  origami_perovskite: {
    id: 'origami_perovskite',
    nameJa: '折りたためる超軽量パネル',
    nameEn: 'Fold-away ultralight panel',
    categoryBadgeJa: '自律可動・収納型',
    categoryBadgeEn: 'Self-stowing furniture',
    suitableSurfaceIds: [
      'egress_cantilever',
      'recessed_loggia',
      'access_gallery',
    ],
    suitableSurfaceLabels: surfaceLinkLabels([
      'egress_cantilever',
      'recessed_loggia',
      'access_gallery',
    ]),
    representativeCountryCodes: ['JP', 'CN', 'DE'],
    weightDescription: '<1.0kg',
    thicknessDescription: '<1mm',
    retractionMechanismJa: '剛体折り紙完全退避',
    retractionMechanismEn: 'Rigid-origami full stow',
    lightAbsorptionJa: '可変 散乱光適応',
    lightAbsorptionEn: 'Variable · diffuse adaptive',
    weightThicknessJa: '1.0kg未満 / 1mm未満（薄膜フィルム）',
    weightThicknessEn: '<1.0kg / <1mm (thin-film foil)',
    egressDeShimaiJa: '剛体折り紙完全退避',
    egressDeShimaiEn: 'Rigid-origami full stow',
    descriptionJa:
      '散乱光発電 × 剛体折り紙。外力と戦わず葉を閉じるように避難動線を即時開放。',
    descriptionEn:
      'Diffuse-light PV × rigid origami. Does not fight wind — folds like a leaf to free egress instantly.',
    peakPowerScore: 58,
    egressClearanceScore: 98,
    agilityScore: 96,
    firedElementJa: '重いガラス・金属架台・屋根限定を解雇',
    firedElementEn: 'Fires heavy glass, metal racks & roof-only rules',
    shortBadgeJa: '可動・収納型',
    shortBadgeEn: 'Stow furniture',
    roleTitleJa: '折りたためる超軽量パネル',
    roleTitleEn: 'Fold-away ultralight panel',
    roleSubtitleJa: '次世代・避難動線即時開放',
    roleSubtitleEn: 'Next-gen · instant egress release',
    generationShortJa: '次世代',
    generationShortEn: 'Next-gen',
    thicknessMm: '<1mm (film)',
    flexibility: 'flexible-origami',
    lightBadgeJa: '可変 散乱光適応',
    lightBadgeEn: 'Variable · diffuse adaptive',
    useCaseJa: 'ベランダ・手すり家具',
    useCaseEn: 'Balcony / rail furniture',
    badgeClass:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20',
    accentBorderClass: 'border-emerald-500/40',
    viewAngleLabels: ['正面展開面', '斜めヒンジ', '折り畳み断面'],
    viewAngleLabelsEn: ['Front unfolded', 'Angled hinge', 'Folded cross-section'],
    environmentalFitJa: '散乱光・出仕舞い退避で耐風',
    environmentalFitEn: 'Diffuse light · stow away from wind',
    cellStructureJa: 'ペロブスカイト薄膜フィルム（剛体折り紙ヒンジ可）',
    cellStructureEn: 'Perovskite thin-film foil (rigid-origami hinge capable)',
    primaryTypologyId: 'egress_cantilever',
    recommendedTypologyIds: [
      'egress_cantilever',
      'recessed_loggia',
      'access_gallery',
    ],
    historyStreamId: 'organic_perovskite',
  },
}

/** History swimlane → default living typology (Si history lands on rigid by default). */
export function solarCellTypeFromHistoryStream(
  stream: SolarCellHistoryStreamId,
): SolarCellTypeId {
  switch (stream) {
    case 'silicon_mainstream':
      return 'rigid_silicon'
    case 'cigs_cdte':
      return 'bipv_thin_film'
    case 'organic_perovskite':
      return 'origami_perovskite'
  }
}

export function getSolarCellType(id: SolarCellTypeId): SolarCellTypeDetail {
  return SOLAR_CELL_TYPES[id]
}

export function listSolarCellTypologies(): SolarCellTypeDetail[] {
  return SOLAR_CELL_TYPE_IDS.map((id) => SOLAR_CELL_TYPES[id])
}

/** Reverse link: 3D surface → recommended panel typologies. */
export function getSolarCellTypesForSurface(
  surfaceId: string,
): SolarCellTypeDetail[] {
  return listSolarCellTypologies().filter(
    (cell) =>
      cell.suitableSurfaceIds.includes(surfaceId) ||
      cell.primaryTypologyId === surfaceId ||
      cell.recommendedTypologyIds.includes(surfaceId as SurfaceTypology),
  )
}

/** Reverse link: ISO country code → representative panel typologies. */
export function getSolarCellTypesForCountryCode(
  countryCode: string,
): SolarCellTypeDetail[] {
  const code = countryCode.trim().toUpperCase()
  if (!code) return []
  return listSolarCellTypologies().filter((cell) =>
    cell.representativeCountryCodes.some((c) => c.toUpperCase() === code),
  )
}
