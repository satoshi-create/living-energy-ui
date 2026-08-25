"use client"

import { useMemo, useState } from "react"
import { Gauge, PackageCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { BalconyIllustration } from "@/components/energy/balcony-illustration"
import {
  DIRECTIONS,
  RAILING_TYPES,
  computeBalconyScore,
  scoreLabel,
  recommendedKit,
  type Direction,
  type RailingType,
} from "@/lib/energy-data"

function formatHour(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

export function BalconyView() {
  const [direction, setDirection] = useState<Direction>("南")
  const [railing, setRailing] = useState<RailingType>("grid")
  const [hour, setHour] = useState(12.5)

  const score = useMemo(() => computeBalconyScore(direction, railing, hour), [direction, railing, hour])
  const kit = useMemo(() => recommendedKit(score), [score])

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">条件設定</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">ベランダの方角</p>
            <ToggleGroup
              value={[direction]}
              onValueChange={(v) => v[0] && setDirection(v[0] as Direction)}
              variant="outline"
              className="flex-wrap"
            >
              {DIRECTIONS.map((d) => (
                <ToggleGroupItem key={d.value} value={d.value} className="text-sm">
                  {d.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">手すりの種類</p>
            <ToggleGroup
              value={[railing]}
              onValueChange={(v) => v[0] && setRailing(v[0] as RailingType)}
              variant="outline"
              className="flex-wrap"
            >
              {RAILING_TYPES.map((r) => (
                <ToggleGroupItem key={r.value} value={r.value} className="text-sm">
                  {r.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">季節・時刻</p>
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
              <span>朝 8:00</span>
              <span>夕方 17:00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">診断結果ビジュアル</CardTitle>
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
                <span className="text-xs font-medium">あなたのベランダの適性スコア</span>
              </div>
              <span className="font-mono text-5xl font-semibold tabular-nums text-primary">{score}</span>
              <Badge className="bg-primary/90 text-primary-foreground">{scoreLabel(score)}</Badge>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <PackageCheck className="size-4 text-primary" />
                おすすめ構成
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-muted-foreground">パネル</span>
                <span className="font-medium text-foreground">{kit.panel}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-muted-foreground">蓄電</span>
                <span className="font-medium text-foreground">{kit.battery}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
