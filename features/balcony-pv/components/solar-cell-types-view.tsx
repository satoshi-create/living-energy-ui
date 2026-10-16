'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  ExternalLink,
  History,
  PanelRightClose,
  PanelRightOpen,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getSurfaceTypologyDetail,
  SOLAR_CELL_TYPE_IDS,
  SOLAR_CELL_TYPES,
  solarCellTypeFromHistoryStream,
  type SolarCellFlexibility,
  type SolarCellHistoryStreamId,
  type SolarCellTypeId,
  type SurfaceTypology,
} from '../data'
import type { PvHistoryStream } from '../history-data'
import type { CellViewAngle } from './cell-3d-model'
import { PvHistoryTimeline } from './pv-history-timeline'

const Cell3DModel = dynamic(
  () => import('./cell-3d-model').then((mod) => mod.Cell3DModel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950/40">
        <span className="text-xs text-muted-foreground">3Dモデル読込中...</span>
      </div>
    ),
  },
)

const TYPOLOGY_LABEL: Record<SurfaceTypology, { ja: string; en: string }> = {
  egress_cantilever: {
    ja: '一般的なマンションのベランダ',
    en: 'Typical apartment balcony',
  },
  precast_parapet: {
    ja: 'コンクリート腰壁のあるベランダ',
    en: 'Balcony with a concrete waist wall',
  },
  recessed_loggia: {
    ja: 'くぼんだ形のバルコニー',
    en: 'Recessed balcony (set into the building)',
  },
  glass_railing: {
    ja: 'ガラス手すりのあるベランダ',
    en: 'Balcony with a glass railing',
  },
  access_gallery: {
    ja: 'マンションの共用廊下',
    en: 'Shared corridor of an apartment building',
  },
  mansard_dormer: {
    ja: 'ヨーロッパ風の急勾配屋根',
    en: 'Steep European-style roof',
  },
  japanese_tiled_roof: {
    ja: '日本の戸建ての瓦屋根',
    en: 'Japanese house tile roof',
  },
  flat_roof_terrace: {
    ja: '平らな屋上（テラス付き）',
    en: 'Flat rooftop with a terrace',
  },
  pitched_gable_terrace: {
    ja: '連棟住宅の勾配屋根',
    en: 'Pitched roof of a terraced house',
  },
}

const FLEX_LABEL: Record<SolarCellFlexibility, { ja: string; en: string }> = {
  rigid: { ja: '剛体（リジッド）', en: 'Rigid' },
  'semi-rigid': { ja: 'セミリジッド', en: 'Semi-rigid' },
  'flexible-etfe': { ja: 'ETFEフレキシブル', en: 'ETFE flexible' },
  'flexible-origami': {
    ja: 'フィルム／剛体折り紙',
    en: 'Film / origami',
  },
}

const CELL_ORDER: readonly SolarCellTypeId[] = SOLAR_CELL_TYPE_IDS

const VIEW_ANGLE_DEGREES: readonly CellViewAngle[] = [0, 30, 90] as const

type DetailTab = 'properties' | 'typology' | 'history'

/** 分子＝ピーク発電力 / 分母＝設置の身軽さ — トレードオフ直感メーター */
function TradeoffMeter({
  label,
  pct,
  barClass,
  tip,
}: {
  label: string
  pct: number
  barClass: string
  tip?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold text-foreground">
        <span>{label}</span>
        <span>{pct}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn('h-full rounded-full transition-all', barClass)}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
      {tip ? (
        <p className="text-xs leading-normal text-slate-300">{tip}</p>
      ) : null}
    </div>
  )
}

export type SolarCellTypesViewProps = {
  onSelectTypology?: (typologyId: SurfaceTypology) => void
  /** Jump to world-map tab and focus a representative country (ISO code). */
  onNavigateToCountry?: (countryCode: string) => void
  /** Open this typology in 3D detail (history stream IDs are mapped). */
  initialSelectedStream?: PvHistoryStream | SolarCellTypeId | null
  /** Highlight a cell card when arriving from surface / map reverse link. */
  highlightCellId?: SolarCellTypeId | null
  isEn?: boolean
}

