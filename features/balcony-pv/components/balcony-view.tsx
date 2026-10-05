"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Building2, ChevronDown, ExternalLink, Gauge, Landmark, PackageCheck, Users, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { HomeView } from "@/features/living-sense"
import type { CountryCode } from "@/lib/country-codes"
import { cn } from "@/lib/utils"
import { BalconyIllustration } from "./balcony-illustration"
import { WorldPvMap, type MovementHistoryPhaseId } from "./world-pv-map"
import {
  DIRECTIONS,
  ECOSYSTEM_ACTOR_FILTERS,
  MOVEMENT_HISTORY_PHASES,
  RAILING_TYPES,
  WORLD_BALCONY_PV_COUNTRIES,
  WORLD_PV_ANALYSIS_LABELS,
  computeBalconyScore,
  getEcosystemActorsByCountry,
  getMaturityScore,
  getPvRegionsByMaturityDesc,
  recommendedKit,
  resolveSystemModel,
  type CountryPvDetail,
  type Direction,
  type EcosystemActorFilter,
  type EcosystemActorType,
  type MovementMilestone,
  type RailingType,
  type SystemModelType,
} from "../data"

const SIDEBAR_DEFAULT_WIDTH = 384
const SIDEBAR_MIN_WIDTH = 320
const SIDEBAR_MAX_WIDTH = 700

/** 自立分散・未電化/停電自衛（送電網非依存・BOP）と判定する status */
const OFFGRID_STATUSES = new Set<CountryPvDetail["status"]>([
  "productive_offgrid",
  "micro_solar_kit",
])

type OutletPlugTone = "emerald" | "cyan" | "amber" | "rose" | "purple"

const OUTLET_TONE_CLASS: Record<OutletPlugTone, string> = {
  emerald: "text-emerald-400 font-semibold",
  cyan: "text-cyan-400 font-semibold",
  amber: "text-amber-400 font-semibold",
  rose: "text-rose-400 font-semibold",
  purple: "text-purple-400 font-semibold",
}

function plugInEaseFromModel(model: SystemModelType): {
  msgKey: "outlet.plugOk" | "outlet.netMetering" | "outlet.offgridStorage" | "outlet.necStrict" | "outlet.standalone"
  tone: OutletPlugTone
} {
  switch (model) {
    case "plug_800w":
    case "plug_1200w":
    case "plug_600w":
      return { msgKey: "outlet.plugOk", tone: "emerald" }
    case "net_metering":
      return { msgKey: "outlet.netMetering", tone: "cyan" }
    case "offgrid_storage":
      return { msgKey: "outlet.offgridStorage", tone: "amber" }
    case "nec_strict":
      return { msgKey: "outlet.necStrict", tone: "rose" }
    case "productive_offgrid":
    case "micro_solar_kit":
      return { msgKey: "outlet.standalone", tone: "purple" }
  }
}

type ExcessPowerMsgKey =
  | "excess.netMetering"
  | "excess.selfConsume"
  | "excess.noExport"
  | "excess.batteryNight"

function excessPowerFromModel(model: SystemModelType): ExcessPowerMsgKey {
  switch (model) {
    case "net_metering":
      return "excess.netMetering"
    case "plug_800w":
    case "plug_1200w":
    case "plug_600w":
      return "excess.selfConsume"
    case "offgrid_storage":
    case "nec_strict":
      return "excess.noExport"
    case "productive_offgrid":
    case "micro_solar_kit":
      return "excess.batteryNight"
  }
}

const SIDEBAR_SPEC_FIELDS = [
  { key: "plugInEase" as const, labelKey: "plugInEase" },
  { key: "excessPower" as const, labelKey: "excessPower" },
  { key: "ruleSummary" as const, labelKey: "ruleSummary" },
]

