'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { CELL_CAMERA_BY_ANGLE, type CellViewAngle } from './constants/camera'
import { CellLightRig } from '../model-3d/scene/light-rig'
import { CameraFraming } from './scene/camera-framing'
import { CellStageGroup } from './scene/cell-stage-group'
import { DisplayPedestal } from './scene/display-pedestal'
import { EgressPathwayGuide } from './scene/egress-pathway-guide'
import type { Cell3DModelProps } from './types'

/** 太陽電池セル模型の公開コンポーネント。 */
export function Cell3DModel({
  type,
  interactive = false,
  className,
  viewAngle,
}: Cell3DModelProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Defer Canvas until after paint so React 19 never sync-unmounts an R3F root mid-render.
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // List cards: static front 30°. Detail: sidebar angle (default 30°).
  const resolvedAngle: CellViewAngle = viewAngle ?? 30
  const cam = CELL_CAMERA_BY_ANGLE[resolvedAngle]

  if (!isMounted) {
    return (
      <div
        className={
          className ??
          'relative flex h-full w-full items-center justify-center rounded-xl bg-slate-950/60'
        }
      >
        <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  return (
    <div className={className ?? 'relative h-full w-full'}>
      {/* No key on Canvas — remounting mid-render races React 19; type changes via CellStageGroup. */}
      <Canvas
        camera={{
          position: cam.position,
          fov: interactive ? 42 : 40,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, interactive ? 2 : 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        shadows
      >
        <CellLightRig />
        <Suspense fallback={null}>
          <DisplayPedestal />
          <EgressPathwayGuide />
          <CellStageGroup type={type} animateFold={interactive} />
          <CameraFraming viewAngle={resolvedAngle} interactive={interactive} />
        </Suspense>
      </Canvas>
    </div>
  )
}
