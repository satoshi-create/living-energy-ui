'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  ExternalLink,
  History,
  Layers,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  getSurfaceTypologyDetail,
  type SurfaceTypology,
} from '../data'
import {
  PV_HISTORY_STREAMS,
  type Cell3DVisualSpec,
  type PvHistoryStream,
} from '../history-data'
import type { CellViewAngle } from './cell-3d-model'
import { PvHistoryTimeline } from './pv-history-timeline'
import { WebGLMountGate } from './webgl-mount-gate'

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
    ja: '避難動線付き片持ちベランダ',
    en: 'Egress cantilever balcony',
  },
  precast_parapet: {
    ja: 'プレキャスト手すり腰壁',
    en: 'Precast parapet railing',
  },
  recessed_loggia: {
    ja: '窪み型ロッジア',
    en: 'Recessed loggia',
  },
  glass_railing: {
    ja: 'ガラス手すり',
    en: 'Glass railing',
  },
  access_gallery: {
    ja: '共用廊下ガレリア',
    en: 'Access gallery',
  },
  mansard_dormer: {
    ja: 'マンサード＋ドーマー',
    en: 'Mansard + dormer',
  },
  japanese_tiled_roof: {
    ja: '和瓦屋根',
    en: 'Japanese tiled roof',
  },
  flat_roof_terrace: {
    ja: '陸屋根テラス',
    en: 'Flat roof terrace',
  },
  pitched_gable_terrace: {
    ja: '切妻傾斜屋根',
    en: 'Pitched gable roof',
  },
}

const FLEX_LABEL: Record<
  Cell3DVisualSpec['flexibility'],
  { ja: string; en: string }
> = {
  rigid: { ja: '剛体（リジッド）', en: 'Rigid' },
  'semi-rigid': { ja: 'セミリジッド', en: 'Semi-rigid' },
  'flexible-origami': {
    ja: 'フィルム／剛体折り紙',
    en: 'Film / origami',
  },
}

const STREAM_ORDER: readonly PvHistoryStream[] = [
  'silicon_mainstream',
  'cigs_cdte',
  'organic_perovskite',
] as const

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

const STREAM_ACCENT: Record<
  PvHistoryStream,
  { active: string; dot: string; badge: string }
> = {
  silicon_mainstream: {
    active:
      'border-emerald-400/70 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50',
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]',
    badge: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-200',
  },
  cigs_cdte: {
    active:
      'border-sky-400/70 bg-sky-500/15 shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/50',
    dot: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
    badge: 'border-sky-500/40 bg-sky-500/20 text-sky-200',
  },
  organic_perovskite: {
    active:
      'border-purple-400/70 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50',
    dot: 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]',
    badge: 'border-purple-500/40 bg-purple-500/20 text-purple-200',
  },
}

/** ベランダ設置判定バッジ（不可 / 条件付 / 最適） */
const BALCONY_FIT_BADGE: Record<
  'unfit' | 'conditional' | 'optimal',
  { className: string; shortJa: string; shortEn: string }
> = {
  unfit: {
    className: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    shortJa: '✕ ベランダ設置不可',
    shortEn: '✕ Not balcony-fit',
  },
  conditional: {
    className: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    shortJa: '△ 条件付き（厚手腰壁）',
    shortEn: '△ Conditional (thick parapet)',
  },
  optimal: {
    className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    shortJa: '◯ ベランダ最適（超軽量家具型）',
    shortEn: '◯ Balcony-optimal (ultralight)',
  },
}

/** 系統が最も活きる代表建築形態の短いカード見出し */
const PRIMARY_TYPOLOGY_CARD: Record<
  SurfaceTypology,
  { ja: string; en: string; hintJa: string; hintEn: string }
