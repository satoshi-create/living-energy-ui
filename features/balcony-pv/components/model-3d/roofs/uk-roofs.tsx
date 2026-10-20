'use client'

import { UK_GABLE_PITCH_RAD } from '../constants/dimensions'

/** UK切妻テラスハウス：外壁＋レンガ煙突。 */
export function UkPitchedGableShell() {
  return (
    <>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.0, 0.7, 1.5]} />
        <meshStandardMaterial color="#c4b8a8" roughness={0.9} />
      </mesh>
      {/* brick chimney stub */}
      <mesh position={[0.7, 1.15, -0.15]}>
        <boxGeometry args={[0.28, 0.7, 0.28]} />
        <meshStandardMaterial color="#8b4a3a" roughness={0.88} />
      </mesh>
    </>
  )
}

/** UK切妻テラスハウス：スレート／粘土瓦の両勾配＋棟。 */
export function UkPitchedGableRoofPlanes() {
  const pitch = UK_GABLE_PITCH_RAD

  return (
    <>
      {/* slate / clay gable planes */}
      <mesh position={[0, 0.95, 0.4]} rotation={[pitch, 0, 0]}>
        <boxGeometry args={[2.2, 0.05, 1.15]} />
        <meshStandardMaterial color="#3a3e45" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.95, -0.4]} rotation={[-pitch, 0, 0]}>
        <boxGeometry args={[2.2, 0.05, 1.15]} />
        <meshStandardMaterial color="#3a3e45" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[2.25, 0.06, 0.08]} />
        <meshStandardMaterial color="#2a2e34" roughness={0.75} />
      </mesh>
    </>
  )
}

/** UKマンサード＋ドーマー：躯体・ドーマー本体・ドーマー屋根。 */
export function UkMansardDormerShell() {
  return (
    <>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.05, 0.55, 1.55]} />
        <meshStandardMaterial color="#b8a898" roughness={0.9} />
      </mesh>
      {/* dormer body + cheeks */}
      <mesh position={[0.4, 0.9, 0.78]}>
        <boxGeometry args={[0.55, 0.5, 0.4]} />
        <meshStandardMaterial color="#cfc4b4" roughness={0.86} />
      </mesh>
      <mesh position={[0.4, 0.9, 0.98]}>
        <boxGeometry args={[0.4, 0.35, 0.04]} />
        <meshStandardMaterial color="#6a90a8" metalness={0.15} roughness={0.2} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.4, 1.2, 0.78]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.62, 0.04, 0.48]} />
        <meshStandardMaterial color="#3a4048" roughness={0.75} />
      </mesh>
    </>
  )
}

/** UKマンサード：急勾配の外装面＋浅い上部デッキ。 */
export function UkMansardRoofPlanes() {
  const steep = (55 * Math.PI) / 180
  const shallow = (20 * Math.PI) / 180

  return (
    <>
      {/* steep outer faces (slate) */}
      <mesh position={[0, 0.75, 0.58]} rotation={[steep * 0.5, 0, 0]}>
        <boxGeometry args={[2.15, 0.05, 0.8]} />
        <meshStandardMaterial color="#4a5058" roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.75, -0.58]} rotation={[-steep * 0.5, 0, 0]}>
        <boxGeometry args={[2.15, 0.05, 0.8]} />
        <meshStandardMaterial color="#4a5058" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* shallow upper deck */}
      <mesh position={[0, 1.2, 0.2]} rotation={[shallow, 0, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.65]} />
        <meshStandardMaterial color="#3e444c" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.2, -0.2]} rotation={[-shallow, 0, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.65]} />
        <meshStandardMaterial color="#3e444c" roughness={0.78} />
      </mesh>
    </>
  )
}
