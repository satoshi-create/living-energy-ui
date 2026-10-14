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
    <div className="flex flex-col space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-800/80 md:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4.5" />
        </div>
        <p className="text-sm font-medium text-slate-200">{t(`cards.${card.id}.title`)}</p>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums text-slate-100">{card.value}</span>
        <span className="text-xs text-slate-400">{t(`cards.${card.id}.unit`)}</span>
      </div>
      <Progress value={card.progress} className="h-1.5" />
      <p className="text-sm leading-relaxed text-slate-400">{t(`cards.${card.id}.detail`)}</p>
    </div>
  )
}
