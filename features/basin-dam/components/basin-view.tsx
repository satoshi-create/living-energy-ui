"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CloudRain, Droplets, ShieldCheck, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BasinDag } from "./basin-dag"
import { BasinEnergyPanel } from "./basin-energy-panel"
import { CitizenSafetySummary } from "./citizen-safety-summary"
import { OrificeFieldCards } from "./orifice-field-cards"
import {
  BASIN_DESCRIPTION,
  BASIN_FIELDS,
  BASIN_LABEL,
  BASIN_RAIN_DEFAULT,
  BASIN_RAIN_MAX,
  BASIN_RAIN_MIN,
  basinEnergyForRain,
  basinRainSummaryWithOrifices,
  citizenSafetyFromState,
  dagNodesForRain,
  fieldsForRain,
} from "../data"

function initialOrifices(): Record<string, boolean> {
  return Object.fromEntries(BASIN_FIELDS.map((f) => [f.id, f.defaultOrifice]))
}

export function BasinView() {
  const [rainMmH, setRainMmH] = useState(BASIN_RAIN_DEFAULT)
  const [orificeById, setOrificeById] = useState(initialOrifices)
  const [preDrained, setPreDrained] = useState(false)
  const [notice, setNotice] = useState("")

  const rainSummary = useMemo(
    () => basinRainSummaryWithOrifices(rainMmH, orificeById),
    [rainMmH, orificeById]
  )
  const safety = useMemo(
    () => citizenSafetyFromState(rainSummary, rainMmH, orificeById),
    [rainSummary, rainMmH, orificeById]
  )
  const dagNodes = useMemo(() => dagNodesForRain(rainMmH), [rainMmH])
  const energy = useMemo(() => basinEnergyForRain(rainMmH), [rainMmH])
  const fields = useMemo(
    () => fieldsForRain(rainMmH, orificeById, preDrained),
    [rainMmH, orificeById, preDrained]
  )

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(""), 2600)
    return () => window.clearTimeout(id)
  }, [notice])

  return (
    <div className="flex flex-col gap-6">
      <CitizenSafetySummary safety={safety} />

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{BASIN_LABEL}</CardTitle>
          <CardDescription className="mt-1 max-w-xl text-pretty">{BASIN_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/40 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="gap-1.5 border border-border/60 bg-muted/60 py-1.5 text-foreground"
              >
                <CloudRain className="size-3.5 text-primary" />
                小学校プール {rainSummary.poolCups}杯分の一時貯留
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1.5 border border-border/60 bg-muted/60 py-1.5 text-foreground"
              >
                氾濫リスク目安 −{rainSummary.riskReductionPct}%
              </Badge>
              <Badge
                className={
                  rainSummary.system === "平常"
                    ? "gap-1.5 bg-primary/90 py-1.5 text-primary-foreground"
                    : "gap-1.5 bg-amber-500/90 py-1.5 text-amber-950"
                }
              >
                流域 {rainSummary.system}
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CloudRain className="size-3.5" />
                  降雨シミュレーション
                </p>
                <span className="font-mono text-sm tabular-nums text-foreground">{rainMmH} mm/h</span>
              </div>
              <Slider
                value={[rainMmH]}
                min={BASIN_RAIN_MIN}
                max={BASIN_RAIN_MAX}
                step={1}
                onValueChange={(v) => {
                  setPreDrained(false)
                  setRainMmH(Array.isArray(v) ? v[0] : v)
                }}
                aria-label="降雨強度"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{BASIN_RAIN_MIN} mm/h</span>
                <span>{BASIN_RAIN_MAX} mm/h</span>
              </div>
            </div>

            <p
              className={`flex items-start gap-2 text-sm ${
                rainSummary.system === "平常" ? "text-muted-foreground" : "text-amber-400"
              }`}
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{rainSummary.message}</span>
            </p>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">流域ネットワーク</h3>
            <span className="text-[11px] text-muted-foreground">最終更新 デモ 14:31</span>
          </div>
          <BasinDag nodes={dagNodes} />
        </CardContent>
      </Card>

      <BasinEnergyPanel energy={energy} />

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">圃場とオリフィス堰板</CardTitle>
            <CardDescription className="mt-1 max-w-xl text-pretty">
              数千円の板を既存枡に挿すだけで、大雨の夜の水路見回りを解雇できます。
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => {
              setPreDrained(true)
              setNotice("全圃場へ事前排水の指示を送りました（デモ）")
            }}
          >
            <Droplets className="size-3.5" />
            一括事前排水
          </Button>
        </CardHeader>
        <CardContent>
          <OrificeFieldCards
            fields={fields}
            onOrificeChange={(fieldId, installed) => {
              setPreDrained(false)
              setOrificeById((prev) => ({ ...prev, [fieldId]: installed }))
            }}
          />
        </CardContent>
      </Card>

      {notice && (
        <div className="fixed right-4 bottom-20 z-50 flex max-w-sm items-center gap-2 rounded-xl border border-primary/40 bg-card px-3 py-2.5 text-sm text-card-foreground shadow-lg lg:bottom-6">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <span className="flex-1">{notice}</span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setNotice("")}
            aria-label="閉じる"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
