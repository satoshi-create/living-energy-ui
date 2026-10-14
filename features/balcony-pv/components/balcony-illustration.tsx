"use client"

import { useState, type CSSProperties } from "react"
import { useLocale, useTranslations } from "next-intl"
import { ChevronLeft, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  SURFACE_TYPOLOGIES,
  getPanelTiltOption,
  resolveDefaultTiltMode,
  typologyToBalconyType,
  typologyToRoofType,
  type BalconyType,
  type Direction,
  type RailingType,
  type RoofType,
  DEFAULT_LIVING_CONTEXT,
  type LivingContext,
  type SurfaceTypology,
  type SurfaceTypologyDetail,
  type WeatherCondition,
} from "../simulator-data"
import {
  getSolarCellTypesForSurface,
  type SolarCellTypeDetail,
  type SolarCellTypeId,
} from "../data"

type SurfaceCategoryFilter = "all" | "balcony" | "roof"

const DIRECTION_ROTATION: Record<Direction, number> = {
  south: 0,
  southeast: -18,
  southwest: 18,
  east: -34,
  west: 34,
}

export type BalconyIllustrationProps = {
  direction: Direction
  railing: RailingType
  hour: number
  balconyType?: BalconyType
  roofType?: RoofType
  /** Optional typology override (bridges to balcony/roof presets). */
  typologyId?: SurfaceTypology
  /** Panel tilt from horizontal (degrees); drives mesh X-axis rotation. */
  tiltDeg?: number
  /** Stow / 出仕舞い — fold panels flat inside the rail. */
  isRetracted?: boolean
  /** Laundry / egress / weather overlays for lived-experience simulation. */
  livingContext?: LivingContext
  /** Show 60 cm egress stripe + hatch no-go zones. */
  showEgressOverlay?: boolean
}

function LifeLayerDefs() {
  return (
    <defs>
      <pattern
        id="egress-stripe"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
        patternTransform="rotate(45)"
      >
        <rect width="8" height="8" fill="var(--color-amber-500)" opacity="0.12" />
        <line x1="0" y1="0" x2="0" y2="8" stroke="var(--color-amber-500)" strokeWidth="3" opacity="0.45" />
      </pattern>
      <pattern id="hatch-no-go" patternUnits="userSpaceOnUse" width="6" height="6">
        <path d="M0,6 L6,0 M-1,1 L1,-1 M5,7 L7,5" stroke="var(--color-rose-500)" strokeWidth="1" opacity="0.5" />
      </pattern>
    </defs>
  )
}

function EgressOverlay({ showHatch }: { showHatch: boolean }) {
  return (
    <g aria-hidden>
      <rect x="0" y="140" width="72" height="60" fill="url(#egress-stripe)" opacity="0.85" />
      {showHatch && (
        <>
          <rect x="228" y="148" width="52" height="44" fill="url(#hatch-no-go)" opacity="0.55" />
          <rect
            x="228"
            y="148"
            width="52"
            height="44"
            fill="none"
            stroke="var(--color-rose-500)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.7"
          />
        </>
      )}
    </g>
  )
}

function LaundryLayer({
  sunX,
  sunY,
  shadowStrength,
  collapsed,
}: {
  sunX: number
  sunY: number
  shadowStrength: number
  collapsed: boolean
}) {
  if (collapsed) {
    return (
      <g aria-hidden opacity="0.5">
        <line x1="60" y1="132" x2="240" y2="132" stroke="var(--color-foreground)" strokeWidth="2" opacity="0.35" />
      </g>
    )
  }
  const poleY = 118
  const items = [
    { x: 85, w: 22, h: 28 },
    { x: 120, w: 18, h: 32 },
    { x: 155, w: 24, h: 26 },
    { x: 190, w: 20, h: 30 },
  ]
  return (
    <g aria-hidden>
      <line x1="50" y1={poleY} x2="250" y2={poleY} stroke="var(--color-foreground)" strokeWidth="2.5" opacity="0.55" />
      <line x1="50" y1={poleY + 14} x2="250" y2={poleY + 14} stroke="var(--color-foreground)" strokeWidth="1.5" opacity="0.35" />
      {items.map((item, i) => {
        const cx = item.x + item.w / 2
        const cy = poleY + item.h / 2 + 8
        const dx = cx - sunX
        const dy = cy - sunY
        const len = Math.hypot(dx, dy) || 1
        const shadowLen = 18 + shadowStrength * 24
        const sx = cx + (dx / len) * shadowLen
        const sy = cy + (dy / len) * shadowLen
        return (
          <g key={i}>
            <polygon
              points={`${cx},${cy} ${cx + item.w / 2},${cy + item.h} ${sx + item.w / 2},${sy + item.h} ${sx},${sy}`}
              fill="var(--color-foreground)"
              opacity={0.12 + shadowStrength * 0.18}
            />
            <rect
              x={item.x}
              y={poleY + 6}
              width={item.w}
              height={item.h}
              rx="2"
              fill="var(--color-muted-foreground)"
              opacity="0.55"
            />
          </g>
        )
      })}
    </g>
  )
}

function weatherSkyOpacity(weather: WeatherCondition): number {
  if (weather === "overcast_tsuyu") return 0.72
  if (weather === "typhoon_alert") return 0.85
  return 0.5
}

function weatherSunOpacity(weather: WeatherCondition): number {
  if (weather === "overcast_tsuyu") return 0.45
  if (weather === "typhoon_alert") return 0.15
  return 0.9
}

