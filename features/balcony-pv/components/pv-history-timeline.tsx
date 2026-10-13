'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Building2,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  getSurfaceTypologyDetail,
  PV_VENDORS,
  type AdoptedVendorId,
  type SurfaceTypology,
} from '../data'
import {
  PV_HISTORY_MILESTONES,
  PV_HISTORY_STREAMS,
  type PvHistoryMilestone,
  type PvHistoryStream,
} from '../history-data'

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

export type PvHistoryTimelineProps = {
  initialStream?: PvHistoryStream | 'all'
  onSelectTypology?: (typologyId: SurfaceTypology) => void
  onNavigateToCell3D?: (streamId: PvHistoryStream) => void
  onSelectVendor?: (vendorId: string) => void
  isEn?: boolean
}

type StreamFilter = 'all' | PvHistoryStream

const STREAM_FILTERS: readonly StreamFilter[] = [
  'all',
  'silicon_mainstream',
  'cigs_cdte',
  'organic_perovskite',
] as const

export function PvHistoryTimeline({
  initialStream = 'all',
  onSelectTypology,
  onNavigateToCell3D,
  onSelectVendor,
  isEn = false,
}: PvHistoryTimelineProps) {
  const [streamFilter, setStreamFilter] = useState<StreamFilter>(initialStream)
  const [activeMilestone, setActiveMilestone] =
    useState<PvHistoryMilestone | null>(null)

  useEffect(() => {
    setStreamFilter(initialStream)
  }, [initialStream])

  const filtered = useMemo(() => {
    if (streamFilter === 'all') return PV_HISTORY_MILESTONES
    return PV_HISTORY_MILESTONES.filter((m) => m.stream === streamFilter)
  }, [streamFilter])

  const closeModal = useCallback(() => setActiveMilestone(null), [])

  useEffect(() => {
    if (!activeMilestone) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [activeMilestone, closeModal])

  const handleTypology = useCallback(
    (id: SurfaceTypology) => {
      closeModal()
      onSelectTypology?.(id)
    },
    [closeModal, onSelectTypology],
  )

  const handleVendor = useCallback(
    (id: string) => {
      closeModal()
      onSelectVendor?.(id)
    },
    [closeModal, onSelectVendor],
  )

  const handleNavigateToCell3D = useCallback(
    (streamId: PvHistoryStream) => {
      closeModal()
      onNavigateToCell3D?.(streamId)
    },
    [closeModal, onNavigateToCell3D],
  )

  const activeIsDisruptive = activeMilestone?.significance === 'disruptive'
  const activeMeta = activeMilestone
    ? PV_HISTORY_STREAMS[activeMilestone.stream]
    : null
  const activeJtbd = activeMilestone?.jtbdAnalysis
  const activeStreamMeta =
    streamFilter === 'all' ? null : PV_HISTORY_STREAMS[streamFilter]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex max-h-[65vh] min-h-0 w-full flex-col gap-3 overflow-y-auto pr-2">
        <div className="relative min-h-0 space-y-2 pb-2">
          <div
            role="group"
            aria-label={isEn ? 'History stream filter' : '系統フィルター'}
            className="flex flex-wrap gap-1.5 rounded-xl border border-border/50 bg-black/40 p-3"
          >
            {STREAM_FILTERS.map((id) => {
              const active = streamFilter === id
              if (id === 'all') {
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStreamFilter('all')}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-primary/50 bg-primary/20 text-primary'
                        : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground',
                    )}
                  >
                    {isEn ? 'Browse all history (All)' : '全歴史を通覧 (All)'}
                  </button>
                )
              }
              const meta = PV_HISTORY_STREAMS[id]
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStreamFilter(id)}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                    active
                      ? meta.badgeClass
                      : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground',
                  )}
                >
                  {isEn ? meta.labelEn : meta.labelJa}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs">
            <p className="text-foreground">
              {streamFilter === 'all' ? (
                isEn ? (
                  <>Showing full history ({filtered.length} milestones)</>
                ) : (
                  <>全歴史を表示中（全{filtered.length}件）</>
                )
              ) : isEn ? (
                <>
                  Showing {activeStreamMeta?.labelEn} timeline ({filtered.length}{' '}
                  of {PV_HISTORY_MILESTONES.length})
                </>
              ) : (
                <>
                  {activeStreamMeta?.labelJa}
                  の年表を表示中（全{filtered.length}件）
                </>
              )}
            </p>
            {streamFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setStreamFilter('all')}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {isEn ? 'Back to full history' : '全歴史を表示に戻す'}
              </button>
            )}
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute top-3 bottom-3 left-6 w-0.5 bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-emerald-500/40"
            />
            <ul className="relative flex flex-col">
              {filtered.map((m) => {
                const meta = PV_HISTORY_STREAMS[m.stream]
                const isDisruptive = m.significance === 'disruptive'
                return (
                  <li
                    key={m.id}
                    className={cn(
                      'relative pl-12',
                      isDisruptive ? 'my-3' : 'my-1.5',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-6 top-4 z-10 -translate-x-1/2 transition-transform',
                        isDisruptive
                          ? 'flex size-5 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          : 'size-3 rounded-full border-2 border-background bg-slate-600',
                      )}
                    >
                      {isDisruptive && (
                        <Zap className="size-2.5 text-amber-300" />
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveMilestone(m)}
                      className={cn(
                        'group flex w-full flex-col text-left transition-all duration-200',
                        isDisruptive
                          ? 'gap-2 rounded-xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent px-4 py-4 shadow-md hover:scale-[1.015] hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                          : 'gap-1.5 rounded-lg border border-border/40 bg-card/40 px-3 py-2.5 hover:scale-[1.01] hover:border-primary/40 hover:bg-muted/40 hover:ring-1 hover:ring-primary/30',
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="px-2.5 py-1 font-mono text-sm font-bold text-amber-300/90"
                        >
                          {m.year}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn('text-xs font-medium', meta.badgeClass)}
                        >
                          {isEn ? meta.labelEn : meta.labelJa}
                        </Badge>
                        {isDisruptive && (
                          <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1 border-amber-400/60 bg-amber-500/15 text-xs font-semibold text-amber-300"
                          >
                            <Sparkles className="size-3" aria-hidden />
                            {isEn
                              ? '⚡ Historic turning point'
                              : '⚡ 歴史的転換点'}
                          </Badge>
                        )}
                      </div>
                      <p
                        className={cn(
                          'leading-snug text-foreground',
                          isDisruptive
                            ? 'text-lg font-extrabold tracking-tight'
                            : 'text-base font-bold',
                        )}
                      >
                        {isEn ? m.titleEn : m.titleJa}
                      </p>
                      <p className="text-sm font-semibold text-emerald-400/90">
                        {isEn ? m.oneLinerEn : m.oneLinerJa}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">
                        {isEn ? m.storyEn : m.storyJa}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/80 opacity-70 transition-opacity group-hover:opacity-100">
                        {isEn
                          ? 'Click to see fitting building surfaces & background →'
                          : 'クリックして適した建築部位・背景を見る →'}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {activeMilestone && activeMeta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pv-history-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          onClick={closeModal}
        >
          <div
            className={cn(
              'relative max-h-[min(90vh,840px)] w-full max-w-lg overflow-y-auto rounded-2xl border shadow-2xl',
              activeIsDisruptive
                ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-slate-950 to-purple-500/10'
                : 'border-border/60 bg-slate-950',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={isEn ? 'Close' : '閉じる'}
            >
              <X className="size-4" />
            </button>

            <div className="space-y-4 p-5 sm:p-6">
              {activeIsDisruptive && (
                <Badge
                  variant="outline"
                  className="inline-flex w-fit items-center gap-1.5 border-amber-400/60 bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300"
                >
                  <Zap className="size-3.5" aria-hidden />
                  {isEn ? '⚡ Historic turning point' : '⚡ 歴史的転換点'}
                </Badge>
              )}

              <div className="flex flex-wrap items-center gap-1.5 pr-8">
                <Badge
                  variant="outline"
                  className="px-2.5 py-1 font-mono text-sm font-bold text-amber-300/90"
                >
                  {activeMilestone.year}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn('text-xs', activeMeta.badgeClass)}
                >
                  {isEn ? activeMeta.labelEn : activeMeta.labelJa}
                </Badge>
                {activeMilestone.keyFigure && (
                  <Badge variant="outline" className="text-xs text-slate-300">
                    {activeMilestone.keyFigure}
                  </Badge>
                )}
              </div>

              <h3
                id="pv-history-modal-title"
                className={cn(
                  'pr-6 text-foreground',
                  activeIsDisruptive
                    ? 'text-lg font-extrabold tracking-tight'
                    : 'text-base font-bold',
                )}
              >
                {isEn ? activeMilestone.titleEn : activeMilestone.titleJa}
              </h3>

              <section className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {isEn ? 'Story background' : '物語の背景'}
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  {isEn ? activeMilestone.storyEn : activeMilestone.storyJa}
                </p>
              </section>

              {activeJtbd && (
                <section className="space-y-2 border-t border-border/40 pt-4">
                  <p className="text-sm font-semibold text-foreground">
                    {isEn
                      ? 'How this innovation worked'
                      : '背景にあるイノベーションの仕組み'}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                      <p className="mb-1.5 text-xs font-semibold text-rose-300">
                        {isEn
                          ? '🗑️ Constraints we left behind'
                          : '🗑️ これまで我慢していた制約'}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-200">
                        {isEn
                          ? activeJtbd.firedInconvenienceEn
                          : activeJtbd.firedInconvenienceJa}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                      <p className="mb-1.5 text-xs font-semibold text-emerald-300">
                        {isEn
                          ? '✨ New uses we gained'
                          : '✨ 新たに手に入れた使い道'}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-200">
                        {isEn
                          ? activeJtbd.hiredJobEn
                          : activeJtbd.hiredJobJa}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <section className="space-y-2 border-t border-border/40 pt-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                  <Box className="size-3.5" aria-hidden />
                  {isEn
                    ? 'Fitting 3D building surfaces'
                    : 'この技術が活きる3D建築形態（サーフェイス）'}
                </p>
                {(activeMilestone.recommendedTypologyIds?.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {isEn
                      ? 'No linked surface typologies for this milestone.'
                      : 'このマイルストーンに紐づく建築形態はありません。'}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {activeMilestone.recommendedTypologyIds!.map((tid) => {
                      const label = TYPOLOGY_LABEL[tid]
                      const detail = getSurfaceTypologyDetail(tid)
                      return (
                        <li
                          key={tid}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-2"
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
                            {isEn
                              ? 'View fitting 3D surfaces'
                              : '適した3D建築形態を見る'}
                            <ExternalLink className="size-3" aria-hidden />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <section className="space-y-2 border-t border-border/40 pt-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Layers className="size-3.5" aria-hidden />
                  {isEn ? '3D cell model' : 'パネルの3Dモデル'}
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigateToCell3D(activeMilestone.stream)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  {isEn
                    ? 'View panel 3D model ↗'
                    : 'パネルの3Dモデルを見る ↗'}
                  <ExternalLink className="size-3.5" aria-hidden />
                </button>
              </section>

              <section className="space-y-2 border-t border-border/40 pt-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-sky-400">
                  <Building2 className="size-3.5" aria-hidden />
                  {isEn
                    ? 'Related vendors & solutions'
                    : '関連する主要企業・ソリューション'}
                </p>
                {(activeMilestone.relatedVendorIds?.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {isEn
                      ? 'No linked vendors for this milestone.'
                      : 'このマイルストーンに紐づく企業はありません。'}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {activeMilestone.relatedVendorIds!.map((vid) => {
                      const vendor = PV_VENDORS[vid as AdoptedVendorId]
                      if (!vendor) return null
                      return (
                        <li
                          key={vid}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {isEn && vendor.nameEn
                                ? vendor.nameEn
                                : vendor.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {isEn && vendor.roleEn
                                ? vendor.roleEn
                                : vendor.role}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleVendor(vid)}
                            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-sky-500/40 bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-500/25"
                          >
                            {isEn ? 'Open vendors' : '企業一覧へ'}
                            <ExternalLink className="size-3" aria-hidden />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
