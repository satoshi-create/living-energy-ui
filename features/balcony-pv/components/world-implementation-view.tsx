"use client"

import dynamic from "next/dynamic"
import { useCallback, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  ArrowRight,
  Building2,
  Droplets,
  ExternalLink,
  Fan,
  Laptop,
  Layers,
  Lightbulb,
  Landmark,
  Refrigerator,
  Smartphone,
  Sofa,
  type LucideIcon,
  Users,
  Wifi,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  SurfaceCountryTags,
  SurfaceMountJobBadges,
} from "./balcony-illustration"
import type { Surface3DFocus } from "./surface-3d-full-view"
import type { PvHistoryStream } from "../history-data"
import type {
  EcosystemDiagramViewMode,
  MovementHistoryPhaseId,
} from "./world-pv-map"

function HeavyChunkLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[160px] w-full items-center justify-center rounded-xl bg-slate-950/40",
        className,
      )}
    >
      <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  )
}

const Surface3DFullView = dynamic(
  () => import("./surface-3d-full-view").then((m) => m.Surface3DFullView),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-full min-h-[320px]" /> },
)

const Surface3DViewer = dynamic(
  () => import("./surface-3d-viewer").then((m) => m.Surface3DViewer),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-[200px]" /> },
)

const SolarCellTypesView = dynamic(
  () => import("./solar-cell-types-view").then((m) => m.SolarCellTypesView),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-full min-h-[320px]" /> },
)

const WorldPvMap = dynamic(
  () => import("./world-pv-map").then((m) => m.WorldPvMap),
  { ssr: false, loading: () => <HeavyChunkLoading className="h-full min-h-[480px]" /> },
)

const CountryPvEcosystem = dynamic(
  () => import("./world-pv-map").then((m) => m.CountryPvEcosystem),
  { ssr: false, loading: () => <HeavyChunkLoading /> },
)

const CountryPvOssTools = dynamic(
  () => import("./world-pv-map").then((m) => m.CountryPvOssTools),
  { ssr: false, loading: () => <HeavyChunkLoading /> },
)

const CountryPvTimeline = dynamic(
  () => import("./world-pv-map").then((m) => m.CountryPvTimeline),
  { ssr: false, loading: () => <HeavyChunkLoading /> },
)

const MajorVendorsListView = dynamic(
  () =>
    import("@/features/global-implementation/components/global-implementation-view").then(
      (m) => m.MajorVendorsListView,
    ),
  { ssr: false, loading: () => <HeavyChunkLoading /> },
)

const NonProfitOrgsListView = dynamic(
  () =>
    import("@/features/global-implementation/components/global-implementation-view").then(
      (m) => m.NonProfitOrgsListView,
    ),
  { ssr: false, loading: () => <HeavyChunkLoading /> },
)

import {
  ECOSYSTEM_ACTOR_FILTERS,
  MARKET_ECOSYSTEM_TOPOLOGIES,
  MARKET_ECOSYSTEM_UI_ACCENT,
  WORLD_BALCONY_PV_COUNTRIES,
  formatMarketEcosystemCountryChip,
  getCountriesByMarketEcosystemModel,
  getCountryArchitectureConfig,
  getEcosystemActorsByCountry,
  getMarketEcosystemForCountry,
  getMaturityScore,
  getPvRegionsByMaturityDesc,
  getSolarCellTypesForCountryCode,
  getSolarCellTypesForRegionId,
  getSurfaceTypologyDetail,
  listArchitectureCatalog,
  resolveMarketEcosystemWiringFlow,
  resolveProfileTypology,
  resolveSystemModel,
  setMarketEcosystemUiLocale,
  solarCellTypeFromHistoryStream,
  type ArchitectureProfile,
  type ArchitectureSurfaceType,
  type CountryPvDetail,
  type EcosystemActorFilter,
  type EcosystemActorType,
  type EcosystemWiringStepKey,
  type MarketEcosystemModelId,
  type PoweredAppliance,
  type SolarCellTypeId,
  type SolarFurnitureId,
  type SurfaceTypology,
  type SystemModelType,
} from "../data"

const POWERED_APPLIANCE_ICONS: Record<string, LucideIcon> = {
  laptop: Laptop,
  fridge: Refrigerator,
  wifi: Wifi,
  fan: Fan,
  smartphone: Smartphone,
  pump: Droplets,
  lightbulb: Lightbulb,
}

