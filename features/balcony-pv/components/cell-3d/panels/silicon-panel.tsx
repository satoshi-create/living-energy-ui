'use client'

import { SILICON_PANEL_DIMS } from '../constants/dimensions'

/** Si主流：アルミフレームの頑丈さと約35mm厚の重厚感を強調。 */
export function SiliconPanel() {
  const { rows, cols, cellW, cellH, gap, frameDepth, frameBezel } =
    SILICON_PANEL_DIMS
  const panelW = cols * cellW + (cols - 1) * gap
  const panelH = rows * cellH + (rows - 1) * gap

  return (
    /* Cell face on +Z toward the default camera. */
    <group>
      {/* Aluminum frame — thick glossy structural extrusion */}
      <mesh position={[0, 0, -frameDepth / 2]} castShadow receiveShadow>
        <boxGeometry
          args={[panelW + frameBezel * 2, panelH + frameBezel * 2, frameDepth]}
        />
        <meshStandardMaterial color="#b8c0cc" metalness={0.88} roughness={0.22} />
      </mesh>
      {/* Inner frame lip — recessed channel for glass */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry
          args={[panelW + frameBezel * 1.4, panelH + frameBezel * 1.4, 0.04]}
        />
        <meshStandardMaterial color="#9aa3b2" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Backsheet */}
      <mesh position={[0, 0, -0.008]}>
        <boxGeometry args={[panelW + 0.02, panelH + 0.02, 0.024]} />
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Glass cover — subtle silicon reflection */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[panelW + 0.04, panelH + 0.04, 0.008]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.22}
        />
      </mesh>
      {/* Silicon cells + busbars */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const x = -panelW / 2 + cellW / 2 + c * (cellW + gap)
          const y = panelH / 2 - cellH / 2 - r * (cellH + gap)
          return (
            <group key={`${r}-${c}`} position={[x, y, 0.012]}>
              <mesh>
                <boxGeometry args={[cellW, cellH, 0.012]} />
                <meshStandardMaterial
                  color="#1e40af"
                  metalness={0.45}
                  roughness={0.25}
                />
              </mesh>
              {[-0.06, 0, 0.06].map((bx) => (
                <mesh key={bx} position={[bx, 0, 0.008]}>
                  <boxGeometry args={[0.012, cellH * 0.92, 0.004]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
                </mesh>
              ))}
            </group>
          )
        }),
      )}
    </group>
  )
}
