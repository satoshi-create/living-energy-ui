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
    <div className="flex flex-col space-y-8">
      <Card className="overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-primary/10 via-slate-900/40 to-slate-900/40">
        <CardContent className="flex flex-col gap-6 p-5 sm:p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("instantGeneration")}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <Zap className="size-7 text-primary" />
                <span className="font-mono text-5xl font-semibold tabular-nums text-slate-100">
                  {LIVE_STATUS.instantWatts}
                </span>
                <span className="text-lg text-slate-400">W</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {t("todayTotal", { val: LIVE_STATUS.todayKwh })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 rounded-md py-1.5">
                <Leaf className="size-3.5 text-emerald-400" />
                {t("co2Saved", { kg: LIVE_STATUS.co2SavedKg })}
              </Badge>
              <Badge className="gap-1.5 rounded-md border-emerald-500/40 bg-emerald-500/10 py-1.5 text-emerald-400">
                <PiggyBank className="size-3.5" />
                {t("monthlySavings", { yen: LIVE_STATUS.monthlySavingsYen.toLocaleString() })}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 rounded-md py-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                {t("basinBadge", { system: t(FLOOD_STATUS.systemKey) })}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-100">{t("livingCardsTitle")}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LIVING_CARDS.map((card) => (
            <LivingCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-base font-semibold text-slate-100">{t("floodCardsTitle")}</h2>
          <p className="text-xs text-slate-400">{t("floodNote")}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

      <Card className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base font-semibold text-slate-100">{t("quickFlowTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PowerFlowDiagram nodes={HOME_FLOW} />
        </CardContent>
      </Card>
    </div>
  )
}
