"use client"

import { useState } from "react"
import { Gauge, Sun, Network, Trophy, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { RegionHeader } from "@/components/energy/region-header"
import { HomeView } from "@/components/energy/home-view"
import { BalconyView } from "@/components/energy/balcony-view"
import { NetworkView } from "@/components/energy/network-view"
import { RankingView } from "@/components/energy/ranking-view"
import { REGIONS } from "@/lib/energy-data"

const NAV_ITEMS = [
  { id: "home", label: "生活実感メーター", shortLabel: "ホーム", icon: Gauge },
  { id: "balcony", label: "ベランダ発電シミュレーター", shortLabel: "ベランダ", icon: Sun },
  { id: "network", label: "地域再エネネットワーク", shortLabel: "ネットワーク", icon: Network },
  { id: "ranking", label: "都道府県別 再エネ番付", shortLabel: "番付", icon: Trophy },
] as const

type ViewId = (typeof NAV_ITEMS)[number]["id"]

export function AppShell() {
  const [activeView, setActiveView] = useState<ViewId>("home")
  const [regionId, setRegionId] = useState(REGIONS[0].id)

  const activeItem = NAV_ITEMS.find((item) => item.id === activeView)!

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar px-4 py-6 lg:flex">
        <div className="flex items-center gap-2 px-2 pb-8">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Leaf className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">Living Energy UI</span>
            <span className="text-xs text-muted-foreground">生活実感型・再エネ</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeView
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-border/60 bg-muted/40 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            すべての数値はデモ用のシミュレーションデータです。実際の発電量とは異なります。
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <RegionHeader
          regionId={regionId}
          onRegionChange={setRegionId}
          title={activeItem.label}
        />

        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          {activeView === "home" && <HomeView />}
          {activeView === "balcony" && <BalconyView />}
          {activeView === "network" && <NetworkView />}
          {activeView === "ranking" && <RankingView />}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-sidebar/95 backdrop-blur lg:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeView
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{item.shortLabel}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