type CellPanelPhase = 'list' | 'empty' | 'detail'

function resolveInitialCellId(
  initial: PvHistoryStream | SolarCellTypeId | null | undefined,
): SolarCellTypeId | null {
  if (!initial) return null
  if (
    initial === 'rigid_silicon' ||
    initial === 'bipv_thin_film' ||
    initial === 'etfe_flexible_silicon' ||
    initial === 'origami_perovskite'
  ) {
    return initial
  }
  return solarCellTypeFromHistoryStream(initial as SolarCellHistoryStreamId)
}

export function SolarCellTypesView({
  onSelectTypology,
  onNavigateToCountry,
  initialSelectedStream = null,
  highlightCellId = null,
  isEn = false,
}: SolarCellTypesViewProps) {
  const initialCellId = resolveInitialCellId(initialSelectedStream)
  const [selectedCellType, setSelectedCellType] = useState<SolarCellTypeId | null>(
    initialCellId,
  )
  /** empty = no Canvas (bridge between list↔detail to avoid R3F sync-unmount races). */
  const [panelPhase, setPanelPhase] = useState<CellPanelPhase>(
    initialCellId ? 'detail' : 'list',
  )
  const [viewAngle, setViewAngle] = useState<CellViewAngle>(30)
  const [detailTab, setDetailTab] = useState<DetailTab>('properties')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const openCellDetail = useCallback((id: SolarCellTypeId) => {
    setSelectedCellType(id)
    setPanelPhase('empty')
  }, [])

  const backToCellList = useCallback(() => {
    setSelectedCellType(null)
    setPanelPhase('empty')
  }, [])

  useEffect(() => {
    const resolved = resolveInitialCellId(initialSelectedStream)
    if (resolved) {
      setSelectedCellType(resolved)
      setPanelPhase('empty')
    }
  }, [initialSelectedStream])

  useEffect(() => {
    if (panelPhase !== 'empty') return
    const id = window.setTimeout(() => {
      setPanelPhase(selectedCellType ? 'detail' : 'list')
    }, 0)
    return () => window.clearTimeout(id)
  }, [panelPhase, selectedCellType])

  useEffect(() => {
    setViewAngle(30)
    setDetailTab('properties')
  }, [selectedCellType])

  useEffect(() => {
    if (!showHistoryModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHistoryModal(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [showHistoryModal])

  const handleTypology = useCallback(
    (id: SurfaceTypology) => {
      onSelectTypology?.(id)
    },
    [onSelectTypology],
  )

  const selectedMeta = selectedCellType
    ? SOLAR_CELL_TYPES[selectedCellType]
    : null

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-950">
      <div className="flex h-full min-h-0 w-full flex-col space-y-8 overflow-y-auto p-5 sm:p-6 lg:p-8">
        {panelPhase === 'empty' ? (
          <div className="flex min-h-[40vh] flex-1 items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        ) : panelPhase === 'detail' && selectedMeta && selectedCellType ? (
          <div className="flex min-h-0 flex-1 flex-col gap-6">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={backToCellList}
                className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground transition-colors hover:border-primary/40 hover:bg-muted/70 hover:text-primary"
                aria-label={isEn ? 'Back to panel list' : 'パネル一覧に戻る'}
              >
                <ArrowLeft className="size-3.5" aria-hidden />
              </button>
              <div className="min-w-0 flex-1 space-y-0.5">
                <h2 className="text-sm font-semibold text-foreground">
                  {isEn ? selectedMeta.nameEn : selectedMeta.nameJa}
                </h2>
                <p className="text-xs leading-relaxed text-slate-400">
                  {isEn
                    ? 'Light physics & living-furniture solar'
                    : '受光物理と生活家具型ソーラーの解説'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground transition-colors hover:bg-muted/70"
                aria-label={
                  sidebarOpen
                    ? isEn
                      ? 'Collapse sidebar'
                      : 'サイドバーを閉じる'
                    : isEn
                      ? 'Expand sidebar'
                      : 'サイドバーを開く'
                }
              >
                {sidebarOpen ? (
                  <PanelRightClose className="size-4" aria-hidden />
                ) : (
                  <PanelRightOpen className="size-4" aria-hidden />
                )}
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
              <div
                key={`canvas-wrapper-${selectedCellType}`}
                className="relative min-h-[580px] h-[calc(100vh-220px)] flex-1 overflow-hidden rounded-2xl border border-border/60 bg-slate-950/90 lg:min-w-0"
              >
                <Cell3DModel
                  type={selectedCellType}
                  interactive
                  viewAngle={viewAngle}
                  className="absolute inset-0 h-full w-full"
                />
              </div>

              {sidebarOpen ? (
              <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[380px]">
                {/* 1. 観察角度 */}
                <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
                  <p className="text-base font-semibold tracking-tight text-slate-100">
                    {isEn ? 'Observation angle' : '観察角度'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {VIEW_ANGLE_DEGREES.map((angle) => (
                      <button
                        key={angle}
                        type="button"
                        onClick={() => setViewAngle(angle)}
                        className={cn(
                          'rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                          viewAngle === angle
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                            : 'border-slate-700/60 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80',
                        )}
                      >
                        {angle}°
                      </button>
                    ))}
                  </div>
                </section>

                {/* 2. トレードオフ直感メーター */}
                <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
                  <p className="text-sm font-bold tracking-tight text-foreground">
                    {isEn
                      ? 'Trade-off intuition meter'
                      : 'トレードオフ直感メーター'}
                  </p>
                  <TradeoffMeter
                    label={isEn ? 'Peak generation' : 'ピーク発電力'}
                    pct={selectedMeta.peakPowerScore}
                    barClass="bg-emerald-500"
                  />
                  <TradeoffMeter
                    label={
                      isEn
                        ? 'Living / egress fit'
                        : '生活・避難動線適応'
                    }
                    pct={selectedMeta.egressClearanceScore}
                    barClass="bg-emerald-400"
                  />
                </section>

                {/* 3. タブ切り替え */}
                <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
                  <div className="mb-3 flex gap-1 rounded-lg border border-border/40 bg-muted/30 p-0.5">
                    <button
                      type="button"
                      onClick={() => setDetailTab('properties')}
                      className={cn(
                        'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                        detailTab === 'properties'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {isEn ? 'Structure & properties' : '物性・セル構造'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailTab('typology')}
                      className={cn(
                        'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                        detailTab === 'typology'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {isEn ? 'Fitting building forms' : '適した建築形態'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailTab('history')}
                      className={cn(
                        'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                        detailTab === 'history'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {isEn ? 'History & background' : '開発史・背景'}
                    </button>
                  </div>

                  {detailTab === 'properties' ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {isEn ? 'Cell stack' : 'セル構造'}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-foreground">
                          {isEn
                            ? selectedMeta.cellStructureEn
                            : selectedMeta.cellStructureJa}
                        </p>
                      </div>
                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                          {isEn
                            ? 'Constraints fired (Fire)'
                            : '解消した制約（Fire）'}
                        </p>
                        <p className="text-sm font-medium leading-relaxed text-slate-200">
                          {isEn
                            ? selectedMeta.firedElementEn
                            : selectedMeta.firedElementJa}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md border border-slate-700/60 bg-slate-900/80 px-2.5 py-1 font-mono text-xs text-slate-300">
                          {isEn
                            ? selectedMeta.weightThicknessEn
                            : selectedMeta.weightThicknessJa}
                        </span>
                        <span className="rounded-md border border-slate-700/60 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300">
                          {isEn
                            ? FLEX_LABEL[selectedMeta.flexibility].en
                            : FLEX_LABEL[selectedMeta.flexibility].ja}
                        </span>
                      </div>
                    </div>
                  ) : detailTab === 'typology' ? (
                    <ul className="flex flex-col gap-1.5">
                      {selectedMeta.recommendedTypologyIds.map((tid) => {
                        const label = TYPOLOGY_LABEL[tid]
                        const detail = getSurfaceTypologyDetail(tid)
                        return (
                          <li
                            key={tid}
                            className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-muted/30 px-2.5 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {isEn ? label.en : label.ja}
                              </p>
                              <p className="font-mono text-xs text-muted-foreground">
                                {detail.id} · {detail.opticalProfile}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleTypology(tid)}
                              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                            >
                              {isEn ? 'View in 3D ↗' : '3Dで見る ↗'}
                              <ExternalLink className="size-3" aria-hidden />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowHistoryModal(true)}
                      className="group flex w-full items-center justify-between rounded-xl border border-primary/40 bg-primary/10 p-3.5 text-foreground transition-all hover:bg-primary/20"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                          <History className="size-4.5" aria-hidden />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-foreground">
                            {isEn
                              ? 'Open development history timeline'
                              : '開発史・タイムラインを開く'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {isEn
                              ? 'Browse the four living typologies & history streams'
                              : '4大タイポロジーと開発史を大画面で確認'}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="size-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </button>
                  )}
                </section>
              </div>
              ) : null}
            </div>

            {showHistoryModal && selectedCellType ? (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="pv-cell-history-modal-title"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
                onClick={() => setShowHistoryModal(false)}
              >
                <div
                  className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
                    <h2
                      id="pv-cell-history-modal-title"
                      className="pr-8 text-base font-bold tracking-tight text-foreground sm:text-lg"
                    >
                      {isEn
                        ? 'Solar cell streams — development history timeline'
                        : '太陽光パネル（セル）開発史タイムライン'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowHistoryModal(false)}
                      className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={isEn ? 'Close' : '閉じる'}
                    >
                      <X className="size-5" aria-hidden />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <PvHistoryTimeline
                      initialStream={selectedMeta.historyStreamId}
                      onSelectTypology={(id) => {
                        setShowHistoryModal(false)
                        handleTypology(id)
                      }}
                      isEn={isEn}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="w-full shrink-0 space-y-8">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6">
              <h2 className="text-base font-semibold text-slate-100">
                {isEn
                  ? 'Solar panel (cell) types'
                  : '太陽光パネル（セル）の種類'}
              </h2>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {CELL_ORDER.map((id) => {
                const meta = SOLAR_CELL_TYPES[id]
                const highlighted = highlightCellId === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => openCellDetail(id)}
                    className={cn(
                      'relative flex flex-col space-y-4 rounded-xl border bg-slate-900/80 p-5 text-left transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-800/80 md:p-6 cursor-pointer',
                      highlighted
                        ? 'border-emerald-500/70 ring-2 ring-emerald-500/40'
                        : 'border-slate-800',
                    )}
                  >
                    <p className="text-base font-semibold leading-snug text-slate-100">
                      {isEn ? meta.roleTitleEn : meta.roleTitleJa}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {isEn ? meta.roleSubtitleEn : meta.roleSubtitleJa}
                    </p>
                    <div className="relative h-[220px] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                      <Cell3DModel
                        type={id}
                        viewAngle={30}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {isEn ? 'Fitting building forms' : '適した建築形態'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {meta.suitableSurfaceLabels.map((surf) => (
                          <span
                            key={surf.id}
                            role="link"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTypology(surf.id as SurfaceTypology)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                e.stopPropagation()
                                handleTypology(surf.id as SurfaceTypology)
                              }
                            }}
                            className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                          >
                            {isEn ? surf.labelEn : surf.labelJa}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-slate-800/60 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {isEn ? 'Key countries' : '主な実装国'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {meta.representativeCountryCodes.map((code) => (
                          <span
                            key={code}
                            role="link"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              onNavigateToCountry?.(code)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                e.stopPropagation()
                                onNavigateToCountry?.(code)
                              }
                            }}
                            className="rounded-md border border-slate-700/60 bg-slate-900/80 px-2 py-1 font-mono text-xs font-medium text-slate-300 transition-colors hover:border-slate-600"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
