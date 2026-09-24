"use client"

import { useTranslations } from "next-intl"
import { Laptop, Fan, Coffee, Smartphone, Waves, ShieldCheck, Moon, type LucideIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { LivingCard as LivingCardData } from "../data"

const ICONS: Record<LivingCardData["icon"], LucideIcon> = {
  laptop: Laptop,
  fan: Fan,
  coffee: Coffee,
  smartphone: Smartphone,
  waves: Waves,
  shield: ShieldCheck,
  moon: Moon,
}

export function LivingCard({ card }: { card: LivingCardData }) {
  const t = useTranslations("livingSense")
  const Icon = ICONS[card.icon]

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4.5" />
        </div>
        <p className="text-sm font-medium text-card-foreground">{t(`cards.${card.id}.title`)}</p>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">{card.value}</span>
        <span className="text-xs text-muted-foreground">{t(`cards.${card.id}.unit`)}</span>
      </div>
      <Progress value={card.progress} className="h-1.5" />
      <p className="text-xs text-muted-foreground">{t(`cards.${card.id}.detail`)}</p>
    </div>
  )
}
