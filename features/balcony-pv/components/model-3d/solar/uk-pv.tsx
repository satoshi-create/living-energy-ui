'use client'

import { UK_GABLE_PITCH_RAD } from '../constants/dimensions'
import { Panel } from './panel'

/** UK Juliet: 窓面に沿った可動ルーバーシャッター。 */
export function UkJulietLouverPv() {
  return (
    <group position={[-0.85, 0.9, -0.28]} rotation={[0, 0.25, 0]}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0.32 - i * 0.13, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.38, 0.045, 0.85]} />
          <meshStandardMaterial color="#1a6b4a" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

/** UK recessed loggia: テーブル＋架台パネル。 */
export function UkRecessedSolarTable() {
  return (
    <>
      {/* solar table furniture */}
      <mesh position={[0.15, 0.28, -0.05]}>
        <boxGeometry args={[0.7, 0.06, 0.45]} />
        <meshStandardMaterial color="#5c4c32" roughness={0.7} />
      </mesh>
      {[-0.25, 0.25].map((x) =>
        [-0.15, 0.15].map((z) => (
          <mesh key={`${x}-${z}`} position={[0.15 + x, 0.14, -0.05 + z]}>
            <cylinderGeometry args={[0.025, 0.025, 0.22, 8]} />
            <meshStandardMaterial color="#4a3c28" roughness={0.75} />
          </mesh>
        )),
      )}
      <Panel position={[0.15, 0.38, -0.05]} rotation={[-0.35, 0, 0]} args={[0.65, 0.04, 0.4]} />
    </>
  )
}

/** UK roof terrace: パーゴラ架台＋パネル。 */
export function UkRoofTerracePergola() {
  return (
    <>
      {/* pergola posts + beams */}
      {[-0.75, 0.75].map((x) =>
        [-0.55, 0.55].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.95, z]}>
            <cylinderGeometry args={[0.04, 0.04, 1.15, 8]} />
            <meshStandardMaterial color="#6b5a3e" roughness={0.75} />
          </mesh>
        )),
      )}
      {[-0.55, 0, 0.55].map((z) => (
        <mesh key={z} position={[0, 1.5, z]}>
          <boxGeometry args={[1.65, 0.06, 0.08]} />
          <meshStandardMaterial color="#5c4c32" roughness={0.7} />
        </mesh>
      ))}
      <Panel position={[0, 1.56, 0]} args={[1.35, 0.04, 1.05]} />
    </>
  )
}

/** UK切妻屋根：勾配に沿った重荷重クランプ金具＋パネル。 */
export function UkGableClampMounts() {
  const pitch = UK_GABLE_PITCH_RAD

  return (
    <>
      {/* heavy-duty clamp mounts along pitch */}
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 1.05, 0.55]} rotation={[pitch, 0, 0]}>
          <boxGeometry args={[0.1, 0.14, 0.1]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <Panel position={[0, 1.12, 0.52]} rotation={[pitch, 0, 0]} args={[1.05, 0.04, 0.65]} />
    </>
  )
}

/** UKマンサード：ドーマー脇の窓シャッター型集光面。 */
export function UkMansardLouverPv() {
  return (
    <group position={[-0.35, 0.85, 0.72]} rotation={[-0.35, 0, 0]}>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[0, 0.22 - i * 0.11, 0]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.7]} />
          <meshStandardMaterial color="#1a6b4a" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}
