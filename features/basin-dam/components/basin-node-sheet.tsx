"use client"

import { Activity, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BasinDagNode } from "../data"

type BasinNodeSheetProps = {
  node: BasinDagNode
  onClose: () => void
}

export function BasinNodeSheet({ node, onClose }: BasinNodeSheetProps) {
  const watching = node.status === "watch"

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose} role="presentation">
      <aside
        className="flex h-full w-full max-w-sm flex-col border-l border-border/60 bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="basin-node-title"
      >
        <button
          type="button"
          className="self-end text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="閉じる"
        >
          <X className="size-4.5" />
        </button>

        <p className="mt-2 text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
          NODE / {node.code}
        </p>
        <h2 id="basin-node-title" className="mt-2 text-xl font-semibold text-card-foreground">
          {node.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{node.type}</p>

        <div
          className={cn(
            "mt-6 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm",
            watching ? "bg-amber-500/15 text-amber-400" : "bg-primary/15 text-primary"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              watching ? "bg-amber-400" : "bg-primary"
            )}
          />
          {watching ? "注意して監視" : "平常どおり稼働"}
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">現在の貯留感</span>
            <strong className="font-mono text-lg tabular-nums text-foreground">{node.level}%</strong>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", watching ? "bg-amber-400" : "bg-primary")}
              style={{ width: `${node.level}%` }}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">処理の余裕</span>
            <strong className="font-mono text-lg tabular-nums text-foreground">{node.capacity}%</strong>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${node.capacity}%` }} />
          </div>
        </div>

        <div className="mt-8 flex items-start gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <Activity className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            流量は直近15分間安定しています。
            <span className="mt-1 block text-[11px]">デモの自動監視表示です</span>
          </span>
        </div>
      </aside>
    </div>
  )
}
