'use client'

import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { CELL_EGRESS_Y } from '../constants/dimensions'

/** 生活スケール基準：消防避難通路幅 60cm（0.6m）の半透明ガイドライン。 */
export function EgressPathwayGuide() {
  /** 幅0.6m × 奥行き1.8m の破線長方形 */
  const rectPoints: [number, number, number][] = [
    [-0.3, 0.025, -0.9],
    [0.3, 0.025, -0.9],
    [0.3, 0.025, 0.9],
    [-0.3, 0.025, 0.9],
    [-0.3, 0.025, -0.9],
  ]

  return (
    <group position={[0, CELL_EGRESS_Y, 0]}>
      {/* 半透明リング：幅0.6mの物差し */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.28, 0.32, 48]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Line
        points={rectPoints}
        color="#3b82f6"
        dashed
        dashSize={0.08}
        gapSize={0.05}
        transparent
        opacity={0.45}
        lineWidth={1.5}
      />
    </group>
  )
}
