"use client"

import { useCallback, useRef, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  BatteryCharging,
  Building2,
  Droplets,
  Flame,
  Fuel,
  Home,
  Sprout,
  SunMedium,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  NETWORK_MODELS,
  categoryColor,
  localizedMapSite,
  localizedModel,
  localizedNode,
  networkMethodKey,
  uiText,
  type NetworkLocale,
  type NetworkModel,
  type NetworkNode,
} from "../data"

const SIDEBAR_UI = {
  closeAria: { ja: "詳細を閉じる", en: "Close detail" },
  resizeAria: { ja: "サイドバー幅を変更", en: "Resize sidebar" },
} as const

const NODE_ICONS: Record<NetworkNode["icon"], LucideIcon> = {
  "sun-medium": SunMedium,
  wind: Wind,
  droplets: Droplets,
  flame: Flame,
  "battery-charging": BatteryCharging,
  "building-2": Building2,
  home: Home,
  fuel: Fuel,
  sprout: Sprout,
}

type FlowMode = "day" | "night"

export type NetworkDetailSidebarProps = {
  modelId: NetworkModel | null
  locale: NetworkLocale
  open: boolean
  onClose: () => void
  width: number
  onWidthChange: (width: number) => void
  minWidth: number
  maxWidth: number
}

function FlowConnector({ mode }: { mode: FlowMode }) {
  const Arrow = mode === "day" ? ArrowDown : ArrowUp
  return (
    <div className="flex flex-col items-center gap-0.5 py-1" aria-hidden>
      <div className="h-3 w-px border-l border-dashed border-cyan-500/40" />
      <span className="relative flex size-6 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20" />
        <Arrow className="relative size-3.5 text-cyan-400" />
      </span>
      <div className="h-3 w-px border-l border-dashed border-cyan-500/40" />
    </div>
  )
}

