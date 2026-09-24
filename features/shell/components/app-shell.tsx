"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Sun, Network, Globe2, Building2, Leaf, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { RegionHeader } from "./region-header"
import { BalconyView } from "@/features/balcony-pv"
import { NetworkView } from "@/features/network"
import { GlobalImplementationView } from "@/features/global-implementation/components/global-implementation-view"
import { EcosystemOrgsView } from "@/features/ecosystem-orgs/components/ecosystem-orgs-view"
import { REGIONS } from "@/lib/regions"

const NAV_ITEMS = [
  { id: "balcony-simulation", icon: Sun },
  { id: "global-implementation", icon: Globe2 },
  { id: "ecosystem-orgs", icon: Building2 },
  { id: "regional-network", icon: Network },
] as const

type ViewId = (typeof NAV_ITEMS)[number]["id"]

const VIEW_STORAGE_KEY = "living-energy-active-view"
const REGION_STORAGE_KEY = "living-energy-region-id"

function isViewId(value: string | null): value is ViewId {
  return NAV_ITEMS.some((item) => item.id === value)
}

export function AppShell() {
  const t = useTranslations("shell")
  const [activeView, setActiveView] = useState<ViewId>("balcony-simulation")
  const [regionId, setRegionId] = useState(REGIONS[0].id)
  const [hydrated, setHydrated] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const storedView = sessionStorage.getItem(VIEW_STORAGE_KEY)
    const storedRegion = sessionStorage.getItem(REGION_STORAGE_KEY)
    if (isViewId(storedView)) setActiveView(storedView)
    if (storedRegion && REGIONS.some((r) => r.id === storedRegion)) {
      setRegionId(storedRegion)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem(VIEW_STORAGE_KEY, activeView)
  }, [activeView, hydrated])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem(REGION_STORAGE_KEY, regionId)
  }, [regionId, hydrated])

  const activeItem = NAV_ITEMS.find((item) => item.id === activeView)!

  return (
    <div className="relative flex min-h-screen w-full">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label={t("brand")}
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/60 bg-sidebar px-4 py-6 transition-transform duration-200 ease-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-2 pb-8">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Leaf className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">{t("brand")}</span>
            <span className="text-xs text-muted-foreground">{t("tagline")}</span>
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
                onClick={() => {
                  setActiveView(item.id)
                  setIsSidebarOpen(false)
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{t(`nav.${item.id}.label`)}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-border/60 bg-muted/40 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{t("demoDisclaimer")}</p>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="mt-3 ml-3 flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-sidebar text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground sm:ml-4 lg:ml-6"
          >
            <PanelLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <RegionHeader
              regionId={regionId}
              onRegionChange={setRegionId}
              title={t(`nav.${activeItem.id}.label`)}
              showRegionSelect={activeView === "regional-network"}
            />
          </div>
        </div>

        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          {activeView === "balcony-simulation" && <BalconyView />}
          {activeView === "regional-network" && <NetworkView />}
          {activeView === "global-implementation" && <GlobalImplementationView />}
          {activeView === "ecosystem-orgs" && <EcosystemOrgsView />}
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
                  "flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium transition-colors sm:px-2 sm:text-[11px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{t(`nav.${item.id}.shortLabel`)}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
