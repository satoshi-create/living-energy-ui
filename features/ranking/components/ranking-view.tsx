"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  RANKING_METRICS,
  rankPrefectures,
  type EnergyMix,
  type RankingMetric,
} from "../data"

const MIX_CONFIG: { key: keyof EnergyMix; label: string; className: string }[] = [
  { key: "solar", label: "太陽光", className: "bg-primary" },
  { key: "wind", label: "風力", className: "bg-accent" },
  { key: "hydro", label: "水力", className: "bg-chart-4" },
  { key: "biomass", label: "バイオマス", className: "bg-chart-3" },
]

function formatValue(value: number, metric: RankingMetric) {
  if (metric === "solarKw") return value.toLocaleString()
  return value.toFixed(1)
}

export function RankingView() {
  const tSide = useTranslations("common.banzuke.side")
  const tTitle = useTranslations("common.banzuke.title")
  const [metric, setMetric] = useState<RankingMetric>("selfSufficiency")
  const ranked = useMemo(() => rankPrefectures(metric), [metric])
  const unit = RANKING_METRICS.find((m) => m.value === metric)!.unit

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-semibold">都道府県別 再エネ番付</CardTitle>
            <ToggleGroup
              value={[metric]}
              onValueChange={(v) => v[0] && setMetric(v[0] as RankingMetric)}
              variant="outline"
              className="flex-wrap"
            >
              {RANKING_METRICS.map((m) => (
                <ToggleGroupItem key={m.value} value={m.value} className="text-sm">
                  {m.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion>
            {ranked.map((entry) => (
              <AccordionItem key={`${entry.prefecture}-${metric}`} value={entry.prefecture}>
                <AccordionTrigger className="items-center gap-4 py-3.5 hover:no-underline">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-center">
                      <Badge
                        variant={entry.rank === 1 ? "default" : "secondary"}
                        className={entry.rank === 1 ? "bg-primary/90 text-primary-foreground" : ""}
                      >
                        {tTitle(entry.title)}
                      </Badge>
                      <span className="mt-1 text-[11px] text-muted-foreground">
                        {entry.side ? tSide(entry.side) : null}
                      </span>
                    </div>
                    <span className="w-24 shrink-0 text-sm font-semibold text-foreground sm:w-32">
                      {entry.prefecture}
                    </span>
                    <span className="ml-auto font-mono text-base font-semibold tabular-nums text-primary">
                      {formatValue(entry[metric], metric)}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pl-[4.5rem] sm:pl-[7.5rem]">
                    <p className="text-xs text-muted-foreground">電源構成の内訳</p>
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      {MIX_CONFIG.map((m) => (
                        <div
                          key={m.key}
                          className={m.className}
                          style={{ width: `${entry.mix[m.key]}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {MIX_CONFIG.map((m) => (
                        <div key={m.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className={`size-2 rounded-full ${m.className}`} />
                          {m.label} {entry.mix[m.key]}%
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
