'use client'

import { useLayoutEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import {
  CAMERA_PRESETS_FULL,
  SURFACE_CAMERA_TARGET,
  type Surface3DCameraPreset,
} from '../constants/camera'

export function CameraPresetController({
  preset,
  enabled,
}: {
  preset: Surface3DCameraPreset
  enabled: boolean
}) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (!enabled) return
    const { position } = CAMERA_PRESETS_FULL[preset]
    camera.position.set(...position)
    camera.lookAt(...SURFACE_CAMERA_TARGET)
    camera.updateProjectionMatrix()
  }, [preset, enabled, camera])

  if (!enabled) return null

  return (
    <OrbitControls
      makeDefault
      enablePan
      minDistance={3.2}
      maxDistance={12}
      maxPolarAngle={Math.PI / 2.05}
      target={SURFACE_CAMERA_TARGET}
    />
  )
}

export function PreviewCameraRig({
  relaxed = false,
  preset,
}: {
  relaxed?: boolean
  preset: Surface3DCameraPreset
}) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (relaxed) {
      const { position } = CAMERA_PRESETS_FULL[preset]
      camera.position.set(...position)
    }
    camera.lookAt(...SURFACE_CAMERA_TARGET)
    camera.updateProjectionMatrix()
  }, [camera, relaxed, preset])

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      minDistance={relaxed ? 3.2 : 2.2}
      maxDistance={relaxed ? 12 : 7}
      maxPolarAngle={Math.PI / 2.05}
      target={SURFACE_CAMERA_TARGET}
    />
  )
}
