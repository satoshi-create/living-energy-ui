"use client"

import { Sun } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { REGIONS, WEATHER } from "@/lib/regions"

export function RegionHeader({
  regionId,
  onRegionChange,
  title,
}: {
  regionId: string
  onRegionChange: (id: string) => void
  title: string
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Living Energy UI</p>
        <h1 className="text-balance text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={regionId} onValueChange={(value) => value && onRegionChange(value)}>
          <SelectTrigger className="h-9 min-w-44">
            <SelectValue>
              {(value: string) => REGIONS.find((region) => region.id === value)?.label ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {REGIONS.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="gap-1.5 border border-border/60 bg-muted/60 py-1.5 text-foreground">
          <Sun className="size-3.5 text-primary" />
          {WEATHER.label} {WEATHER.irradiance} W/m²
        </Badge>
      </div>
    </header>
  )
}
