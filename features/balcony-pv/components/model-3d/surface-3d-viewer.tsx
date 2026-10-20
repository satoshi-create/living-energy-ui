'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  CAMERA_PRESETS_FULL,
  CAMERA_PRESETS_PREVIEW,
} from './constants/camera'
import { SurfaceScene } from './scene/surface-scene'
import type { Surface3DViewerProps } from './types'

/**
 * バルコニー／屋根3Dビューアの公開コンポーネント。
 * Canvas の設定だけを担い、モデル本体は `scene/surface-scene.tsx` が組み立てる。
 */
export function Surface3DViewer({
  profileId,
  className,
  variant = 'preview',
  cameraPreset = '30°',
  tiltDeg = 30,
  isRetracted = false,
}: Surface3DViewerProps) {
  const t = useTranslations('worldPv.architecture.surface3d')
  const full = variant === 'full'
  const cam = (full ? CAMERA_PRESETS_FULL : CAMERA_PRESETS_PREVIEW)[cameraPreset]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border/50 bg-slate-950',
        full && 'flex h-full min-h-0 flex-col',
        className,
      )}
      role="img"
      aria-label={t(full ? 'fullView.viewerAria' : 'viewerAria')}
    >
      <div className={cn(full ? 'min-h-0 flex-1' : 'h-44 w-full sm:h-48')}>
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              …
            </div>
          }
        >
          <Canvas
            key={`${profileId}-${full ? cameraPreset : 'preview'}-${tiltDeg}-${isRetracted}`}
            dpr={[1, full ? 2 : 1.5]}
            camera={{
              position: cam.position,
              fov: 42,
              near: 0.1,
              far: 50,
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: full ? 'high-performance' : 'low-power',
            }}
          >
            <SurfaceScene
              profileId={profileId}
              cameraPreset={cameraPreset}
              full={full}
              tiltDeg={tiltDeg}
              isRetracted={isRetracted}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  )
}