function formatHour(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

function scoreBand(score: number): "excellent" | "good" | "fair" | "poor" {
  if (score >= 80) return "excellent"
  if (score >= 60) return "good"
  if (score >= 40) return "fair"
  return "poor"
}

const ACTOR_TYPE_ICON: Record<EcosystemActorType, typeof Building2> = {
  company: Building2,
  npo: Users,
  government: Landmark,
}

type BalconyTab = "simulator" | "living-sense"

export type BalconyViewProps = {
  onNavigateToEcosystem?: (countryCode: CountryCode) => void
}

export function WorldImplementationView() {
  const t = useTranslations("worldPv")
  const tSidebar = useTranslations("worldPv.sidebar")
  const locale = useLocale()
  const isEn = locale === "en"
  const [selectedId, setSelectedId] = useState<string | null>("germany")
  const [isRankingOpen, setIsRankingOpen] = useState(false)
  const [isMovementHistoryOpen, setIsMovementHistoryOpen] = useState(false)
  const [historyPhase, setHistoryPhase] = useState<MovementHistoryPhaseId | null>(null)
  const [expandedPhaseId, setExpandedPhaseId] = useState<MovementHistoryPhaseId | null>(null)
  const [focusedMilestoneId, setFocusedMilestoneId] = useState<string | null>(null)
  const [historyFocusRegionId, setHistoryFocusRegionId] = useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [actorFilter, setActorFilter] = useState<EcosystemActorFilter>("all")
  const sidebarRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const clearHistoryFocus = useCallback(() => {
    setFocusedMilestoneId(null)
    setHistoryFocusRegionId(null)
  }, [])

  const focusHistoryPhase = useCallback(
    (phaseId: MovementHistoryPhaseId) => {
      setHistoryPhase(phaseId)
      setExpandedPhaseId(phaseId)
      clearHistoryFocus()
    },
    [clearHistoryFocus],
  )

  const focusHistoryMilestone = useCallback(
    (milestone: MovementMilestone, openDetail: boolean) => {
      setFocusedMilestoneId(milestone.id)
      setHistoryFocusRegionId(milestone.regionId)
      if (openDetail) {
        const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === milestone.regionId)
        if (country) {
          setSelectedId(country.id)
          setActorFilter("all")
          setIsRankingOpen(false)
        }
      }
    },
    [],
  )

  const selectedCountry = useMemo(
    () => WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  )
  const relatedActors = useMemo(
    () => (selectedCountry ? getEcosystemActorsByCountry(selectedCountry.id, actorFilter) : []),
    [selectedCountry, actorFilter],
  )
  const rankingRegions = useMemo(() => getPvRegionsByMaturityDesc(), [])

  const handleSelectCountry = useCallback((region: CountryPvDetail) => {
    setSelectedId(region.id)
    setActorFilter("all")
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
    setExpandedPhaseId(null)
    setFocusedMilestoneId(null)
    setHistoryFocusRegionId(null)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSelectedId(null)
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
    setExpandedPhaseId(null)
    setFocusedMilestoneId(null)
    setHistoryFocusRegionId(null)
  }, [])

  const countryMsg = (field: string, defaultFallback: string = "") => {
    if (!selectedCountry) return defaultFallback
    try {
      const key = `countries.${selectedCountry.id}.${field}` as Parameters<typeof t>[0]
      // next-intl の t.has が利用可能な場合は事前チェック
      if (typeof (t as { has?: (k: string) => boolean }).has === "function" && !(t as { has: (k: string) => boolean }).has(key)) {
        return defaultFallback
      }
      const val = t(key)
      // 未解決でキー文字列そのまま、または空文字列が返ってきた場合のガード
      if (!val || val.includes(`countries.${selectedCountry.id}`)) {
        return defaultFallback
      }
      return val
    } catch {
      // MISSING_MESSAGE 例外をトラップし、画面クラッシュを防ぐ
      return defaultFallback
    }
  }

  const isOffgridArch =
    selectedCountry !== null && OFFGRID_STATUSES.has(selectedCountry.status)

  const systemModel = selectedCountry ? resolveSystemModel(selectedCountry) : null
  const plugInEaseSpec = systemModel ? plugInEaseFromModel(systemModel) : null
  const excessPowerKey = systemModel ? excessPowerFromModel(systemModel) : null

  const sidebarRuleSummary = () => {
    if (!selectedCountry) return ""
    const dataFallback =
      isEn && selectedCountry.regulationEn
        ? selectedCountry.regulationEn
        : selectedCountry.regulation
    return countryMsg(
      "ruleSummary",
      countryMsg("procedure", countryMsg("regulation", dataFallback)),
    )
  }

  const onResizePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [])

  const onResizePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !sidebarRef.current) return
    const right = sidebarRef.current.getBoundingClientRect().right
    const next = Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, right - e.clientX))
    setSidebarWidth(next)
  }, [])

  const onResizePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [])

  const sidebarOpen =
    selectedCountry !== null || isRankingOpen || isMovementHistoryOpen

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* マップ: サイドバー開閉に依らず常に全面（幅連動による Layout Shift を防ぐ） */}
      <div className="absolute inset-0 min-h-0 min-w-0 overflow-hidden">
        <div className="flex h-full min-h-0 w-full items-center justify-center p-2 sm:p-4">
          <WorldPvMap
            selectedCountryId={selectedId ?? ""}
            isRankingOpen={isRankingOpen}
            onRankingOpenChange={(open) => {
              setIsRankingOpen(open)
              if (open) {
                setIsMovementHistoryOpen(false)
                setHistoryPhase(null)
                setExpandedPhaseId(null)
                clearHistoryFocus()
              }
            }}
            isMovementHistoryOpen={isMovementHistoryOpen}
            onMovementHistoryOpenChange={(open) => {
              setIsMovementHistoryOpen(open)
              if (open) {
                setSelectedId(null)
                setIsRankingOpen(false)
                const phase = historyPhase ?? "guerrilla"
                setHistoryPhase(phase)
                setExpandedPhaseId(phase)
                clearHistoryFocus()
              } else {
                setHistoryPhase(null)
                setExpandedPhaseId(null)
                clearHistoryFocus()
              }
            }}
            historyPhase={historyPhase}
            onHistoryPhaseChange={(phase) => {
              setHistoryPhase(phase)
              if (phase) setExpandedPhaseId(phase)
              else setExpandedPhaseId(null)
              clearHistoryFocus()
            }}
            historyFocusRegionId={historyFocusRegionId}
            onSelectCountry={(country) => {
              if (country) {
                setSelectedId(country.id)
                setActorFilter("all")
                setIsRankingOpen(false)
                setIsMovementHistoryOpen(false)
                setHistoryPhase(null)
                setExpandedPhaseId(null)
                clearHistoryFocus()
              } else {
                setSelectedId(null)
              }
            }}
          />
        </div>
      </div>

      <Card
        ref={sidebarRef}
        className={cn(
          "z-30 flex flex-col overflow-hidden border-border/60 bg-card/95 backdrop-blur-md transition-transform duration-300 ease-in-out",
          // <lg: ボトムシート（マップ上部を常時可視、ピン操作を阻害しない）
          "fixed inset-x-0 bottom-0 h-[45vh] max-h-[50vh] w-full rounded-t-xl shadow-lg",
          // >=lg: 右側絶対配置オーバーレイ（地図を押し縮めない）
          "lg:absolute lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 lg:h-full lg:max-h-none lg:w-[var(--sidebar-w)] lg:rounded-none lg:border-l lg:shadow-2xl",
          sidebarOpen
            ? "translate-y-0 lg:translate-x-0"
            : "pointer-events-none translate-y-full lg:translate-y-0 lg:translate-x-full",
        )}
        style={{ ["--sidebar-w" as string]: `${sidebarWidth}px` }}
        aria-hidden={!sidebarOpen}
      >
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={tSidebar("resizeAria")}
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
          className="absolute top-0 bottom-0 left-0 z-10 hidden w-1.5 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-primary/40 active:bg-primary/60 lg:block"
        />
        {/* SP グラブハンドル */}
        <div className="flex shrink-0 justify-center pt-2 lg:hidden" aria-hidden>
          <div className="h-1.5 w-10 rounded-full bg-muted-foreground/40" />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1 border-b border-border/50 px-3 pt-1 pb-2 pl-5">
          <button
            type="button"
            onClick={handleCloseSidebar}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t("detail.close")}
          >
            <X className="size-4" />
          </button>
        </div>

        {isMovementHistoryOpen ? (
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pl-5 text-sm">
            <CardHeader className="shrink-0 space-y-1 p-0">
              <CardTitle className="text-base font-bold leading-snug text-white">
                {t("movementHistory.title")}
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-2">
              {MOVEMENT_HISTORY_PHASES.map((phase) => {
                const isActive = historyPhase === phase.id
                const isExpanded = expandedPhaseId === phase.id
                return (
                  <div
                    key={phase.id}
                    className={cn(
                      "rounded-lg border transition-colors",
                      isActive
                        ? "border-cyan-500/50 bg-cyan-500/10"
                        : "border-border/40 bg-muted/30 hover:border-cyan-500/30",
                    )}
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
                      onClick={() => {
                        const nextExpanded = !(isExpanded && isActive)
                        if (nextExpanded) {
                          focusHistoryPhase(phase.id)
                        } else {
                          setExpandedPhaseId(null)
                          clearHistoryFocus()
                        }
                      }}
                      onMouseEnter={() => {
                        focusHistoryPhase(phase.id)
                      }}
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
                        {phase.milestones.length}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {t(`movementHistory.phases.${phase.id}.title`)}
                        </span>
                        <span className="block font-mono text-[11px] text-cyan-300/90">
                          {t(`movementHistory.phases.${phase.id}.period`)}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    {isExpanded ? (
                      <ol className="relative space-y-0 border-t border-border/40 px-3 pb-2.5 pt-2">
                        {phase.milestones.map((ms, idx) => {
                          const isMsActive = focusedMilestoneId === ms.id
                          const dateLabel = ms.date.replace("-", ".")
                          return (
                            <li key={ms.id} className="relative flex gap-2.5 pb-3 last:pb-0">
                              {idx < phase.milestones.length - 1 ? (
                                <span
                                  aria-hidden
                                  className="absolute top-3 left-[5px] h-[calc(100%-4px)] w-px bg-border"
                                />
                              ) : null}
                              <span
                                className={cn(
                                  "relative z-[1] mt-1 size-2.5 shrink-0 rounded-full ring-2",
                                  isMsActive
                                    ? "bg-cyan-400 ring-cyan-400/40"
                                    : "bg-muted-foreground/50 ring-card",
                                )}
                              />
                              <button
                                type="button"
                                className={cn(
                                  "min-w-0 flex-1 rounded-md px-1.5 py-1 text-left transition-colors",
                                  isMsActive ? "bg-cyan-500/15" : "hover:bg-muted/50",
                                )}
                                onMouseEnter={() => focusHistoryMilestone(ms, false)}
                                onClick={() => focusHistoryMilestone(ms, true)}
                              >
                                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  <span className="font-mono text-[10px] text-cyan-300/90">
                                    {dateLabel}
                                  </span>
                                  <span className="rounded-md bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-200">
                                    {ms.regionName}
                                  </span>
                                </span>
                                <span className="mt-0.5 block text-[11px] leading-snug text-slate-300">
                                  {ms.summary}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ol>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </CardContent>
        ) : isRankingOpen ? (
          <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pl-5 text-sm">
            <p className="text-[11px] font-medium text-muted-foreground">
              世界実装度ランキング（★5 → ★1）
            </p>
            <ul className="flex flex-col gap-1.5">
              {rankingRegions.map((region, index) => {
                const score = getMaturityScore(region)
                const isActive = region.id === selectedId
                return (
                  <li key={region.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectCountry(region)}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors",
                        isActive
                          ? "border-primary/50 bg-primary/10"
                          : "border-border/40 bg-muted/30 hover:border-border hover:bg-muted/50",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold",
                          index < 3
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="truncate text-sm font-medium text-foreground">
                            {region.name}
                          </span>
                          <span className="font-mono text-xs text-amber-400">★{score}</span>
                        </span>
                        <Badge
                          variant="secondary"
                          className="mt-1 max-w-full truncate text-[10px] font-normal"
                        >
                          {region.statusLabel}
                        </Badge>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        ) : selectedCountry ? (
          <>
            <CardHeader className="flex shrink-0 flex-row items-start justify-between gap-2 space-y-0 pl-5">
              <div className="flex min-w-0 flex-col gap-1">
                <CardTitle className="text-xl font-bold text-white">
                  {countryMsg(
                    "name",
                    (selectedCountry as { nameJa?: string }).nameJa || selectedCountry.name,
                  )}
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                    {selectedCountry.code}
                  </span>
                </CardTitle>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    className={cn(
                      "w-fit border px-2 py-0.5 text-xs font-medium",
                      isOffgridArch
                        ? "border-violet-500/40 bg-violet-500/20 text-violet-300"
                        : "border-sky-500/40 bg-sky-500/20 text-sky-300",
                    )}
                  >
                    {isOffgridArch
                      ? tSidebar("archOffgrid")
                      : tSidebar("archGrid")}
                  </Badge>
                  <Badge
                    className={cn(
                      "w-fit border px-2 py-0.5 text-xs font-medium",
                      isOffgridArch ||
                        (selectedCountry as { modelType?: string }).modelType === "offgrid_storage"
                        ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                        : "border-transparent bg-primary/90 text-primary-foreground",
                    )}
                  >
                    {countryMsg(
                      "statusLabel",
                      selectedCountry.statusLabel || "オフグリッド蓄電",
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pl-5 text-sm">
              <div className="flex flex-col gap-2">
                {SIDEBAR_SPEC_FIELDS.map(({ key, labelKey }) => {
                  const isPlugInEase = key === "plugInEase"
                  const value = isPlugInEase
                    ? plugInEaseSpec
                      ? tSidebar(plugInEaseSpec.msgKey)
                      : ""
                    : key === "excessPower"
                      ? excessPowerKey
                        ? tSidebar(excessPowerKey)
                        : ""
                      : sidebarRuleSummary()
                  return (
                    <div key={key} className="flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-xs font-semibold text-slate-400">{tSidebar(labelKey)}</span>
                      <span
                        className={cn(
                          "break-words text-sm",
                          isPlugInEase && plugInEaseSpec
                            ? OUTLET_TONE_CLASS[plugInEaseSpec.tone]
                            : "font-medium text-slate-100",
                        )}
                      >
                        {value}
                      </span>
                    </div>
                  )
                })}
                <p className="text-sm leading-relaxed text-slate-300">
                  {countryMsg(
                    "summary",
                    selectedCountry.keyDrivers?.join(" / ") ||
                      selectedCountry.bottlenecks?.join(" / ") ||
                      `${selectedCountry.name}の実装状況`,
                  )}
                </p>
              </div>

              {selectedCountry.keyDrivers && selectedCountry.keyDrivers.length > 0 && (
                <div className="space-y-1.5 border-t border-slate-800 pt-2">
                  <div className="text-sm font-semibold text-emerald-400">
                    {WORLD_PV_ANALYSIS_LABELS.drivers}
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-200">
                    {selectedCountry.keyDrivers.map((driver, idx) => (
                      <li key={idx}>
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedCountry.bottlenecks && selectedCountry.bottlenecks.length > 0 && (
                <div className="space-y-1.5 border-t border-slate-800 pt-2">
                  <div className="text-sm font-semibold text-rose-400">
                    {WORLD_PV_ANALYSIS_LABELS.bottlenecks}
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-200">
                    {selectedCountry.bottlenecks.map((bottle, idx) => (
                      <li key={idx}>
                        {bottle}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium text-muted-foreground">{tSidebar("relatedOrgs")}</p>
                <ToggleGroup
                  value={[actorFilter]}
                  onValueChange={(v) => v[0] && setActorFilter(v[0] as EcosystemActorFilter)}
                  variant="outline"
                  className="flex w-full flex-wrap"
                >
                  {ECOSYSTEM_ACTOR_FILTERS.map((f) => (
                    <ToggleGroupItem key={f.id} value={f.id} className="flex-1 text-xs sm:flex-none">
                      {tSidebar(`filters.${f.id}`)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <div className="flex flex-col gap-2">
                  {relatedActors.length === 0 ? (
                    <p className="rounded-lg bg-muted/40 px-3 py-4 text-center text-xs text-muted-foreground">
                      {tSidebar("relatedOrgsEmpty")}
                    </p>
                  ) : (
                    relatedActors.map((actor) => {
                      const Icon = ACTOR_TYPE_ICON[actor.type]
                      const displayName = isEn && actor.nameEn ? actor.nameEn : actor.name
                      const displayRole = isEn && actor.roleEn ? actor.roleEn : actor.role
                      if (actor.url) {
                        return (
                          <a
                            key={actor.id}
                            href={actor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 transition-all duration-150 hover:border-primary/40 hover:bg-muted/50"
                          >
                            <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="break-words font-medium text-foreground transition-colors group-hover:text-emerald-400">
                                  {displayName}
                                </p>
                                <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-emerald-400" />
                              </div>
                              <p className="mt-0.5 break-words text-xs text-muted-foreground">
                                {displayRole}
                              </p>
                            </div>
                          </a>
                        )
                      }
                      return (
                        <div
                          key={actor.id}
                          className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5"
                        >
                          <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                          <div className="min-w-0 flex-1">
                            <p className="break-words font-medium text-foreground">{displayName}</p>
                            <p className="mt-0.5 break-words text-xs text-muted-foreground">
                              {displayRole}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </>
        ) : null}
      </Card>
    </div>
  )
}

export function BalconyView({ onNavigateToEcosystem: _onNavigateToEcosystem }: BalconyViewProps) {
  const t = useTranslations("balconyPv")
  const tDirections = useTranslations("common.directions")
  const [tab, setTab] = useState<BalconyTab>("simulator")
  const [direction, setDirection] = useState<Direction>("south")
  const [railing, setRailing] = useState<RailingType>("grid")
  const [hour, setHour] = useState(12.5)

  const score = useMemo(() => computeBalconyScore(direction, railing, hour), [direction, railing, hour])
  const kit = useMemo(() => recommendedKit(score), [score])

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        value={[tab]}
        onValueChange={(v) => v[0] && setTab(v[0] as BalconyTab)}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <ToggleGroupItem value="simulator" className="flex-1 text-sm sm:flex-none">
          {t("tabs.simulator")}
        </ToggleGroupItem>
        <ToggleGroupItem value="living-sense" className="flex-1 text-sm sm:flex-none">
          {t("tabs.livingSense")}
        </ToggleGroupItem>
      </ToggleGroup>

      {tab === "living-sense" ? (
        <HomeView />
      ) : (
        <>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">{t("conditions.title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">{t("conditions.direction")}</p>
                <ToggleGroup
                  value={[direction]}
                  onValueChange={(v) => v[0] && setDirection(v[0] as Direction)}
                  variant="outline"
                  className="flex-wrap"
                >
                  {DIRECTIONS.map((value) => (
                    <ToggleGroupItem key={value} value={value} className="text-sm">
                      {tDirections(value)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">{t("conditions.railing")}</p>
                <ToggleGroup
                  value={[railing]}
                  onValueChange={(v) => v[0] && setRailing(v[0] as RailingType)}
                  variant="outline"
                  className="flex-wrap"
                >
                  {RAILING_TYPES.map((r) => (
                    <ToggleGroupItem key={r.value} value={r.value} className="text-sm">
                      {t(`railing.${r.value}`)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{t("conditions.seasonTime")}</p>
                  <span className="font-mono text-sm text-foreground">{formatHour(hour)}</span>
                </div>
                <Slider
                  value={[hour]}
                  min={8}
                  max={17}
                  step={0.5}
                  onValueChange={(v) => setHour(Array.isArray(v) ? v[0] : v)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("conditions.morning")}</span>
                  <span>{t("conditions.evening")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">{t("results.visualTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <BalconyIllustration direction={direction} railing={railing} hour={hour} />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="border-border/60">
                <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="size-4" />
                    <span className="text-xs font-medium">{t("results.scoreLabel")}</span>
                  </div>
                  <span className="font-mono text-5xl font-semibold tabular-nums text-primary">{score}</span>
                  <Badge className="bg-primary/90 text-primary-foreground">{t(`score.${scoreBand(score)}`)}</Badge>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <PackageCheck className="size-4 text-primary" />
                    {t("results.kitTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-muted-foreground">{t("results.panel")}</span>
                    <span className="font-medium text-foreground">{t(`kit.${kit.panel}`)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-muted-foreground">{t("results.battery")}</span>
                    <span className="font-medium text-foreground">{t(`kit.${kit.battery}`)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
