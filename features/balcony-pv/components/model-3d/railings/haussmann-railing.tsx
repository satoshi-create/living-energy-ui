'use client'

import { MATERIALS } from '../constants/materials'

/** パリ伝統の装飾鋳鉄（錬鉄ロートアイアン）手すり。 */
export function HaussmannRailing() {
  return (
    <group position={[0, 0, 0.18]}>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1.96, 0.03, 0.04]} />
        <meshStandardMaterial {...MATERIALS.darkIron} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.96, 0.02, 0.02]} />
        <meshStandardMaterial {...MATERIALS.darkIron} />
      </mesh>
      {[-0.96, 0.96].map((px, pi) => (
        <mesh key={`post-${pi}`} position={[px, 0.5, 0]}>
          <boxGeometry args={[0.04, 0.92, 0.04]} />
          <meshStandardMaterial {...MATERIALS.castIron} />
        </mesh>
      ))}
      {Array.from({ length: 11 }, (_, i) => {
        const x = -0.8 + i * 0.16
        return (
          <group key={`baluster-${i}`} position={[x, 0.5, 0]}>
            <mesh>
              <cylinderGeometry args={[0.009, 0.009, 0.86, 8]} />
              <meshStandardMaterial {...MATERIALS.darkIron} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <torusGeometry args={[0.045, 0.008, 8, 16]} />
              <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
