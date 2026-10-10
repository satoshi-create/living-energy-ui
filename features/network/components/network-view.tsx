"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { JapanReMap } from "./japan-re-map"
import { NetworkDetailSidebar } from "./network-detail-sidebar"
import {
  type NetworkLocale,
  type NetworkModel,
} from "../data"

const SIDEBAR_DEFAULT_WIDTH = 384
const SIDEBAR_MIN_WIDTH = 320
const SIDEBAR_MAX_WIDTH = 700

function toNetworkLocale(locale: string): NetworkLocale {
  return locale === "en" ? "en" : "ja"
}

export function NetworkView() {
  const locale = toNetworkLocale(useLocale())
  const [selectedModel, setSelectedModel] = useState<NetworkModel | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const sidebarOpen = selectedModel !== null

  return (
    <div
      className="relative h-[calc(100dvh-7.5rem)] min-h-[500px] w-full overflow-hidden bg-background/50"
      style={{ ["--sidebar-w" as string]: `${sidebarWidth}px` }}
    >
      <div
        className={cn(
          "absolute inset-0 min-h-0 min-w-0 overflow-hidden transition-[right] duration-300 ease-in-out",
          sidebarOpen && "lg:right-[var(--sidebar-w)]",
        )}
      >
        <JapanReMap
          locale={locale}
          selectedModelId={selectedModel}
          onSelect={setSelectedModel}
        />
      </div>

      <NetworkDetailSidebar
        modelId={selectedModel}
        locale={locale}
        open={sidebarOpen}
        onClose={() => setSelectedModel(null)}
        width={sidebarWidth}
        onWidthChange={setSidebarWidth}
        minWidth={SIDEBAR_MIN_WIDTH}
        maxWidth={SIDEBAR_MAX_WIDTH}
      />
    </div>
  )
}
