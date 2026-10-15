import type { AdoptedVendorId, SurfaceTypology } from './data'

/** 太陽電池セル開発史のスイムレーン系統（結晶Si・化合物薄膜・有機/ペロブスカイト） */
export type PvHistoryStream =
  | 'silicon_mainstream' // 結晶Si・HIT・主系統
  | 'cigs_cdte' // 化合物薄膜
  | 'organic_perovskite' // 有機系・ペロブスカイト

export interface PvHistoryMilestone {
  id: string
  year: string
  stream: PvHistoryStream
  significance: 'disruptive' | 'major' | 'normal'
  titleJa: string
  titleEn: string
  /** タイムラインカード用：専門用語なしの直感的な1行要約 */
  oneLinerJa: string
  oneLinerEn: string
  /** タイムラインカード用：物語がつながる平易な補足解説（2〜3行） */
  storyJa: string
  storyEn: string
  keyFigure?: string
  /** モーダル詳細用：クリステンセン理論による深掘り分析 */
  jtbdAnalysis?: {
    /** 解消された不便・手放した制約（Fire） */
    firedInconvenienceJa: string
    firedInconvenienceEn: string
    /** 手に入れた新体験・新しい置き場（Hire） */
    hiredJobJa: string
    hiredJobEn: string
  }
  recommendedTypologyIds?: SurfaceTypology[]
  relatedVendorIds?: AdoptedVendorId[]
  physicsTags: string[]
}

/** 3Dパネル観察用のセル構造・物性スペック */
export interface Cell3DVisualSpec {
  /** 例: '単結晶Siウェハ + 強化ガラス + アルミフレーム' */
  cellStructureJa: string
  cellStructureEn: string
  /** 例: '約30〜40mm (ガラス・フレーム込)' */
  thicknessMm: string
  flexibility: 'rigid' | 'semi-rigid' | 'flexible-etfe' | 'flexible-origami'
  lightType: 'direct_beam' | 'high_temperature' | 'diffuse_dominant'
  /** 一覧カード右上: 例 '30° 直達光主体' */
  lightBadgeJa: string
  lightBadgeEn: string
  /** ピルタグ: 主要用途 */
  useCaseJa: string
  useCaseEn: string
}

/** クリステンセン的トレードオフ直感メーター用パラメーター */
export interface StreamTradeoffMetric {
  /** 分子スペック：晴天ピーク出力（0-100） */
  peakPowerScore: number
  /** 分母スペック：身軽さ・設置容易度（0-100、薄さ・軽さ・工事不要度） */
  agilityScore: number
  /** 耐環境性ラベル */
  environmentalFitJa: string
  environmentalFitEn: string
  /** 直感キャッチコピー（8文字以内） */
  shortBadgeJa: string
  shortBadgeEn: string
  /** 観察視点固有ラベル [正面, 斜め, 固有アングル] */
  viewAngleLabels: [string, string, string]
  viewAngleLabelsEn: [string, string, string]
  /** セレクター用の役割キャラ付け */
  roleTitleJa: string
  roleTitleEn: string
  roleSubtitleJa: string
  roleSubtitleEn: string
}

/** ベランダ生活適合（設置スタンプ・出仕舞い・避難動線） */
export interface BalconyLivingFit {
  /** 不可 / 条件付き / 現行Good Enough / 次世代理想 */
  balconyFitStatus: 'unfit' | 'conditional' | 'good_enough' | 'optimal'
  balconyFitLabelJa: string
  /** 出仕舞い（台風退避）性能 */
  deShimaiAbilityJa: string
  /** 消防避難動線（60cm）のクリア度 */
  egressClearanceScore: number
  /** 重量・厚みバッジ */
  weightThicknessJa?: string
  /** 解雇した要素 */
  firedElementJa?: string
}

