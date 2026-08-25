"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { BasinNodeSheet } from "./basin-node-sheet"
import { BASIN_DAG_EDGES, type BasinDagNode } from "../data"

type BasinDagProps = {
  nodes: BasinDagNode[]
}

function StatusDot({ status }: { status: BasinDagNode["status"] }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 rounded-full",
        status === "watch" ? "bg-amber-400 shadow-[0_0_8px_currentColor]" : "bg-primary shadow-[0_0_8px_currentColor]"
      )}
      aria-hidden
    />
  )
}

export function BasinDag({ nodes }: BasinDagProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const selected = selectedId ? byId.get(selectedId) ?? null : null

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 1030 300"
          className="h-[220px] min-w-[720px] w-full sm:h-[255px]"
          role="img"
          aria-label="流域ネットワーク図"
        >
          {BASIN_DAG_EDGES.map((edge) => {
            const from = byId.get(edge.from)
            const to = byId.get(edge.to)
            if (!from || !to) return null
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x + 75}
                y1={from.y + 18}
                x2={to.x - 12}
                y2={to.y + 18}
                stroke="var(--color-primary)"
                strokeWidth={2}
                strokeDasharray="7 7"
                opacity={0.55}
                className="animate-flow-dash"
              />
            )
          })}

          {nodes.map((node) => (
            <g
              key={node.id}
              className="cursor-pointer"
              onClick={() => setSelectedId(node.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setSelectedId(node.id)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${node.name}の詳細`}
            >
              <rect
                x={node.x - 12}
                y={node.y - 22}
                width={150}
                height={78}
                rx={8}
                fill="var(--color-card)"
                stroke={node.status === "watch" ? "oklch(0.75 0.15 85)" : "var(--color-border)"}
                strokeWidth={node.status === "watch" ? 1.5 : 1}
              />
              <circle
                cx={node.x + 9}
                cy={node.y - 1}
                r={17}
                fill="color-mix(in oklch, var(--color-primary) 18%, transparent)"
                stroke="var(--color-primary)"
                strokeWidth={1}
              />
              <text
                x={node.x + 9}
                y={node.y + 5}
                textAnchor="middle"
                fill="var(--color-primary)"
                fontSize={12}
                fontWeight={700}
              >
                {node.code}
              </text>
              <text x={node.x + 34} y={node.y - 2} fill="var(--color-foreground)" fontSize={11}>
                {node.name}
              </text>
              <text x={node.x + 34} y={node.y + 18} fill="var(--color-muted-foreground)" fontSize={9}>
                {node.type}
              </text>
              <rect x={node.x + 34} y={node.y + 29} width={85} height={5} rx={2} fill="var(--color-muted)" />
              <rect
                x={node.x + 34}
                y={node.y + 29}
                width={85 * (node.level / 100)}
                height={5}
                rx={2}
                fill={node.status === "watch" ? "oklch(0.75 0.15 85)" : "var(--color-primary)"}
              />
              <text
                x={node.x + 125}
                y={node.y + 34}
                textAnchor="end"
                fill="var(--color-muted-foreground)"
                fontSize={9}
              >
                {node.level}%
              </text>
              <circle
                cx={node.x + 126}
                cy={node.y - 12}
                r={3.5}
                fill={node.status === "watch" ? "oklch(0.75 0.15 85)" : "var(--color-primary)"}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <StatusDot status="normal" />
          平常
        </span>
        <span className="inline-flex items-center gap-1.5">
          <StatusDot status="watch" />
          注意
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-5 border-t-2 border-dashed border-primary/70" />
          水流方向
        </span>
        <span className="ml-auto hidden sm:inline">ノードを選択して詳細を表示</span>
      </div>

      {selected && <BasinNodeSheet node={selected} onClose={() => setSelectedId(null)} />}
    </div>
  )
}
