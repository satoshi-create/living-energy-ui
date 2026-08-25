"use client"

import { Sprout } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { BasinFieldStatus } from "../data"

type OrificeFieldCardsProps = {
  fields: BasinFieldStatus[]
  onOrificeChange: (fieldId: string, installed: boolean) => void
}

export function OrificeFieldCards({ fields, onOrificeChange }: OrificeFieldCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <div
          key={field.id}
          className={cn(
            "flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4",
            field.tone === "watch" && "border-amber-500/40"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sprout className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">{field.name}</p>
                <p className="text-xs text-muted-foreground">{field.crop}</p>
              </div>
            </div>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium",
                field.tone === "watch" && "bg-amber-500/15 text-amber-400",
                field.tone === "done" && "bg-sky-500/15 text-sky-300",
                field.tone === "normal" && "bg-primary/15 text-primary"
              )}
            >
              {field.statusLabel}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>土壌含水率</span>
            <span className="font-mono tabular-nums text-foreground">{field.moisture}%</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-label={`${field.name}の含水率`}
            aria-valuenow={field.moisture}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-300",
                field.tone === "watch" ? "bg-amber-400" : "bg-primary"
              )}
              style={{ width: `${field.moisture}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-3">
            <div>
              <p className="text-xs font-medium text-card-foreground">オリフィス堰板</p>
              <p className="text-[11px] text-muted-foreground">既存枡に板を挿すだけ</p>
            </div>
            <Switch
              checked={field.orificeInstalled}
              onCheckedChange={(checked) => onOrificeChange(field.id, checked)}
              aria-label={`${field.name}の堰板`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
