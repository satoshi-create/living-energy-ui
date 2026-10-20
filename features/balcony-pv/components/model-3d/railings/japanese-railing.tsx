'use client'

import { JAPANESE_BALCONY_DIMS } from '../constants/dimensions'
import { MATERIALS } from '../constants/materials'

/** JIS準拠 アルミ手すり（天端H=1,100mm・ピッチ115mm格子）。 */
export function JapaneseRailing() {
  const { height, z, balusterPitch, postXs } = JAPANESE_BALCONY_DIMS.railing

  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[2.8, 0.04, 0.08]} />
        <meshStandardMaterial {...MATERIALS.aluminiumRail} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[2.8, 0.03, 0.03]} />
        <meshStandardMaterial {...MATERIALS.galvanizedSteel} />
      </mesh>
      {postXs.map((x, i) => (
        <mesh key={`post-${i}`} position={[x, 0.55, 0]}>
          <boxGeometry args={[0.04, height, 0.04]} />
          <meshStandardMaterial {...MATERIALS.galvanizedSteel} />
        </mesh>
      ))}
      {Array.from({ length: 23 }).map((_, i) => {
        const x = -1.26 + i * balusterPitch
        if (Math.abs(x - -0.42) < 0.05 || Math.abs(x - 0.42) < 0.05) return null
        return (
          <mesh key={`baluster-${i}`} position={[x, 0.61, 0]}>
            <boxGeometry args={[0.014, 0.95, 0.014]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.35} />
          </mesh>
        )
      })}
    </group>
  )
}
