'use client'

import { useLocale } from 'next-intl'
import { LabelSprite } from '../scene/label-sprite'

/** パリ・バルコネットの部位解説アノテーション。 */
export function HaussmannAnnotations() {
  const isEn = useLocale() === 'en'

  return (
    <>
      <group position={[-0.78, 1.85, -0.4]}>
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
          text={isEn ? 'Adaptive Louver PV' : '可動鎧戸ルーバーPV'}
          subText={isEn ? 'Biomimetic Perovskite Shutter' : '生体模倣・ペロブスカイト'}
          accentColor="#10b981"
          position={[0, 0.14, 0]}
          scale={isEn ? [0.95, 0.25, 1] : [0.88, 0.25, 1]}
        />
      </group>

      <group position={[0.78, 0.35, -0.58]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.06, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <LabelSprite
          badge="✓"
          text={isEn ? 'Direct Feed-in' : 'サッシ枠密着配線'}
          subText={isEn ? 'No Wall Penetration' : '外壁無穿孔・室内給電'}
          accentColor="#38bdf8"
          position={[0, 0.12, 0]}
          scale={isEn ? [0.92, 0.25, 1] : [0.85, 0.25, 1]}
        />
      </group>
    </>
  )
}
