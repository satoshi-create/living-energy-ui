'use client'

import { useLocale } from 'next-intl'
import { LabelSprite } from '../scene/label-sprite'

/** 日本式避難バルコニーの部位解説アノテーション。 */
export function JapaneseBalconyAnnotations() {
  const isEn = useLocale() === 'en'

  return (
    <>
      {/* ① 太陽光パネル */}
      <group position={[-0.35, 0.86, 0.68]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.06, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <LabelSprite
          badge="1"
          text={isEn ? 'Solar Panel' : '太陽光パネル'}
          subText={isEn ? 'Inner-rail Manual Stow' : '手すり内側・手動退避式'}
          accentColor="#10b981"
          position={[0, 0.14, 0]}
          scale={isEn ? [0.92, 0.25, 1] : [0.85, 0.25, 1]}
        />
      </group>

      {/* ② ポータブル蓄電（一時蓄電） */}
      <group position={[-0.95, 0.42, -0.62]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.06, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <LabelSprite
          badge="2"
          text={isEn ? 'Portable Battery' : 'ポータブル蓄電'}
          subText={isEn ? 'Buffer Storage (Zero Export)' : '一時蓄電（逆潮流防止）'}
          accentColor="#38bdf8"
          position={[0, 0.14, 0]}
          scale={isEn ? [0.96, 0.25, 1] : [0.85, 0.25, 1]}
        />
      </group>

      {/* ③ 室内引き込み給電 */}
      <group position={[0.45, 0.52, -0.70]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.08, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <LabelSprite
          badge="✓"
          text={isEn ? 'Indoor Feed-in' : '室内引き込み給電'}
          subText={isEn ? 'Window Cable / Self-use' : '窓すきま配線・家電自給'}
          accentColor="#10b981"
          position={[0, 0.10, 0]}
          scale={isEn ? [0.94, 0.25, 1] : [0.88, 0.25, 1]}
        />
      </group>
    </>
  )
}
