'use client'

import { MathUtils } from 'three'
import { MATERIALS } from '../constants/materials'
import { usePanelTilt } from '../scene/tilt-context'

/**
 * 傾斜角・収納状態に連動する汎用パネル。
 * UK各モデルの架台に載る可変ソーラー設備。
 */
export function Panel({
  position,
  rotation,
  args = [0.55, 0.04, 0.9],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  args?: [number, number, number]
}) {
  const { tiltDeg, isRetracted } = usePanelTilt()
  const base = rotation ?? [0, 0, 0]
  const tiltRad = MathUtils.degToRad(isRetracted ? 0 : tiltDeg)
  const rotX = isRetracted ? base[0] : base[0] + (base[0] === 0 ? tiltRad : 0)
  const pos: [number, number, number] = isRetracted
    ? [position[0], Math.min(position[1], 0.22), position[2] * 0.45]
    : position
  const size: [number, number, number] = isRetracted
    ? [args[0], args[1] * 0.6, args[2] * 0.35]
    : args

  return (
    <mesh position={pos} rotation={[rotX, base[1], base[2]]} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        {...MATERIALS.pvPanel}
        opacity={isRetracted ? 0.55 : 1}
        transparent={isRetracted}
      />
    </mesh>
  )
}
