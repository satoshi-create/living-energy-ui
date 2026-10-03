"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Building2, Gauge, Landmark, PackageCheck, Users, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { HomeView } from "@/features/living-sense"
import type { CountryCode } from "@/lib/country-codes"
import { cn } from "@/lib/utils"
import { BalconyIllustration } from "./balcony-illustration"
import { WorldPvMap } from "./world-pv-map"
import {
  COUNTRY_PV_SIDEBAR_FIELDS,
  DIRECTIONS,
  ECOSYSTEM_ACTOR_FILTERS,
  RAILING_TYPES,
  WORLD_BALCONY_PV_COUNTRIES,
  computeBalconyScore,
  getEcosystemActorsByCountry,
  recommendedKit,
  type Direction,
  type EcosystemActorFilter,
  type EcosystemActorType,
  type RailingType,
} from "../data"

const SIDEBAR_DEFAULT_WIDTH = 384
const SIDEBAR_MIN_WIDTH = 320
const SIDEBAR_MAX_WIDTH = 700

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
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [actorFilter, setActorFilter] = useState<EcosystemActorFilter>("all")
  const sidebarRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const selectedCountry = useMemo(
    () => WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  )
  const relatedActors = useMemo(
    () => (selectedCountry ? getEcosystemActorsByCountry(selectedCountry.id, actorFilter) : []),
    [selectedCountry, actorFilter],
  )

  const countryMsg = (field: string) =>
    t(`countries.${selectedCountry!.id}.${field}` as Parameters<typeof t>[0])

  const sidebarFieldValue = (key: (typeof COUNTRY_PV_SIDEBAR_FIELDS)[number]["key"]) => {
    if (!selectedCountry) return ""
    if (key === "powerLimit") return countryMsg("powerLimit")
    if (key === "tenantRights") {
      if (isEn && selectedCountry.tenantRightsEn) return selectedCountry.tenantRightsEn
      return isEn ? countryMsg("tenantRights") : selectedCountry.tenantRights
    }
    if (key === "connectionMethod") {
      if (isEn && selectedCountry.connectionMethodEn) return selectedCountry.connectionMethodEn
      return isEn ? countryMsg("connectionMethod") : selectedCountry.connectionMethod
    }
    if (key === "regulation") {
      if (isEn && selectedCountry.regulationEn) return selectedCountry.regulationEn
      return selectedCountry.regulation
    }
    return String(selectedCountry[key])
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

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* マップ: <lg は全幅上部、>=lg は左側 flex-1 */}
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="flex h-full min-h-0 w-full items-center justify-center p-2 sm:p-4">
          <WorldPvMap
            selectedCountryId={selectedId ?? ""}
            onSelectCountry={(country) => {
              setSelectedId(country.id)
              setActorFilter("all")
            }}
          />
        </div>
      </div>

      {selectedCountry ? (
        <Card
          ref={sidebarRef}
          className={cn(
            "z-30 flex flex-col overflow-hidden border-border/60 bg-card",
            // <lg: ボトムシート（マップ上部を常時可視、ピン操作を阻害しない）
            "fixed inset-x-0 bottom-0 h-[45vh] max-h-[50vh] w-full rounded-t-xl shadow-lg",
            // >=lg: 右側リサイズ可能サイドバー
            "lg:relative lg:inset-auto lg:h-full lg:max-h-[calc(100vh-4rem)] lg:w-[var(--sidebar-w)] lg:shrink-0 lg:rounded-xl lg:shadow-none",
          )}
          style={{ ["--sidebar-w" as string]: `${sidebarWidth}px` }}
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
          <CardHeader className="flex shrink-0 flex-row items-start justify-between gap-2 space-y-0 pl-5">
            <div className="flex min-w-0 flex-col gap-1">
              <CardTitle className="text-sm font-semibold">
                {countryMsg("name")}
                <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                  {selectedCountry.code}
                </span>
              </CardTitle>
              <Badge className="w-fit bg-primary/90 text-primary-foreground">
                {countryMsg("statusLabel")}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("detail.close")}
            >
              <X className="size-4" />
            </button>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pl-5 text-sm">
            <div className="flex flex-col gap-2">
              {COUNTRY_PV_SIDEBAR_FIELDS.map(({ key, labelKey }) => (
                <div key={key} className="flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-xs text-muted-foreground">{tSidebar(labelKey)}</span>
                  <span className="break-words font-medium text-foreground">
                    {sidebarFieldValue(key)}
                  </span>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-muted-foreground">{countryMsg("summary")}</p>
            </div>

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
                    return (
                      <div
                        key={actor.id}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5",
                        )}
                      >
                        <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-medium text-foreground">
                            {isEn && actor.nameEn ? actor.nameEn : actor.name}
                          </p>
                          <p className="mt-0.5 break-words text-xs text-muted-foreground">
                            {isEn && actor.roleEn ? actor.roleEn : actor.role}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
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
