'use client'

import { useLocale } from 'next-intl'
import { LabelSprite } from '../scene/label-sprite'

/** ドイツ式コンクリートバルコニーの部位解説アノテーション。 */
export function ConcreteParapetAnnotations() {
  const isEn = useLocale() === 'en'

  return (
    <>
      {/* ① ソーラーパネル */}
      <group position={[0, 0.88, 0.95]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <LabelSprite
          badge="1"
          text={isEn ? 'Solar Panels' : '太陽光パネル'}
          subText={isEn ? 'Solar Generation (DC)' : '太陽光で発電（DC）'}
          accentColor="#10b981"
          position={[0, 0.15, 0]}
          scale={isEn ? [0.92, 0.25, 1] : [0.82, 0.25, 1]}
        />
      </group>

      {/* ② マイクロインバータ */}
      <group position={[-0.35, 1.02, -0.66]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <LabelSprite
          badge="2"
          text={isEn ? 'Microinverter' : 'インバータ'}
          subText={isEn ? 'Household Conversion (AC)' : '家庭用に変換（AC）'}
          accentColor="#38bdf8"
          position={[0, 0.15, 0]}
          scale={isEn ? [0.96, 0.25, 1] : [0.82, 0.25, 1]}
        />
      </group>

      {/* ④ 壁コンセント直挿し（Plug & Play） */}
      <group position={[0.55, 0.45, -0.62]}>
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
          text={isEn ? 'Wall Outlet Plug-in' : '壁コンセント直挿し'}
          subText={isEn ? 'Plug & Play Feed-in' : '部屋へ給電（工事不要）'}
          accentColor="#10b981"
          position={[0, 0.08, 0.02]}
          scale={isEn ? [0.96, 0.25, 1] : [0.82, 0.24, 1]}
        />
      </group>
    </>
  )
}
