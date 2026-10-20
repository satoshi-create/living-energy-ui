'use client'

import {
  EUROPEAN_GABLE_WALL_SHAPE,
  EUROPEAN_ROOF_DIMS,
} from '../constants/dimensions'
import { RoofMountedPanel } from '../solar/roof-mounted-panel'

/** 欧州急勾配切妻屋根の躯体（外壁＋妻壁）。 */
export function EuropeanRoofBody() {
  const { body } = EUROPEAN_ROOF_DIMS

  return (
    <>
      {/* 1. 外壁 */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[body.width, body.height, body.depth]} />
        <meshStandardMaterial color="#ebe6df" roughness={0.8} />
      </mesh>

      {/* 2. 切妻妻壁 */}
      <mesh position={[-1.1, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <extrudeGeometry args={[EUROPEAN_GABLE_WALL_SHAPE, { depth: 0.04, bevelEnabled: false }]} />
        <meshStandardMaterial color="#ebe6df" roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 0.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <extrudeGeometry args={[EUROPEAN_GABLE_WALL_SHAPE, { depth: 0.04, bevelEnabled: false }]} />
        <meshStandardMaterial color="#ebe6df" roughness={0.8} />
      </mesh>
    </>
  )
}

/** 南北の屋根面、軒先、チムニー、棟包み。 */
export function EuropeanRoofPlanes() {
  const { body, gable, roofBoardLength, ridgeY } = EUROPEAN_ROOF_DIMS
  // 水平からの勾配角
  const pitchRad = Math.atan2(gable.rise, gable.halfDepth)
  // boxGeometry（Y軸長）を水平勾配に合わせるための回転角
  const roofSlope = -(Math.PI / 2 - pitchRad)

  // 妻壁の斜辺中心（body.height + rise/2, halfDepth/2）を基準に配置
  const slopeGroupY = body.height + gable.rise / 2
  const slopeGroupZ = gable.halfDepth / 2

  return (
    <>
      {/* 3. 南面屋根 */}
      <group position={[0, slopeGroupY, slopeGroupZ]} rotation={[roofSlope, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, roofBoardLength, 0.04]} />
          <meshStandardMaterial color="#33383f" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0.035]}>
          <boxGeometry args={[1.5, 0.02, 0.02]} />
          <meshStandardMaterial color="#78828c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.2, 0.035]}>
          <boxGeometry args={[1.5, 0.02, 0.02]} />
          <meshStandardMaterial color="#78828c" metalness={0.8} roughness={0.3} />
        </mesh>

        <RoofMountedPanel
          frameColor="#d1d5db"
          cellColor="#0f172a"
          height={0.8}
          cellHeight={0.74}
        />

        <mesh position={[0, -roofBoardLength / 2, 0.03]} rotation={[-roofSlope, 0, 0]}>
          <boxGeometry args={[2.42, 0.05, 0.05]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </group>

      {/* 4. 北面屋根 */}
      <group position={[0, slopeGroupY, -slopeGroupZ]} rotation={[-roofSlope, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, roofBoardLength, 0.04]} />
          <meshStandardMaterial color="#33383f" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, -roofBoardLength / 2, -0.03]} rotation={[roofSlope, 0, 0]}>
          <boxGeometry args={[2.42, 0.05, 0.05]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </group>

      {/* 5. チムニー */}
      <mesh position={[0.6, 1.6, -0.2]}>
        <boxGeometry args={[0.26, 0.55, 0.26]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 1.9, -0.2]}>
        <boxGeometry args={[0.32, 0.05, 0.32]} />
        <meshStandardMaterial color="#4b5563" roughness={0.7} />
      </mesh>

      {/* 6. 棟包み */}
      <mesh position={[0, ridgeY, 0]}>
        <boxGeometry args={[2.42, 0.05, 0.08]} />
        <meshStandardMaterial color="#1f2429" metalness={0.3} roughness={0.4} />
      </mesh>
    </>
  )
}
