import { Zap, Leaf, PiggyBank, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LivingCard } from "./living-card"
import { PowerFlowDiagram } from "./power-flow-diagram"
import { LIVING_CARDS, FLOOD_LIVING_CARDS, FLOOD_STATUS, LIVE_STATUS, HOME_FLOW } from "../data"

export function HomeView() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-muted-foreground">現在の瞬間発電量</p>
              <div className="mt-1 flex items-baseline gap-2">
                <Zap className="size-7 text-primary" />
                <span className="font-mono text-5xl font-semibold tabular-nums text-foreground">
                  {LIVE_STATUS.instantWatts}
                </span>
                <span className="text-lg text-muted-foreground">W</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                本日の累計発電量: <span className="font-mono text-foreground">{LIVE_STATUS.todayKwh} kWh</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 border border-border/60 bg-muted/60 py-1.5 text-foreground">
                <Leaf className="size-3.5 text-primary" />
                本日のCO2削減 {LIVE_STATUS.co2SavedKg}kg
              </Badge>
              <Badge className="gap-1.5 bg-primary/90 py-1.5 text-primary-foreground">
                <PiggyBank className="size-3.5" />
                今月の電気代削減目安 ¥{LIVE_STATUS.monthlySavingsYen.toLocaleString()}相当
              </Badge>
              <Badge variant="secondary" className="gap-1.5 border border-border/60 bg-muted/60 py-1.5 text-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                流域 {FLOOD_STATUS.system}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">生活実感カード</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIVING_CARDS.map((card) => (
            <LivingCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-sm font-semibold text-foreground">流域の生活実感</h2>
          <p className="text-xs text-muted-foreground">{FLOOD_STATUS.note}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FLOOD_LIVING_CARDS.map((card) => (
            <LivingCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">クイック電力フロー</CardTitle>
        </CardHeader>
        <CardContent>
          <PowerFlowDiagram nodes={HOME_FLOW} />
        </CardContent>
      </Card>
    </div>
  )
}
