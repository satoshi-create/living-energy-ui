"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  Building2,
  ExternalLink,
  Gauge,
  Landmark,
  PackageCheck,
  Sofa,
  Users,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { HomeView } from "@/features/living-sense"
import {
  MajorVendorsListView,
  NonProfitOrgsListView,
} from "@/features/global-implementation/components/global-implementation-view"
import type { CountryCode } from "@/lib/country-codes"
import { cn } from "@/lib/utils"
import {
  BalconyIllustration,
  SurfaceCountryTags,
  SurfaceMountJobBadges,
} from "./balcony-illustration"
import {
  Surface3DFullView,
  type Surface3DFocus,
} from "./surface-3d-full-view"
import { Surface3DViewer } from "./surface-3d-viewer"
import { WorldPvMap, type MovementHistoryPhaseId } from "./world-pv-map"
import {
  DIRECTIONS,
  ECOSYSTEM_ACTOR_FILTERS,
  RAILING_TYPES,
  WORLD_BALCONY_PV_COUNTRIES,
  computeBalconyScore,
  getCountryArchitectureConfig,
  getEcosystemActorsByCountry,
  getMaturityScore,
  getPvRegionsByMaturityDesc,
  getSurfaceTypologyDetail,
  listArchitectureCatalog,
  recommendedKit,
  resolveProfileTypology,
  resolveSystemModel,
  type ArchitectureProfile,
  type ArchitectureSurfaceType,
  type CountryPvDetail,
  type Direction,
  type EcosystemActorFilter,
  type EcosystemActorType,
  type RailingType,
  type SolarFurnitureId,
  type SystemModelType,
} from "../data"

function profileRegionContextKey(constraintsKey: string): string {
  return constraintsKey.replace(/\.constraints$/, ".regionContext")
}

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

const ARCH_TYPE_ICON: Record<ArchitectureSurfaceType, typeof Building2> = {
  balcony: Building2,
  roof: Landmark,
  facade: Building2,
}

type ArchitectureSidebarProps = {
  profiles: ArchitectureProfile[]
  countryId: string
  highlightedFurnitureId: SolarFurnitureId | null
  onHighlightFurniture: (id: SolarFurnitureId) => void
  onOpenSurfaceDetail: (focus: Surface3DFocus) => void
}

