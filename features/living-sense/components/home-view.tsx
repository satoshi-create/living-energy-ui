"use client"

import { useTranslations } from "next-intl"
import { Zap, Leaf, PiggyBank, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LivingCard } from "./living-card"
import { PowerFlowDiagram } from "./power-flow-diagram"
import { LIVING_CARDS, FLOOD_LIVING_CARDS, FLOOD_STATUS, LIVE_STATUS, HOME_FLOW } from "../data"

export function HomeView() {
  const t = useTranslations("livingSense")

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-muted-foreground">{t("instantGeneration")}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <Zap className="size-7 text-primary" />
                <span className="font-mono text-5xl font-semibold tabular-nums text-foreground">
                  {LIVE_STATUS.instantWatts}
                </span>
                <span className="text-lg text-muted-foreground">W</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("todayTotal", { val: LIVE_STATUS.todayKwh })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 border border-border/60 bg-muted/60 py-1.5 text-foreground">
                <Leaf className="size-3.5 text-primary" />
                {t("co2Saved", { kg: LIVE_STATUS.co2SavedKg })}
              </Badge>
              <Badge className="gap-1.5 bg-primary/90 py-1.5 text-primary-foreground">
                <PiggyBank className="size-3.5" />
                {t("monthlySavings", { yen: LIVE_STATUS.monthlySavingsYen.toLocaleString() })}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 border border-border/60 bg-muted/60 py-1.5 text-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                {t("basinBadge", { system: t(FLOOD_STATUS.systemKey) })}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">{t("livingCardsTitle")}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIVING_CARDS.map((card) => (
            <LivingCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-sm font-semibold text-foreground">{t("floodCardsTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("floodNote")}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FLOOD_LIVING_CARDS.map((card) => (
            <LivingCard
              key={card.id}
              card={
                card.value === "notRequired" ? { ...card, value: t("notRequired") } : card
              }
            />
          ))}
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("quickFlowTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PowerFlowDiagram nodes={HOME_FLOW} />
        </CardContent>
      </Card>
    </div>
  )
}