/** 三大分類サマリーカード用マスター */
export interface PvStreamSummary {
  id: PvHistoryStream
  labelJa: string
  labelEn: string
  generationLabelJa: string
  generationLabelEn: string
  /** カード用短い世代バッジ: 例 '第1世代' */
  generationShortJa: string
  generationShortEn: string
  taglineJa: string
  taglineEn: string
  /** カードフッター: 構造的ポイント解説（1行） */
  structuralPointJa: string
  structuralPointEn: string
  bestFitPlaceJa: string
  bestFitPlaceEn: string
  /** 相対発電効率（%）・生活・安全適合度（%） */
  relativeEfficiencyPct: number
  livingFitnessPct: number
  /** トレードオフ直感メーター（ピーク発電力 vs 身軽さ） */
  tradeoff: StreamTradeoffMetric
  /** ベランダ生活適合（設置・出仕舞い・避難動線） */
  balconyLivingFit: BalconyLivingFit
  /** カードクリック時に遷移する代表的な3D建築形態 */
  primaryTypologyId: SurfaceTypology
  recommendedTypologyIds: SurfaceTypology[]
  keyMilestoneYears: string[]
  badgeClass: string
  accentBorderClass: string
  /** 3Dモデル・物性タグ用メタデータ */
  cell3d: Cell3DVisualSpec
  /** 系統が解消した代表的な制約（Fire） */
  firedConstraintJa: string
  firedConstraintEn: string
}

/** @deprecated Prefer PvStreamSummary */
export type PvHistoryStreamMeta = PvStreamSummary

