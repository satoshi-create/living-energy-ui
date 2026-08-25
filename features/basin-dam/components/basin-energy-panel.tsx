import { BatteryCharging, Laptop, Lightbulb, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { BasinEnergySnapshot } from "../data"

type BasinEnergyPanelProps = {
  energy: BasinEnergySnapshot
}

export function BasinEnergyPanel({ energy }: BasinEnergyPanelProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold">発電・蓄電の生活実感</CardTitle>
            <CardDescription className="mt-1 text-pretty">
              水路マイクロ水力と流域内の太陽光のデモ推計です。数値はシミュレーションです。
            </CardDescription>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <i className="size-1.5 rounded-full bg-primary" />
            LIVE
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="size-3.5 text-primary" />
              いま水路で賄える分
            </p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                {energy.ledHours}
              </span>
              <span className="text-sm text-muted-foreground">時間分のLED</span>
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Laptop className="size-3.5 text-primary" />
              MacBook 充電
            </p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                {energy.macbookCharges}
              </span>
              <span className="text-sm text-muted-foreground">回分</span>
            </p>
          </div>
          <p className="ml-auto text-xs text-muted-foreground">
            発電デモ <span className="font-mono text-foreground">{energy.todayKwhDemo} kWh</span>
          </p>
        </div>

        <svg
          viewBox="0 0 500 130"
          className="h-[100px] w-full"
          role="img"
          aria-label="24時間の発電量グラフ（デモ）"
        >
          <path d={energy.chartFillPath} fill="color-mix(in oklch, var(--color-primary) 13%, transparent)" />
          <path
            d={energy.chartPath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={3}
          />
        </svg>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BatteryCharging className="size-3.5 text-primary" />
              蓄電池
            </span>
            <span className="font-mono tabular-nums text-foreground">{energy.batteryPct}%</span>
          </div>
          <Progress value={energy.batteryPct} className="h-1.5" />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Sun className="size-3" />
              今日の目標 {energy.batteryGoalPct}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
