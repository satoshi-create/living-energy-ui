'use client'

/** UK Juliet のフラッシュ手すり（縦桟付き）。 */
export function UkJulietRailing() {
  return (
    <>
      {/* flush Juliet rail */}
      <mesh position={[0, 0.55, -0.22]}>
        <boxGeometry args={[1.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.22, -0.22]}>
        <boxGeometry args={[1.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.35} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-0.7 + i * 0.175, 0.38, -0.22]}>
          <cylinderGeometry args={[0.015, 0.015, 0.34, 8]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
    </>
  )
}

/** UK recessed loggia の前側手すり。 */
export function UkRecessedRailing() {
  return (
    <>
      {/* front rail */}
      <mesh position={[0, 0.5, 0.4]}>
        <boxGeometry args={[1.65, 0.04, 0.04]} />
        <meshStandardMaterial color="#c0c4c8" metalness={0.55} roughness={0.4} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-0.7 + i * 0.2, 0.28, 0.4]}>
          <boxGeometry args={[0.03, 0.42, 0.03]} />
          <meshStandardMaterial color="#b0b4b8" metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
    </>
  )
}
