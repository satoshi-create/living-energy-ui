/**
 * 3Dビューアのカメラ設定。
 * 配置・角度は従来の `surface-3d-viewer.tsx` と完全に同一。
 */

export type Surface3DCameraPreset = '0°' | '30°' | '90°' | '-30°'

/** カード一覧・詳細ビュー共通の注視点（モデル中央高さ）。 */
export const SURFACE_CAMERA_TARGET: [number, number, number] = [0, 0.7, 0]

/** カード一覧用のコンパクトなフレーミング。 */
export const CAMERA_PRESETS_PREVIEW: Record<
  Surface3DCameraPreset,
  { position: [number, number, number] }
> = {
  '0°': { position: [0, 1.6, 3.6] },
  '30°': { position: [2.4, 1.8, 2.8] },
  '90°': { position: [3.6, 1.5, 0.2] },
  '-30°': { position: [-2.4, 1.8, 2.8] },
}

/**
 * 詳細ビュー用のフレーミング。
 * 壁・屋根の頂点と床が大画面内に収まるよう、プレビューより後方へ引いた画角。
 */
export const CAMERA_PRESETS_FULL: Record<
  Surface3DCameraPreset,
  { position: [number, number, number] }
> = {
  '0°': { position: [0, 2.4, 5.6] },
  '30°': { position: [3.8, 2.9, 4.4] },
  '90°': { position: [5.6, 2.5, 0.35] },
  '-30°': { position: [-3.8, 2.9, 4.4] },
}