/** Panel group style: X-axis CSS rotate (+ stow pose). */
function panelTiltStyle(tiltDeg: number, isRetracted: boolean): CSSProperties {
  if (isRetracted) {
    return {
      transform: "rotateX(0deg) translateY(6px) scaleY(0.2)",
      transformOrigin: "center bottom",
      transformBox: "fill-box",
      opacity: 0.55,
    }
  }
  return {
    transform: `rotateX(${tiltDeg}deg)`,
    transformOrigin: "center bottom",
    transformBox: "fill-box",
  }
}

function StandardDeck({
  rotation,
  railing,
  railingOpacity,
  shadowLength,
  tiltDeg,
  isRetracted,
}: {
  rotation: number
  railing: RailingType
  railingOpacity: number
  shadowLength: number
  tiltDeg: number
  isRetracted: boolean
}) {
  const panelStyle = panelTiltStyle(tiltDeg, isRetracted)
  const railMount = tiltDeg >= 70 && !isRetracted
  return (
    <>
      <rect x="0" y="140" width="300" height="60" fill="var(--color-card)" />
      <g
        transform={
          railMount
            ? `rotate(${rotation} 150 124) translate(0 -34)`
            : `rotate(${rotation} 150 168)`
        }
        style={panelStyle}
      >
        <rect
          x="105"
          y={railMount ? 118 : 158}
          width="90"
          height={railMount ? 36 : 20}
          rx="3"
          fill="var(--color-primary)"
          opacity="0.85"
        />
        <line x1="120" y1={railMount ? 118 : 158} x2="120" y2={railMount ? 154 : 178} stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
        <line x1="135" y1={railMount ? 118 : 158} x2="135" y2={railMount ? 154 : 178} stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
        <line x1="150" y1={railMount ? 118 : 158} x2="150" y2={railMount ? 154 : 178} stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
        <line x1="165" y1={railMount ? 118 : 158} x2="165" y2={railMount ? 154 : 178} stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
        <line x1="180" y1={railMount ? 118 : 158} x2="180" y2={railMount ? 154 : 178} stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
      </g>
      <g>
        <rect x="0" y="138" width="300" height="4" fill="var(--color-foreground)" opacity="0.4" />
        {railing !== "concrete" &&
          Array.from({ length: 15 }, (_, i) => (
            <line
              key={i}
              x1={i * 21 + 5}
              y1="110"
              x2={i * 21 + 5}
              y2="138"
              stroke="var(--color-foreground)"
              strokeWidth={railing === "glass" ? 1 : 2.5}
              opacity={railing === "glass" ? 0.25 : 0.5}
            />
          ))}
        {railing === "concrete" && (
          <rect x="0" y="110" width="300" height="28" fill="var(--color-foreground)" opacity="0.55" />
        )}
      </g>
      <rect
        x="0"
        y="140"
        width="300"
        height={Math.min(58, shadowLength)}
        fill="var(--color-foreground)"
        opacity={railingOpacity * 0.35}
      />
    </>
  )
}

/** Juliet: no protruding deck — French doors + rail/glass with thin-film mesh. */
function JulietSurface({
  railing,
  tiltDeg,
  isRetracted,
}: {
  railing: RailingType
  tiltDeg: number
  isRetracted: boolean
}) {
  const isGlass = railing === "glass"
  const panelStyle = panelTiltStyle(tiltDeg, isRetracted)
  return (
    <>
      {/* building façade */}
      <rect x="0" y="70" width="300" height="130" fill="var(--color-card)" />
      <rect x="0" y="70" width="300" height="8" fill="var(--color-foreground)" opacity="0.15" />

      {/* French doors (pair) */}
      <g>
        <rect
          x="95"
          y="85"
          width="50"
          height="95"
          fill="var(--color-muted)"
          stroke="var(--color-foreground)"
          strokeWidth="1.5"
          opacity="0.85"
        />
        <rect
          x="155"
          y="85"
          width="50"
          height="95"
          fill="var(--color-muted)"
          stroke="var(--color-foreground)"
          strokeWidth="1.5"
          opacity="0.85"
        />
        <line x1="120" y1="85" x2="120" y2="180" stroke="var(--color-foreground)" strokeWidth="1" opacity="0.35" />
        <line x1="180" y1="85" x2="180" y2="180" stroke="var(--color-foreground)" strokeWidth="1" opacity="0.35" />
        <line x1="95" y1="132" x2="145" y2="132" stroke="var(--color-foreground)" strokeWidth="1" opacity="0.35" />
        <line x1="155" y1="132" x2="205" y2="132" stroke="var(--color-foreground)" strokeWidth="1" opacity="0.35" />
        {/* door handles */}
        <circle cx="140" cy="135" r="2" fill="var(--color-foreground)" opacity="0.5" />
        <circle cx="160" cy="135" r="2" fill="var(--color-foreground)" opacity="0.5" />
      </g>

      {/* Juliet rail flush to façade */}
      <g>
        <rect x="80" y="155" width="140" height="3" fill="var(--color-foreground)" opacity="0.55" />
        <rect x="80" y="175" width="140" height="3" fill="var(--color-foreground)" opacity="0.45" />
        {isGlass ? (
          <rect x="82" y="118" width="136" height="40" fill="var(--color-primary)" opacity="0.12" stroke="var(--color-foreground)" strokeWidth="1" />
        ) : (
          Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1={88 + i * 11}
              y1="118"
              x2={88 + i * 11}
              y2="178"
              stroke="var(--color-foreground)"
              strokeWidth={railing === "concrete" ? 3 : 1.5}
              opacity={0.55}
            />
          ))
        )}
        {/* flexible thin-film / receiving mesh along rail */}
        <g opacity="0.9" style={panelStyle}>
          {Array.from({ length: 6 }, (_, i) => (
            <rect
              key={i}
              x={90 + i * 20}
              y={isRetracted ? 150 : 120}
              width="16"
              height={isRetracted ? 10 : 32}
              rx="1"
              fill="var(--color-primary)"
              opacity={0.55 + (i % 2) * 0.15}
            />
          ))}
        </g>
      </g>
    </>
  )
}

