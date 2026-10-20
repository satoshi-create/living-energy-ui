'use client'

/** 生活感アクセント（室外機・植木鉢）。構造・発電には関与しない装飾。 */
export function GermanLifestyleProps() {
  return (
    <>
      {/* 8. 生活感アクセント（小型プランター / エアコン室外機） */}
      {/* 側壁脇の室外機 */}
      <group position={[0.92, 0, -0.1]}>
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[0.42, 0.48, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
      {/* 笠木上の小型植木鉢 */}
      {[-0.95, -0.8].map((x, i) => (
        <group key={`plant-${i}`} position={[x, 1.07, 0.72]}>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.045, 0.035, 0.07, 12]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  )
}
