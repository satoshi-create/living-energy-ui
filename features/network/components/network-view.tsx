"use client"

import { useMemo, useState } from "react"
import { useLocale } from "next-intl"
import { Moon, Sun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Switch } from "@/components/ui/switch"
import { RankingView } from "@/features/ranking"
import { NetworkFlow } from "./network-flow"
import {
  COUNTRIES,
  MAP_REGION_TABS,
  NETWORK_MODELS,
  localizedCountry,
  localizedModel,
  pickLocale,
  uiText,
  type MapRegionTab,
  type NetworkLocale,
  type NetworkModel,
} from "../data"

type NetworkTab = "flow" | "ranking"
type DetailSheetTab = "policy" | "life" | "safety"

function toNetworkLocale(locale: string): NetworkLocale {
  return locale === "en" ? "en" : "ja"
}

export function NetworkView() {
  const locale = toNetworkLocale(useLocale())
  const [tab, setTab] = useState<NetworkTab>("flow")
  const [model, setModel] = useState<NetworkModel>("yamanashi")
  const [isNight, setIsNight] = useState(false)
  const [mapRegion, setMapRegion] = useState<MapRegionTab>("all")
  const [selectedCountryId, setSelectedCountryId] = useState<string>("de")
  const [detailTab, setDetailTab] = useState<DetailSheetTab>("policy")

  const config = NETWORK_MODELS[model]
  const modelCopy = localizedModel(config, locale)

  const filteredCountries = useMemo(
    () =>
      mapRegion === "all"
        ? COUNTRIES
        : COUNTRIES.filter((c) => c.region === mapRegion),
    [mapRegion]
  )

  const selectedCountry =
    filteredCountries.find((c) => c.id === selectedCountryId) ??
    filteredCountries[0] ??
    COUNTRIES[0]

  const countryCopy = localizedCountry(selectedCountry, locale)

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        value={[tab]}
        onValueChange={(v) => v[0] && setTab(v[0] as NetworkTab)}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <ToggleGroupItem value="flow" className="flex-1 text-sm sm:flex-none">
          {uiText("networkTab", locale)}
        </ToggleGroupItem>
        <ToggleGroupItem value="ranking" className="flex-1 text-sm sm:flex-none">
          {uiText("rankingTab", locale)}
        </ToggleGroupItem>
      </ToggleGroup>

      {tab === "ranking" ? (
        <RankingView />
      ) : (
        <>
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">{modelCopy.label}</CardTitle>
                  <CardDescription className="mt-1 max-w-xl text-pretty">
                    {modelCopy.description}
                  </CardDescription>
                </div>
                <ToggleGroup
                  value={[model]}
                  onValueChange={(v) => v[0] && setModel(v[0] as NetworkModel)}
                  variant="outline"
                >
                  <ToggleGroupItem value="yamanashi" className="text-sm">
                    {localizedModel(NETWORK_MODELS.yamanashi, locale).label}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="fukushima" className="text-sm">
                    {localizedModel(NETWORK_MODELS.fukushima, locale).label}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
                <Sun
                  className={
                    isNight
                      ? "size-4 shrink-0 text-muted-foreground"
                      : "size-4 shrink-0 text-primary"
                  }
                />
                <span className="whitespace-nowrap text-sm text-muted-foreground">
                  {uiText("dayMode", locale)}
                </span>
                <Switch checked={isNight} onCheckedChange={setIsNight} />
                <span className="whitespace-nowrap text-sm text-muted-foreground">
                  {uiText("nightMode", locale)}
                </span>
                <Moon
                  className={
                    isNight
                      ? "size-4 shrink-0 text-primary"
                      : "size-4 shrink-0 text-muted-foreground"
                  }
                />
              </div>

              <NetworkFlow
                nodes={config.nodes}
                edges={config.edges}
                mode={isNight ? "night" : "day"}
                locale={locale}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
            <Card className="border-border/60">
              <CardHeader className="gap-3">
                <ToggleGroup
                  value={[mapRegion]}
                  onValueChange={(v) => v[0] && setMapRegion(v[0] as MapRegionTab)}
                  variant="outline"
                  className="flex-wrap"
                >
                  {(Object.keys(MAP_REGION_TABS) as MapRegionTab[]).map((key) => (
                    <ToggleGroupItem key={key} value={key} className="text-sm">
                      {pickLocale(MAP_REGION_TABS[key], locale)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-md border border-border/60 px-2 py-1">
                    {uiText("badge800W", locale)}
                  </span>
                  <span className="rounded-md border border-border/60 px-2 py-1">
                    {uiText("badge600W", locale)}
                  </span>
                  <span className="rounded-md border border-border/60 px-2 py-1">
                    {uiText("badgeOffGrid", locale)}
                  </span>
                  <span className="rounded-md border border-border/60 px-2 py-1">
                    {uiText("badgeNec", locale)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {filteredCountries.map((country) => {
                    const copy = localizedCountry(country, locale)
                    const active = country.id === selectedCountry.id
                    return (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => setSelectedCountryId(country.id)}
                        className={
                          active
                            ? "rounded-xl border border-primary/50 bg-primary/10 px-3 py-3 text-left transition-colors"
                            : "rounded-xl border border-border/60 bg-card px-3 py-3 text-left transition-colors hover:border-border"
                        }
                      >
                        <p className="text-sm font-medium text-card-foreground">{copy.name}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{copy.subtitle}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">{countryCopy.name}</CardTitle>
                <CardDescription>{countryCopy.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-border/60 px-2 py-2">
                    <p className="text-[10px] text-muted-foreground">{uiText("progress", locale)}</p>
                    <p className="mt-1 text-xs font-medium text-card-foreground">{countryCopy.category}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 px-2 py-2">
                    <p className="text-[10px] text-muted-foreground">
                      {uiText("capacityLimit", locale)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-card-foreground">
                      {countryCopy.details.system}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 px-2 py-2">
                    <p className="text-[10px] text-muted-foreground">{uiText("payback", locale)}</p>
                    <p className="mt-1 text-xs font-medium text-card-foreground">
                      {countryCopy.details.payback}
                    </p>
                  </div>
                </div>

                <ToggleGroup
                  value={[detailTab]}
                  onValueChange={(v) => v[0] && setDetailTab(v[0] as DetailSheetTab)}
                  variant="outline"
                  className="w-full"
                >
                  <ToggleGroupItem value="policy" className="flex-1 text-xs">
                    {uiText("tabPolicy", locale)}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="life" className="flex-1 text-xs">
                    {uiText("tabLife", locale)}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="safety" className="flex-1 text-xs">
                    {uiText("tabSafety", locale)}
                  </ToggleGroupItem>
                </ToggleGroup>

                {detailTab === "policy" && (
                  <dl className="flex flex-col gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("connectionType", locale)}</dt>
                      <dd className="mt-0.5 text-card-foreground">{countryCopy.details.connection}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("tenantRight", locale)}</dt>
                      <dd className="mt-0.5 text-card-foreground">{countryCopy.details.tenantRight}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("regulation", locale)}</dt>
                      <dd className="mt-0.5 text-card-foreground">{countryCopy.details.regulation}</dd>
                    </div>
                  </dl>
                )}

                {detailTab === "life" && (
                  <dl className="flex flex-col gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("payback", locale)}</dt>
                      <dd className="mt-0.5 text-card-foreground">{countryCopy.details.payback}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("meterReq", locale)}</dt>
                      <dd className="mt-0.5 text-card-foreground">{countryCopy.details.meter}</dd>
                    </div>
                    <p className="text-pretty text-sm text-muted-foreground">
                      {countryCopy.details.summary}
                    </p>
                  </dl>
                )}

                {detailTab === "safety" && (
                  <dl className="flex flex-col gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("meterReq", locale)}</dt>
                      <dd className="mt-0.5 text-card-foreground">{countryCopy.details.meter}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("regulation", locale)}</dt>
                      <dd className="mt-0.5 text-card-foreground">{countryCopy.details.regulation}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">{uiText("lastUpdated", locale)}</dt>
                      <dd className="mt-0.5 tabular-nums text-card-foreground">2026-03</dd>
                    </div>
                  </dl>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
