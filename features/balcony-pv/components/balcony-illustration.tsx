import { cn } from "@/lib/utils"
import type { Direction, RailingType } from "../data"

const DIRECTION_ROTATION: Record<Direction, number> = {
  南: 0,
  南東: -18,
  南西: 18,
  東: -34,
  西: 34,
}

export function BalconyIllustration({
  direction,
  railing,
  hour,
}: {
  direction: Direction
  railing: RailingType
  hour: number
}) {
  // hour ranges 8-17. Map to sun arc position: t=0 at 8:00, t=1 at 17:00.
  const t = (hour - 8) / 9
  const sunX = 20 + t * 260
  // Elevation peaks at solar noon (t ~ 0.5).
  const elevation = Math.sin(t * Math.PI)
  const sunY = 130 - elevation * 95
  // Longer shadows at low elevation.
  const shadowLength = 10 + (1 - elevation) * 70
  const rotation = DIRECTION_ROTATION[direction]

  const railingOpacity = railing === "concrete" ? 0.9 : railing === "grid" ? 0.55 : 0.2

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-muted/40 to-background">
      <svg viewBox="0 0 300 200" className="h-56 w-full" role="img" aria-label="ベランダの日照シミュレーション">
        {/* sky */}
        <rect x="0" y="0" width="300" height="140" fill="var(--color-muted)" opacity="0.5" />
        {/* sun path arc guide */}
        <path d="M 20 130 Q 150 20 280 130" fill="none" stroke="var(--color-border)" strokeDasharray="3 4" />
        {/* sun */}
        <circle cx={sunX} cy={sunY} r="10" fill="var(--color-primary)" opacity="0.9" />
        <circle cx={sunX} cy={sunY} r="18" fill="var(--color-primary)" opacity="0.18" />

        {/* floor */}
        <rect x="0" y="140" width="300" height="60" fill="var(--color-card)" />
        {/* solar panel on floor */}
        <g transform={`rotate(${rotation} 150 168)`}>
          <rect x="105" y="158" width="90" height="20" rx="3" fill="var(--color-primary)" opacity="0.85" />
          <line x1="120" y1="158" x2="120" y2="178" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
          <line x1="135" y1="158" x2="135" y2="178" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
          <line x1="150" y1="158" x2="150" y2="178" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
          <line x1="165" y1="158" x2="165" y2="178" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
          <line x1="180" y1="158" x2="180" y2="178" stroke="var(--color-background)" strokeWidth="1" opacity="0.4" />
        </g>

        {/* railing */}
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
          {railing === "concrete" && <rect x="0" y="110" width="300" height="28" fill="var(--color-foreground)" opacity="0.55" />}
        </g>

        {/* cast shadow from railing onto floor, length reacts to sun elevation */}
        <rect
          x="0"
          y="140"
          width="300"
          height={Math.min(58, shadowLength)}
          fill="var(--color-foreground)"
          opacity={railingOpacity * 0.35}
        />
      </svg>
    </div>
  )
}