> = {
  japanese_tiled_roof: {
    ja: '和瓦屋根',
    en: 'Japanese tiled roof',
    hintJa: 'Si主流が最も活きる勾配屋根',
    hintEn: 'Where Si mainstream thrives',
  },
  precast_parapet: {
    ja: '垂直パラペット',
    en: 'Vertical parapet',
    hintJa: '化合物薄膜が最も活きる腰壁',
    hintEn: 'Where compound film thrives',
  },
  egress_cantilever: {
    ja: '片持ちベランダ',
    en: 'Cantilever balcony',
    hintJa: 'ペロブスカイトが最も活きる避難動線付き',
    hintEn: 'Where perovskite thrives on egress',
  },
  recessed_loggia: {
    ja: '窪み型ロッジア',
    en: 'Recessed loggia',
    hintJa: '散乱光向け',
    hintEn: 'Diffuse-light fit',
  },
  glass_railing: {
    ja: 'ガラス手すり',
    en: 'Glass railing',
    hintJa: '軽量フィルム向け',
    hintEn: 'Light-film fit',
  },
  access_gallery: {
    ja: '共用廊下ガレリア',
    en: 'Access gallery',
    hintJa: '共用動線沿い',
    hintEn: 'Along shared corridors',
  },
  mansard_dormer: {
    ja: 'マンサード＋ドーマー',
    en: 'Mansard + dormer',
    hintJa: '屋根面の変則勾配',
    hintEn: 'Irregular roof pitch',
  },
  flat_roof_terrace: {
    ja: '陸屋根テラス',
    en: 'Flat roof terrace',
    hintJa: '水平設置面',
    hintEn: 'Flat install surface',
  },
  pitched_gable_terrace: {
    ja: '切妻傾斜屋根',
    en: 'Pitched gable roof',
    hintJa: '直達光の勾配屋根',
    hintEn: 'Direct-beam pitched roof',
  },
}

export type SolarCellTypesViewProps = {
  onSelectTypology?: (typologyId: SurfaceTypology) => void
  /** Open this stream in 3D detail mode (surface badge / timeline navigation). */
  initialSelectedStream?: PvHistoryStream | null
  isEn?: boolean
}

