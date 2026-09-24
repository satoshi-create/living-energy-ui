// Mock for balcony-plug-in-pv. Heuristic stand-in for suncalc-js-engine.

export type Direction = '南' | '南東' | '南西' | '東' | '西'
export type RailingType = 'grid' | 'glass' | 'concrete'

export const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: '南', label: '南向き' },
  { value: '南東', label: '南東' },
  { value: '南西', label: '南西' },
  { value: '東', label: '東' },
  { value: '西', label: '西' },
]

export const RAILING_TYPES: { value: RailingType; label: string }[] = [
  { value: 'grid', label: '格子スチール' },
  { value: 'glass', label: 'ガラス' },
  { value: 'concrete', label: 'コンクリート壁' },
]

// Returns a suitability score (0-100) for the balcony simulator based on
// direction, railing type, and time of day.
export function computeBalconyScore(direction: Direction, railing: RailingType, hour: number): number {
  const directionScore: Record<Direction, number> = {
    南: 100,
    南東: 88,
    南西: 88,
    東: 68,
    西: 68,
  }
  const railingScore: Record<RailingType, number> = {
    glass: 100,
    grid: 90,
    concrete: 55,
  }
  // Bell curve centered at 12:30 across an 8:00-17:00 window.
  const distanceFromNoon = Math.abs(hour - 12.5)
  const timeScore = Math.max(30, 100 - distanceFromNoon * 12)

  const raw = directionScore[direction] * 0.45 + railingScore[railing] * 0.25 + timeScore * 0.3
  return Math.round(Math.min(100, Math.max(0, raw)))
}

export function scoreLabel(score: number): string {
  if (score >= 85) return '最高適性'
  if (score >= 70) return '高適性'
  if (score >= 50) return '標準適性'
  return '要検討'
}

export function recommendedKit(score: number): { panel: string; battery: string } {
  if (score >= 85) return { panel: '100W折りたたみパネル', battery: '500Whポータブル電源' }
  if (score >= 70) return { panel: '60W折りたたみパネル', battery: '300Whポータブル電源' }
  return { panel: '30W軽量パネル', battery: '150Whモバイル電源' }
}
