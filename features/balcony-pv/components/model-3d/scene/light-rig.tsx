'use client'

/**
 * 3D空間のライティング。
 * バルコニー／屋根モデル用と、太陽電池セル模型用で現行の光量を維持する。
 */

export function SurfaceLightRig() {
  return (
    <>
      <color attach="background" args={['#0f1419']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
    </>
  )
}

export function CellLightRig() {
  return (
    <>
      <color attach="background" args={['#0b0f17']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 7]} intensity={2.2} castShadow />
      <directionalLight position={[-5, -2, -5]} intensity={0.8} />
      <pointLight position={[0, 4, 3]} intensity={1.0} color="#ffffff" />
    </>
  )
}
