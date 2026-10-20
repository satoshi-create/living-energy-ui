'use client'

import { MODEL_COLORS } from '../constants/materials'

/** バルコニー／屋根モデル共通の接地円盤。 */
export function SurfaceGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <circleGeometry args={[3.2, 48]} />
      <meshStandardMaterial color={MODEL_COLORS.ground} roughness={1} />
    </mesh>
  )
}
