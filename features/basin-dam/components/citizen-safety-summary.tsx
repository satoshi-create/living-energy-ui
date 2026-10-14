import { CloudRain, Droplets, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CitizenSafety } from "../data"

type CitizenSafetySummaryProps = {
  safety: CitizenSafety
}

export function CitizenSafetySummary({ safety }: CitizenSafetySummaryProps) {
  const calm = safety.system === "平常"

  return (
    <Card className="rounded-2xl border border-slate-800/80 bg-slate-900/40">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-6 md:p-8">
        <div>
          <Badge className="gap-1.5 bg-emerald-600 py-1.5 text-white">
            <ShieldCheck className="size-3.5" />
            公開情報
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            流域の安全状況
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 text-pretty">{safety.headline}</p>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-3 rounded-xl border px-5 py-4",
            calm ? "border-emerald-500/40 bg-emerald-500/10" : "border-amber-500/40 bg-amber-500/10"
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              calm ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-amber-400"
            )}
          />
          <strong className={cn("text-lg", calm ? "text-primary" : "text-amber-400")}>
            {safety.system === "平常" ? "正常" : safety.system}
          </strong>
          <span className="text-xs text-slate-400 sm:ml-auto">{safety.updatedAt}</span>
          <Badge variant="secondary" className="border border-slate-700/60 bg-slate-900/80 text-slate-200">
            {safety.patrolLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <Droplets className="size-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">河川水位</span>
            <strong className="text-base text-slate-100">{safety.riverLevel}</strong>
          </div>
          <div className="flex flex-col space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <CloudRain className="size-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">降雨状況</span>
            <strong className="font-mono text-base tabular-nums text-slate-100">{safety.rainLabel}</strong>
          </div>
          <div className="flex flex-col space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <ShieldCheck className="size-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">排水設備</span>
            <strong className="text-base text-slate-100">{safety.drainageLabel}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
