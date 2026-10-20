'use client'

import { MathUtils } from 'three'
import { usePanelTilt } from '../scene/tilt-context'

/**
 * バイオミミクリー可動ルーバーPV（生体模倣ソーラー鎧戸シャッター）。
 * 左右一対の鎧戸が傾斜角・収納状態に連動する。
 */
export function HaussmannLouverPv() {
  const { tiltDeg, isRetracted } = usePanelTilt()
  const louverTiltRad = MathUtils.degToRad(isRetracted ? 0 : Math.min(tiltDeg, 60))
  const shutterSwingRad = isRetracted ? 0.08 : 0.45

  return (
    <>
      <group position={[-0.82, 1.15, -0.58]} rotation={[0, shutterSwingRad, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.46, 1.88, 0.03]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
        </mesh>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={`louver-l-${i}`}
            position={[0, 0.72 - i * 0.24, 0.015]}
            rotation={[louverTiltRad, 0, 0]}
          >
            <boxGeometry args={[0.42, 0.18, 0.008]} />
            <meshStandardMaterial
              color="#10b981"
              metalness={0.4}
              roughness={0.3}
              opacity={isRetracted ? 0.6 : 0.95}
              transparent={isRetracted}
            />
          </mesh>
        ))}
      </group>

      <group position={[0.82, 1.15, -0.58]} rotation={[0, -shutterSwingRad, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.46, 1.88, 0.03]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
        </mesh>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={`louver-r-${i}`}
            position={[0, 0.72 - i * 0.24, 0.015]}
            rotation={[louverTiltRad, 0, 0]}
          >
            <boxGeometry args={[0.42, 0.18, 0.008]} />
            <meshStandardMaterial
              color="#10b981"
              metalness={0.4}
              roughness={0.3}
              opacity={isRetracted ? 0.6 : 0.95}
              transparent={isRetracted}
            />
          </mesh>
        ))}
      </group>
    </>
  )
}