/** Recessed / loggia: setback walls, ceiling, and side cheeks with shade. */
function RecessedSurface({
  rotation,
  shadowLength,
  tiltDeg,
  isRetracted,
}: {
  rotation: number
  shadowLength: number
  tiltDeg: number
  isRetracted: boolean
}) {
  const panelStyle = panelTiltStyle(tiltDeg, isRetracted)
  return (
    <>
      {/* outer façade plane */}
      <rect x="0" y="60" width="300" height="140" fill="var(--color-muted)" opacity="0.35" />

      {/* left cheek wall (perspective) */}
      <polygon points="40,70 90,90 90,180 40,200" fill="var(--color-foreground)" opacity="0.22" />
      {/* right cheek wall */}
      <polygon points="260,70 210,90 210,180 260,200" fill="var(--color-foreground)" opacity="0.22" />
      {/* ceiling soffit */}
      <polygon points="40,70 260,70 210,90 90,90" fill="var(--color-foreground)" opacity="0.18" />

      {/* setback back wall */}
      <rect x="90" y="90" width="120" height="90" fill="var(--color-card)" />
      <rect
        x="110"
        y="105"
        width="80"
        height="55"
        fill="var(--color-muted)"
        stroke="var(--color-foreground)"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* recessed deck floor */}
      <polygon points="90,180 210,180 260,200 40,200" fill="var(--color-card)" />
      {/* side-wall cast shade on deck */}
      <polygon
        points={`90,180 ${90 + shadowLength * 0.4},180 ${40 + shadowLength * 0.5},200 40,200`}
        fill="var(--color-foreground)"
        opacity="0.28"
      />
      <polygon
        points={`${210 - shadowLength * 0.35},180 210,180 260,200 ${260 - shadowLength * 0.4},200`}
        fill="var(--color-foreground)"
        opacity="0.22"
      />

      {/* PV on recessed deck */}
      <g transform={`rotate(${rotation} 150 188)`} style={panelStyle}>
        <rect
          x="115"
          y={isRetracted ? 184 : 178}
          width="70"
          height={isRetracted ? 8 : 16}
          rx="2"
          fill="var(--color-primary)"
          opacity="0.85"
        />
        <line x1="132" y1="178" x2="132" y2="194" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
        <line x1="150" y1="178" x2="150" y2="194" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
        <line x1="168" y1="178" x2="168" y2="194" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
      </g>

      {/* front rail of loggia */}
      <line x1="40" y1="200" x2="260" y2="200" stroke="var(--color-foreground)" strokeWidth="2" opacity="0.4" />
    </>
  )
}

/** Roof terrace: flat roof plane as primary surface. */
function RoofTerraceSurface({
  rotation,
  tiltDeg,
  isRetracted,
}: {
  rotation: number
  tiltDeg: number
  isRetracted: boolean
}) {
  const panelStyle = panelTiltStyle(tiltDeg, isRetracted)
  return (
    <>
      <rect x="0" y="100" width="300" height="100" fill="var(--color-card)" />
      {/* parapet */}
      <rect x="0" y="95" width="300" height="8" fill="var(--color-foreground)" opacity="0.35" />
      <rect x="10" y="70" width="8" height="35" fill="var(--color-foreground)" opacity="0.3" />
      <rect x="282" y="70" width="8" height="35" fill="var(--color-foreground)" opacity="0.3" />
      {/* flat-roof PV array */}
      <g transform={`rotate(${rotation} 150 145)`} style={panelStyle}>
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={70 + col * 42}
              y={118 + row * 28}
              width="36"
              height={isRetracted ? 8 : 22}
              rx="2"
              fill="var(--color-primary)"
              opacity={0.75 + (row + col) % 2 * 0.1}
            />
          )),
        )}
      </g>
    </>
  )
}

/** Pitched gable — steep slate roof with PV highlight band. */
function PitchedGableRoof() {
  return (
    <g>
      {/* gable silhouette */}
      <polygon points="20,130 150,35 280,130" fill="var(--color-foreground)" opacity="0.28" />
      <polygon points="30,128 150,42 270,128" fill="var(--color-muted)" opacity="0.55" />
      {/* slate course lines */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={45 + i * 8}
          y1={118 - i * 12}
          x2={255 - i * 8}
          y2={118 - i * 12}
          stroke="var(--color-foreground)"
          strokeWidth="1"
          opacity="0.2"
        />
      ))}
      {/* PV band on south pitch */}
      <g>
        <polygon
          points="95,95 150,55 205,95 205,115 150,78 95,115"
          fill="var(--color-primary)"
          opacity="0.75"
        />
        <line x1="122" y1="88" x2="122" y2="108" stroke="var(--color-background)" strokeWidth="1" opacity="0.35" />
        <line x1="150" y1="68" x2="150" y2="95" stroke="var(--color-background)" strokeWidth="1" opacity="0.35" />
        <line x1="178" y1="88" x2="178" y2="108" stroke="var(--color-background)" strokeWidth="1" opacity="0.35" />
      </g>
      {/* eaves / wall */}
      <rect x="40" y="128" width="220" height="72" fill="var(--color-card)" opacity="0.85" />
    </g>
  )
}

