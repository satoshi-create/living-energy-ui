'use client'

/** 勾配屋根に載る一般的な太陽光パネル（枠＋セル面）。 */
export function RoofMountedPanel({
  position = [0, -0.05, 0.06],
  frameColor = '#e2e8f0',
  cellColor = '#090d16',
  height = 0.75,
  cellHeight = 0.69,
}: {
  position?: [number, number, number]
  frameColor?: string
  cellColor?: string
  height?: number
  cellHeight?: number
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.4, height, 0.025]} />
        <meshStandardMaterial color={frameColor} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <boxGeometry args={[1.34, cellHeight, 0.015]} />
        <meshStandardMaterial color={cellColor} roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  )
}
