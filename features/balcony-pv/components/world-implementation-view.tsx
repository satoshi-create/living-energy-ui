"use client"

import dynamic from "next/dynamic"
import { useCallback, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  Building2,
  Droplets,
  ExternalLink,
  Fan,
  Laptop,
  Layers,
  Lightbulb,
  Landmark,
  PanelRightClose,
  PanelRightOpen,
  Refrigerator,
  Smartphone,
  type LucideIcon,
  Wifi,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SurfaceCountryTags } from "./balcony-illustration"
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
  WORLD_BALCONY_PV_COUNTRIES,
  formatMarketEcosystemCountryChip,
  getCountriesByMarketEcosystemModel,
  getCountryArchitectureConfig,
  getEcosystemActorsByCountry,
  getMarketEcosystemForCountry,
  getMaturityScore,
  getPvRegionsByMaturityDesc,
  listArchitectureCatalog,
  resolveGridCategory,
  resolveMarketEcosystemWiringFlow,
  resolveSystemModel,
  setMarketEcosystemUiLocale,
  solarCellTypeFromHistoryStream,
  type ArchitectureProfile,
  type ArchitectureSurfaceType,
  type CountryPvDetail,
  type EcosystemActorFilter,
  type EcosystemWiringStepKey,
  type GridCategory,
  type MarketEcosystemModelId,
  type PoweredAppliance,
  type SolarCellTypeId,
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
              className="inline-flex max-w-full items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs leading-tight text-emerald-400"
            >
              <Icon className="size-3 shrink-0 opacity-80" aria-hidden />
              <span className="truncate font-medium">
                {isEn ? app.nameEn : app.nameJa}
              </span>
              <span className="shrink-0 font-mono text-xs text-emerald-400/80">
                {app.wattage}
              </span>
            </span>
          )
        })}
      </div>
      <p className="text-xs leading-snug text-slate-400">{note}</p>
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

const SIDEBAR_DEFAULT_WIDTH = 384
const SIDEBAR_MIN_WIDTH = 320
const SIDEBAR_MAX_WIDTH = 700

/** 自立分散・未電化/停電自衛（送電網非依存・BOP）と判定する status */
const OFFGRID_STATUSES = new Set<CountryPvDetail["status"]>([
  "productive_offgrid",
  "micro_solar_kit",
])