/** Mansard + dormer — steep outer pitch with dormer cheek highlight. */
function PitchedMansardDormerRoof() {
  return (
    <g>
      {/* mansard outer steep faces */}
      <polygon points="25,140 55,55 245,55 275,140" fill="var(--color-foreground)" opacity="0.22" />
      <polygon points="40,138 65,62 235,62 260,138" fill="var(--color-muted)" opacity="0.5" />
      {/* upper shallow pitch */}
      <polygon points="65,62 150,30 235,62" fill="var(--color-foreground)" opacity="0.2" />
      {/* dormer body */}
      <rect x="125" y="58" width="50" height="45" fill="var(--color-card)" />
      <polygon points="125,58 150,40 175,58" fill="var(--color-foreground)" opacity="0.35" />
      <rect x="133" y="68" width="34" height="28" fill="var(--color-muted)" opacity="0.65" stroke="var(--color-foreground)" strokeWidth="1" />
      {/* PV on mansard pitch flanking dormer */}
      <polygon points="70,100 118,70 118,105 70,130" fill="var(--color-primary)" opacity="0.8" />
      <polygon points="182,70 230,100 230,130 182,105" fill="var(--color-primary)" opacity="0.8" />
      {/* slate hint lines */}
      {Array.from({ length: 4 }, (_, i) => (
        <line
          key={i}
          x1={75 + i * 4}
          y1={125 - i * 8}
          x2={115}
          y2={100 - i * 6}
          stroke="var(--color-background)"
          strokeWidth="1"
          opacity="0.35"
        />
      ))}
      <rect x="50" y="138" width="200" height="62" fill="var(--color-card)" opacity="0.85" />
    </g>
  )
}

function resolveIllustrationTypes(
  typologyId: SurfaceTypology | undefined,
  balconyType: BalconyType,
  roofType: RoofType,
): { balconyType: BalconyType; roofType: RoofType; railing: RailingType | null } {
  if (!typologyId) return { balconyType, roofType, railing: null }
  const bridgedBalcony = typologyToBalconyType(typologyId)
  const bridgedRoof = typologyToRoofType(typologyId)
  const railing: RailingType | null =
    typologyId === "precast_parapet"
      ? "concrete"
      : typologyId === "glass_railing"
        ? "glass"
        : null
  return {
    balconyType: bridgedBalcony ?? balconyType,
    roofType: bridgedRoof ?? roofType,
    railing,
  }
}

export function BalconyIllustration({
  direction,
  railing,
  hour,
  balconyType = "standard",
  roofType = "flat",
  typologyId,
  tiltDeg = 0,
  isRetracted = false,
  livingContext = DEFAULT_LIVING_CONTEXT,
  showEgressOverlay = true,
}: BalconyIllustrationProps) {
  const t = useTranslations("balconyPv")
  // hour ranges 8-17. Map to sun arc position: t=0 at 8:00, t=1 at 17:00.
  const tPos = (hour - 8) / 9
  const sunX = 20 + tPos * 260
  // Elevation peaks at solar noon (t ~ 0.5).
  const elevation = Math.sin(tPos * Math.PI)
  const sunY = 130 - elevation * 95
  // Longer shadows at low elevation.
  const shadowLength = 10 + (1 - elevation) * 70
  const rotation = DIRECTION_ROTATION[direction]

  const resolved = resolveIllustrationTypes(typologyId, balconyType, roofType)
  const effectiveBalcony = resolved.balconyType
  const effectiveRoof = resolved.roofType
  const effectiveRailing = resolved.railing ?? railing

  const railingOpacity =
    effectiveRailing === "concrete" ? 0.9 : effectiveRailing === "grid" ? 0.55 : 0.2
  const showPitchedRoof =
    effectiveRoof === "pitched_gable" || effectiveRoof === "pitched_mansard_dormer"
  const hideBalconyDeck = effectiveBalcony === "roof_terrace" && showPitchedRoof
  const weather = livingContext.weather
  const showLaundry = livingContext.habit === "laundry_drying"
  const showEgress =
    showEgressOverlay &&
    (livingContext.habit === "outdoor_unit_service" ||
      effectiveBalcony === "standard" ||
      effectiveBalcony === "recessed")
  const typhoonOrStow = weather === "typhoon_alert" || isRetracted
  const laundryShadowStrength = 1 - elevation * 0.35

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950">
      <svg viewBox="0 0 300 200" className="h-56 w-full" role="img" aria-label={t("illustration.ariaLabel")}>
        <LifeLayerDefs />
        {/* sky */}
        <rect x="0" y="0" width="300" height="140" fill="var(--color-muted)" opacity={weatherSkyOpacity(weather)} />
        {weather === "overcast_tsuyu" && (
          <rect x="0" y="0" width="300" height="140" fill="var(--color-background)" opacity="0.25" />
        )}
        {/* sun path arc guide */}
        <path d="M 20 130 Q 150 20 280 130" fill="none" stroke="var(--color-border)" strokeDasharray="3 4" />
        {/* sun */}
        <circle cx={sunX} cy={sunY} r="10" fill="var(--color-primary)" opacity={weatherSunOpacity(weather)} />
        <circle cx={sunX} cy={sunY} r="18" fill="var(--color-primary)" opacity={weatherSunOpacity(weather) * 0.2} />

        {/* UK pitched roofs sit in the upper / background plane */}
        {effectiveRoof === "pitched_gable" && <PitchedGableRoof />}
        {effectiveRoof === "pitched_mansard_dormer" && <PitchedMansardDormerRoof />}

        {/* balcony / terrace receiving surface */}
        {!hideBalconyDeck && effectiveBalcony === "standard" && !showPitchedRoof && (
          <>
            <StandardDeck
              rotation={rotation}
              railing={effectiveRailing}
              railingOpacity={railingOpacity}
              shadowLength={shadowLength}
              tiltDeg={tiltDeg}
              isRetracted={isRetracted}
            />
            {showEgress && <EgressOverlay showHatch={livingContext.habit === "outdoor_unit_service"} />}
            {showLaundry && (
              <LaundryLayer
                sunX={sunX}
                sunY={sunY}
                shadowStrength={laundryShadowStrength}
                collapsed={typhoonOrStow}
              />
            )}
          </>
        )}
        {!hideBalconyDeck && effectiveBalcony === "juliet" && (
          <JulietSurface railing={effectiveRailing} tiltDeg={tiltDeg} isRetracted={isRetracted} />
        )}
        {!hideBalconyDeck && effectiveBalcony === "recessed" && (
          <>
            <RecessedSurface
              rotation={rotation}
              shadowLength={shadowLength}
              tiltDeg={tiltDeg}
              isRetracted={isRetracted}
            />
            {showEgress && <EgressOverlay showHatch />}
            {showLaundry && (
              <LaundryLayer
                sunX={sunX}
                sunY={sunY}
                shadowStrength={laundryShadowStrength}
                collapsed={typhoonOrStow}
              />
            )}
          </>
        )}
        {!hideBalconyDeck && effectiveBalcony === "roof_terrace" && !showPitchedRoof && (
          <RoofTerraceSurface rotation={rotation} tiltDeg={tiltDeg} isRetracted={isRetracted} />
        )}
        {/* When a pitched roof is selected with standard deck, keep a simple floor under eaves */}
        {!hideBalconyDeck && effectiveBalcony === "standard" && showPitchedRoof && (
          <StandardDeck
            rotation={rotation}
            railing={effectiveRailing}
            railingOpacity={railingOpacity}
            shadowLength={shadowLength}
            tiltDeg={tiltDeg}
            isRetracted={isRetracted}
          />
        )}
        {!hideBalconyDeck && effectiveBalcony === "roof_terrace" && showPitchedRoof && (
          <RoofTerraceSurface rotation={rotation} tiltDeg={tiltDeg} isRetracted={isRetracted} />
        )}
      </svg>
    </div>
  )
}

