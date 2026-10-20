'use client'

import { JAPANESE_BALCONY_DIMS } from '../constants/dimensions'

/** 隔て板・避難ハッチ・室外機・避難動線ガイド。 */
export function JapaneseBalconyFixtures() {
  return (
    <>
      {/* 5. 隔て板（蹴破り戸：アルミ枠＋シースルー半透明パネル＋避難標示） */}
      <group position={[1.36, 0.85, -0.05]}>
        {/* アルミ外枠（輪郭を維持） */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 1.7, 1.45]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
        {/* ケイカル板メイン面（奥の配線・室外機が見えるよう半透明化） */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.015, 1.62, 1.37]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.8}
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
        {/* 避難ステッカー枠（アクセントとして視認維持） */}
        <mesh position={[-0.01, 0.1, 0]}>
          <boxGeometry args={[0.002, 0.2, 0.42]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.5}
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 6. 避難ハッチ金物（SUS製 600角：外枠段差・蓋天板・格納式取っ手・ラッチ部） */}
      <group position={[0.75, 0, 0.2]}>
        <mesh position={[0, 0.004, 0]}>
          <boxGeometry args={[0.62, 0.008, 0.62]} />
          <meshStandardMaterial color="#64748b" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.009, 0]}>
          <boxGeometry args={[0.58, 0.004, 0.58]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.55, 0.004, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.0145, 0.16]}>
          <boxGeometry args={[0.12, 0.002, 0.05]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.016, 0.16]}>
          <boxGeometry args={[0.08, 0.003, 0.012]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.015, -0.18]}>
          <boxGeometry args={[0.06, 0.003, 0.03]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.0145, -0.02]}>
          <boxGeometry args={[0.22, 0.001, 0.1]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
      </group>

      {/* 7. エアコン室外機＋据付架台＋配管化粧カバー */}
      <group position={[0.88, 0, -0.48]}>
        {[-0.26, 0.26].map((x, i) => (
          <mesh key={`cu-base-${i}`} position={[x, 0.04, 0]}>
            <boxGeometry args={[0.12, 0.08, 0.38]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[0.78, 0.56, 0.3]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.45} />
        </mesh>
        <mesh position={[-0.1, 0.36, 0.155]}>
          <cylinderGeometry args={[0.19, 0.19, 0.01, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.1, 0.36, 0.16]}>
          <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.395, 0.28, -0.02]}>
          <boxGeometry args={[0.03, 0.22, 0.12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.34, 1.15, -0.2]}>
          <boxGeometry args={[0.075, 1.3, 0.065]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </mesh>
        <mesh position={[0.34, 0.45, -0.1]}>
          <boxGeometry args={[0.07, 0.12, 0.14]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
      </group>

      {/* 8. 消防避難動線（60cm幅クリアライン床面ガイド） */}
      <mesh position={[0.42, 0.002, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[JAPANESE_BALCONY_DIMS.egress.width, JAPANESE_BALCONY_DIMS.egress.depth]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
      </mesh>
    </>
  )
}