function plugInEaseFromModel(model: SystemModelType): {
  msgKey: "outlet.plugOk" | "outlet.netMetering" | "outlet.offgridStorage" | "outlet.necStrict" | "outlet.standalone"
} {
  switch (model) {
    case "plug_800w":
    case "plug_1200w":
    case "plug_600w":
      return { msgKey: "outlet.plugOk" }
    case "net_metering":
      return { msgKey: "outlet.netMetering" }
    case "offgrid_storage":
      return { msgKey: "outlet.offgridStorage" }
    case "nec_strict":
      return { msgKey: "outlet.necStrict" }
    case "productive_offgrid":
    case "micro_solar_kit":
      return { msgKey: "outlet.standalone" }
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

type LegalProcMsgKey =
  | "legal.webRegister"
  | "legal.meterApply"
  | "legal.portableOnly"
  | "legal.licensedWork"
  | "legal.noneStandalone"

function legalProcFromModel(model: SystemModelType): LegalProcMsgKey {
  switch (model) {
    case "plug_800w":
    case "plug_1200w":
    case "plug_600w":
      return "legal.webRegister"
    case "net_metering":
      return "legal.meterApply"
    case "offgrid_storage":
      return "legal.portableOnly"
    case "nec_strict":
      return "legal.licensedWork"
    case "productive_offgrid":
    case "micro_solar_kit":
      return "legal.noneStandalone"
  }
}

function SidebarJumpButton({
  onClick,
  "aria-label": ariaLabel,
}: {
  onClick: () => void
  "aria-label": string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={ariaLabel}
      className="size-7 shrink-0 p-1 text-muted-foreground/60 transition-colors hover:bg-muted/40 hover:text-foreground"
    >
      <ExternalLink className="size-3.5" aria-hidden />
    </Button>
  )
}

const MARKET_MODEL_BADGE_FALLBACK: Record<
  GridCategory,
  { ja: string; en: string; msgKey: string }
> = {
  grid_plug_in: {
    ja: "① コンセント直結",
    en: "① Outlet plug-in",
    msgKey: "marketModel.gridPlugIn",
  },
  grid_hybrid_storage: {
    ja: "② 蓄電ハイブリッド",
    en: "② Storage hybrid",
    msgKey: "marketModel.gridHybridStorage",
  },
  grid_blackout_defense: {
    ja: "③ 停電対策・蓄電自衛",
    en: "③ Blackout defense storage",
    msgKey: "marketModel.gridBlackoutDefense",
  },
  no_grid_leapfrog: {
    ja: "④ 自立オフグリッド",
    en: "④ Off-grid leapfrog",
    msgKey: "marketModel.noGridLeapfrog",
  },
}

function marketModelBadgeLabel(
  category: GridCategory,
  tSidebar: ReturnType<typeof useTranslations>,
  isEn: boolean,
): string {
  const spec = MARKET_MODEL_BADGE_FALLBACK[category]
  try {
    const key = spec.msgKey as Parameters<typeof tSidebar>[0]
    if (
      typeof (tSidebar as { has?: (k: string) => boolean }).has === "function" &&
      (tSidebar as { has: (k: string) => boolean }).has(key)
    ) {
      const val = tSidebar(key)
      if (val && !String(val).includes("marketModel.")) return val
    }
  } catch {
    /* fall through */
  }
  return isEn ? spec.en : spec.ja
}

const ARCH_TYPE_ICON: Record<ArchitectureSurfaceType, typeof Building2> = {
  balcony: Building2,
  roof: Landmark,
  facade: Building2,
}

type ArchitectureSidebarProps = {
  profiles: ArchitectureProfile[]
  onJumpToSurfacesTab: () => void
}

function ArchitectureSidebar({
  profiles,
  onJumpToSurfacesTab,
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
        {visibleProfiles.slice(0, 1).map((profile) => (
          <li
            key={profile.id}
            className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2"
          >
            <p className="min-w-0 truncate text-sm font-medium text-foreground">
              {tArch(profile.nameKey)}
            </p>
            <div className="max-h-[140px] overflow-hidden rounded-md [&_>div]:min-h-[120px] [&_>div]:h-[140px]">
              <Surface3DViewer profileId={profile.model3dId} />
            </div>
          </li>
        ))}
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
  const [surfaceSidebarOpen, setSurfaceSidebarOpen] = useState(true)
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
  const jumpToMapCountry = useCallback((countryId: string) => {
    setSelectedId(countryId)
    setActorFilter("all")
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

  const jumpToOssTools = useCallback((_toolId?: string) => {
    setSelectedId(null)
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
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
    setSelectedId(match?.id ?? null)
    setViewTab("map")
  }, [])

  const detailCatalogItem = useMemo(() => {
    if (surfacesPanel.mode !== "detail") return null
    return (
      architectureCatalog.find(
        (item) =>
          item.countryId === surfacesPanel.focus.countryId &&
          item.profile.id === surfacesPanel.focus.profileId,
      ) ?? null
    )
  }, [surfacesPanel, architectureCatalog])

  const backFromSurfaceDetail = useCallback(() => {
    setViewTab("surfaces")
    setSurfacesPanel({ mode: "list" })
  }, [])

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
    setIsRankingOpen(false)
    setIsMovementHistoryOpen(false)
    setHistoryPhase(null)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSelectedId(null)
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
  const legalProcKey = systemModel ? legalProcFromModel(systemModel) : null
  const selectedEcosystem = selectedCountry
    ? getMarketEcosystemForCountry(selectedCountry)
    : null
  const selectedEcosystemModelId = selectedEcosystem
    ? (selectedEcosystem.modelId as MarketEcosystemModelId)
    : null
  const selectedGridCategory = selectedCountry
    ? resolveGridCategory(selectedCountry)
    : null

  const sidebarLegalProc = () => {
    if (!selectedCountry) return ""
    const fromMsg = countryMsg("procedure", countryMsg("ruleSummary", ""))
    if (fromMsg) return fromMsg
    return legalProcKey ? tSidebar(legalProcKey) : ""
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
                setHighlightCountryCodes([String(country.code).toUpperCase()])
                setIsRankingOpen(false)
                setIsMovementHistoryOpen(false)
                setHistoryPhase(null)
              } else {
                setSelectedId(null)
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
            <p className="text-xs font-medium text-slate-400">
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
                          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold",
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
                          <span className="font-mono text-xs text-emerald-400">★{score}</span>
                        </span>
                        <Badge
                          variant="secondary"
                          className="mt-1 max-w-full truncate rounded-md text-xs font-normal"
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
                <div className="flex items-center gap-2">
                  <CardTitle className="min-w-0 truncate text-xl font-bold text-white">
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
                  {selectedGridCategory ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-900/80 px-2 py-0.5 text-xs font-normal text-slate-300">
                      <span
                        className="size-1.5 rounded-md bg-emerald-500/60"
                        aria-hidden
                      />
                      {marketModelBadgeLabel(
                        selectedGridCategory,
                        tSidebar,
                        isEn,
                      )}
                    </span>
                  ) : null}
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
                        <p className="mt-1 line-clamp-1 break-words text-sm font-medium leading-snug text-slate-100">
                          {countryMsg(
                            "statusLabel",
                            selectedCountry.statusLabel ||
                              (isOffgridArch
                                ? tSidebar("archOffgrid")
                                : tSidebar("archGrid")),
                          )}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-slate-900/60 p-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {tSidebar("statusCard.works")}
                        </span>
                        <p className="mt-1 line-clamp-1 break-words text-sm font-medium leading-snug text-emerald-400">
                          {plugInEaseSpec ? tSidebar(plugInEaseSpec.msgKey) : "—"}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-slate-900/60 p-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {tSidebar("statusCard.excess")}
                        </span>
                        <p className="mt-1 line-clamp-1 break-words text-sm font-medium leading-snug text-slate-100">
                          {excessPowerKey ? tSidebar(excessPowerKey) : "—"}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-slate-900/60 p-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {tSidebar("statusCard.legal")}
                        </span>
                        <p className="mt-1 line-clamp-1 break-words text-sm font-medium leading-snug text-slate-100">
                          {sidebarLegalProc() || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {architectureConfig && architectureConfig.profiles.length > 0 && (
                    <ArchitectureSidebar
                      key={selectedCountry.id}
                      profiles={architectureConfig.profiles}
                      onJumpToSurfacesTab={() =>
                        jumpToSurfacesTabForCountry(selectedCountry)
                      }
                    />
                  )}

                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-slate-100">
                      {tSidebar("relatedOrgs")}
                    </h3>
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
                        <p className="w-full rounded-lg bg-muted/40 px-3 py-3 text-center text-xs text-muted-foreground">
                          {tSidebar("relatedOrgsEmpty")}
                        </p>
                      ) : (
                        relatedActors.map((actor) => {
                          const displayName = isEn && actor.nameEn ? actor.nameEn : actor.name
                          const subtitle =
                            isEn && actor.roleEn ? actor.roleEn : actor.role
                          const cardInner = (
                            <>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-200">
                                  {displayName}
                                </p>
                                {subtitle ? (
                                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                    {subtitle}
                                  </p>
                                ) : null}
                              </div>
                              {actor.url ? (
                                <ExternalLink
                                  className="size-3.5 shrink-0 text-muted-foreground"
                                  aria-hidden
                                />
                              ) : null}
                            </>
                          )
                          if (actor.url) {
                            return (
                              <a
                                key={actor.id}
                                href={actor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 rounded-xl border border-border/50 bg-slate-900/60 p-3 transition-colors hover:border-slate-700 hover:bg-slate-800/60"
                              >
                                {cardInner}
                              </a>
                            )
                          }
                          return (
                            <div
                              key={actor.id}
                              className="flex items-start gap-2 rounded-xl border border-border/50 bg-slate-900/60 p-3"
                            >
                              {cardInner}
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
              const active = id === ecosystemModelId
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEcosystemModelId(id)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-700/60 bg-slate-900/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80",
                  )}
                >
                  {t(`ecosystem.models.${id}`)}
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

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
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
                    className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/20"
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
            <div className="flex shrink-0 items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-1.5">
                <button
                  type="button"
                  onClick={backFromSurfaceDetail}
                  className="inline-flex w-fit items-center rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/70 hover:text-primary"
                >
                  {tArch("surface3d.backToList")}
                </button>
                {detailCatalogItem ? (
                  <h2 className="truncate text-base font-semibold text-slate-100">
                    {tArch(detailCatalogItem.profile.nameKey)}
                  </h2>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setSurfaceSidebarOpen((v) => !v)}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground transition-colors hover:bg-muted/70"
                aria-label={
                  surfaceSidebarOpen
                    ? isEn
                      ? "Collapse sidebar"
                      : "サイドバーを閉じる"
                    : isEn
                      ? "Expand sidebar"
                      : "サイドバーを開く"
                }
              >
                {surfaceSidebarOpen ? (
                  <PanelRightClose className="size-4" aria-hidden />
                ) : (
                  <PanelRightOpen className="size-4" aria-hidden />
                )}
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Surface3DFullView
                key={`${surfacesPanel.focus.countryId}:${surfacesPanel.focus.profileId}`}
                initialFocus={surfacesPanel.focus}
                className="h-full min-h-0"
                sidebarOpen={surfaceSidebarOpen}
                onSidebarOpenChange={setSurfaceSidebarOpen}
                hideSidebarToggle
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
                      className="flex w-full cursor-pointer flex-col space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 text-left transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/80 md:p-6"
                    >
                      <p className="min-w-0 text-base font-semibold leading-relaxed text-slate-100">
                        {tArch(profile.nameKey)}
                      </p>

                      <div className="overflow-hidden rounded-lg border border-slate-800 [&_.text-muted-foreground]:hidden [&_p]:hidden">
                        <Surface3DViewer profileId={profile.model3dId} />
                      </div>

                      <div className="flex flex-col gap-3 border-t border-slate-800/60 pt-4">
                        <div className="flex flex-wrap content-start gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-300">
                            <TypeIcon className="size-3 shrink-0 text-slate-400" aria-hidden />
                            {tArch(`types.${profile.type}`)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNavigateToCell(typology.recommendedCellStream)
                            }}
                            className="inline-flex items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/20"
                          >
                            {typology.recommendedCellBadgeJa}
                          </button>
                        </div>
                        <div>
                          <SurfaceCountryTags
                            typology={{
                              ...typology,
                              prevalentCountries:
                                typology.prevalentCountries.filter((c) => {
                                  const code = String(c.code).toUpperCase()
                                  return code === "JP" || code === "DE"
                                }),
                            }}
                          />
                        </div>
                      </div>
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