function consumptionNodeTitle(
  modelId: MarketEcosystemModelId,
  isEn: boolean,
): string {
  switch (modelId) {
    case "grid_plugin_allowed":
      return isEn ? "Self-use" : "自家消費"
    case "grid_plugin_prohibited":
      return isEn ? "Appliances" : "生活家電"
    case "offgrid_leapfrog":
      return isEn ? "Direct loads" : "直結負荷"
  }
}

function PoweredApplianceChips({
  appliances,
  note,
  isEn,
}: {
  appliances: PoweredAppliance[]
  note: string
  isEn: boolean
}) {
  return (
    <div className="mt-1.5 flex flex-col gap-1.5 border-t border-border/30 pt-1.5">
      <div className="flex flex-wrap gap-1">
        {appliances.map((app) => {
          const Icon = POWERED_APPLIANCE_ICONS[app.icon] ?? Lightbulb
          return (
            <span
              key={`${app.icon}-${app.nameJa}`}
              className="inline-flex max-w-full items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] leading-tight text-emerald-200"
            >
              <Icon className="size-2.5 shrink-0 opacity-80" aria-hidden />
              <span className="truncate font-medium">
                {isEn ? app.nameEn : app.nameJa}
              </span>
              <span className="shrink-0 font-mono text-[9px] text-emerald-300/80">
                {app.wattage}
              </span>
            </span>
          )
        })}
      </div>
      <p className="text-[9px] leading-snug text-muted-foreground/90">{note}</p>
    </div>
  )
}

const ECOSYSTEM_WIRING_STEPS: readonly EcosystemWiringStepKey[] = [
  "generation",
  "conversion",
  "connection",
  "metering",
  "consumption",
] as const

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

function SidebarJumpButton({
  label,
  onClick,
  icon: Icon = ExternalLink,
  "aria-label": ariaLabel,
}: {
  label: string
  onClick: () => void
  icon?: LucideIcon
  "aria-label"?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className="h-auto shrink-0 gap-1 px-2 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
    >
      <Icon className="size-3" aria-hidden />
      {label}
      <span aria-hidden>↗</span>
    </Button>
  )
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
  onJumpToSurfacesTab: () => void
  jumpToSurfacesLabel: string
}

