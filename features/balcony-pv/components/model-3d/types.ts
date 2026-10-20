import type { Surface3dModelId } from '../../data'
import type { Surface3DCameraPreset } from './constants/camera'

export type { Surface3DCameraPreset }

export type Surface3DViewerProps = {
  profileId: Surface3dModelId
  className?: string
  /** Compact sidebar preview (default) or large full-tab canvas. */
  variant?: 'preview' | 'full'
  /** Orbit camera azimuth preset for the full viewer. */
  cameraPreset?: Surface3DCameraPreset
  /** Panel tilt from horizontal (degrees). */
  tiltDeg?: number
  /** Stow / 出仕舞い pose. */
  isRetracted?: boolean
}

export type PanelTiltContextValue = {
  tiltDeg: number
  isRetracted: boolean
}