export type SurfaceCountryTagsProps = {
  typology: SurfaceTypologyDetail
}

/** Prevalent-country tags shared by typology cards and world-impl surfaces list. */
export function SurfaceCountryTags({ typology }: SurfaceCountryTagsProps) {
  const tPv = useTranslations("balconyPv")
  if (typology.prevalentCountries.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {typology.prevalentCountries.map((country) => (
        <Badge
          key={country.code}
          variant="outline"
          className="rounded-md border border-slate-700/50 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-700"
        >
          {country.code} {tPv(country.nameKey)}
        </Badge>
      ))}
    </div>
  )
}

export type SurfaceMountJobBadgesProps = {
  typology: SurfaceTypologyDetail
}

/** Mount-method + de-shimai badges for install-job support. */
export function SurfaceMountJobBadges({ typology }: SurfaceMountJobBadgesProps) {
  const tPv = useTranslations("balconyPv")
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {typology.mountOptions.map((opt) => (
        <Badge
          key={opt.mountMethod}
          variant="secondary"
          className="rounded-md border border-slate-700/60 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300"
        >
          🔧 {tPv(opt.labelKey)}
        </Badge>
      ))}
      <Badge
        variant="outline"
        className={
          typology.requiresDeShimai
            ? "rounded-md border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300"
            : "rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400"
        }
      >
        {typology.requiresDeShimai
          ? `🍃 ${tPv("mount.deshimai_required")}`
          : tPv("mount.deshimai_optional")}
      </Badge>
    </div>
  )
}

export type SurfaceTypologyCardProps = {
  typology: SurfaceTypologyDetail
  selected?: boolean
  onSelect?: (id: SurfaceTypology) => void
  /** Reverse link: open a panel typology card. */
  onNavigateToCell?: (cellId: SolarCellTypeId) => void
  highlightCellId?: SolarCellTypeId | null
}

