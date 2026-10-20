'use client'

import { FLAT_ROOF_DIMS } from '../constants/dimensions'

/** 屋上パーゴラ風自立架台（木調耐候フレーム＋柱脚金物）。 */
export function FlatRoofPergola() {
  const { slab, pergola } = FLAT_ROOF_DIMS
  const baseY = slab.topY
  const postH = pergola.postH
  const postCenterY = baseY + postH / 2
  const beamY = baseY + postH + 0.04
  const rafterY = beamY + 0.07

  // パーゴラ設置位置（やや西側に配置し、ペントハウスとの動線を確保）
  const originX = -0.3
  const originZ = 0.1

  return (
    <group position={[originX, 0, originZ]}>
      {/* 支柱 4本 ＋ 柱脚アンカープレート */}
      {[-0.65, 0.65].map((x) =>
        [-0.5, 0.5].map((z) => (
          <group key={`post-assembly-${x}-${z}`}>
            {/* 柱脚アンカー金物（金属ベース） */}
            <mesh position={[x, baseY + 0.015, z]}>
              <boxGeometry args={[0.11, 0.03, 0.11]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* 木製柱 */}
            <mesh position={[x, postCenterY, z]}>
              <boxGeometry args={[0.08, postH, 0.08]} />
              <meshStandardMaterial color="#544432" roughness={0.7} />
            </mesh>
          </group>
        )),
      )}

      {/* 桁（X方向の主梁 2本） */}
      {[-0.5, 0.5].map((z) => (
        <mesh key={`beam-x-${z}`} position={[0, beamY, z]}>
          <boxGeometry args={[1.5, 0.08, 0.08]} />
          <meshStandardMaterial color="#423424" roughness={0.75} />
        </mesh>
      ))}

      {/* 垂木（Z方向の副梁 3本：パネル傾斜角に合わせて南面10°勾配） */}
      <group position={[0, rafterY, 0]} rotation={[ (pergola.tiltDeg * Math.PI) / 180, 0, 0 ]}>
        {[-0.55, 0, 0.55].map((x) => (
          <mesh key={`beam-z-${x}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.06, 0.06, 1.3]} />
            <meshStandardMaterial color="#423424" roughness={0.75} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** フラット屋根上の太陽光パネル（垂木上に架台レールで南向き10°傾斜設置）。 */
export function FlatRoofPanel() {
  const { slab, pergola } = FLAT_ROOF_DIMS
  const originX = -0.3
  const originZ = 0.1

  // 垂木天端高さ
  const rafterTopY = slab.topY + pergola.postH + 0.08 + 0.06
  const tiltRad = (pergola.tiltDeg * Math.PI) / 180

  return (
    <group position={[originX, rafterTopY + 0.02, originZ]} rotation={[tiltRad, 0, 0]}>
      {/* アルミニウム架台レール */}
      {[-0.45, 0.45].map((x) => (
        <mesh key={`mount-rail-${x}`} position={[x, 0.01, 0]}>
          <boxGeometry args={[0.04, 0.025, 1.15]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}

      {/* パネル外枠フレーム */}
      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[1.44, 0.035, 1.14]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 単結晶受光セル面 */}
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[1.38, 0.018, 1.08]} />
        <meshStandardMaterial color="#0c121e" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  )
}
