"use client"

import { useEffect, useRef, useState } from "react"
import {
  SunMedium,
  Wind,
  Droplets,
  Flame,
  BatteryCharging,
  Building2,
  Home,
  Fuel,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { NetworkEdge, NetworkNode } from "../data"

const ICONS: Record<NetworkNode["icon"], LucideIcon> = {
  "sun-medium": SunMedium,
  wind: Wind,
  droplets: Droplets,
  flame: Flame,
  "battery-charging": BatteryCharging,
  "building-2": Building2,
  home: Home,
  fuel: Fuel,
}

const KIND_LABEL: Record<NetworkNode["kind"], string> = {
  supply: "供給ノード",
  convert: "変換・蓄電ノード",
  consume: "消費ノード",
}

type LinePos = { x1: number; y1: number; x2: number; y2: number; key: string; active: boolean }

export function NetworkFlow({
  nodes,
  edges,
  mode,
}: {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  mode: "day" | "night"
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [lines, setLines] = useState<LinePos[]>([])

  const columns: Record<NetworkNode["kind"], NetworkNode[]> = {
    supply: nodes.filter((n) => n.kind === "supply"),
    convert: nodes.filter((n) => n.kind === "convert"),
    consume: nodes.filter((n) => n.kind === "consume"),
  }

  useEffect(() => {
    function measure() {
      const container = containerRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const next: LinePos[] = []
      for (const edge of edges) {
        const fromEl = nodeRefs.current.get(edge.from)
        const toEl = nodeRefs.current.get(edge.to)
        if (!fromEl || !toEl) continue
        const fromRect = fromEl.getBoundingClientRect()
        const toRect = toEl.getBoundingClientRect()
        const fromKind = nodes.find((n) => n.id === edge.from)?.kind
        const active = mode === "day" ? fromKind === "supply" : fromKind === "convert"
        next.push({
          key: `${edge.from}-${edge.to}`,
          x1: fromRect.right - containerRect.left,
          y1: fromRect.top + fromRect.height / 2 - containerRect.top,
          x2: toRect.left - containerRect.left,
          y2: toRect.top + toRect.height / 2 - containerRect.top,
          active,
        })
      }
      setLines(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [nodes, edges, mode])

  return (
    <div ref={containerRef} className="relative">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {lines.map((line) => (
          <g key={line.key}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--color-border)"
              strokeWidth={1.5}
            />
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.active ? "var(--color-primary)" : "var(--color-accent)"}
              strokeWidth={2}
              strokeDasharray="6 6"
              opacity={line.active ? 0.9 : 0.35}
              className={line.active ? "animate-flow-dash" : undefined}
            />
          </g>
        ))}
      </svg>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-10">
        {(["supply", "convert", "consume"] as const).map((kind) => (
          <div key={kind} className="flex flex-col gap-4">
            <p className="text-center text-xs font-medium text-muted-foreground">{KIND_LABEL[kind]}</p>
            <div className="flex flex-col gap-4 sm:justify-center sm:gap-6">
              {columns[kind].map((node) => {
                const Icon = ICONS[node.icon]
                const dimmed = mode === "night" && node.kind === "supply" && node.icon !== "wind"
                return (
                  <div
                    key={node.id}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.id, el)
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3.5 py-3 transition-opacity",
                      dimmed && "opacity-40"
                    )}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="size-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-card-foreground">{node.label}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">{node.sublabel}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
