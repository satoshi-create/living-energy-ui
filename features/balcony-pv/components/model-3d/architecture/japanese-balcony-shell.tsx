'use client'

import { JAPANESE_BALCONY_DIMS } from '../constants/dimensions'

/** 日本式避難バルコニーの静的躯体（外壁・サッシ・物干し・床・排水溝）。 */
export function JapaneseBalconyShell() {
  return (
    <>
      {/* 1. 外壁（RC躯体＋サッシ枠ライン） */}
      <mesh position={[0, 1.1, -0.78]}>
        <boxGeometry args={[2.8, 2.2, 0.16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.88} />
      </mesh>
      {/* 掃き出し窓サッシ枠 */}
      <mesh position={[-0.2, 1.05, -0.69]}>
        <boxGeometry args={[1.8, 1.9, 0.04]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 複層ガラス */}
      <mesh position={[-0.2, 1.05, -0.67]}>
        <boxGeometry args={[1.68, 1.78, 0.01]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.1} transparent opacity={0.45} />
      </mesh>

      {/* 壁付け物干し金物（ホスクリーン型アーム：左右2基 ＋ SUS物干し竿） */}
      <group position={[0, 0, -0.68]}>
        {[-1.2, 0.85].map((x, i) => (
          <group key={`dryer-arm-${i}`} position={[x, 1.55, 0]}>
            <mesh position={[0, 0, 0.015]}>
              <boxGeometry args={[0.05, 0.3, 0.03]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
            <group position={[0, 0.08, 0.03]} rotation={[0.6, 0, 0]}>
              <mesh position={[0, 0, 0.28]}>
                <boxGeometry args={[0.025, 0.04, 0.55]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.52]}>
                <boxGeometry args={[0.03, 0.07, 0.05]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          </group>
        ))}

        <mesh position={[-0.18, 1.33, 0.46]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.2, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 2. 床コンクリートスラブ（厚み150mm・長尺塩ビシート仕上げ） */}
      <mesh position={[0, -JAPANESE_BALCONY_DIMS.slab.thickness / 2, 0]}>
        <boxGeometry
          args={[
            JAPANESE_BALCONY_DIMS.slab.width,
            JAPANESE_BALCONY_DIMS.slab.thickness,
            JAPANESE_BALCONY_DIMS.slab.depth,
          ]}
        />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>

      {/* 3. 排水側溝（手すり側の一段下がった水抜き溝） */}
      <mesh position={[0, -0.005, 0.65]}>
        <boxGeometry args={[2.8, 0.015, 0.14]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
    </>
  )
}
