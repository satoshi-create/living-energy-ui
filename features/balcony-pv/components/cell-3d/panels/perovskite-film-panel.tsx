'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { PEROVSKITE_PANEL_DIMS } from '../constants/dimensions'
import { PEROVSKITE_FILM_MATERIAL } from '../constants/materials'

/** ペロブスカイト：1mm未満の剛体折り紙ヒンジ＋折り畳み／展開の動的変形。 */
export function PerovskiteFilmPanel({ animateFold = false }: { animateFold?: boolean }) {
  const leftWing = useRef<Group>(null)
  const rightWing = useRef<Group>(null)
  const phase = useRef(0)

  const { thickness, height: panelH, width: panelW, staticFold } = PEROVSKITE_PANEL_DIMS

  useFrame((_, delta) => {
    if (!animateFold) {
      const fold = staticFold
      if (leftWing.current) leftWing.current.rotation.y = fold
      if (rightWing.current) rightWing.current.rotation.y = -fold
      return
    }
    phase.current += delta * 0.55
    // 0 → 展開、π → 畳み：正弦で往復
    const t = (Math.sin(phase.current) + 1) / 2
    const fold = 0.08 + t * 1.15 // ~5°〜~70°
    if (leftWing.current) leftWing.current.rotation.y = fold
    if (rightWing.current) rightWing.current.rotation.y = -fold
  })

  return (
    <group>
      {/* 中央面（谷折り基準面） */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[panelW, panelH, thickness]} />
        <meshStandardMaterial {...PEROVSKITE_FILM_MATERIAL} />
      </mesh>

      {/* 左翼 — 山折りヒンジ（動的） */}
      <group ref={leftWing} position={[-panelW / 2, 0, 0]} rotation={[0, animateFold ? 0 : staticFold, 0]}>
        <mesh position={[-panelW / 2, 0, 0]} castShadow>
          <boxGeometry args={[panelW, panelH, thickness]} />
          <meshStandardMaterial {...PEROVSKITE_FILM_MATERIAL} color="#34d399" />
        </mesh>
      </group>

      {/* 右翼 — 谷折り反対側（動的） */}
      <group ref={rightWing} position={[panelW / 2, 0, 0]} rotation={[0, animateFold ? 0 : -staticFold, 0]}>
        <mesh position={[panelW / 2, 0, 0]} castShadow>
          <boxGeometry args={[panelW, panelH, thickness]} />
          <meshStandardMaterial {...PEROVSKITE_FILM_MATERIAL} color="#a78bfa" />
        </mesh>
      </group>

      {/* 折り目サポート — 極薄ヒンジライン */}
      <mesh position={[-panelW / 2, 0, 0.003]}>
        <boxGeometry args={[0.006, panelH * 0.98, 0.002]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.85}
          roughness={0.25}
          emissive="#64748b"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[panelW / 2, 0, 0.003]}>
        <boxGeometry args={[0.006, panelH * 0.98, 0.002]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.85}
          roughness={0.25}
          emissive="#64748b"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  )
}
