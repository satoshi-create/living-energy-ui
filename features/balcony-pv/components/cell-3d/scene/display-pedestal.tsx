'use client'

import { CELL_PEDESTAL_Y } from '../constants/dimensions'

/** セル模型を載せる円形表示台座。 */
export function DisplayPedestal() {
  return (
    <group position={[0, CELL_PEDESTAL_Y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#252a36" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[4.2, 5, 64]} />
        <meshStandardMaterial
          color="#2a3142"
          metalness={0.25}
          roughness={0.7}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}