function ArchitectureSidebar({
  profiles,
  countryId,
  highlightedFurnitureId,
  onHighlightFurniture,
  onOpenSurfaceDetail,
  onJumpToSurfacesTab,
  jumpToSurfacesLabel,
}: ArchitectureSidebarProps) {
  const tArch = useTranslations("worldPv.architecture")
  const tSidebarJump = useTranslations("worldPv.sidebar")
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
    <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{tArch("sectionTitle")}</h3>
        <SidebarJumpButton
          label={jumpToSurfacesLabel}
          aria-label={tSidebarJump("jump.surfaces")}
          onClick={onJumpToSurfacesTab}
        />
      </div>
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
                "flex-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors",
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
      <ul className="flex flex-col gap-2">
        {visibleProfiles.map((profile) => {
          const TypeIcon = ARCH_TYPE_ICON[profile.type]
          const typology = getSurfaceTypologyDetail(resolveProfileTypology(profile))
          return (
            <li
              key={profile.id}
              className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2"
            >
              <div className="flex flex-wrap items-center gap-1">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-1 text-xs font-semibold"
                >
                  <TypeIcon className="size-3" />
                  {tArch(`types.${profile.type}`)}
                </Badge>
                <span className="text-sm font-medium text-foreground">
                  {tArch(profile.nameKey)}
                </span>
                <Badge variant="outline" className="font-mono text-xs font-bold text-foreground">
                  {tArch("surface3d.tiltLabel")}: {profile.tiltAngle}
                </Badge>
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                  {tArch(`opticalProfile.${typology.opticalProfile}`)}
                </Badge>
              </div>
              <div className="relative max-h-[140px] overflow-hidden rounded-md [&_>div]:min-h-[120px] [&_>div]:h-[140px]">
                <Surface3DViewer profileId={profile.model3dId} />
                <button
                  type="button"
                  onClick={() =>
                    onOpenSurfaceDetail({
                      countryId,
                      profileId: profile.id,
                    })
                  }
                  className="absolute top-1.5 right-1.5 z-10 inline-flex items-center gap-1 rounded-md border border-border/60 bg-black/70 px-2 py-1 text-xs font-semibold text-primary backdrop-blur transition-colors hover:bg-black/85 hover:text-emerald-300"
                >
                  {tArch("surface3d.expandFull")}
                  <ExternalLink className="size-3" />
                </button>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-200">
                {tArch(profile.descriptionKey)}
              </p>
              <div className="rounded-md bg-rose-500/10 px-2 py-1">
                <p className="text-xs font-semibold text-slate-100">
                  {tArch("constraintsLabel")}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-200">
                  {tArch(profile.constraintsKey)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center gap-1 text-xs font-semibold text-slate-100">
                  <Sofa className="size-3 text-emerald-400" />
                  {tArch("adaptedFurnitureLabel")}
                </p>
                <div className="flex flex-wrap gap-1">
                  {profile.adaptedFurnitureIds.map((fid) => {
                    const active = highlightedFurnitureId === fid
                    return (
                      <button
                        key={fid}
                        type="button"
                        onClick={() => onHighlightFurniture(fid)}
                        className={cn(
                          "rounded-md border px-2 py-1 text-left text-xs font-medium transition-colors",
                          active
                            ? "border-primary/60 bg-primary/20 text-primary ring-1 ring-primary/40"
                            : "border-border/50 bg-muted/40 text-slate-200 hover:border-primary/40 hover:bg-muted/60",
                        )}
                      >
                        <span className="font-medium">{tArch(`furniture.${fid}.name`)}</span>
                        <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">
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

type WorldImplTab =
  | "map"
  | "vendors"
  | "nonprofits"
  | "oss"
  | "ecosystem"
  | "surfaces"
  | "cell-types"

type SurfaceCategoryFilter = "all" | "balcony" | "roof"

const CELL_STREAM_BADGE_CLASS: Record<PvHistoryStream, string> = {
  silicon_mainstream:
    "border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",
  cigs_cdte: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20",
  organic_perovskite:
    "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
}

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
  // Keep MARKET_ECOSYSTEM_TOPOLOGIES.wiringFlow in sync with locale for diagram/table.
  setMarketEcosystemUiLocale(isEn)
  const [viewTab, setViewTab] = useState<WorldImplTab>("map")
  const [surfacesPanel, setSurfacesPanel] = useState<SurfacesPanelState>({ mode: "list" })
  const [surfaceCategoryFilter, setSurfaceCategoryFilter] =
    useState<SurfaceCategoryFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>("germany")
  const [ecosystemModelId, setEcosystemModelId] =
    useState<MarketEcosystemModelId>("grid_plugin_allowed")
  const [ecosystemViewMode, setEcosystemViewMode] =
    useState<EcosystemDiagramViewMode>("hardware")
  const [isRankingOpen, setIsRankingOpen] = useState(false)
  const [isMovementHistoryOpen, setIsMovementHistoryOpen] = useState(false)
  const [historyPhase, setHistoryPhase] = useState<MovementHistoryPhaseId | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [actorFilter, setActorFilter] = useState<EcosystemActorFilter>("all")
  const [highlightedFurnitureId, setHighlightedFurnitureId] =
    useState<SolarFurnitureId | null>(null)
  const [selectedCellStream, setSelectedCellStream] = useState<
    PvHistoryStream | SolarCellTypeId | null
  >(null)
  const [highlightCellId, setHighlightCellId] = useState<SolarCellTypeId | null>(
    null,
  )
  const [highlightCountryCodes, setHighlightCountryCodes] = useState<string[]>(
    [],
  )
  const sidebarRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const ecosystemAdopterCountries = useMemo(
    () => getCountriesByMarketEcosystemModel(ecosystemModelId),
    [ecosystemModelId],
  )
  const ecosystemAccent = MARKET_ECOSYSTEM_UI_ACCENT[ecosystemModelId]

  const jumpToMapCountry = useCallback((countryId: string) => {
    setSelectedId(countryId)
    setActorFilter("all")
    setHighlightedFurnitureId(null)
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
    setViewTab("map")
  }, [])

  const preserveSelectedCountryCode = useCallback((country: CountryPvDetail) => {
    setHighlightCountryCodes([String(country.code).toUpperCase()])
  }, [])

  const jumpToEcosystemModel = useCallback(
    (modelId: MarketEcosystemModelId, country?: CountryPvDetail | null) => {
      if (country) preserveSelectedCountryCode(country)
      setEcosystemModelId(modelId)
      setViewTab("ecosystem")
    },
    [preserveSelectedCountryCode],
  )

  const jumpToSurfacesTabForCountry = useCallback(
    (country: CountryPvDetail) => {
      preserveSelectedCountryCode(country)
      const config =
        getCountryArchitectureConfig(country.code) ??
        getCountryArchitectureConfig(country.id)
      const firstProfile = config?.profiles[0]
      if (firstProfile) {
        setSurfacesPanel({
          mode: "detail",
          focus: { countryId: country.id, profileId: firstProfile.id },
          returnTo: "map",
        })
      } else {
        setSurfacesPanel({ mode: "list" })
      }
      setViewTab("surfaces")
    },
    [preserveSelectedCountryCode],
  )

  const jumpToRelatedOrgsTab = useCallback(
    (tab: "vendors" | "nonprofits", country: CountryPvDetail) => {
      preserveSelectedCountryCode(country)
      setViewTab(tab)
    },
    [preserveSelectedCountryCode],
  )

  const jumpToOssTools = useCallback((_toolId?: string) => {
    setSelectedId(null)
    setHighlightedFurnitureId(null)
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
    setViewTab("oss")
  }, [])

  const activeEcosystemTopology = useMemo(
    () =>
      MARKET_ECOSYSTEM_TOPOLOGIES.find((t) => t.modelId === ecosystemModelId) ??
      MARKET_ECOSYSTEM_TOPOLOGIES[0],
    [ecosystemModelId],
  )

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

  const jumpToTypologyFromHistory = useCallback(
    (typologyId: SurfaceTypology) => {
      const match = architectureCatalog.find((item) => item.typology.id === typologyId)
      if (match) {
        setSurfacesPanel({
          mode: "detail",
          focus: { countryId: match.countryId, profileId: match.profile.id },
          returnTo: "list",
        })
      } else {
        setSurfacesPanel({ mode: "list" })
      }
      setSelectedId(null)
      setHighlightedFurnitureId(null)
      setIsRankingOpen(false)
      setIsMovementHistoryOpen(false)
      setHistoryPhase(null)
      setViewTab("surfaces")
    },
    [architectureCatalog],
  )

  const handleNavigateToCell = useCallback((streamId: PvHistoryStream) => {
    setSelectedCellStream(streamId)
    setHighlightCellId(solarCellTypeFromHistoryStream(streamId))
    setViewTab("cell-types")
  }, [])

  const handleNavigateToCellType = useCallback(
    (cellId: SolarCellTypeId, country?: CountryPvDetail | null) => {
      if (country) {
        setHighlightCountryCodes([String(country.code).toUpperCase()])
      }
      setSelectedCellStream(cellId)
      setHighlightCellId(cellId)
      setViewTab("cell-types")
    },
    [],
  )

  const jumpToCellTypesTabForCountry = useCallback(
    (country: CountryPvDetail) => {
      setHighlightCountryCodes([String(country.code).toUpperCase()])
      const panelLinks =
        getSolarCellTypesForCountryCode(String(country.code)).length > 0
          ? getSolarCellTypesForCountryCode(String(country.code))
          : getSolarCellTypesForRegionId(country.id)
      if (panelLinks[0]) {
        setSelectedCellStream(panelLinks[0].id)
        setHighlightCellId(panelLinks[0].id)
      } else {
        setSelectedCellStream(null)
        setHighlightCellId(null)
      }
      setViewTab("cell-types")
    },
    [],
  )

  const handleNavigateToCountryCode = useCallback((countryCode: string) => {
    const code = countryCode.trim().toUpperCase()
    const match =
      WORLD_BALCONY_PV_COUNTRIES.find(
        (c) => String(c.code).toUpperCase() === code && !c.parentId,
      ) ??
      WORLD_BALCONY_PV_COUNTRIES.find(
        (c) => String(c.code).toUpperCase() === code,
      )
    setHighlightCountryCodes([code])
    setHighlightedFurnitureId(null)
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
    setSelectedId(match?.id ?? null)
    setViewTab("map")
  }, [])

  const detailTypology = useMemo(() => {
    if (surfacesPanel.mode !== "detail") return null
    const match = architectureCatalog.find(
      (item) =>
        item.countryId === surfacesPanel.focus.countryId &&
        item.profile.id === surfacesPanel.focus.profileId,
    )
    return match?.typology ?? null
  }, [surfacesPanel, architectureCatalog])

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
  const selectedEcosystem = selectedCountry
    ? getMarketEcosystemForCountry(selectedCountry)
    : null
  const selectedEcosystemModelId = selectedEcosystem
    ? (selectedEcosystem.modelId as MarketEcosystemModelId)
    : null
  const selectedEcosystemAccent = selectedEcosystemModelId
    ? MARKET_ECOSYSTEM_UI_ACCENT[selectedEcosystemModelId]
    : null

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
        if (
          v === "map" ||
          v === "vendors" ||
          v === "nonprofits" ||
          v === "oss" ||
          v === "ecosystem" ||
          v === "surfaces" ||
          v === "cell-types"
        ) {
          setViewTab(v)
          if (
            v === "vendors" ||
            v === "nonprofits" ||
            v === "oss" ||
            v === "ecosystem" ||
            v === "cell-types"
          ) {
            setSelectedId(null)
            setHighlightedFurnitureId(null)
            setIsRankingOpen(false)
            setIsMovementHistoryOpen(false)
            setHistoryPhase(null)
          }
          if (v === "cell-types") {
            setSelectedCellStream(null)
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
        <TabsList className="h-8 w-full max-w-5xl bg-black/60 sm:w-auto">
          <TabsTrigger value="map" className="flex-1 px-2 text-xs sm:flex-none">
            🗺️ {t("tabs.map")}
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex-1 px-2 text-xs sm:flex-none">
            🏢 {t("tabs.vendors")}
          </TabsTrigger>
          <TabsTrigger value="nonprofits" className="flex-1 px-2 text-xs sm:flex-none">
            🌐 {t("tabs.nonprofits")}
          </TabsTrigger>
          <TabsTrigger value="oss" className="flex-1 px-2 text-xs sm:flex-none">
            🛠️ {t("tabs.oss")}
          </TabsTrigger>
          <TabsTrigger value="ecosystem" className="flex-1 px-2 text-xs sm:flex-none">
            ⚡ {t("tabs.ecosystem")}
          </TabsTrigger>
          <TabsTrigger value="surfaces" className="flex-1 px-2 text-xs sm:flex-none">
            📐 {t("tabs.surfaces")}
          </TabsTrigger>
          <TabsTrigger
            value="cell-types"
            className="flex-1 items-center gap-1 px-2 text-xs sm:flex-none"
          >
            <Layers className="size-3 shrink-0" aria-hidden />
            {isEn ? "Solar Cell Types" : "太陽光パネル（セル）の種類"}
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
            highlightCountryCodes={highlightCountryCodes}
            onNavigateToSolarCell={handleNavigateToCellType}
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
                setHighlightCountryCodes([String(country.code).toUpperCase()])
                setIsRankingOpen(false)
                setIsMovementHistoryOpen(false)
                setHistoryPhase(null)
              } else {
                setSelectedId(null)
                setHighlightedFurnitureId(null)
                setHighlightCountryCodes([])
              }
            }}
          />
        </div>
      </div>

      <Card
        ref={sidebarRef}
        className={cn(
          "z-30 flex flex-col overflow-hidden border-slate-800 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:bg-slate-900/40",
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
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden pl-5 text-sm">
              <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col gap-2">
                <TabsList variant="line" className="w-full shrink-0 justify-start">
                  <TabsTrigger value="overview">
                    {isEn ? "Overview" : "概要"}
                  </TabsTrigger>
                  <TabsTrigger value="timeline">
                    {isEn ? "Timeline" : "タイムライン"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="overview"
                  className="mt-0 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto outline-none"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-100">
                        {tSidebar("statusSummary")}
                      </h3>
                      {selectedEcosystemModelId && (
                        <SidebarJumpButton
                          label={tSidebar("jumpOpen")}
                          aria-label={tSidebar("jump.ecosystem")}
                          onClick={() =>
                            jumpToEcosystemModel(selectedEcosystemModelId, selectedCountry)
                          }
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-border/50 bg-slate-900/60 p-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {tSidebar("statusCard.powerModel")}
                        </span>
                        <p
                          className={cn(
                            "mt-1 break-words text-sm font-medium leading-snug",
                            selectedEcosystemAccent
                              ? "text-slate-100"
                              : "text-slate-200",
                          )}
                        >
                          {selectedEcosystem
                            ? isEn
                              ? selectedEcosystem.badgeEn
                              : selectedEcosystem.badgeJa
                            : isOffgridArch
                              ? tSidebar("archOffgrid")
                              : tSidebar("archGrid")}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-slate-900/60 p-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {tSidebar("statusCard.works")}
                        </span>
                        <p
                          className={cn(
                            "mt-1 break-words text-sm leading-snug",
                            plugInEaseSpec
                              ? OUTLET_TONE_CLASS[plugInEaseSpec.tone]
                              : "font-medium text-slate-100",
                          )}
                        >
                          {plugInEaseSpec ? tSidebar(plugInEaseSpec.msgKey) : "—"}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-slate-900/60 p-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {tSidebar("statusCard.excess")}
                        </span>
                        <p className="mt-1 break-words text-sm font-medium leading-snug text-slate-100">
                          {excessPowerKey ? tSidebar(excessPowerKey) : "—"}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-slate-900/60 p-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {tSidebar("statusCard.legal")}
                        </span>
                        <p className="mt-1 line-clamp-3 break-words text-sm font-medium leading-snug text-slate-100">
                          {sidebarRuleSummary() || "—"}
                        </p>
                      </div>
                    </div>
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
                      onJumpToSurfacesTab={() =>
                        jumpToSurfacesTabForCountry(selectedCountry)
                      }
                      jumpToSurfacesLabel={tSidebar("jumpOpen")}
                    />
                  )}

                  {(() => {
                    const panelLinks =
                      getSolarCellTypesForCountryCode(
                        String(selectedCountry.code),
                      ).length > 0
                        ? getSolarCellTypesForCountryCode(
                            String(selectedCountry.code),
                          )
                        : getSolarCellTypesForRegionId(selectedCountry.id)
                    if (panelLinks.length === 0) return null
                    return (
                      <div className="mt-1 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-100">
                            {tSidebar("recommendedCells")}
                          </h3>
                          <SidebarJumpButton
                            label={tSidebar("jumpOpen")}
                            icon={Layers}
                            aria-label={tSidebar("jump.cellTypes")}
                            onClick={() =>
                              jumpToCellTypesTabForCountry(selectedCountry)
                            }
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {panelLinks.map((cell) => (
                            <button
                              key={cell.id}
                              type="button"
                              onClick={() =>
                                handleNavigateToCellType(cell.id, selectedCountry)
                              }
                              className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                            >
                              {isEn ? cell.categoryBadgeEn : cell.categoryBadgeJa}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {selectedCountry.keyDrivers && selectedCountry.keyDrivers.length > 0 && (
                    <div className="space-y-1.5 border-t border-slate-800 pt-2">
                      <h3 className="text-sm font-semibold text-emerald-400">
                        {tSidebar("drivers")}
                      </h3>
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
                      <h3 className="text-sm font-semibold text-rose-400">
                        {tSidebar("bottlenecks")}
                      </h3>
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
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-100">
                        {tSidebar("relatedOrgs")}
                      </h3>
                      <div className="flex shrink-0 flex-wrap justify-end gap-1">
                        <SidebarJumpButton
                          label={tSidebar("jumpOpen")}
                          icon={Building2}
                          aria-label={tSidebar("jump.vendors")}
                          onClick={() =>
                            jumpToRelatedOrgsTab("vendors", selectedCountry)
                          }
                        />
                        <SidebarJumpButton
                          label={tSidebar("jumpOpen")}
                          icon={Users}
                          aria-label={tSidebar("jump.nonprofits")}
                          onClick={() =>
                            jumpToRelatedOrgsTab("nonprofits", selectedCountry)
                          }
                        />
                      </div>
                    </div>
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
                </TabsContent>
                <TabsContent
                  value="timeline"
                  className="mt-0 min-h-0 flex-1 overflow-y-auto outline-none"
                >
                  <CountryPvTimeline
                    key={selectedCountry.id}
                    country={selectedCountry}
                    isEn={isEn}
                    barrierLabel={t("analysis.barrierOvercome")}
                    milestoneLabel={t("analysis.keyMilestone")}
                  />
                </TabsContent>
              </Tabs>
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
        value="oss"
        className="m-0 min-h-0 flex-1 overflow-hidden outline-none data-[hidden]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col space-y-8 overflow-y-auto bg-slate-950 p-5 sm:p-6 md:p-8">
          <div className="shrink-0 space-y-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6">
            <h2 className="text-base font-semibold text-slate-100">{t("oss.title")}</h2>
            <p className="text-sm leading-relaxed text-slate-400">{t("oss.lead")}</p>
          </div>
          <CountryPvOssTools isEn={isEn} />
        </div>
      </TabsContent>

      <TabsContent
        value="ecosystem"
        className="m-0 min-h-0 flex-1 overflow-hidden outline-none data-[hidden]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col space-y-8 overflow-y-auto bg-slate-950 p-5 sm:p-6 md:p-8">
          <div className="mb-8 shrink-0 space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6">
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-slate-100">{t("ecosystem.title")}</h2>
              <p className="text-sm leading-relaxed text-slate-400">{t("ecosystem.lead")}</p>
            </div>

          <div className="flex flex-wrap gap-2">
            {MARKET_ECOSYSTEM_TOPOLOGIES.map((topo) => {
              const id = topo.modelId as MarketEcosystemModelId
              const accent = MARKET_ECOSYSTEM_UI_ACCENT[id]
              const active = id === ecosystemModelId
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEcosystemModelId(id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? accent.tab : accent.tabIdle,
                  )}
                >
                  {isEn ? topo.badgeEn : topo.badgeJa}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-800/60 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t("ecosystem.viewMode.label")}
            </p>
            <ToggleGroup
              value={[ecosystemViewMode]}
              onValueChange={(v) => {
                if (v[0] === "hardware" || v[0] === "software") {
                  setEcosystemViewMode(v[0])
                }
              }}
              variant="outline"
              className="flex w-full flex-wrap sm:w-auto"
              aria-label={t("ecosystem.viewMode.label")}
            >
              <ToggleGroupItem
                value="hardware"
                className="flex-1 text-xs sm:flex-none"
              >
                {t("ecosystem.viewMode.hardware")}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="software"
                className="flex-1 text-xs sm:flex-none"
              >
                {t("ecosystem.viewMode.software")}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div
            className={cn(
              "space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-5",
              ecosystemAccent.panel,
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isEn
                ? "🌍 Main countries & regions using this power model"
                : "🌍 この給電モデルを採用している主な国・地域"}
            </p>
            <div className="flex flex-wrap gap-2">
              {ecosystemAdopterCountries.length === 0 ? (
                <span className="text-xs text-slate-400">
                  {isEn ? "No countries listed" : "該当国なし"}
                </span>
              ) : (
                ecosystemAdopterCountries.map((country) => (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => jumpToMapCountry(country.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      ecosystemAccent.chip,
                    )}
                  >
                    {formatMarketEcosystemCountryChip(country, isEn)}
                  </button>
                ))
              )}
            </div>
          </div>
          </div>

          {/* Hide inner ①②③ tabs — parent owns model selection for chip sync.
              remount on locale / viewMode so wiringFlow + SVG overlays refresh.
              Hide default wiring-step cards (5th child); re-render below as hardware specs. */}
          <div className="[&>div>div:first-child]:hidden [&>div>div:nth-child(5)]:hidden">
            <CountryPvEcosystem
              key={`${ecosystemModelId}:${ecosystemViewMode}:${isEn ? "en" : "ja"}:${resolveMarketEcosystemWiringFlow(
                activeEcosystemTopology,
                isEn,
              ).generation}`}
              isEn={isEn}
              modelId={ecosystemModelId}
              viewMode={ecosystemViewMode}
              onSelectOssTab={() => jumpToOssTools()}
            />
          </div>

          {/* Hardware wiring specs only — software overlays live on the SVG above */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ECOSYSTEM_WIRING_STEPS.map((stepKey) => {
              const flow = resolveMarketEcosystemWiringFlow(
                activeEcosystemTopology,
                isEn,
              )
              const isConsumption = stepKey === "consumption"
              return (
                <div
                  key={stepKey}
                  className={cn(
                    "flex flex-col space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6",
                    isConsumption && "min-h-[7.5rem] sm:col-span-2 lg:col-span-1",
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {isConsumption
                      ? consumptionNodeTitle(ecosystemModelId, isEn)
                      : t(`ecosystem.wiringSteps.${stepKey}`)}
                  </p>
                  <p className="text-sm leading-relaxed break-words text-slate-200">
                    {flow[stepKey]}
                  </p>
                  {isConsumption && (
                    <PoweredApplianceChips
                      appliances={activeEcosystemTopology.poweredAppliances}
                      note={
                        isEn
                          ? activeEcosystemTopology.applianceNoteEn
                          : activeEcosystemTopology.applianceNoteJa
                      }
                      isEn={isEn}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="surfaces"
        className="m-0 min-h-0 flex-1 overflow-hidden outline-none data-[hidden]:hidden"
      >
        {surfacesPanel.mode === "detail" ? (
          <div className="flex h-full min-h-0 flex-col gap-2 px-2 pb-2 pt-1 sm:px-3">
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={backFromSurfaceDetail}
                className="inline-flex items-center rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/70 hover:text-primary"
              >
                {surfacesPanel.returnTo === "map"
                  ? tArch("surface3d.backToMap")
                  : tArch("surface3d.backToList")}
              </button>
              {detailTypology && (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/30 p-3 sm:max-w-md sm:flex-none">
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      この建築部位に最適なセル
                    </span>
                    <span className="mt-0.5 truncate text-xs font-bold text-foreground">
                      {detailTypology.recommendedCellBadgeJa}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigateToCell(detailTypology.recommendedCellStream)
                    }
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
                  >
                    <span>セル3Dを見る</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="min-h-0 flex-1">
              <Surface3DFullView
                key={`${surfacesPanel.focus.countryId}:${surfacesPanel.focus.profileId}`}
                initialFocus={surfacesPanel.focus}
                className="h-full min-h-0"
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-0 flex-col space-y-8 overflow-y-auto bg-slate-950 p-5 sm:p-6 md:p-8">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6">
              <h2 className="text-base font-semibold text-slate-100">
                {tArch("surface3d.listTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {tArch("surface3d.listLead")}
              </p>

              <Tabs
                value={surfaceCategoryFilter}
                onValueChange={(value) => {
                  if (value === "all" || value === "balcony" || value === "roof") {
                    setSurfaceCategoryFilter(value)
                  }
                }}
                className="mt-4"
              >
                <TabsList
                  className="h-auto w-full flex-wrap justify-start gap-2 sm:w-fit"
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
            </div>

            <ul className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredArchitectureCatalog.map(({ countryId, profile, typology }) => {
                const TypeIcon = ARCH_TYPE_ICON[profile.type]
                const opticalLabel = tArch(`opticalProfile.${typology.opticalProfile}`)
                return (
                  <li key={`${countryId}:${profile.id}`}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        openSurfaceDetailFromList({
                          countryId,
                          profileId: profile.id,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          openSurfaceDetailFromList({
                            countryId,
                            profileId: profile.id,
                          })
                        }
                      }}
                      className="flex w-full cursor-pointer flex-col space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 text-left transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-800/80 md:p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 text-base font-semibold leading-snug text-slate-100">
                          {tArch(profile.nameKey)}
                        </p>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs text-amber-300/90"
                          >
                            {profile.tiltAngle}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs font-normal text-slate-400"
                          >
                            {opticalLabel}
                          </Badge>
                        </div>
                      </div>

                      <SurfaceCountryTags typology={typology} />

                      <div className="relative overflow-hidden rounded-lg border border-slate-800">
                        <Surface3DViewer profileId={profile.model3dId} />
                        <div className="pointer-events-none absolute right-2 top-2 flex flex-col items-end gap-1.5">
                          <span className="rounded-md bg-slate-950/85 px-2 py-0.5 font-mono text-xs text-slate-100 shadow-sm ring-1 ring-slate-700/50">
                            {profile.tiltAngle}
                          </span>
                          <span className="rounded-md bg-slate-950/85 px-2 py-0.5 text-xs text-slate-400 shadow-sm ring-1 ring-slate-700/50">
                            {opticalLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNavigateToCell(typology.recommendedCellStream)
                          }}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                            CELL_STREAM_BADGE_CLASS[typology.recommendedCellStream],
                          )}
                        >
                          {typology.recommendedCellBadgeJa}
                        </button>
                        <Badge
                          variant="secondary"
                          className="inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <TypeIcon className="size-3" />
                          {tArch(`types.${profile.type}`)}
                        </Badge>
                        {typology.typicalRegions.map((region) => (
                          <Badge
                            key={region}
                            variant="outline"
                            className="text-xs font-normal text-slate-400"
                          >
                            {tArch(`regions.${region}`)}
                          </Badge>
                        ))}
                      </div>

                      <SurfaceMountJobBadges typology={typology} />

                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-300">
                        {tArch(profile.constraintsKey)}
                      </p>
                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
                        {tArch(
                          profileRegionContextKey(
                            profile.constraintsKey,
                          ) as Parameters<typeof tArch>[0],
                        )}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="cell-types"
        className="m-0 min-h-0 flex-1 overflow-hidden outline-none data-[hidden]:hidden"
      >
        <SolarCellTypesView
          key={selectedCellStream ?? "cell-list"}
          isEn={isEn}
          initialSelectedStream={selectedCellStream}
          highlightCellId={highlightCellId}
          onSelectTypology={jumpToTypologyFromHistory}
          onNavigateToCountry={handleNavigateToCountryCode}
        />
      </TabsContent>
    </Tabs>
  )
}

