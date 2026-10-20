'use client'

/** UK Juliet: no deck — French doors + flush rail. 外壁とフレンチドア。 */
export function UkJulietShell() {
  return (
    <>
      <mesh position={[0, 0.95, -0.42]}>
        <boxGeometry args={[2.4, 2.1, 0.16]} />
        <meshStandardMaterial color="#cfc8bc" roughness={0.88} />
      </mesh>
      {/* French door pair (glazing) */}
      {[-0.32, 0.32].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.85, -0.32]}>
            <boxGeometry args={[0.48, 1.35, 0.06]} />
            <meshStandardMaterial color="#3a4550" metalness={0.35} roughness={0.45} />
          </mesh>
          <mesh position={[x, 0.95, -0.28]}>
            <boxGeometry args={[0.38, 0.55, 0.02]} />
            <meshStandardMaterial color="#7ec8e8" metalness={0.2} roughness={0.15} transparent opacity={0.55} />
          </mesh>
          <mesh position={[x, 0.35, -0.28]}>
            <boxGeometry args={[0.38, 0.45, 0.02]} />
            <meshStandardMaterial color="#7ec8e8" metalness={0.2} roughness={0.15} transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </>
  )
}

/** UK recessed loggia: 側壁・後退した外壁・ソフィット・床。 */
export function UkRecessedShell() {
  return (
    <>
      {/* outer façade wings */}
      <mesh position={[-1.05, 0.95, 0.15]}>
        <boxGeometry args={[0.35, 2.0, 1.1]} />
        <meshStandardMaterial color="#b8b2a8" roughness={0.9} />
      </mesh>
      <mesh position={[1.05, 0.95, 0.15]}>
        <boxGeometry args={[0.35, 2.0, 1.1]} />
        <meshStandardMaterial color="#b8b2a8" roughness={0.9} />
      </mesh>
      {/* setback back wall */}
      <mesh position={[0, 0.95, -0.55]}>
        <boxGeometry args={[1.75, 2.0, 0.14]} />
        <meshStandardMaterial color="#d4cfc6" roughness={0.85} />
      </mesh>
      {/* soffit */}
      <mesh position={[0, 1.85, -0.05]}>
        <boxGeometry args={[1.75, 0.08, 1.0]} />
        <meshStandardMaterial color="#9a948c" roughness={0.92} />
      </mesh>
      {/* recessed floor */}
      <mesh position={[0, 0.04, -0.05]}>
        <boxGeometry args={[1.7, 0.08, 0.95]} />
        <meshStandardMaterial color="#6e6a64" roughness={0.9} />
      </mesh>
    </>
  )
}

/** UK roof terrace: フラットデッキ＋低いパラペット。 */
export function UkRoofTerraceShell() {
  return (
    <>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.3, 0.3, 2.0]} />
        <meshStandardMaterial color="#8a8680" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[2.5, 0.08, 2.15]} />
        <meshStandardMaterial color="#a09c94" roughness={0.9} />
      </mesh>
      {/* low parapet */}
      <mesh position={[0, 0.55, 1.0]}>
        <boxGeometry args={[2.5, 0.4, 0.12]} />
        <meshStandardMaterial color="#9a9690" roughness={0.92} />
      </mesh>
      <mesh position={[-1.2, 0.55, 0]}>
        <boxGeometry args={[0.12, 0.4, 2.0]} />
        <meshStandardMaterial color="#9a9690" roughness={0.92} />
      </mesh>
    </>
  )
}