/** Single typology-first catalog card (title = pure form geometry, not country). */
export function SurfaceTypologyCard({
  typology,
  selected,
  onSelect,
  onNavigateToCell,
  highlightCellId = null,
}: SurfaceTypologyCardProps) {
  const t = useTranslations("balconyPv.typologies")
  const defaultMode = resolveDefaultTiltMode(typology)
  const tiltOption = getPanelTiltOption(defaultMode)
  const tiltDeg = tiltOption.tiltDeg
  const tiltLabel = `${tiltDeg}°`
  const opticalLabel = t(`opticalProfile.${typology.opticalProfile}`)
  const panelLinks = getSolarCellTypesForSurface(typology.id)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(typology.id)}
      className={`group flex w-full flex-col overflow-hidden rounded-xl border text-left transition-colors ${
        selected
          ? "border-emerald-500/60 bg-slate-900/70 ring-1 ring-emerald-500/40"
          : "border-slate-800/80 bg-slate-900/70 hover:border-emerald-500/40"
      }`}
    >
      <div className="relative">
        <BalconyIllustration
          direction="south"
          railing="grid"
          hour={12.5}
          typologyId={typology.id}
          tiltDeg={tiltDeg}
          isRetracted={defaultMode === "retracted"}
        />
        <div className="pointer-events-none absolute right-2 top-2 flex flex-col items-end gap-1">
          <span className="rounded-md border border-slate-700/50 bg-slate-900/90 px-2 py-0.5 font-mono text-xs text-slate-200">
            {tiltLabel}
          </span>
          <span className="rounded-md border border-slate-700/50 bg-slate-900/90 px-2 py-0.5 text-xs text-slate-400">
            {opticalLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-slate-100">
            {t(`${typology.id}.name`)}
          </h3>
          <div className="shrink-0 text-right font-mono text-xs leading-tight text-slate-400">
            <div>{tiltLabel}</div>
            <div>{opticalLabel}</div>
          </div>
        </div>

        <SurfaceCountryTags typology={typology} />

        {panelLinks.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {panelLinks.map((cell) => (
              <span
                key={cell.id}
                role="link"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigateToCell?.(cell.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    e.stopPropagation()
                    onNavigateToCell?.(cell.id)
                  }
                }}
                className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                  highlightCellId === cell.id
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                    : "border-slate-700/50 bg-slate-800 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-700"
                }`}
              >
                {cell.categoryBadgeJa}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300">
            {t(`category.${typology.category}`)}
          </span>
          {typology.typicalRegions.map((region) => (
            <span
              key={region}
              className="rounded-md border border-slate-700/60 bg-slate-800/80 px-3 py-1 text-xs text-slate-300"
            >
              {t(`regions.${region}`)}
            </span>
          ))}
        </div>

        <SurfaceMountJobBadges typology={typology} />

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
          {t(`${typology.id}.constraints`)}
        </p>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
          {t(`${typology.id}.regionContext`)}
        </p>

        <p className="text-xs text-slate-400">{t("orbitHint")}</p>
      </div>
    </button>
  )
}

/** セル／パネル4大タイポロジーの2Dプレビュー（ETFEハトメ・折り紙など） */
export type CellTypologyPreviewProps = {
  cellType:
    | 'rigid_silicon'
    | 'bipv_thin_film'
    | 'etfe_flexible_silicon'
    | 'origami_perovskite'
  className?: string
}

export function CellTypologyPreview({ cellType, className }: CellTypologyPreviewProps) {
  return (
    <svg
      viewBox="0 0 160 100"
      className={className ?? 'h-full w-full'}
      role="img"
      aria-hidden
    >
      <rect x="0" y="0" width="160" height="100" fill="var(--color-slate-950)" opacity="0.85" />
      {cellType === 'rigid_silicon' && (
        <g>
          <rect x="28" y="18" width="104" height="64" rx="3" fill="#94a3b8" opacity="0.9" />
          <rect x="34" y="24" width="92" height="52" fill="#1e40af" opacity="0.95" />
          {[0, 1, 2, 3].map((c) => (
            <line
              key={c}
              x1={42 + c * 20}
              y1="26"
              x2={42 + c * 20}
              y2="74"
              stroke="#e2e8f0"
              strokeWidth="1.5"
              opacity="0.7"
            />
          ))}
          <rect x="28" y="18" width="104" height="8" fill="#cbd5e1" />
          <rect x="28" y="74" width="104" height="8" fill="#cbd5e1" />
        </g>
      )}
      {cellType === 'bipv_thin_film' && (
        <g>
          <rect
            x="30"
            y="22"
            width="100"
            height="56"
            rx="1"
            fill="#0f172a"
            stroke="#cbd5e1"
            strokeWidth="2"
            opacity="0.95"
          />
          <rect x="34" y="26" width="92" height="48" fill="#1e293b" opacity="0.8" />
          <line x1="30" y1="50" x2="130" y2="50" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.35" />
        </g>
      )}
      {cellType === 'etfe_flexible_silicon' && (
        <g>
          {/* Thin ETFE plate */}
          <rect x="32" y="28" width="96" height="44" rx="2" fill="#64748b" opacity="0.55" />
          <rect x="36" y="32" width="88" height="36" rx="1" fill="#1d4ed8" opacity="0.85" />
          {/* Grommets (ハトメ) at corners */}
          {[
            [38, 34],
            [122, 34],
            [38, 66],
            [122, 66],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="4.5" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="1.8" fill="#0f172a" />
            </g>
          ))}
          {/* Soft edge curl */}
          <path
            d="M36 68 Q80 76 124 68"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            opacity="0.7"
          />
        </g>
      )}
      {cellType === 'origami_perovskite' && (
        <g>
          {/* Rigid origami fold — center + angled wings */}
          <polygon
            points="80,22 80,78 52,70 52,30"
            fill="#10b981"
            opacity="0.9"
          />
          <polygon
            points="80,22 80,78 108,70 108,30"
            fill="#34d399"
            opacity="0.85"
          />
          <polygon
            points="52,30 28,38 28,62 52,70"
            fill="#059669"
            opacity="0.8"
          />
          <polygon
            points="108,30 132,38 132,62 108,70"
            fill="#047857"
            opacity="0.75"
          />
          <line x1="80" y1="22" x2="80" y2="78" stroke="#94a3b8" strokeWidth="1.2" opacity="0.8" />
        </g>
      )}
    </svg>
  )
}

export type CellTypologyCatalogProps = {
  cells: SolarCellTypeDetail[]
  selectedId?: SolarCellTypeId | null
  onSelect?: (id: SolarCellTypeId | null) => void
  onNavigateToSurface?: (surfaceId: SurfaceTypology) => void
  onNavigateToCountry?: (code: string) => void
}

type CellDetailAngle = 0 | 30 | 90
type CellDetailTab = "physics" | "architecture" | "history"

function TradeoffMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <span className="font-mono text-sm tabular-nums text-emerald-400">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width]"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}

/** 太陽光パネル（セル）一覧 + 詳細（3D + 開閉サイドバー）。 */
export function CellTypologyCatalog({
  cells,
  selectedId = null,
  onSelect,
  onNavigateToSurface,
  onNavigateToCountry,
}: CellTypologyCatalogProps) {
  const locale = useLocale()
  const isEn = locale === "en"
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [viewAngle, setViewAngle] = useState<CellDetailAngle>(0)
  const [detailTab, setDetailTab] = useState<CellDetailTab>("physics")

  const selected = selectedId
    ? cells.find((c) => c.id === selectedId) ?? null
    : null

  if (selected) {
    const title = isEn ? selected.roleTitleEn : selected.roleTitleJa
    const subtitle = isEn ? selected.roleSubtitleEn : selected.roleSubtitleJa
    const angleLabel = isEn
      ? selected.viewAngleLabelsEn[[0, 30, 90].indexOf(viewAngle)]
      : selected.viewAngleLabels[[0, 30, 90].indexOf(viewAngle)]

    return (
      <section className="flex min-h-[28rem] flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/70">
        <header className="flex items-start gap-3 border-b border-slate-800 px-5 py-4">
          <button
            type="button"
            onClick={() => onSelect?.(null)}
            className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-slate-200 transition-colors hover:border-emerald-500/50 hover:bg-slate-700"
            aria-label={isEn ? "Back to list" : "一覧へ戻る"}
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold leading-snug text-slate-100">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {isEn
                ? `Drag to orbit · view ${viewAngle}° — ${angleLabel}`
                : `ドラッグで周回 · 観察 ${viewAngle}° — ${angleLabel}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-slate-200 transition-colors hover:border-emerald-500/50 hover:bg-slate-700"
            aria-label={sidebarOpen ? (isEn ? "Collapse sidebar" : "サイドバーを閉じる") : (isEn ? "Expand sidebar" : "サイドバーを開く")}
          >
            {sidebarOpen ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="relative flex min-h-[16rem] flex-1 items-center justify-center bg-slate-950/50 p-5">
            <div
              className="h-56 w-full max-w-md transition-transform duration-300"
              style={{
                transform: `perspective(800px) rotateX(${viewAngle === 90 ? 72 : viewAngle === 30 ? 28 : 0}deg) rotateY(${viewAngle === 0 ? 0 : viewAngle === 30 ? -18 : -8}deg)`,
              }}
            >
              <CellTypologyPreview cellType={selected.id} className="h-full w-full rounded-xl" />
            </div>
          </div>

          {sidebarOpen ? (
            <aside className="flex w-full shrink-0 flex-col gap-5 border-t border-slate-800 bg-slate-950/40 p-5 lg:w-80 lg:border-l lg:border-t-0">
              <div className="space-y-2">
                <p className="text-sm font-semibold tracking-tight text-slate-100">
                  {isEn ? "Observation angle" : "観察角度"}
                </p>
                <ToggleGroup
                  value={[String(viewAngle)]}
                  onValueChange={(v) => {
                    const next = Number(v[0])
                    if (next === 0 || next === 30 || next === 90) setViewAngle(next)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  {([0, 30, 90] as const).map((deg) => (
                    <ToggleGroupItem
                      key={deg}
                      value={String(deg)}
                      className="flex-1 px-2 py-1.5 font-mono text-sm font-medium text-slate-200"
                    >
                      {deg}°
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold tracking-tight text-slate-100">
                  {isEn ? "Trade-off intuition meter" : "トレードオフ直感メーター"}
                </p>
                <TradeoffMeter
                  label={isEn ? "Peak generation" : "ピーク発電力"}
                  value={selected.peakPowerScore}
                />
                <TradeoffMeter
                  label={isEn ? "Living / egress fit" : "生活・避難動線適応"}
                  value={selected.egressClearanceScore}
                />
              </div>

              <Tabs
                value={detailTab}
                onValueChange={(v) => {
                  if (v === "physics" || v === "architecture" || v === "history") {
                    setDetailTab(v)
                  }
                }}
                className="flex min-h-0 flex-1 flex-col gap-3"
              >
                <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
                  <TabsTrigger value="physics" className="px-2.5 py-1 text-sm">
                    {isEn ? "Physics / cell" : "物性・セル構造"}
                  </TabsTrigger>
                  <TabsTrigger value="architecture" className="px-2.5 py-1 text-sm">
                    {isEn ? "Built form" : "適した建築形態"}
                  </TabsTrigger>
                  <TabsTrigger value="history" className="px-2.5 py-1 text-sm">
                    {isEn ? "History" : "開発史・背景"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="physics" className="mt-0 space-y-2 text-sm leading-relaxed text-slate-400">
                  <p>{isEn ? selected.cellStructureEn : selected.cellStructureJa}</p>
                  <p className="font-mono text-xs text-slate-200">
                    {isEn ? selected.weightThicknessEn : selected.weightThicknessJa}
                  </p>
                  <p>{isEn ? selected.lightAbsorptionEn : selected.lightAbsorptionJa}</p>
                  <p>{isEn ? selected.environmentalFitEn : selected.environmentalFitJa}</p>
                </TabsContent>
                <TabsContent value="architecture" className="mt-0 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {selected.suitableSurfaceLabels.map((surf) => (
                      <button
                        key={surf.id}
                        type="button"
                        onClick={() => onNavigateToSurface?.(surf.id as SurfaceTypology)}
                        className="rounded-md border border-slate-700/50 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-700"
                      >
                        {surf.labelJa}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {isEn ? selected.useCaseEn : selected.useCaseJa}
                  </p>
                </TabsContent>
                <TabsContent value="history" className="mt-0 space-y-2 text-sm leading-relaxed text-slate-400">
                  <p className="font-medium text-slate-200">
                    {isEn ? selected.generationShortEn : selected.generationShortJa}
                  </p>
                  <p>{isEn ? selected.descriptionEn : selected.descriptionJa}</p>
                  <p>{isEn ? selected.firedElementEn : selected.firedElementJa}</p>
                </TabsContent>
              </Tabs>
            </aside>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">
          {isEn ? "Solar panel (cell) types" : "太陽光パネル（セル）の種類"}
        </h2>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cells.map((cell) => (
          <button
            key={cell.id}
            type="button"
            onClick={() => onSelect?.(cell.id)}
            className={`flex flex-col gap-3 rounded-xl border p-5 text-left transition-colors ${
              selectedId === cell.id
                ? "border-emerald-500/60 bg-slate-900/70 ring-1 ring-emerald-500/40"
                : "border-slate-800/80 bg-slate-900/70 hover:border-emerald-500/40"
            }`}
          >
            <h3 className="text-base font-semibold text-slate-100">
              {isEn ? cell.roleTitleEn : cell.roleTitleJa}
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {isEn ? cell.roleSubtitleEn : cell.roleSubtitleJa}
            </p>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-200">
                {isEn ? "Suitable 3D surfaces" : "適した3Dサーフェイス"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cell.suitableSurfaceLabels.map((surf) => (
                  <span
                    key={surf.id}
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigateToSurface?.(surf.id as SurfaceTypology)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.stopPropagation()
                        onNavigateToSurface?.(surf.id as SurfaceTypology)
                      }
                    }}
                    className="rounded-md border border-slate-700/50 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-700"
                  >
                    {surf.labelJa}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-200">
                {isEn ? "Key countries" : "主な実装国"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cell.representativeCountryCodes.map((code) => (
                  <span
                    key={code}
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigateToCountry?.(code)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.stopPropagation()
                        onNavigateToCountry?.(code)
                      }
                    }}
                    className="rounded-md border border-slate-700/50 bg-slate-800 px-3 py-1 font-mono text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-700"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export type SurfaceTypologyCatalogProps = {
  selectedId?: SurfaceTypology
  onSelect?: (id: SurfaceTypology) => void
  categoryFilter?: SurfaceCategoryFilter
  onNavigateToCell?: (cellId: SolarCellTypeId) => void
  highlightCellId?: SolarCellTypeId | null
}

/** Deduplicate master rows by typology id (guards against accidental double registration). */
function uniqueSurfaceTypologies(
  rows: readonly SurfaceTypologyDetail[],
): SurfaceTypologyDetail[] {
  const seen = new Set<string>()
  const out: SurfaceTypologyDetail[] = []
  for (const row of rows) {
    if (seen.has(row.id)) continue
    seen.add(row.id)
    out.push(row)
  }
  return out
}

/** Typology-first 3D surface / architecture list (replaces country-led cards). */
export function SurfaceTypologyCatalog({
  selectedId,
  onSelect,
  categoryFilter = "all",
  onNavigateToCell,
  highlightCellId = null,
}: SurfaceTypologyCatalogProps) {
  const t = useTranslations("balconyPv.typologies")
  const tFilter = useTranslations("balconyPv.filter")
  const [activeFilter, setActiveFilter] = useState<SurfaceCategoryFilter>(categoryFilter)

  const catalog = uniqueSurfaceTypologies(SURFACE_TYPOLOGIES)
  const allCount = catalog.length
  const balconyCount = catalog.filter((item) => item.category === "balcony").length
  const roofCount = catalog.filter((item) => item.category === "roof").length

  const items = catalog.filter(
    (item) => activeFilter === "all" || item.category === activeFilter,
  )

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{t("listTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("listLead")}</p>
      </header>

      <Tabs
        value={activeFilter}
        onValueChange={(value) => {
          if (value === "all" || value === "balcony" || value === "roof") {
            setActiveFilter(value)
          }
        }}
      >
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 sm:w-fit">
          <TabsTrigger value="all" className="px-3 py-1.5 text-sm font-medium">
            {tFilter("all")} ({allCount})
          </TabsTrigger>
          <TabsTrigger value="balcony" className="px-3 py-1.5 text-sm font-medium">
            {tFilter("balcony")} ({balconyCount})
          </TabsTrigger>
          <TabsTrigger value="roof" className="px-3 py-1.5 text-sm font-medium">
            {tFilter("roof")} ({roofCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((typology) => (
          <SurfaceTypologyCard
            key={typology.id}
            typology={typology}
            selected={selectedId === typology.id}
            onSelect={onSelect}
            onNavigateToCell={onNavigateToCell}
            highlightCellId={highlightCellId}
          />
        ))}
      </div>
    </section>
  )
}
