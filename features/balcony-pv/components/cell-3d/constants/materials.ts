import { DoubleSide } from 'three'

/** ペロブスカイト薄膜の共通マテリアル。 */
export const PEROVSKITE_FILM_MATERIAL = {
  color: '#10b981' as const,
  roughness: 0.25,
  metalness: 0.3,
  emissive: '#047857' as const,
  emissiveIntensity: 0.3,
  side: DoubleSide,
  transparent: true,
  opacity: 0.92,
}
