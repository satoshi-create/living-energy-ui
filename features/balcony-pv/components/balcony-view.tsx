"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Gauge, PackageCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { CountryCode } from "@/lib/country-codes"
import { BalconyIllustration } from "./balcony-illustration"
import {
  DIRECTIONS,
  RAILING_TYPES,
  computeBalconyLifeCompliance,
  computeBalconyScore,
  DEFAULT_LIVING_CONTEXT,
  recommendedKit,
  type Direction,
  type LivingContext,
  type LivingHabit,
  type PanelTiltMode,
  type RailingType,
  type WeatherCondition,
} from "../simulator-data"

const HomeView = dynamic(
  () => import("@/features/living-sense").then((m) => m.HomeView),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl bg-slate-950/40">
        <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    ),
  },
)

type BalconyTab = "simulator" | "living-sense"

export type BalconyViewProps = {
  onNavigateToEcosystem?: (countryCode: CountryCode) => void
}

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

export function BalconyView({ onNavigateToEcosystem: _onNavigateToEcosystem }: BalconyViewProps) {
  const t = useTranslations("balconyPv")
  const tDirections = useTranslations("common.directions")
  const [tab, setTab] = useState<BalconyTab>("simulator")
  const [direction, setDirection] = useState<Direction>("south")
  const [railing, setRailing] = useState<RailingType>("grid")
  const [hour, setHour] = useState(12.5)
  const [livingContext, setLivingContext] = useState<LivingContext>(DEFAULT_LIVING_CONTEXT)

  const simulatorTiltMode: PanelTiltMode =
    livingContext.weather === "typhoon_alert" ? "retracted" : "optimal_tilt"

  const score = useMemo(
    () => computeBalconyScore(direction, railing, hour, livingContext, simulatorTiltMode),
    [direction, railing, hour, livingContext, simulatorTiltMode],
  )
  const lifeCompliance = useMemo(
    () => computeBalconyLifeCompliance(livingContext, simulatorTiltMode),
    [livingContext, simulatorTiltMode],
  )
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
                <p className="text-sm font-bold tracking-tight text-foreground">{t("conditions.direction")}</p>
                <ToggleGroup
                  value={[direction]}
                  onValueChange={(v) => v[0] && setDirection(v[0] as Direction)}
                  variant="outline"
                  className="flex-wrap"
                >
                  {DIRECTIONS.map((value) => (
                    <ToggleGroupItem key={value} value={value} className="px-3 py-1.5 text-xs font-semibold">
                      {tDirections(value)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold tracking-tight text-foreground">{t("conditions.railing")}</p>
                <ToggleGroup
                  value={[railing]}
                  onValueChange={(v) => v[0] && setRailing(v[0] as RailingType)}
                  variant="outline"
                  className="flex-wrap"
                >
                  {RAILING_TYPES.map((r) => (
                    <ToggleGroupItem key={r.value} value={r.value} className="px-3 py-1.5 text-xs font-semibold">
                      {t(`railing.${r.value}`)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold tracking-tight text-foreground">{t("conditions.seasonTime")}</p>
                  <span className="font-mono text-xs font-bold text-foreground">{formatHour(hour)}</span>
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

              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold tracking-tight text-foreground">{t("conditions.livingHabit")}</p>
                <ToggleGroup
                  value={[livingContext.habit]}
                  onValueChange={(v) => {
                    const habit = v[0] as LivingHabit | undefined
                    if (habit) setLivingContext((prev) => ({ ...prev, habit }))
                  }}
                  variant="outline"
                  className="flex-wrap"
                >
                  {(
                    [
                      "laundry_drying",
                      "view_preservation_terrace",
                      "outdoor_unit_service",
                    ] as const
                  ).map((habit) => (
                    <ToggleGroupItem key={habit} value={habit} className="px-3 py-1.5 text-xs font-semibold">
                      {t(`livingHabit.${habit}`)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold tracking-tight text-foreground">{t("conditions.weather")}</p>
                <ToggleGroup
                  value={[livingContext.weather]}
                  onValueChange={(v) => {
                    const weather = v[0] as WeatherCondition | undefined
                    if (weather) setLivingContext((prev) => ({ ...prev, weather }))
                  }}
                  variant="outline"
                  className="flex-wrap"
                >
                  {(["clear", "overcast_tsuyu", "typhoon_alert"] as const).map((weather) => (
                    <ToggleGroupItem key={weather} value={weather} className="px-3 py-1.5 text-xs font-semibold">
                      {t(`weather.${weather}`)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">{t("results.visualTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <BalconyIllustration
                  direction={direction}
                  railing={railing}
                  hour={hour}
                  livingContext={livingContext}
                  isRetracted={simulatorTiltMode === "retracted"}
                  tiltDeg={simulatorTiltMode === "retracted" ? 0 : 30}
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="border-border/60">
                <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="size-4" />
                    <span className="text-sm font-bold tracking-tight text-foreground">{t("results.scoreLabel")}</span>
                  </div>
                  <span className="font-mono text-5xl font-semibold tabular-nums text-primary">{score}</span>
                  <Badge className="bg-primary/90 text-primary-foreground">{t(`score.${scoreBand(score)}`)}</Badge>
                  <p className="text-xs text-muted-foreground">
                    {t("results.lifeComplianceLabel")}:{" "}
                    <span className="font-mono text-xs font-bold text-foreground">{lifeCompliance}%</span>
                  </p>
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
