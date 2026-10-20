'use client'

import {
  JAPANESE_GABLE_WALL_SHAPE,
  JAPANESE_ROOF_DIMS,
} from '../constants/dimensions'
import { MATERIALS } from '../constants/materials'
import { RoofMountedPanel } from '../solar/roof-mounted-panel'

/** 日本式切妻屋根の躯体（外壁＋妻壁）。 */
export function JapaneseRoofBody() {
  const { body, gable } = JAPANESE_ROOF_DIMS

  return (
    <>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[body.width, body.height, body.depth]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      <mesh position={[-1.06, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <extrudeGeometry args={[JAPANESE_GABLE_WALL_SHAPE, { depth: 0.07, bevelEnabled: false }]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      <mesh position={[1.06, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <extrudeGeometry args={[JAPANESE_GABLE_WALL_SHAPE, { depth: 0.07, bevelEnabled: false }]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
    </>
  )
}

/** 南面・北面の屋根面、瓦桟、取付レール、軒先、棟包み。 */
export function JapaneseRoofPlanes() {
  const { gable, slopeRun, eaveHeight, roofBoard, ridgeY } = JAPANESE_ROOF_DIMS
  const roofSlope = -(Math.PI / 2 - Math.atan2(gable.rise, slopeRun))
  const slopeGroupY = eaveHeight + gable.rise / 2
  const slopeGroupZ = slopeRun / 2

  return (
    <>
      {/* 南面屋根 */}
      <group position={[0, slopeGroupY, slopeGroupZ]} rotation={[roofSlope, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[roofBoard.width, roofBoard.length, roofBoard.thickness]} />
          <meshStandardMaterial {...MATERIALS.roofDeck} />
        </mesh>

        {[-0.35, -0.1, 0.15, 0.38].map((y, i) => (
          <mesh key={i} position={[0, y, 0.022]}>
            <boxGeometry args={[2.38, 0.015, 0.008]} />
            <meshStandardMaterial {...MATERIALS.roofTrim} />
          </mesh>
        ))}

        <mesh position={[0, 0.08, 0.035]}>
          <boxGeometry args={[1.5, 0.02, 0.02]} />
          <meshStandardMaterial {...MATERIALS.aluminiumRail} />
        </mesh>
        <mesh position={[0, -0.18, 0.035]}>
          <boxGeometry args={[1.5, 0.02, 0.02]} />
          <meshStandardMaterial {...MATERIALS.aluminiumRail} />
        </mesh>

        <RoofMountedPanel />

        <mesh position={[0, -0.58, -0.01]} rotation={[-roofSlope, 0, 0]}>
          <boxGeometry args={[2.42, 0.05, 0.05]} />
          <meshStandardMaterial {...MATERIALS.roofTrim} />
        </mesh>
      </group>

      {/* 北面屋根 */}
      <group position={[0, slopeGroupY, -slopeGroupZ]} rotation={[-roofSlope, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[roofBoard.width, roofBoard.length, roofBoard.thickness]} />
          <meshStandardMaterial {...MATERIALS.roofDeck} />
        </mesh>
        <mesh position={[0, -0.58, -0.01]} rotation={[roofSlope, 0, 0]}>
          <boxGeometry args={[2.42, 0.05, 0.05]} />
          <meshStandardMaterial {...MATERIALS.roofTrim} />
        </mesh>
      </group>

      {/* 棟包み */}
      <mesh position={[0, ridgeY, 0]}>
        <boxGeometry args={[2.42, 0.05, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.4} />
      </mesh>
    </>
  )
}
