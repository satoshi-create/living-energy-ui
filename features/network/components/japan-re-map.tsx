"use client"

import { useState } from "react"
import { Minus, Plus, RotateCcw } from "lucide-react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps"
import {
  NETWORK_MODELS,
  NETWORK_UI,
  categoryColor,
  localizedMapSite,
  matchesModelCategory,
  uiText,
  type ModelCategory,
  type NetworkLocale,
  type NetworkModel,
} from "../data"

/**
 * Natural Earth via world-atlas (same stack as world-pv-map).
 * 50m keeps Okinawa / major islets readable at Japan national framing;
 * world map uses 110m for global scale.
 */
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
const JAPAN_GEO_ID = "392"

const MIN_ZOOM = 1
const MAX_ZOOM = 8
const ZOOM_STEP = 1.25

/** National framing: lon 128–146 / lat ~26–46 (Okinawa→Hokkaido) via Mercator */
const MAP_WIDTH = 1000
const MAP_HEIGHT = 850
const MAP_CENTER: [number, number] = [137, 36]
const MAP_SCALE = 1350

type MapCamera = { center: [number, number]; zoom: number }
type CategoryFilter = ModelCategory | "all"
type RegionFocus =
  | "all"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "kyushu"

interface JapanReMapProps {
  locale: NetworkLocale
  selectedModelId: NetworkModel | null
  onSelect: (model: NetworkModel | null) => void
}

const REGION_CAMERA: Record<RegionFocus, MapCamera> = {
  all: { center: MAP_CENTER, zoom: 1 },
  tohoku: { center: [140.5, 39.2], zoom: 2.6 },
  kanto: { center: [139.7, 35.9], zoom: 3.4 },
  chubu: { center: [137.8, 35.8], zoom: 3.2 },
  kansai: { center: [135.5, 34.7], zoom: 3.4 },
  kyushu: { center: [130.7, 32.0], zoom: 2.8 },
}

/** Approximate pin → macro region for filter dimming (paths stay visible). */
const SITE_REGION: Record<NetworkModel, RegionFocus> = {
  yamanashi: "chubu",
  fukushima: "tohoku",
}

/** Site pin overrides — central Honshu (Yamanashi) / southern Tohoku (Fukushima). */
const SITE_COORDINATES: Partial<Record<NetworkModel, [number, number]>> = {
  yamanashi: [138.57, 35.66],
  fukushima: [140.47, 37.75],
}

const FILTER_OPTIONS: readonly {
  id: CategoryFilter
  uiKey: keyof typeof NETWORK_UI
}[] = [
  { id: "all", uiKey: "japanMapFilterAll" },
  { id: "p2g", uiKey: "japanMapFilterP2g" },
  { id: "vpp", uiKey: "japanMapFilterVpp" },
  { id: "microgrid", uiKey: "japanMapFilterMicrogrid" },
  { id: "self-line", uiKey: "japanMapFilterSelfLine" },
]

const REGION_OPTIONS: readonly {
  id: RegionFocus
  uiKey: keyof typeof NETWORK_UI
}[] = [
  { id: "all", uiKey: "japanMapRegionAll" },
  { id: "tohoku", uiKey: "japanMapRegionTohoku" },
  { id: "kanto", uiKey: "japanMapRegionKanto" },
  { id: "chubu", uiKey: "japanMapRegionChubu" },
  { id: "kansai", uiKey: "japanMapRegionKansai" },
  { id: "kyushu", uiKey: "japanMapRegionKyushu" },
]

const MODEL_IDS = Object.keys(NETWORK_MODELS) as NetworkModel[]

function clampZoom(z: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
}

function siteCoordinates(id: NetworkModel): [number, number] {
  return SITE_COORDINATES[id] ?? NETWORK_MODELS[id].coordinates
}

