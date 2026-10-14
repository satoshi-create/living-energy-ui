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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <div
          key={field.id}
          className={cn(
            "flex flex-col space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-800/80 md:p-6",
            field.tone === "watch" && "border-amber-500/40"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sprout className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{field.name}</p>
                <p className="text-xs text-slate-400">{field.crop}</p>
              </div>
            </div>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-xs font-medium",
                field.tone === "watch" && "bg-amber-500/15 text-amber-400",
                field.tone === "done" && "bg-sky-500/15 text-sky-300",
                field.tone === "normal" && "bg-primary/15 text-primary"
              )}
            >
              {field.statusLabel}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400">土壌含水率</span>
            <span className="font-mono tabular-nums text-slate-200">{field.moisture}%</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-slate-800"
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

          <div className="flex items-center justify-between gap-3 border-t border-slate-800/60 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-200">オリフィス堰板</p>
              <p className="text-xs text-slate-400">既存枡に板を挿すだけ</p>
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
