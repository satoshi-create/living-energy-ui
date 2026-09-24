"use client"

import { useTranslations } from "next-intl"
import { Sun, BatteryCharging, Laptop, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FlowNode } from "../data"

const ICONS: Record<FlowNode["icon"], LucideIcon> = {
  sun: Sun,
  battery: BatteryCharging,
  laptop: Laptop,
}

export function PowerFlowDiagram({ nodes }: { nodes: FlowNode[] }) {
  const t = useTranslations("livingSense")

  return (
    <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-center">
      {nodes.map((node, index) => {
        const Icon = ICONS[node.icon]
        const isLast = index === nodes.length - 1
        return (
          <div key={node.id} className="flex flex-1 flex-col items-center sm:flex-row">
            <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-5 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="size-5" />
              </div>
              <p className="text-sm font-medium text-card-foreground">{t(`flow.${node.id}.label`)}</p>
              <p className="text-xs tabular-nums text-primary">{t(`flow.${node.id}.sublabel`)}</p>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "relative my-2 h-6 w-px sm:my-0 sm:h-px sm:w-10 sm:shrink-0",
                  "bg-gradient-to-b from-primary/60 via-primary/20 to-transparent sm:bg-gradient-to-r"
                )}
                aria-hidden="true"
              >
                <span className="absolute inset-0 flex items-center justify-center sm:rotate-90">
                  <span className="size-1.5 animate-ping rounded-full bg-primary" />
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