function ArchitectureSidebar({
  profiles,
  countryId,
  highlightedFurnitureId,
  onHighlightFurniture,
  onOpenSurfaceDetail,
}: ArchitectureSidebarProps) {
  const tArch = useTranslations("worldPv.architecture")
  const balconyProfiles = useMemo(
    () => profiles.filter((p) => p.type === "balcony"),
    [profiles],
  )
  const roofProfiles = useMemo(
    () => profiles.filter((p) => p.type === "roof"),
    [profiles],
  )
  const hasBothSurfaces = balconyProfiles.length > 0 && roofProfiles.length > 0
  const [surfaceTab, setSurfaceTab] = useState<"balcony" | "roof">(
    balconyProfiles.length > 0 ? "balcony" : "roof",
  )

  const visibleProfiles = useMemo(() => {
    if (!hasBothSurfaces) return profiles
    return surfaceTab === "balcony" ? balconyProfiles : roofProfiles
  }, [hasBothSurfaces, surfaceTab, profiles, balconyProfiles, roofProfiles])

  if (profiles.length === 0) return null

  return (
    <div className="flex flex-col gap-3 border-t border-slate-800 pt-3">
      <p className="text-xs font-medium text-muted-foreground">{tArch("sectionTitle")}</p>
      {hasBothSurfaces && (
        <div
          role="tablist"
          aria-label={tArch("surface3d.surfaceTabsAria")}
          className="flex gap-1 rounded-md border border-border/50 bg-muted/40 p-0.5"
        >
          {(["balcony", "roof"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={surfaceTab === tab}
              onClick={() => setSurfaceTab(tab)}
              className={cn(
                "flex-1 rounded px-2 py-1 text-[11px] font-medium transition-colors",
                surfaceTab === tab
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tArch(`surface3d.tab${tab === "balcony" ? "Balcony" : "Roof"}`)}
            </button>
          ))}
        </div>
      )}
      <ul className="flex flex-col gap-2.5">
        {visibleProfiles.map((profile) => {
          const TypeIcon = ARCH_TYPE_ICON[profile.type]
          const typology = getSurfaceTypologyDetail(resolveProfileTypology(profile))
          return (
            <li
              key={profile.id}
              className="flex flex-col gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-1 text-[10px] font-medium"
                >
                  <TypeIcon className="size-3" />
                  {tArch(`types.${profile.type}`)}
                </Badge>
                <span className="text-sm font-medium text-foreground">
                  {tArch(profile.nameKey)}
                </span>
                <Badge variant="outline" className="font-mono text-[10px] text-amber-300/90">
                  {tArch("surface3d.tiltLabel")}: {profile.tiltAngle}
                </Badge>
                <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                  {tArch(`opticalProfile.${typology.opticalProfile}`)}
                </Badge>
              </div>
              <div className="relative">
                <Surface3DViewer profileId={profile.model3dId} />
                <button
                  type="button"
                  onClick={() =>
                    onOpenSurfaceDetail({
                      countryId,
                      profileId: profile.id,
                    })
                  }
                  className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-md border border-border/60 bg-black/70 px-2 py-1 text-[10px] font-medium text-primary backdrop-blur transition-colors hover:bg-black/85 hover:text-emerald-300"
                >
                  {tArch("surface3d.expandFull")}
                  <ExternalLink className="size-3" />
                </button>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {tArch(profile.descriptionKey)}
              </p>
              <div className="rounded-md bg-rose-500/10 px-2.5 py-1.5">
                <p className="text-[10px] font-semibold text-rose-300">
                  {tArch("constraintsLabel")}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-200">
                  {tArch(profile.constraintsKey)}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <Sofa className="size-3" />
                  {tArch("adaptedFurnitureLabel")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.adaptedFurnitureIds.map((fid) => {
                    const active = highlightedFurnitureId === fid
                    return (
                      <button
                        key={fid}
                        type="button"
                        onClick={() => onHighlightFurniture(fid)}
                        className={cn(
                          "rounded-md border px-2 py-1 text-left text-[11px] transition-colors",
                          active
                            ? "border-primary/60 bg-primary/20 text-primary ring-1 ring-primary/40"
                            : "border-border/50 bg-muted/40 text-slate-200 hover:border-primary/40 hover:bg-muted/60",
                        )}
                      >
                        <span className="font-medium">{tArch(`furniture.${fid}.name`)}</span>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">
                          {tArch(`furniture.${fid}.adaptation`)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

type BalconyTab = "simulator" | "living-sense"

export type BalconyViewProps = {
  onNavigateToEcosystem?: (countryCode: CountryCode) => void
}

type WorldImplTab = "map" | "vendors" | "nonprofits" | "surfaces"

type SurfaceCategoryFilter = "all" | "balcony" | "roof"

/** surfaces タブ内: 一覧 / 大画面詳細（戻り先は一覧 or マップ） */
type SurfacesPanelState =
  | { mode: "list" }
  | { mode: "detail"; focus: Surface3DFocus; returnTo: "list" | "map" }

function catalogSurfaceCategory(
  profileType: ArchitectureSurfaceType,
  typologyCategory: "balcony" | "roof",
): "balcony" | "roof" {
  if (profileType === "facade") return "balcony"
  if (profileType === "balcony" || profileType === "roof") return profileType
  return typologyCategory
}

export function WorldImplementationView() {
  const t = useTranslations("worldPv")
  const tSidebar = useTranslations("worldPv.sidebar")
  const tArch = useTranslations("worldPv.architecture")
  const tPv = useTranslations("balconyPv")
  const locale = useLocale()
  const isEn = locale === "en"
  const [viewTab, setViewTab] = useState<WorldImplTab>("map")
  const [surfacesPanel, setSurfacesPanel] = useState<SurfacesPanelState>({ mode: "list" })
  const [surfaceCategoryFilter, setSurfaceCategoryFilter] =
    useState<SurfaceCategoryFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>("germany")
  const [isRankingOpen, setIsRankingOpen] = useState(false)
  const [isMovementHistoryOpen, setIsMovementHistoryOpen] = useState(false)
  const [historyPhase, setHistoryPhase] = useState<MovementHistoryPhaseId | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [actorFilter, setActorFilter] = useState<EcosystemActorFilter>("all")
  const [highlightedFurnitureId, setHighlightedFurnitureId] =
    useState<SolarFurnitureId | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const architectureCatalog = useMemo(() => listArchitectureCatalog(), [])

  const surfaceFilterCounts = useMemo(() => {
    let balcony = 0
    let roof = 0
    for (const item of architectureCatalog) {
      const cat = catalogSurfaceCategory(item.profile.type, item.typology.category)
      if (cat === "balcony") balcony += 1
      else roof += 1
    }
    return { all: architectureCatalog.length, balcony, roof }
  }, [architectureCatalog])

  const filteredArchitectureCatalog = useMemo(() => {
    if (surfaceCategoryFilter === "all") return architectureCatalog
    return architectureCatalog.filter(
      (item) =>
        catalogSurfaceCategory(item.profile.type, item.typology.category) ===
        surfaceCategoryFilter,
    )
  }, [architectureCatalog, surfaceCategoryFilter])

  const openSurfaceDetailFromMap = useCallback((focus: Surface3DFocus) => {
    setSurfacesPanel({ mode: "detail", focus, returnTo: "map" })
    setViewTab("surfaces")
  }, [])

  const openSurfaceDetailFromList = useCallback((focus: Surface3DFocus) => {
    setSurfacesPanel({ mode: "detail", focus, returnTo: "list" })
  }, [])

  const backFromSurfaceDetail = useCallback(() => {
    if (surfacesPanel.mode === "detail" && surfacesPanel.returnTo === "map") {
      setViewTab("map")
    }
    setSurfacesPanel({ mode: "list" })
  }, [surfacesPanel])

  const selectedCountry = useMemo(
    () => WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  )
  const relatedActors = useMemo(
    () => (selectedCountry ? getEcosystemActorsByCountry(selectedCountry.id, actorFilter) : []),
    [selectedCountry, actorFilter],
  )
  const rankingRegions = useMemo(() => getPvRegionsByMaturityDesc(), [])
  const architectureConfig = useMemo(
    () =>
      selectedCountry
        ? getCountryArchitectureConfig(selectedCountry.code) ??
          getCountryArchitectureConfig(selectedCountry.id)
        : null,
    [selectedCountry],
  )

  const handleSelectCountry = useCallback((region: CountryPvDetail) => {
    setSelectedId(region.id)
    setActorFilter("all")
    setHighlightedFurnitureId(null)
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
  }, [])

  const handleHighlightFurniture = useCallback((id: SolarFurnitureId) => {
    setHighlightedFurnitureId((prev) => (prev === id ? null : id))
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSelectedId(null)
    setHighlightedFurnitureId(null)
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
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

  // 欧米伝播史は WorldPvMap 内 TimelineSidebar に一元化（親 Card との二重表示を防ぐ）
  const sidebarOpen = viewTab === "map" && (selectedCountry !== null || isRankingOpen)

  return (
    <Tabs
      value={viewTab}
      onValueChange={(v) => {
        if (v === "map" || v === "vendors" || v === "nonprofits" || v === "surfaces") {
          setViewTab(v)
          if (v === "vendors" || v === "nonprofits") {
            setSelectedId(null)
            setHighlightedFurnitureId(null)
            setIsRankingOpen(false)
            setIsMovementHistoryOpen(false)
            setHistoryPhase(null)
          }
          if (v === "surfaces") {
            setSurfacesPanel((prev) =>
              prev.mode === "detail" && prev.returnTo === "map" ? prev : { mode: "list" },
            )
          }
        }
      }}
      className="flex h-[calc(100vh-4rem)] min-h-0 flex-col gap-0 overflow-hidden"
      style={{ ["--sidebar-w" as string]: `${sidebarWidth}px` }}
    >
      <div className="z-40 flex shrink-0 items-center justify-start gap-2 border-b border-border/50 bg-slate-950/90 px-2 py-2 backdrop-blur-md sm:px-3">
        <TabsList className="h-8 w-full max-w-4xl bg-black/60 sm:w-auto">
          <TabsTrigger value="map" className="flex-1 px-2 text-xs sm:flex-none">
            🗺️ {t("tabs.map")}
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex-1 px-2 text-xs sm:flex-none">
            🏢 {t("tabs.vendors")}
          </TabsTrigger>
          <TabsTrigger value="nonprofits" className="flex-1 px-2 text-xs sm:flex-none">
            🌐 {t("tabs.nonprofits")}
          </TabsTrigger>
          <TabsTrigger value="surfaces" className="flex-1 px-2 text-xs sm:flex-none">
            📐 {t("tabs.surfaces")}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="map" className="relative m-0 min-h-0 flex-1 overflow-hidden data-[hidden]:hidden">
      {/* 国詳細／ランキング Card 展開時は右端を空け、コントロールバーが下敷きにならないよう可視域内に収める */}
      <div
        className={cn(
          "absolute inset-0 min-h-0 min-w-0 overflow-hidden transition-[right] duration-300 ease-in-out",
          sidebarOpen && "lg:right-[var(--sidebar-w)]",
        )}
      >
        <div className="flex h-full min-h-0 w-full max-w-full items-center justify-center p-2 sm:p-4">
          <WorldPvMap
            selectedCountryId={selectedId ?? ""}
            isRankingOpen={isRankingOpen}
            onRankingOpenChange={(open) => {
              setIsRankingOpen(open)
              if (open) {
                setIsMovementHistoryOpen(false)
                setHistoryPhase(null)
              }
            }}
            isMovementHistoryOpen={isMovementHistoryOpen}
            onMovementHistoryOpenChange={(open) => {
              setIsMovementHistoryOpen(open)
              if (open) {
                setSelectedId(null)
                setIsRankingOpen(false)
                setHistoryPhase(historyPhase ?? "guerrilla")
              } else {
                setHistoryPhase(null)
              }
            }}
            historyPhase={historyPhase}
            onHistoryPhaseChange={(phase) => {
              setHistoryPhase(phase)
            }}
              onSelectCountry={(country) => {
              if (country) {
                setSelectedId(country.id)
                setActorFilter("all")
                setHighlightedFurnitureId(null)
                setIsRankingOpen(false)
                setIsMovementHistoryOpen(false)
                setHistoryPhase(null)
              } else {
                setSelectedId(null)
                setHighlightedFurnitureId(null)
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

        {isRankingOpen ? (
          <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pl-5 text-sm">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t("map.rankingTitle")}
            </p>
            <ul className="flex flex-col gap-1.5">
              {rankingRegions.map((region, index) => {
                const score = getMaturityScore(region)
                const isActive = region.id === selectedId
                const regionName = (() => {
                  try {
                    const key = `countries.${region.id}.name` as Parameters<typeof t>[0]
                    if (typeof (t as { has?: (k: string) => boolean }).has === "function" &&
                      (t as { has: (k: string) => boolean }).has(key)) {
                      return t(key)
                    }
                  } catch { /* fall through */ }
                  return isEn && (region as { nameEn?: string }).nameEn
                    ? (region as { nameEn?: string }).nameEn!
                    : region.name
                })()
                const regionStatus = (() => {
                  try {
                    const key = `countries.${region.id}.statusLabel` as Parameters<typeof t>[0]
                    if (typeof (t as { has?: (k: string) => boolean }).has === "function" &&
                      (t as { has: (k: string) => boolean }).has(key)) {
                      return t(key)
                    }
                  } catch { /* fall through */ }
                  return region.statusLabel
                })()
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
                            {regionName}
                          </span>
                          <span className="font-mono text-xs text-amber-400">★{score}</span>
                        </span>
                        <Badge
                          variant="secondary"
                          className="mt-1 max-w-full truncate text-[10px] font-normal"
                        >
                          {regionStatus}
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
                    isEn && (selectedCountry as { nameEn?: string }).nameEn
                      ? (selectedCountry as { nameEn?: string }).nameEn!
                      : selectedCountry.name,
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
                      selectedCountry.statusLabel || t("analysis.offgridStorageFallback"),
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
                    isEn && (selectedCountry as { summaryEn?: string }).summaryEn
                      ? (selectedCountry as { summaryEn?: string }).summaryEn!
                      : selectedCountry.keyDrivers?.join(" / ") ||
                        selectedCountry.bottlenecks?.join(" / ") ||
                        t("analysis.implStatus", {
                          name: countryMsg(
                            "name",
                            isEn && (selectedCountry as { nameEn?: string }).nameEn
                              ? (selectedCountry as { nameEn?: string }).nameEn!
                              : selectedCountry.name,
                          ),
                        }),
                  )}
                </p>
              </div>

              {architectureConfig && architectureConfig.profiles.length > 0 && (
                <ArchitectureSidebar
                  key={selectedCountry.id}
                  profiles={architectureConfig.profiles}
                  countryId={selectedCountry.id}
                  highlightedFurnitureId={highlightedFurnitureId}
                  onHighlightFurniture={handleHighlightFurniture}
                  onOpenSurfaceDetail={openSurfaceDetailFromMap}
                />
              )}

              {selectedCountry.keyDrivers && selectedCountry.keyDrivers.length > 0 && (
                <div className="space-y-1.5 border-t border-slate-800 pt-2">
                  <div className="text-sm font-semibold text-emerald-400">
                    {tSidebar("drivers")}
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-200">
                    {selectedCountry.keyDrivers.map((driver, idx) => {
                      const enList = (selectedCountry as { keyDriversEn?: string[] }).keyDriversEn
                      const fromMsg = countryMsg(`keyDrivers.${idx}`, "")
                      const text =
                        (fromMsg && fromMsg) ||
                        (isEn && enList?.[idx] ? enList[idx] : driver)
                      return <li key={idx}>{text}</li>
                    })}
                  </ul>
                </div>
              )}
              {selectedCountry.bottlenecks && selectedCountry.bottlenecks.length > 0 && (
                <div className="space-y-1.5 border-t border-slate-800 pt-2">
                  <div className="text-sm font-semibold text-rose-400">
                    {tSidebar("bottlenecks")}
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-200">
                    {selectedCountry.bottlenecks.map((bottle, idx) => {
                      const enList = (selectedCountry as { bottlenecksEn?: string[] }).bottlenecksEn
                      const fromMsg = countryMsg(`bottlenecks.${idx}`, "")
                      const text =
                        (fromMsg && fromMsg) ||
                        (isEn && enList?.[idx] ? enList[idx] : bottle)
                      return <li key={idx}>{text}</li>
                    })}
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
      </TabsContent>

      <TabsContent
        value="vendors"
        className="m-0 min-h-0 flex-1 overflow-hidden outline-none data-[hidden]:hidden"
      >
        <MajorVendorsListView />
      </TabsContent>

      <TabsContent
        value="nonprofits"
        className="m-0 min-h-0 flex-1 overflow-hidden outline-none data-[hidden]:hidden"
      >
        <NonProfitOrgsListView />
      </TabsContent>

      <TabsContent
        value="surfaces"
        className="m-0 min-h-0 flex-1 overflow-hidden outline-none data-[hidden]:hidden"
      >
        {surfacesPanel.mode === "detail" ? (
          <div className="flex h-full min-h-0 flex-col gap-2 px-2 pb-2 pt-1 sm:px-3">
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={backFromSurfaceDetail}
                className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/70 hover:text-primary"
              >
                {surfacesPanel.returnTo === "map"
                  ? tArch("surface3d.backToMap")
                  : tArch("surface3d.backToList")}
              </button>
            </div>
            <Surface3DFullView
              key={`${surfacesPanel.focus.countryId}:${surfacesPanel.focus.profileId}`}
              initialFocus={surfacesPanel.focus}
              className="h-full min-h-0"
            />
          </div>
        ) : (
          <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto px-3 py-3 sm:px-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {tArch("surface3d.listTitle")}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tArch("surface3d.listLead")}
              </p>
            </div>

            <Tabs
              value={surfaceCategoryFilter}
              onValueChange={(value) => {
                if (value === "all" || value === "balcony" || value === "roof") {
                  setSurfaceCategoryFilter(value)
                }
              }}
            >
              <TabsList
                className="h-auto w-full flex-wrap justify-start gap-1 sm:w-fit"
                aria-label={tArch("surface3d.surfaceTabsAria")}
              >
                <TabsTrigger value="all" className="px-3 py-1.5 text-xs sm:text-sm">
                  {tPv("filter.all")} ({surfaceFilterCounts.all})
                </TabsTrigger>
                <TabsTrigger value="balcony" className="px-3 py-1.5 text-xs sm:text-sm">
                  {tPv("filter.balcony")} ({surfaceFilterCounts.balcony})
                </TabsTrigger>
                <TabsTrigger value="roof" className="px-3 py-1.5 text-xs sm:text-sm">
                  {tPv("filter.roof")} ({surfaceFilterCounts.roof})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredArchitectureCatalog.map(({ countryId, profile, typology }) => {
                const TypeIcon = ARCH_TYPE_ICON[profile.type]
                const opticalLabel = tArch(`opticalProfile.${typology.opticalProfile}`)
                return (
                  <li key={`${countryId}:${profile.id}`}>
                    <button
                      type="button"
                      onClick={() =>
                        openSurfaceDetailFromList({
                          countryId,
                          profileId: profile.id,
                        })
                      }
                      className="flex w-full flex-col gap-2 rounded-xl border border-border/50 bg-card/80 p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 text-sm font-semibold leading-snug text-foreground">
                          {tArch(profile.nameKey)}
                        </p>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] text-amber-300/90"
                          >
                            {profile.tiltAngle}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal text-muted-foreground"
                          >
                            {opticalLabel}
                          </Badge>
                        </div>
                      </div>

                      <SurfaceCountryTags typology={typology} />

                      <div className="relative overflow-hidden rounded-lg border border-border/40">
                        <Surface3DViewer profileId={profile.model3dId} />
                        <div className="pointer-events-none absolute right-2 top-2 flex flex-col items-end gap-1">
                          <span className="rounded-md bg-background/85 px-2 py-0.5 font-mono text-xs text-foreground shadow-sm ring-1 ring-border/50">
                            {profile.tiltAngle}
                          </span>
                          <span className="rounded-md bg-background/85 px-2 py-0.5 text-[10px] text-muted-foreground shadow-sm ring-1 ring-border/50">
                            {opticalLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="inline-flex items-center gap-1 text-[10px] font-medium"
                        >
                          <TypeIcon className="size-3" />
                          {tArch(`types.${profile.type}`)}
                        </Badge>
                        {typology.typicalRegions.map((region) => (
                          <Badge
                            key={region}
                            variant="outline"
                            className="text-[10px] font-normal text-muted-foreground/90"
                          >
                            {tArch(`regions.${region}`)}
                          </Badge>
                        ))}
                      </div>

                      <SurfaceMountJobBadges typology={typology} />

                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-300">
                        {tArch(profile.constraintsKey)}
                      </p>
                      <p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/80">
                        {tArch(
                          profileRegionContextKey(
                            profile.constraintsKey,
                          ) as Parameters<typeof tArch>[0],
                        )}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </TabsContent>
    </Tabs>
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
