'use client'

import { ETFE_PANEL_DIMS } from '../constants/dimensions'

/** ETFEフレキシブル：薄型プレート＋四隅ハトメ固定メタファー。 */
export function EtfeFlexiblePanel() {
  const { width: w, height: h, thickness, grommetR, cellW: cw, cellH: ch, gap } =
    ETFE_PANEL_DIMS

  const grommetPositions: [number, number, number][] = [
    [-w / 2 + 0.08, h / 2 - 0.08, thickness / 2 + 0.004],
    [w / 2 - 0.08, h / 2 - 0.08, thickness / 2 + 0.004],
    [-w / 2 + 0.08, -h / 2 + 0.08, thickness / 2 + 0.004],
    [w / 2 - 0.08, -h / 2 + 0.08, thickness / 2 + 0.004],
  ]

  return (
    <group>
      {/* ETFE fluoropolymer sheet — thin translucent shell; cells face +Z. */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, thickness]} />
        <meshPhysicalMaterial
          color="#94a3b8"
          roughness={0.35}
          metalness={0.05}
          transmission={0.35}
          thickness={0.2}
          transparent
          opacity={0.88}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {/* Mono-Si cell lattice under the sheet (toward camera / +Z) */}
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => {
          const x = -((5 - 1) * (cw + gap)) / 2 + c * (cw + gap)
          const y = ((3 - 1) * (ch + gap)) / 2 - r * (ch + gap)
          return (
            <mesh key={`${r}-${c}`} position={[x, y, 0.002]} castShadow>
              <boxGeometry args={[cw, ch, 0.006]} />
              <meshStandardMaterial
                color="#1d4ed8"
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
          )
        }),
      )}
      {/* Corner grommets (ハトメ) */}
      {grommetPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <torusGeometry args={[grommetR, 0.006, 8, 24]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh>
            <circleGeometry args={[grommetR * 0.55, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
      {/* Soft curl hint — sheet edge lift */}
      <mesh position={[0, -h / 2 + 0.02, 0.01]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[w * 0.92, 0.04, 0.004]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.1}
          roughness={0.45}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}
