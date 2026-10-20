'use client'

/**
 * パリ・オスマニアン様式の石造バルコニー躯体。
 * 外壁・コーニス・フレンチサッシ・浅いスラブ・持送りで構成する。
 */
export function HaussmannBalconyShell() {
  return (
    <>
      {/* 1. パリ市街地オスマニアン石造外壁（アシュラー石積み） */}
      <mesh position={[0, 1.15, -0.72]}>
        <boxGeometry args={[2.8, 2.3, 0.18]} />
        <meshStandardMaterial color="#e5ded0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.12, -0.61]}>
        <boxGeometry args={[2.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#d8cfbe" roughness={0.88} />
      </mesh>

      {/* 2. 背の高いフレンチ木製サッシドア（掃き出し窓＋上部欄間） */}
      <mesh position={[0, 1.12, -0.63]}>
        <boxGeometry args={[1.5, 2.05, 0.05]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.4} />
      </mesh>
      {[-0.34, 0.34].map((gx, gi) => (
        <group key={`glass-${gi}`} position={[gx, 1.12, -0.61]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.55, 1.88, 0.01]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.1} transparent opacity={0.4} />
          </mesh>
          <mesh position={[0, 0.3, 0.008]}>
            <boxGeometry args={[0.55, 0.02, 0.01]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, -0.3, 0.008]}>
            <boxGeometry args={[0.55, 0.02, 0.01]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}

      {/* 3. 浅い石造バルコニースラブ（奥行き約450mm） */}
      <mesh position={[0, -0.06, -0.22]}>
        <boxGeometry args={[2.0, 0.12, 0.85]} />
        <meshStandardMaterial color="#c7bcab" roughness={0.92} />
      </mesh>
      {[-0.75, 0.75].map((cx, ci) => (
        <mesh key={`corbel-${ci}`} position={[cx, -0.18, -0.25]}>
          <boxGeometry args={[0.16, 0.14, 0.45]} />
          <meshStandardMaterial color="#b8ab97" roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}
