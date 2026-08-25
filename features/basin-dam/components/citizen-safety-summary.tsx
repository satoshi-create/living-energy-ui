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
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-5 p-6 sm:p-8">
        <div>
          <Badge className="gap-1.5 bg-primary/90 py-1.5 text-primary-foreground">
            <ShieldCheck className="size-3.5" />
            公開情報
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            流域の安全状況
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">{safety.headline}</p>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-3 rounded-xl border px-4 py-4",
            calm ? "border-primary/40 bg-primary/10" : "border-amber-500/40 bg-amber-500/10"
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
          <span className="text-xs text-muted-foreground sm:ml-auto">{safety.updatedAt}</span>
          <Badge variant="secondary" className="border border-border/60 bg-muted/60 text-foreground">
            {safety.patrolLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
            <Droplets className="size-5 text-primary" />
            <span className="text-xs text-muted-foreground">河川水位</span>
            <strong className="text-base text-foreground">{safety.riverLevel}</strong>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
            <CloudRain className="size-5 text-primary" />
            <span className="text-xs text-muted-foreground">降雨状況</span>
            <strong className="font-mono text-base tabular-nums text-foreground">{safety.rainLabel}</strong>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-4">
            <ShieldCheck className="size-5 text-primary" />
            <span className="text-xs text-muted-foreground">排水設備</span>
            <strong className="text-base text-foreground">{safety.drainageLabel}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