export const PV_HISTORY_STREAMS: Record<PvHistoryStream, PvStreamSummary> = {
  silicon_mainstream: {
    id: 'silicon_mainstream',
    labelJa: '屋根用・重厚リジッド型（c-Si）',
    labelEn: 'Heavy rigid rooftop (c-Si)',
    generationLabelJa: '第1世代（現在シェア9割超）',
    generationLabelEn: '1st generation (~90%+ market share)',
    generationShortJa: '第1世代',
    generationShortEn: 'Gen 1',
    taglineJa: '硬くて重いが、最も安く大量発電する大黒柱',
    taglineEn: 'Hard and heavy — the workhorse that generates cheapest at scale',
    structuralPointJa:
      '重い架台・耐風圧前提。ドイツ等で主流だが日本の手すり倒壊・避難路閉塞リスク大。',
    structuralPointEn:
      'Heavy racks & wind-load assumed. Mainstream abroad, high rail-collapse / egress risk on JP balconies.',
    bestFitPlaceJa: '勾配屋根・野立て（直達光と堅固な架台がある場所）',
    bestFitPlaceEn: 'Pitched roofs & ground mounts (direct sun + solid racks)',
    relativeEfficiencyPct: 100,
    livingFitnessPct: 35,
    tradeoff: {
      peakPowerScore: 96,
      agilityScore: 28,
      environmentalFitJa: '直達光・耐風圧前提の屋外定置',
      environmentalFitEn: 'Outdoor fixed mount — direct beam & wind load',
      shortBadgeJa: '重量級高出力',
      shortBadgeEn: 'Heavy yield',
      viewAngleLabels: ['正面セル格子', '斜めフレーム厚', '側面35mm断面'],
      viewAngleLabelsEn: ['Front cell grid', 'Angled frame depth', '35mm side cut'],
      roleTitleJa: '屋根用・重厚リジッド型（c-Si）',
      roleTitleEn: 'Heavy rigid rooftop (c-Si)',
      roleSubtitleJa: '固定架台・耐風圧の大黒柱',
      roleSubtitleEn: 'Fixed-rack wind-load workhorse',
    },
    balconyLivingFit: {
      balconyFitStatus: 'unfit',
      balconyFitLabelJa: '❌ ベランダ設置不可',
      deShimaiAbilityJa: '出仕舞い不可（固定架台必須・風圧衝突）',
      egressClearanceScore: 18,
      weightThicknessJa: '21.0kg / 約35mm（ガラス・アルミ枠）',
      firedElementJa: '燃料補給・遠隔自律電源の制約を解雇',
    },
    primaryTypologyId: 'japanese_tiled_roof',
    recommendedTypologyIds: [
      'japanese_tiled_roof',
      'pitched_gable_terrace',
      'flat_roof_terrace',
    ],
    keyMilestoneYears: ['1954年', '1980年', '1990年'],
    badgeClass:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20',
    accentBorderClass: 'border-emerald-500/40',
    cell3d: {
      cellStructureJa: '単結晶Siウェハ + 強化ガラス + アルミフレーム',
      cellStructureEn: 'Mono-Si wafer + tempered glass + aluminum frame',
      thicknessMm: '約35mm（ガラス・フレーム込）',
      flexibility: 'rigid',
      lightType: 'direct_beam',
      lightBadgeJa: '30° 直達光主体',
      lightBadgeEn: '30° Direct beam',
      useCaseJa: '勾配屋根・野立て',
      useCaseEn: 'Pitched roof / ground mount',
    },
    firedConstraintJa:
      '燃料補給できない宇宙・遠隔地でも、堅牢な板状セルで自律電源を確保できる',
    firedConstraintEn:
      'Hard-panel cells that run without fuel resupply in space and remote sites',
  },
  cigs_cdte: {
    id: 'cigs_cdte',
    labelJa: '酷暑耐性・BIPVガラス建材（CIGS/CdTe）',
    labelEn: 'Heat-tough BIPV glass (CIGS/CdTe)',
    generationLabelJa: '第2世代（大面積・高温向け）',
    generationLabelEn: '2nd generation (large-area / high-heat)',
    generationShortJa: '第2世代',
    generationShortEn: 'Gen 2',
    taglineJa: '手すり板そのものを発電ガラス化する建材型',
    taglineEn: 'Turns the rail itself into generating glass fabric',
    structuralPointJa:
      '手すり板そのものを発電ガラス化。欧州美観条例クリアだが既存後付けは困難。',
    structuralPointEn:
      'Rail-as-PV glass. Clears EU aesthetics codes; hard to retrofit on existing stock.',
    bestFitPlaceJa: '高温砂漠・ビルの垂直壁面・堅牢な腰壁',
    bestFitPlaceEn: 'Hot deserts, vertical façades, and sturdy parapets',
    relativeEfficiencyPct: 78,
    livingFitnessPct: 55,
    tradeoff: {
      peakPowerScore: 74,
      agilityScore: 58,
      environmentalFitJa: '酷暑・垂直ファサードでも落ちにくい',
      environmentalFitEn: 'Holds on hot vertical façades',
      shortBadgeJa: '酷暑耐性',
      shortBadgeEn: 'Heat-tough',
      viewAngleLabels: ['正面鏡面ガラス', '斜めスペキュラ', 'ガラス切断面'],
      viewAngleLabelsEn: ['Front mirror glass', 'Angled specular', 'Glass cut edge'],
      roleTitleJa: '酷暑耐性・BIPVガラス建材（CIGS/CdTe）',
      roleTitleEn: 'Heat-tough BIPV glass (CIGS/CdTe)',
      roleSubtitleJa: '手すり／ファサード建材型',
      roleSubtitleEn: 'Rail / façade building fabric',
    },
    balconyLivingFit: {
      balconyFitStatus: 'conditional',
      balconyFitLabelJa: '⚠️ 条件付き（新築・手すり建材）',
      deShimaiAbilityJa: '常設建材（後付けDIY不可）',
      egressClearanceScore: 52,
      weightThicknessJa: '重厚ガラス建材 / 約3〜5mm',
      firedElementJa: 'シリコン厚板が置けない垂直・酷暑面の制約を解雇',
    },
    primaryTypologyId: 'precast_parapet',
    recommendedTypologyIds: ['precast_parapet'],
    keyMilestoneYears: ['1960年', '1974年', '2009年'],
    badgeClass:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20',
    accentBorderClass: 'border-emerald-500/40',
    cell3d: {
      cellStructureJa: 'ガラス一体型化合物薄膜（CdTe / CIGS）・フレームレス',
      cellStructureEn: 'Glass-integrated compound thin film (CdTe / CIGS), frameless',
      thicknessMm: '約3〜5mm（ガラス一体）',
      flexibility: 'semi-rigid',
      lightType: 'high_temperature',
      lightBadgeJa: '90° 垂直壁面',
      lightBadgeEn: '90° Vertical façade',
      useCaseJa: '垂直壁面・腰壁',
      useCaseEn: 'Vertical wall / parapet',
    },
    firedConstraintJa:
      '高温・垂直壁面でも落ちにくい薄膜で、シリコン厚板が置けない場所の発電制約を解消',
    firedConstraintEn:
      'Thin films that hold up in heat and on vertical walls where thick Si panels fail',
  },
  organic_perovskite: {
    id: 'organic_perovskite',
    labelJa: '超軽量・剛体折り紙出仕舞い（ペロブスカイト）',
    labelEn: 'Ultralight rigid-origami stow (perovskite)',
    generationLabelJa: '次世代（軽量・フレキシブル家具解）',
    generationLabelEn: 'Next-gen (ultralight furniture)',
    generationShortJa: '次世代',
    generationShortEn: 'Next-gen',
    taglineJa: '散乱光発電 × 剛体折り紙で避難動線を即時開放',
    taglineEn: 'Diffuse PV × rigid origami — frees egress instantly',
    structuralPointJa:
      '散乱光発電 × 剛体折り紙。外力と戦わず葉を閉じるように避難動線を即時開放。',
    structuralPointEn:
      'Diffuse-light PV × rigid origami. Folds like a leaf to free egress instantly.',
    bestFitPlaceJa: 'ベランダ手すり・日陰のロッジア・耐荷重のない屋根',
    bestFitPlaceEn: 'Balcony rails, shaded loggias, and low-load roofs',
    relativeEfficiencyPct: 62,
    livingFitnessPct: 92,
    tradeoff: {
      peakPowerScore: 58,
      agilityScore: 96,
      environmentalFitJa: '散乱光・出仕舞い退避で耐風',
      environmentalFitEn: 'Diffuse light · stow away from wind',
      shortBadgeJa: '出仕舞い家具',
      shortBadgeEn: 'Stow furniture',
      viewAngleLabels: ['正面展開面', '斜めヒンジ', '折り畳み断面'],
      viewAngleLabelsEn: ['Front unfolded', 'Angled hinge', 'Folded cross-section'],
      roleTitleJa: '超軽量・剛体折り紙出仕舞い（ペロブスカイト）',
      roleTitleEn: 'Ultralight rigid-origami stow (perovskite)',
      roleSubtitleJa: '次世代・避難動線即時開放',
      roleSubtitleEn: 'Next-gen · instant egress release',
    },
    balconyLivingFit: {
      balconyFitStatus: 'optimal',
      balconyFitLabelJa: '🌟 ベランダ最適（次世代家具解）',
      deShimaiAbilityJa: '出仕舞い完全対応（強風・夜間に1秒で自動・受動退避）',
      egressClearanceScore: 98,
      weightThicknessJa: '1.0kg未満 / 1mm未満（薄膜フィルム）',
      firedElementJa: '重いガラス・金属架台・屋根限定を解雇',
    },
    primaryTypologyId: 'egress_cantilever',
    recommendedTypologyIds: [
      'egress_cantilever',
      'glass_railing',
      'mansard_dormer',
    ],
    keyMilestoneYears: ['1977年', '2009年', '2026年'],
    badgeClass:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20',
    accentBorderClass: 'border-emerald-500/40',
    cell3d: {
      cellStructureJa: 'ペロブスカイト薄膜フィルム（剛体折り紙ヒンジ可）',
      cellStructureEn: 'Perovskite thin-film foil (rigid-origami hinge capable)',
      thicknessMm: '1mm未満（フィルム）',
      flexibility: 'flexible-origami',
      lightType: 'diffuse_dominant',
      lightBadgeJa: '可変 散乱光対応',
      lightBadgeEn: 'Variable · Diffuse light',
      useCaseJa: 'ベランダ・手すり家具',
      useCaseEn: 'Balcony / rail furniture',
    },
    firedConstraintJa:
      '重いガラス・金属架台と屋根限定の制約を解消し、散乱光・曲面でも貼れる発電へ',
    firedConstraintEn:
      'Drops heavy glass/racks and roof-only rules — stick-on power for diffuse light and curves',
  },
}