function StageSection({
  label,
  nodes,
  locale,
}: {
  label: string
  nodes: NetworkNode[]
  locale: NetworkLocale
}) {
  if (nodes.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">{label}</p>
      <ul className="flex flex-col gap-1.5">
        {nodes.map((node) => {
          const nodeCopy = localizedNode(node, locale)
          const Icon = NODE_ICONS[node.icon]
          return (
            <li
              key={node.id}
              className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-[#111827]/70 p-3 transition-colors hover:border-cyan-500/30"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{nodeCopy.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{nodeCopy.sublabel}</p>
                {node.kind === "convert" ? (
                  <Badge
                    variant="outline"
                    className="mt-1.5 w-fit border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0 text-[10px] font-normal text-cyan-300"
                  >
                    {uiText("kindConvert", locale)}
                  </Badge>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function NetworkDetailSidebar({
  modelId,
  locale,
  open,
  onClose,
  width,
  onWidthChange,
  minWidth,
  maxWidth,
}: NetworkDetailSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [flowMode, setFlowMode] = useState<FlowMode>("day")

  const config = modelId ? NETWORK_MODELS[modelId] : null
  const copy = config ? localizedMapSite(config, locale) : null
  const modelCopy = config ? localizedModel(config, locale) : null

  const onResizePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [])

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !sidebarRef.current) return
      const right = sidebarRef.current.getBoundingClientRect().right
      const next = Math.min(maxWidth, Math.max(minWidth, right - e.clientX))
      onWidthChange(next)
    },
    [maxWidth, minWidth, onWidthChange],
  )

  const onResizePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [])

  const categoryLabel =
    config &&
    uiText(
      config.modelCategory === "p2g"
        ? "japanMapFilterP2g"
        : config.modelCategory === "vpp"
          ? "japanMapFilterVpp"
          : config.modelCategory === "microgrid"
            ? "japanMapFilterMicrogrid"
            : "japanMapFilterSelfLine",
      locale,
    )

  const supplyNodes = config?.nodes.filter((n) => n.kind === "supply") ?? []
  const convertNodes = config?.nodes.filter((n) => n.kind === "convert") ?? []
  const consumeNodes = config?.nodes.filter((n) => n.kind === "consume") ?? []

  return (
    <Card
      ref={sidebarRef}
      className={cn(
        "z-30 flex flex-col overflow-hidden border-border/60 bg-card/95 backdrop-blur-md transition-transform duration-300 ease-in-out",
        "fixed inset-x-0 bottom-0 h-[45vh] max-h-[50vh] w-full rounded-t-xl shadow-lg",
        "lg:absolute lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 lg:h-full lg:max-h-none lg:w-[var(--sidebar-w)] lg:rounded-none lg:border-l lg:shadow-2xl",
        open
          ? "translate-y-0 lg:translate-x-0"
          : "pointer-events-none translate-y-full lg:translate-y-0 lg:translate-x-full",
      )}
      style={{ ["--sidebar-w" as string]: `${width}px` }}
      aria-hidden={!open}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={SIDEBAR_UI.resizeAria[locale]}
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        className="absolute top-0 bottom-0 left-0 z-10 hidden w-1.5 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-primary/40 active:bg-primary/60 lg:block"
      />
      <div className="flex shrink-0 justify-center pt-2 lg:hidden" aria-hidden>
        <div className="h-1.5 w-10 rounded-full bg-muted-foreground/40" />
      </div>

      <div className="flex shrink-0 items-center justify-end gap-1 border-b border-border/50 px-3 pt-1 pb-2 pl-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={SIDEBAR_UI.closeAria[locale]}
        >
          <X className="size-4" />
        </button>
      </div>

      {config && copy && modelCopy ? (
        <>
          <CardHeader className="flex shrink-0 flex-col gap-3 space-y-0 pl-5">
            <div className="flex min-w-0 flex-col gap-1">
              <CardTitle className="text-xl font-bold text-white">{copy.label}</CardTitle>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  className="w-fit border px-2 py-0.5 text-xs font-medium"
                  style={{
                    borderColor: `${categoryColor(config.modelCategory)}66`,
                    backgroundColor: `${categoryColor(config.modelCategory)}33`,
                    color: categoryColor(config.modelCategory),
                  }}
                >
                  {categoryLabel}
                </Badge>
                <Badge variant="secondary" className="w-fit text-[10px] font-normal">
                  {copy.regionName}
                </Badge>
                <Badge variant="outline" className="w-fit font-mono text-[10px]">
                  {copy.scaleLabel}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="w-fit border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300"
                >
                  {uiText(networkMethodKey(config.modelCategory), locale)}
                </Badge>
                <Badge
                  variant="outline"
                  className="w-fit border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
                >
                  {uiText("selfSufficiency", locale)} {config.selfSufficiencyPct}%
                </Badge>
                <Badge
                  variant="outline"
                  className="w-fit border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-normal text-slate-300"
                >
                  {config.modelCategory === "microgrid" || config.modelCategory === "self-line"
                    ? uiText("gridIsland", locale)
                    : uiText("gridLinked", locale)}
                </Badge>
              </div>
            </div>

            <div
              role="group"
              aria-label={
                flowMode === "day" ? uiText("dayMode", locale) : uiText("nightMode", locale)
              }
              className="flex rounded-lg border border-white/10 bg-[#111827]/70 p-0.5"
            >
              <button
                type="button"
                onClick={() => setFlowMode("day")}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                  flowMode === "day"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="block">{uiText("dayMode", locale)}</span>
                <span className="mt-0.5 block text-[9px] font-normal opacity-70">
                  {uiText("dayModeHint", locale)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFlowMode("night")}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                  flowMode === "night"
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="block">{uiText("nightMode", locale)}</span>
                <span className="mt-0.5 block text-[9px] font-normal opacity-70">
                  {uiText("nightModeHint", locale)}
                </span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pl-5 text-sm">
            <p className="leading-relaxed text-slate-300">{modelCopy.description}</p>

            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-muted-foreground">
                {uiText("flowSection", locale)}
              </p>

              <StageSection
                label={uiText("stageGeneration", locale)}
                nodes={supplyNodes}
                locale={locale}
              />
              <FlowConnector mode={flowMode} />
              <StageSection
                label={uiText("stageBuffer", locale)}
                nodes={convertNodes}
                locale={locale}
              />
              <FlowConnector mode={flowMode} />
              <StageSection
                label={uiText("stageConsume", locale)}
                nodes={consumeNodes}
                locale={locale}
              />
            </div>
          </CardContent>
        </>
      ) : null}
    </Card>
  )
}
