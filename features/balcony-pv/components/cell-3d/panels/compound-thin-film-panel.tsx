'use client'

import { THIN_FILM_PANEL_DIMS } from '../constants/dimensions'

/** CdTe：フレームレス強化ガラス鏡面＋リアルなガラス切断面エッジ（シアン排除）。 */
export function CompoundThinFilmPanel() {
  const { width: w, height: h, depth, edge } = THIN_FILM_PANEL_DIMS

  return (
    <group>
      {/* 斜めスペキュラ用 DirectionalLight — 大面積ガラス表面を走らせる */}
      <directionalLight position={[3.5, 2.5, 4]} intensity={1.8} color="#f1f5f9" />
      <directionalLight position={[-2, 1.5, 2]} intensity={0.55} color="#e2e8f0" />

      {/* 本体：ガラス積層内の薄膜吸収層 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w - edge * 2, h - edge * 2, depth * 0.55]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.35} roughness={0.4} />
      </mesh>

      {/* 表面カバーガラス — 強い鏡面ハイライト（フレームレス） */}
      <mesh position={[0, 0, depth / 2 - 0.002]} castShadow>
        <boxGeometry args={[w, h, 0.01]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.04}
          metalness={0.05}
          transmission={0.15}
          thickness={0.4}
          transparent
          opacity={0.88}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* 裏面ガラス */}
      <mesh position={[0, 0, -(depth / 2 - 0.002)]}>
        <boxGeometry args={[w, h, 0.008]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ガラス切断面エッジ — 無色〜淡いグレーの断面（シアンなし） */}
      {/* 左右 */}
      <mesh position={[-(w / 2), 0, 0]}>
        <boxGeometry args={[edge, h, depth]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.18}
          metalness={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh position={[w / 2, 0, 0]}>
        <boxGeometry args={[edge, h, depth]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.18}
          metalness={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* 上下 */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, edge, depth]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, -(h / 2), 0]}>
        <boxGeometry args={[w, edge, depth]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}