export function SolarCellTypesView({
  onSelectTypology,
  initialSelectedStream = null,
  isEn = false,
}: SolarCellTypesViewProps) {
  const [selectedCellType, setSelectedCellType] = useState<PvHistoryStream | null>(
    initialSelectedStream,
  )
  const [viewAngle, setViewAngle] = useState<CellViewAngle>(30)
  const [detailTab, setDetailTab] = useState<DetailTab>('properties')
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  useEffect(() => {
    if (initialSelectedStream) {
      setSelectedCellType(initialSelectedStream)
    }
  }, [initialSelectedStream])

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
    ? PV_HISTORY_STREAMS[selectedCellType]
    : null

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-950/80">
      <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {selectedMeta && selectedCellType ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <button
              type="button"
              onClick={() => setSelectedCellType(null)}
              className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/70 hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              {isEn ? '← Back to panel list' : '← パネル一覧に戻る'}
            </button>

            <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
              {/* Left: large 3D stage — full-bleed stage matching 3D surface detail */}
              <div
                key={`canvas-wrapper-${selectedCellType}`}
                className="relative min-h-[580px] h-[calc(100vh-220px)] flex-1 overflow-hidden rounded-2xl border border-border/60 bg-slate-950/90 lg:min-w-0"
              >
                <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[70%] space-y-0.5">
                  <p className="text-sm font-semibold text-foreground drop-shadow">
                    {isEn ? selectedMeta.labelEn : selectedMeta.labelJa}
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground drop-shadow">
                    {isEn
                      ? 'Light physics & living-furniture solar — drag to orbit'
                      : '受光物理と生活家具型ソーラーの解説 — ドラッグで回転'}
                  </p>
                </div>
                <div className="pointer-events-none absolute bottom-4 left-4 z-10">
                  <p className="rounded-md border border-border/40 bg-muted/60 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
                    {isEn
                      ? 'Drag to orbit · scroll to zoom'
                      : 'ドラッグで回転・スクロールでズーム'}
                  </p>
                </div>
                <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex flex-wrap justify-end gap-1.5">
                  <span className="rounded-full border border-border/40 bg-muted/70 px-2.5 py-1 font-mono text-[11px] text-amber-300/90 backdrop-blur-sm">
                    {selectedMeta.cell3d.thicknessMm}
                  </span>
                  <span className="rounded-full border border-border/40 bg-muted/70 px-2.5 py-1 text-[11px] text-slate-200 backdrop-blur-sm">
                    {isEn
                      ? selectedMeta.cell3d.lightBadgeEn
                      : selectedMeta.cell3d.lightBadgeJa}
                  </span>
                </div>
                <WebGLMountGate
                  priority
                  className="absolute inset-0 h-full w-full"
                >
                  <Cell3DModel
                    type={selectedCellType}
                    interactive
                    viewAngle={viewAngle}
                    className="h-full w-full"
                  />
                </WebGLMountGate>
              </div>

              {/* Right sidebar — fixed width matching 3D surface detail */}
              <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[380px]">
                {/* Stream comparison — 役割キャラ付けカード */}
                <section className="space-y-2 rounded-2xl border border-border/60 bg-card/60 p-3 sm:p-4">
                  <p className="text-sm font-bold tracking-tight text-foreground">
                    {isEn ? 'Pick a role' : '役割で選ぶ'}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {STREAM_ORDER.map((id) => {
                      const meta = PV_HISTORY_STREAMS[id]
                      const t = meta.tradeoff
                      const accent = STREAM_ACCENT[id]
                      const active = id === selectedCellType
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => setSelectedCellType(id)}
                            className={cn(
                              'flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all',
                              active
                                ? accent.active
                                : 'border-border/40 bg-muted/20 hover:border-primary/40 hover:bg-muted/40',
                            )}
                          >
                            <span className="min-w-0 space-y-1">
                              <span
                                className={cn(
                                  'inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold',
                                  accent.badge,
                                )}
                              >
                                {isEn ? t.shortBadgeEn : t.shortBadgeJa}
                              </span>
                              <span className="block text-sm font-bold text-foreground">
                                {isEn ? t.roleTitleEn : t.roleTitleJa}
                              </span>
                              <span className="block text-xs text-slate-300">
                                {isEn ? t.roleSubtitleEn : t.roleSubtitleJa}
                              </span>
                            </span>
                            {active && (
                              <span
                                className={cn(
                                  'mt-1 size-2 shrink-0 rounded-full',
                                  accent.dot,
                                )}
                              />
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </section>

                {/* トレードオフ直感メーター：分子＝ピーク / 分母＝生活・避難動線適応 */}
                <section className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-3 sm:p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold tracking-tight text-foreground">
                      {isEn
                        ? 'Trade-off intuition meter'
                        : 'トレードオフ直感メーター'}
                    </p>
                    <p className="text-xs leading-normal text-slate-300">
                      {isEn
                        ? 'Numerator: peak power · Denominator: living & egress fit'
                        : '分子：ピーク発電力 ／ 分母：生活・避難動線適応（出仕舞い性）'}
                    </p>
                  </div>
                  <TradeoffMeter
                    label={
                      isEn
                        ? 'Peak power (numerator)'
                        : 'ピーク発電力（分子）'
                    }
                    pct={selectedMeta.tradeoff.peakPowerScore}
                    barClass="bg-amber-500"
                    tip={
                      isEn
                        ? 'Clear-sky peak output relative to Si mainstream'
                        : '晴天ピーク出力の相対値（Si主流=基準）'
                    }
                  />
                  <TradeoffMeter
                    label={
                      isEn
                        ? 'Living & egress fit (stow-away)'
                        : '生活・避難動線適応（出仕舞い性）'
                    }
                    pct={selectedMeta.balconyLivingFit.egressClearanceScore}
                    barClass="bg-sky-500"
                    tip={
                      isEn
                        ? 'Clears 60cm egress · stows away from typhoon load'
                        : '避難通路60cmのクリア度・台風時の出仕舞い性能'
                    }
                  />
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {isEn
                      ? 'Living-safety index: can it fold away from typhoon forces? Does it leave the egress hatch clear?'
                      : '生活適合指数：台風時は畳んで外力を受け流せるか／避難ハッチを塞がないか'}
                  </p>
                  <div className="rounded-lg border border-border/40 bg-muted/30 px-2.5 py-2">
                    <p className="text-xs text-muted-foreground">
                      {isEn ? 'Environmental fit' : '耐環境性'}
                    </p>
                    <p className="mt-0.5 text-xs leading-normal text-slate-300">
                      {isEn
                        ? selectedMeta.tradeoff.environmentalFitEn
                        : selectedMeta.tradeoff.environmentalFitJa}
                    </p>
                  </div>
                </section>

                {/* Observation angle presets — 系統固有ラベル */}
                <section className="space-y-2 rounded-2xl border border-border/60 bg-card/60 p-3 sm:p-4">
                  <p className="text-sm font-bold tracking-tight text-foreground">
                    {isEn ? 'Observation angle' : '観察角度'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {VIEW_ANGLE_DEGREES.map((angle, i) => {
                      const labels = isEn
                        ? selectedMeta.tradeoff.viewAngleLabelsEn
                        : selectedMeta.tradeoff.viewAngleLabels
                      return (
                        <button
                          key={angle}
                          type="button"
                          onClick={() => setViewAngle(angle)}
                          className={cn(
                            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                            viewAngle === angle
                              ? 'border-primary/60 bg-primary/15 text-primary'
                              : 'border-border/40 bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                          )}
                        >
                          {labels[i]}
                          <span className="ml-1 font-mono text-[10px] opacity-70">
                            {angle}°
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* Commentary tabs */}
                <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border/60 bg-card/60 p-3 sm:p-4">
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
                            ? selectedMeta.cell3d.cellStructureEn
                            : selectedMeta.cell3d.cellStructureJa}
                        </p>
                      </div>
                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5">
                        <p className="mb-1 text-xs font-semibold text-rose-300">
                          {isEn
                            ? 'Constraints fired (Fire)'
                            : '解消した制約（Fire）'}
                        </p>
                        <p className="text-xs leading-relaxed text-rose-200">
                          {isEn
                            ? selectedMeta.firedConstraintEn
                            : selectedMeta.firedConstraintJa}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-border/40 bg-muted/50 px-2.5 py-1 font-mono text-xs text-amber-300/90">
                          {selectedMeta.cell3d.thicknessMm}
                        </span>
                        <span className="rounded-full border border-border/40 bg-muted/50 px-2.5 py-1 text-xs text-slate-300">
                          {isEn
                            ? FLEX_LABEL[selectedMeta.cell3d.flexibility].en
                            : FLEX_LABEL[selectedMeta.cell3d.flexibility].ja}
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
                              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/25"
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
                          <span className="text-[11px] text-muted-foreground">
                            {isEn
                              ? 'Browse the three streams evolution on a large screen'
                              : '三大系統の進化ストーリーを大画面で確認'}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="size-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </button>
                  )}
                </section>

                {/* 代表建築サーフェイスへのクイック遷移（サイドバー下部常設） */}
                {(() => {
                  const tid = selectedMeta.primaryTypologyId
                  const card = PRIMARY_TYPOLOGY_CARD[tid]
                  const label = TYPOLOGY_LABEL[tid]
                  return (
                    <section className="mt-auto space-y-2 rounded-2xl border border-primary/30 bg-primary/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold text-primary">
                        {isEn
                          ? 'Best-fit building form for this cell'
                          : 'このセルが最も活きる建築形態'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleTypology(tid)}
                        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/50 bg-card/80 px-3 py-2.5 text-left transition-all hover:border-primary/50 hover:bg-muted/40"
                      >
                        <span className="min-w-0 space-y-0.5">
                          <span className="block text-sm font-bold text-foreground">
                            {isEn ? card.en : card.ja}
                          </span>
                          <span className="block text-[11px] text-slate-300">
                            {isEn ? card.hintEn : card.hintJa}
                          </span>
                          <span className="block font-mono text-[10px] text-muted-foreground">
                            {isEn ? label.en : label.ja}
                          </span>
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                          {isEn ? '3D ↗' : '3Dへ ↗'}
                          <ExternalLink className="size-3" aria-hidden />
                        </span>
                      </button>
                    </section>
                  )
                })()}
              </div>
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
                        : '太陽光パネル（セル）三大系統・開発史タイムライン'}
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
                      initialStream={selectedCellType}
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
          <div className="w-full shrink-0 space-y-4">
            <div className="flex items-start gap-2">
              <Layers
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <div className="min-w-0 space-y-1">
                <h2 className="text-base font-semibold text-foreground">
                  {isEn
                    ? 'Solar cell types & characteristics'
                    : '太陽光パネル（セル）の種類と特徴'}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {isEn
                    ? 'Observe and compare three material approaches in 3D — by stack and light physics.'
                    : '素材・受光物理ごとの3大アプローチを3Dで観察できます。'}
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
              {STREAM_ORDER.map((id) => {
                const meta = PV_HISTORY_STREAMS[id]
                const cell = meta.cell3d
                const t = meta.tradeoff
                const fit = meta.balconyLivingFit
                const fitBadge = BALCONY_FIT_BADGE[fit.balconyFitStatus]
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedCellType(id)}
                    className="relative flex flex-col rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition-all hover:border-primary/50 cursor-pointer"
                  >
                    {/* ベランダ設置判定バッジ（カード上部） */}
                    <div
                      className={cn(
                        'mb-3 w-full rounded-lg border px-2.5 py-1.5 text-center text-xs font-bold tracking-tight',
                        fitBadge.className,
                      )}
                    >
                      {isEn ? fitBadge.shortEn : fitBadge.shortJa}
                    </div>

                    {/* Card header — 役割キャラ付け */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1.5">
                        <span
                          className={cn(
                            'inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold',
                            STREAM_ACCENT[id].badge,
                          )}
                        >
                          {isEn ? t.shortBadgeEn : t.shortBadgeJa}
                        </span>
                        <p className="text-sm font-semibold leading-snug text-foreground">
                          {isEn ? t.roleTitleEn : t.roleTitleJa}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {isEn ? t.roleSubtitleEn : t.roleSubtitleJa}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] font-medium',
                            meta.badgeClass,
                          )}
                        >
                          {isEn
                            ? meta.generationShortEn
                            : meta.generationShortJa}
                        </Badge>
                      </div>
                      <span className="shrink-0 rounded-full border border-border/40 bg-muted/50 px-2.5 py-1 text-[11px] text-slate-300">
                        {isEn ? cell.lightBadgeEn : cell.lightBadgeJa}
                      </span>
                    </div>

                    {/* 3D viewport — at most one live Canvas across list cards */}
                    <div className="relative my-3 h-[220px] w-full overflow-hidden rounded-xl bg-slate-950/80">
                      <WebGLMountGate
                        activateOnPointer
                        className="h-full w-full"
                        placeholder={
                          <div className="flex h-full flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-slate-900 to-slate-950 px-3 text-center">
                            <div
                              className={cn(
                                'size-10 rounded-lg border opacity-80',
                                STREAM_ACCENT[id].badge,
                              )}
                            />
                            <span className="text-[10px] text-muted-foreground">
                              {isEn
                                ? 'Hover to load 3D preview'
                                : 'ホバーで3Dプレビュー'}
                            </span>
                          </div>
                        }
                      >
                        <Cell3DModel type={id} className="h-full w-full" />
                      </WebGLMountGate>
                      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] text-muted-foreground/70">
                        {isEn
                          ? 'Drag to rotate · scroll to zoom'
                          : 'ドラッグで回転・スクロールでズーム'}
                      </p>
                    </div>

                    {/* Mini trade-off bars — ピーク vs 避難動線適合 */}
                    <div className="mb-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-14 shrink-0 text-[9px] text-muted-foreground">
                          {isEn ? 'Peak' : 'ピーク'}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
                          <div
                            className="h-full rounded-full bg-amber-500"
                            style={{ width: `${t.peakPowerScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-14 shrink-0 text-[9px] text-muted-foreground">
                          {isEn ? 'Egress' : '避難動線'}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
                          <div
                            className="h-full rounded-full bg-sky-500"
                            style={{
                              width: `${fit.egressClearanceScore}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pill tags — 出仕舞い可否を明記 */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] font-medium',
                          fit.balconyFitStatus === 'optimal'
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                            : fit.balconyFitStatus === 'conditional'
                              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                              : 'border-rose-500/40 bg-rose-500/10 text-rose-300',
                        )}
                      >
                        {fit.deShimaiAbilityJa}
                      </span>
                      <span className="rounded-full border border-border/40 bg-muted/50 px-2.5 py-1 font-mono text-[11px] text-amber-300/90">
                        {cell.thicknessMm}
                      </span>
                      <span className="rounded-full border border-border/40 bg-muted/50 px-2.5 py-1 text-[11px] text-slate-300">
                        {isEn
                          ? FLEX_LABEL[cell.flexibility].en
                          : FLEX_LABEL[cell.flexibility].ja}
                      </span>
                      <span className="rounded-full border border-border/40 bg-muted/50 px-2.5 py-1 text-[11px] text-slate-300">
                        {isEn ? cell.useCaseEn : cell.useCaseJa}
                      </span>
                    </div>

                    {/* Footer structural point */}
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      「
                      {isEn
                        ? meta.structuralPointEn
                        : meta.structuralPointJa}
                      」
                    </p>
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
