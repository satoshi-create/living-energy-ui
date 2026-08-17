"use client"

import { useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Switch } from "@/components/ui/switch"
import { NetworkFlow } from "@/components/energy/network-flow"
import { NETWORK_MODELS, type NetworkModel } from "@/lib/energy-data"

export function NetworkView() {
  const [model, setModel] = useState<NetworkModel>("yamanashi")
  const [isNight, setIsNight] = useState(false)
  const config = NETWORK_MODELS[model]

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">{config.label}</CardTitle>
              <CardDescription className="mt-1 max-w-xl text-pretty">{config.description}</CardDescription>
            </div>
            <ToggleGroup
              value={[model]}
              onValueChange={(v) => v[0] && setModel(v[0] as NetworkModel)}
              variant="outline"
            >
              <ToggleGroupItem value="yamanashi" className="text-sm">
                山梨 P2G 水素モデル
              </ToggleGroupItem>
              <ToggleGroupItem value="fukushima" className="text-sm">
                福島 広域VPPモデル
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
            <Sun className={isNight ? "size-4 text-muted-foreground" : "size-4 text-primary"} />
            <span className="text-sm text-muted-foreground">日中余剰モード</span>
            <Switch checked={isNight} onCheckedChange={setIsNight} />
            <span className="text-sm text-muted-foreground">夜間供給モード</span>
            <Moon className={isNight ? "size-4 text-primary" : "size-4 text-muted-foreground"} />
          </div>

          <NetworkFlow nodes={config.nodes} edges={config.edges} mode={isNight ? "night" : "day"} />
        </CardContent>
      </Card>
    </div>
  )
}