export const PV_HISTORY_MILESTONES: readonly PvHistoryMilestone[] = [
  {
    id: '1839-becquerel',
    year: '1839年',
    stream: 'silicon_mainstream',
    significance: 'major',
    titleJa: '湿式セルで光起電力を初確認',
    titleEn: 'First photovoltaic effect in a wet cell',
    oneLinerJa: '光を当てると電気が起きる不思議な現象の発見',
    oneLinerEn: 'The discovery that light on a surface can make electricity flow',
    storyJa:
      '溶液中の電極に光を当てた瞬間、わずかな電流が発生。太陽電池という発想のすべての原点となった物理的発見。',
    storyEn:
      'Light on electrodes in a solution produced a tiny current — the physical spark that began the idea of solar cells.',
    keyFigure: 'E. ベクレル',
    physicsTags: ['photovoltaic_effect', 'photoelectrochemistry'],
  },
  {
    id: '1954-bell-si-cell',
    year: '1954年',
    stream: 'silicon_mainstream',
    significance: 'disruptive',
    titleJa: 'p-n接合型 Si太陽電池の誕生',
    titleEn: 'Birth of the p–n junction Si solar cell',
    oneLinerJa: '硬いシリコン板から生まれた、近代太陽電池の原点',
    oneLinerEn: 'A hard silicon wafer that became the origin of modern solar cells',
    storyJa:
      '宇宙衛星の電源として実用化され、地上でも使える太陽電池の歴史がスタート。高価で重い板だったが、無尽蔵の太陽光を電気に変える夢を現実に。',
    storyEn:
      'First used to power satellites, then brought solar cells to Earth. Expensive and heavy — but it made endless sunlight into electricity a reality.',
    keyFigure: 'ベル研',
    jtbdAnalysis: {
      firedInconvenienceJa:
        '宇宙空間で燃料補給ができないという物理的限界を解消',
      firedInconvenienceEn:
        'Removed the hard limit of no fuel resupply in space',
      hiredJobJa:
        '衛星や遠隔地無人灯台など、過酷環境で自律稼働する高信頼電源として雇用',
      hiredJobEn:
        'Hired as a trusted self-running power source for satellites and remote unmanned lights',
    },
    recommendedTypologyIds: ['pitched_gable_terrace', 'flat_roof_terrace'],
    relatedVendorIds: ['enphase', 'solaredge', 'sunrun'],
    physicsTags: ['p-n_junction', 'crystalline_Si', 'diffusion'],
  },
  {
    id: '1960-cdte-first-pn',
    year: '1960年',
    stream: 'cigs_cdte',
    significance: 'normal',
    titleJa: '単結晶 CdTe 薄膜の萌芽',
    titleEn: 'Early single-crystal CdTe thin films',
    oneLinerJa: 'シリコンとは違う『化合物』で薄く作れないかの模索',
    oneLinerEn: 'Exploring thinner cells from compound materials, not silicon',
    storyJa:
      'カドミウム・テルルなど別の半導体素材を使い、シリコンよりも薄い膜で光を吸収できる可能性が示され始めた。',
    storyEn:
      'Materials like cadmium telluride began to show that a thinner film than silicon could still absorb light.',
    recommendedTypologyIds: ['flat_roof_terrace', 'precast_parapet'],
    relatedVendorIds: ['solaredge'],
    physicsTags: ['CdTe', 'thin_film', 'compound_semiconductor'],
  },
  {
    id: '1974-cuinse2-hetero',
    year: '1974年',
    stream: 'cigs_cdte',
    significance: 'normal',
    titleJa: 'CuInSe₂ 単結晶ヘテロ接合',
    titleEn: 'CuInSe₂ single-crystal heterojunction',
    oneLinerJa: '光を強力に吸い取る新しい薄膜素材（CIGS）の原型',
    oneLinerEn: 'The prototype of CIGS — a thin film that drinks in light',
    storyJa:
      '銅・インジウム・セレンを組み合わせ、わずかな厚みでも光を逃さない化合物薄膜の研究が本格化。',
    storyEn:
      'Copper, indium, and selenium were combined so even a thin layer could hold onto light — the start of serious compound thin-film research.',
    recommendedTypologyIds: ['precast_parapet', 'glass_railing', 'access_gallery'],
    relatedVendorIds: ['solaredge', 'priwatt'],
    physicsTags: ['chalcopyrite', 'heterojunction', 'direct_gap'],
  },
  {
    id: '1975-a-si-breakthrough',
    year: '1975年',
    stream: 'silicon_mainstream',
    significance: 'disruptive',
    titleJa: '【薄膜転換点】a-Si（アモルファスSi）の価電子制御成功',
    titleEn: 'Thin-film turning point: a-Si valence control',
    oneLinerJa: '結晶を作らずに『塗る』ように薄膜を作る技術のブレイクスルー',
    oneLinerEn: 'A breakthrough: making thin films by coating, without growing crystals',
    storyJa:
      '高温で結晶を育てる膨大な手間を省き、気体を吹き付けるだけで安く大面積に半導体膜を作れる技術を確立。太陽光パネルの低コスト化へ扉を開いた。',
    storyEn:
      'Skipping the hard work of growing crystals in hot furnaces, gases could be sprayed into a cheap, large-area film — opening the door to lower-cost solar panels.',
    keyFigure: 'スピア/ルカンバー',
    jtbdAnalysis: {
      firedInconvenienceJa:
        '高温炉でインゴットを結晶成長させる莫大な製造コスト・エネルギーを解消',
      firedInconvenienceEn:
        'Removed the huge cost and energy of growing crystal ingots in hot furnaces',
      hiredJobJa:
        'ガラスやフィルムに安価に吹き付け成膜できる大面積薄膜素材として雇用',
      hiredJobEn:
        'Hired as a large-area thin film that can be cheaply sprayed onto glass or foil',
    },
    recommendedTypologyIds: ['glass_railing', 'recessed_loggia'],
    relatedVendorIds: ['anker-solix', 'yuma'],
    physicsTags: ['a-Si:H', 'doping', 'localized_states', 'thin_film'],
  },
  {
    id: '1977-conductive-polymer',
    year: '1977年',
    stream: 'organic_perovskite',
    significance: 'normal',
    titleJa: '導電性高分子の誕生',
    titleEn: 'Birth of conductive polymers',
    oneLinerJa: '電気を通すプラスチックの発見（白川英樹）',
    oneLinerEn: 'The discovery of plastic that conducts electricity (Hideki Shirakawa)',
    storyJa:
      '『プラスチック＝電気を通さない絶縁体』という常識を覆し、柔らかい素材でも電子が流れることを実証。後の有機・フィルム型太陽電池の礎となる。',
    storyEn:
      'Overturned the idea that plastic must be an insulator — soft materials could carry electrons. The foundation for later organic and film solar cells.',
    keyFigure: '白川英樹',
    recommendedTypologyIds: ['egress_cantilever', 'glass_railing'],
    relatedVendorIds: ['ecoflow', 'jackery'],
    physicsTags: ['conjugated_polymer', 'doping', 'organic_semiconductor'],
  },
  {
    id: '1980-sanyo-solar-calc',
    year: '1980年',
    stream: 'silicon_mainstream',
    significance: 'disruptive',
    titleJa: '集積型 a-Si ソーラー電卓の実用化',
    titleEn: 'Integrated a-Si solar calculator commercialized',
    oneLinerJa: '発電効率競争を降りて、室内光で動く電卓として生活の中へ',
    oneLinerEn: 'Leaving the efficiency race — solar that works under indoor light in everyday life',
    storyJa:
      '直射日光下の効率は低くても『室内の蛍光灯で動く』という強みを活かして電卓に内蔵。太陽電池が初めて専門家のもとを離れ、一般人の手のひらに届いた瞬間。',
    storyEn:
      'Even with modest outdoor efficiency, it thrived on desk fluorescent light inside calculators — the moment solar left the lab and reached everyday hands.',
    keyFigure: '桑野幸徳',
    jtbdAnalysis: {
      firedInconvenienceJa:
        '電卓の面倒な乾電池交換と、太陽直達光でないと動かないという制約を解消',
      firedInconvenienceEn:
        'Ended fiddly battery swaps and the need for direct sun to keep a calculator alive',
      hiredJobJa:
        'デスクの室内灯だけで半永久的に動く、身近な文房具の自立電源として生活者に雇用',
      hiredJobEn:
        'Hired by everyday people as a self-powered desk tool that runs on indoor light alone',
    },
    relatedVendorIds: ['anker-solix', 'ecoflow', 'jackery'],
    physicsTags: ['a-Si', 'consumer_PV', 'indoor_irradiance'],
  },
  {
    id: '1990-taguchi-hit-cell',
    year: '1990年',
    stream: 'silicon_mainstream',
    significance: 'disruptive',
    titleJa: 'HIT型（結晶Si/a-Siヘテロ接合）開発',
    titleEn: 'HIT cell (c-Si / a-Si heterojunction) developed',
    oneLinerJa: '夏の暑さでも発電が落ちない、屋根置きシリコンの最高峰',
    oneLinerEn: 'Roof silicon that keeps generating even in summer heat',
    storyJa:
      '結晶シリコンの表面に極薄のアモルファス膜を重ね合わせることで、気温上昇による出力低下を克服。住宅屋根で大量の電気を稼ぐエース技術に。',
    storyEn:
      'An ultra-thin amorphous layer on crystal silicon tamed heat-related power loss — the ace for squeezing electricity from home roofs.',
    keyFigure: '田口幹朗',
    jtbdAnalysis: {
      firedInconvenienceJa:
        '真夏のパネル表面過熱によって発電効率がガタ落ちする課題を解消',
      firedInconvenienceEn:
        'Fixed the summer problem of panels overheating and losing efficiency',
      hiredJobJa:
        '限られた屋根面積から最大限の発電量を搾り取る高効率住宅電源として雇用',
      hiredJobEn:
        'Hired as a high-efficiency home power source that squeezes the most from limited roof area',
    },
    recommendedTypologyIds: ['japanese_tiled_roof', 'pitched_gable_terrace', 'mansard_dormer'],
    relatedVendorIds: ['enphase', 'solaredge', 'tesla-energy'],
    physicsTags: ['HIT', 'heterojunction', 'passivation'],
  },
  {
    id: '1991-graetzel-dssc',
    year: '1991年',
    stream: 'organic_perovskite',
    significance: 'normal',
    titleJa: '色素増感太陽電池（DSSC）',
    titleEn: 'Dye-sensitized solar cell (DSSC)',
    oneLinerJa: '植物の光合成のように、色素で光を捉えるアプローチ',
    oneLinerEn: 'Capturing light with dye — like plant photosynthesis',
    storyJa:
      '葉緑素の代わりに色素分子を使って発電する人工光合成型セル。液体を使った溶液プロセスが、後のペロブスカイト誕生の母体となる。',
    storyEn:
      'An artificial-photosynthesis cell that uses dye molecules instead of chlorophyll. Its liquid, solution process later became the cradle of perovskites.',
    keyFigure: 'M. グレーツェル',
    recommendedTypologyIds: ['glass_railing', 'recessed_loggia', 'egress_cantilever'],
    relatedVendorIds: ['priwatt', 'yuma'],
    physicsTags: ['DSSC', 'dye_sensitizer', 'TiO2', 'photoelectrochemistry'],
  },
  {
    id: '2009-first-solar-1gw',
    year: '2009年',
    stream: 'cigs_cdte',
    significance: 'major',
    titleJa: 'First Solar CdTe薄膜 1GW量産達成',
    titleEn: 'First Solar CdTe thin film reaches 1 GW production',
    oneLinerJa: 'シリコンを使わない薄膜パネルが、世界規模でメガソーラーへ',
    oneLinerEn: 'Non-silicon thin-film panels scaled to mega-solar worldwide',
    storyJa:
      'ガラス基板に吹き付けて作る化合物薄膜が、ついに年間100万kW以上の巨大工場で量産され、砂漠や広大な敷地に敷き詰められた。',
    storyEn:
      'Compound thin films sprayed onto glass finally hit giant factories over 1 GW a year — and spread across deserts and vast sites.',
    recommendedTypologyIds: ['flat_roof_terrace', 'precast_parapet'],
    relatedVendorIds: ['solaredge', 'sunrun', 'goodleap'],
    physicsTags: ['CdTe', 'thin_film_GW', 'utility_scale'],
  },
  {
    id: '2009-miyasaka-perovskite',
    year: '2009年',
    stream: 'organic_perovskite',
    significance: 'disruptive',
    titleJa: 'ペロブスカイト太陽電池の発明',
    titleEn: 'Invention of perovskite solar cells',
    oneLinerJa: 'インクを塗るように作れる、軽くて曲がる新世代セル（宮坂教授）',
    oneLinerEn: 'A new generation you can print like ink — light and bendable (Miyasaka)',
    storyJa:
      '重くて硬いシリコン板とは違い、フィルムに印刷できて曇り空の散乱光にも強い。耐荷重のないベランダ手すりやビルの壁面でも発電できる未来を拓いた。',
    storyEn:
      'Unlike heavy, rigid silicon, it prints onto film and works well in cloudy scattered light — opening generation on balcony rails and building walls that could never hold a heavy panel.',
    keyFigure: '宮坂力',
    jtbdAnalysis: {
      firedInconvenienceJa:
        '重いガラス・金属架台、および屋根にしか置けないという設置場所の制約を解消',
      firedInconvenienceEn:
        'Removed heavy glass and metal racks — and the rule that solar only belongs on roofs',
      hiredJobJa:
        '既存建物の窓やベランダ手すり、曲面壁など、今まで置けなかったあらゆる場所への貼付け発電として雇用',
      hiredJobEn:
        'Hired as stick-on generation for windows, balcony rails, curved walls — places that never worked before',
    },
    recommendedTypologyIds: [
      'egress_cantilever',
      'glass_railing',
      'mansard_dormer',
      'recessed_loggia',
    ],
    relatedVendorIds: ['anker-solix', 'priwatt', 'yuma', 'ecoflow'],
    physicsTags: ['perovskite', 'halide', 'solution_process', 'bandgap_tunable'],
  },
  {
    id: '2026-plant-origami-present',
    year: '2026年',
    stream: 'organic_perovskite',
    significance: 'disruptive',
    titleJa: '剛体折り紙 × ペロブスカイト出仕舞い家具ソーラー',
    titleEn: 'Rigid origami × perovskite de-shimai furniture solar',
    oneLinerJa: '強風と戦わずサッと畳める、避難路を塞がない自律型ソーラー家具',
    oneLinerEn: 'Fold away from wind — self-stowing solar furniture that never blocks egress',
    storyJa:
      '『台風に耐えるため太いボルトで固める』土木工事の発想を捨て、嵐が来たらワンタッチで畳んで小さくしまえる折り紙機構を融合。賃貸のベランダでも安心して使える生活家具へ。',
    storyEn:
      'Instead of bolting down like civil works against typhoons, origami mechanisms fold away in one touch when storms come — living furniture safe enough for rental balconies.',
    jtbdAnalysis: {
      firedInconvenienceJa:
        '山林を削る基礎造成工事、専門の電気工事、避難ハッチを塞ぐ危険性を解消',
      firedInconvenienceEn:
        'Ended site grading, specialist electrical work, and the risk of blocking egress hatches',
      hiredJobJa:
        '集合住宅のベランダで、日常はPCや家電をまかない、非常時は畳んで退避できる自立生活家具として雇用',
      hiredJobEn:
        'Hired as self-reliant living furniture on apartment balconies — powering PCs daily, folding clear in emergencies',
    },
    recommendedTypologyIds: [
      'egress_cantilever',
      'precast_parapet',
      'glass_railing',
      'mansard_dormer',
    ],
    relatedVendorIds: ['anker-solix', 'priwatt', 'yuma', 'hoymiles'],
    physicsTags: ['flexible_perovskite', 'nastic_origami', 'de_shimai', 'wind_load'],
  },
] as const

/** 系統に紐付く開発史マイルストーンを抽出 */
export function getMilestonesByStream(
  stream: PvHistoryStream,
): readonly PvHistoryMilestone[] {
  return PV_HISTORY_MILESTONES.filter((m) => m.stream === stream)
}
