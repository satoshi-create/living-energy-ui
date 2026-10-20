'use client'

import { useLayoutEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import {
  CELL_CAMERA_BY_ANGLE,
  CELL_CAMERA_TARGET,
  type CellViewAngle,
} from '../constants/camera'

/** 観察角度プリセットに応じてカメラ位置を固定する。 */
export function CameraFraming({
  viewAngle,
  interactive,
}: {
  viewAngle: CellViewAngle
  interactive: boolean
}) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    const { position } = CELL_CAMERA_BY_ANGLE[viewAngle]
    camera.position.set(...position)
    camera.lookAt(...CELL_CAMERA_TARGET)
    camera.updateProjectionMatrix()
  }, [viewAngle, camera])

  if (!interactive) return null

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      minDistance={2.8}
      maxDistance={8}
      maxPolarAngle={Math.PI / 2.05}
      target={CELL_CAMERA_TARGET}
    />
  )
}