export function JapanReMap({
  locale,
  selectedModelId,
  onSelect,
}: JapanReMapProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [regionFocus, setRegionFocus] = useState<RegionFocus>("all")
  const [hoveredId, setHoveredId] = useState<NetworkModel | null>(null)
  const [center, setCenter] = useState<[number, number]>(REGION_CAMERA.all.center)
  const [zoom, setZoom] = useState(REGION_CAMERA.all.zoom)

  function focusRegion(id: RegionFocus) {
    setRegionFocus(id)
    const cam = REGION_CAMERA[id]
    setCenter(cam.center)
    setZoom(cam.zoom)
  }

  function zoomBy(factor: number) {
    setZoom((prev) => clampZoom(prev * factor))
  }

  function resetView() {
    setRegionFocus("all")
    const cam = REGION_CAMERA.all
    setCenter(cam.center)
    setZoom(cam.zoom)
  }

  function selectPin(id: NetworkModel) {
    const config = NETWORK_MODELS[id]
    if (!matchesModelCategory(config.modelCategory, categoryFilter)) return
    if (regionFocus !== "all" && SITE_REGION[id] !== regionFocus) return
    onSelect(selectedModelId === id ? null : id)
  }

  const sortedPins = [...MODEL_IDS].sort((a, b) => {
    const aMatch = matchesModelCategory(
      NETWORK_MODELS[a].modelCategory,
      categoryFilter
    )
      ? 1
      : 0
    const bMatch = matchesModelCategory(
      NETWORK_MODELS[b].modelCategory,
      categoryFilter
    )
      ? 1
      : 0
    if (aMatch !== bMatch) return aMatch - bMatch
    const aTop = a === selectedModelId || a === hoveredId ? 1 : 0
    const bTop = b === selectedModelId || b === hoveredId ? 1 : 0
    return aTop - bTop
  })

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#080b11] select-none">
      <div className="absolute top-2 left-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-2 rounded-md border border-border/50 bg-card/90 p-0.5 shadow-sm backdrop-blur">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          aria-label={uiText("japanMapFilterAria", locale)}
          className="cursor-pointer rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs font-medium text-slate-100 shadow-sm backdrop-blur hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {uiText(opt.uiKey, locale)}
            </option>
          ))}
        </select>
        <select
          value={regionFocus}
          onChange={(e) => focusRegion(e.target.value as RegionFocus)}
          aria-label={uiText("japanMapRegionAria", locale)}
          className="cursor-pointer rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs font-medium text-slate-100 shadow-sm backdrop-blur hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          {REGION_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {uiText(opt.uiKey, locale)}
            </option>
          ))}
        </select>
      </div>

      <div
        className="absolute inset-0 flex h-full w-full items-center justify-center outline-none focus:outline-none select-none [&_*]:outline-none [&_*]:focus:outline-none"
        onClick={() => {
          setHoveredId(null)
          onSelect(null)
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: MAP_CENTER,
            scale: MAP_SCALE,
          }}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full max-h-full max-w-full outline-none focus:outline-none select-none [&_*]:outline-none [&_*]:focus:outline-none"
          style={{ width: "100%", height: "100%", outline: "none" }}
          tabIndex={-1}
        >
          <ZoomableGroup
            center={center}
            zoom={zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveEnd={(pos) => {
              setCenter(pos.coordinates as [number, number])
              setZoom(pos.zoom)
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => String(geo.id) === JAPAN_GEO_ID)
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      tabIndex={-1}
                      className="cursor-default select-none focus:outline-none focus:ring-0"
                      style={{
                        default: {
                          fill: "#111827",
                          stroke: "#1f2937",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "#1e293b",
                          stroke: "#1f2937",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#1e293b",
                          stroke: "#1f2937",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    />
                  ))
              }
            </Geographies>

            {sortedPins.map((id) => {
              const config = NETWORK_MODELS[id]
              const copy = localizedMapSite(config, locale)
              const coords = siteCoordinates(id)
              const isMatch =
                matchesModelCategory(config.modelCategory, categoryFilter) &&
                (regionFocus === "all" || SITE_REGION[id] === regionFocus)
              const isSelected = id === selectedModelId
              const isHovered = id === hoveredId
              const color = categoryColor(config.modelCategory)
              const pinScale =
                (1 / zoom) * (isSelected || isHovered ? 1.25 : 1)
              const showLabel =
                isMatch && (isHovered || isSelected || zoom >= 2.2)
              const tooltipLabel = `${copy.regionName} · ${copy.scaleLabel}`
              const tooltipW = Math.max(tooltipLabel.length * 7.2 + 14, 64)
              const tooltipH = 18

              return (
                <Marker
                  key={id}
                  coordinates={coords}
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectPin(id)
                  }}
                  className={`group select-none focus:outline-none focus:ring-0 ${
                    isMatch ? "cursor-pointer" : "pointer-events-none"
                  }`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                    pointerEvents: isMatch ? "auto" : "none",
                  }}
                >
                  <g
                    transform={`scale(${pinScale})`}
                    opacity={isMatch ? 1 : 0.15}
                    className={
                      isMatch ? "cursor-pointer" : "pointer-events-none"
                    }
                    style={{
                      outline: "none",
                      pointerEvents: isMatch ? "auto" : "none",
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectPin(id)
                    }}
                    onMouseEnter={() => {
                      if (isMatch) setHoveredId(id)
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                    role="button"
                    tabIndex={isMatch ? 0 : -1}
                    aria-label={copy.label}
                    aria-pressed={isSelected}
                    aria-hidden={!isMatch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        selectPin(id)
                      }
                    }}
                  >
                    {isSelected ? (
                      <circle
                        r={14}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        className="animate-ping opacity-75"
                      />
                    ) : null}
                    <circle
                      r={isSelected || isHovered ? 11 : 9}
                      fill={color}
                      opacity={isSelected || isHovered ? 0.5 : 0.22}
                    />
                    <circle
                      r={isSelected || isHovered ? 5.5 : 5}
                      fill={color}
                      stroke={isSelected ? "#38bdf8" : "var(--background)"}
                      strokeWidth={isSelected ? 2 : 1.5}
                    />
                    {showLabel ? (
                      <g
                        transform="translate(0, -16)"
                        className="pointer-events-none"
                      >
                        <rect
                          x={-tooltipW / 2}
                          y={-tooltipH / 2 - 1}
                          width={tooltipW}
                          height={tooltipH}
                          rx={4}
                          fill={isHovered || isSelected ? "#0f172a" : "#1e293b"}
                          opacity={isHovered || isSelected ? 0.95 : 0.82}
                        />
                        <text
                          y={1}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="600"
                          fill={isHovered || isSelected ? "#f8fafc" : "#cbd5e1"}
                        >
                          {tooltipLabel}
                        </text>
                      </g>
                    ) : null}
                  </g>
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-1 rounded-lg border border-border/50 bg-zinc-900/80 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          aria-label={uiText("japanMapZoomIn", locale)}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={() => zoomBy(ZOOM_STEP)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          aria-label={uiText("japanMapZoomOut", locale)}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={() => zoomBy(1 / ZOOM_STEP)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          aria-label={uiText("japanMapReset", locale)}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={resetView}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
