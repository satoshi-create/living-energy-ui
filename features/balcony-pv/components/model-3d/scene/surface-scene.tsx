'use client'

import { useMemo } from 'react'
import type { Surface3dModelId } from '../../../data'
import type { Surface3DCameraPreset } from '../constants/camera'
import { ConcreteParapetModel } from '../models/concrete-parapet'
import { MODEL_REGISTRY } from '../models/registry'
import { CameraPresetController, PreviewCameraRig } from './camera-rig'
import { SurfaceGround } from './ground-plane'
import { SurfaceLightRig } from './light-rig'
import { PanelTiltContext } from './tilt-context'

/**
 * バルコニー／屋根モデルのシーン基盤。
 * ライト・接地・カメラ・パネル傾斜コンテキストをまとめ、選択モデルを描画する。
 */
export function SurfaceScene({
  profileId,
  cameraPreset,
  full,
  relaxedPreview = false,
  tiltDeg,
  isRetracted,
}: {
  profileId: Surface3dModelId
  cameraPreset: Surface3DCameraPreset
  full: boolean
  relaxedPreview?: boolean
  tiltDeg: number
  isRetracted: boolean
}) {
  const tiltValue = useMemo(
    () => ({ tiltDeg, isRetracted }),
    [tiltDeg, isRetracted],
  )

  const Model = MODEL_REGISTRY[profileId] ?? ConcreteParapetModel

  return (
    <PanelTiltContext.Provider value={tiltValue}>
      <SurfaceLightRig />
      <Model />
      <SurfaceGround />
      <CameraPresetController preset={cameraPreset} enabled={full} />
      {!full && (
        <PreviewCameraRig relaxed={relaxedPreview} preset={cameraPreset} />
      )}
    </PanelTiltContext.Provider>
  )
}
