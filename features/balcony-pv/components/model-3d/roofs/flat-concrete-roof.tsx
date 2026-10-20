'use client'

import { FLAT_ROOF_DIMS } from '../constants/dimensions'

/** フラットコンクリート屋根の躯体（外壁・スラブ・デッキ・ペントハウス・パラペット）。 */
export function FlatConcreteRoofShell() {
  const { body, slab, parapet, deck, penthouse } = FLAT_ROOF_DIMS
  const parapetY = slab.topY + parapet.height / 2
  const capY = slab.topY + parapet.height + parapet.capThickness / 2
  const deckY = slab.topY + deck.thickness / 2

  // パラペット配置用（南北・東西の芯座標）
  const zOffset = (slab.depth - parapet.thickness) / 2
  const xOffset = (slab.width - parapet.thickness) / 2
  const innerDepth = slab.depth - parapet.thickness * 2

  return (
    <>
      {/* 1. 躯体外壁 */}
      <mesh position={[0, body.height / 2, 0]}>
        <boxGeometry args={[body.width, body.height, body.depth]} />
        <meshStandardMaterial color="#949699" roughness={0.9} />
      </mesh>

      {/* 2. スラブ（コンクリート天端） */}
      <mesh position={[0, slab.topY - slab.thickness / 2, 0]}>
        <boxGeometry args={[slab.width, slab.thickness, slab.depth]} />
        <meshStandardMaterial color="#7f8387" roughness={0.85} />
      </mesh>

      {/* 3. ウッドデッキ敷設面 */}
      <mesh position={[-0.2, deckY, 0.1]}>
        <boxGeometry args={[deck.width - 0.4, deck.thickness, deck.depth - 0.2]} />
        <meshStandardMaterial color="#785c43" roughness={0.7} />
      </mesh>

      {/* 4. 出入口ペントハウス（階段室・ドア） */}
      <group position={[penthouse.x, slab.topY + penthouse.height / 2, penthouse.z]}>
        {/* 小屋躯体 */}
        <mesh>
          <boxGeometry args={[penthouse.width, penthouse.height, penthouse.depth]} />
          <meshStandardMaterial color="#60666d" roughness={0.8} />
        </mesh>
        {/* 出入口ドア（前面） */}
        <mesh position={[0, -0.05, penthouse.depth / 2 + 0.005]}>
          <boxGeometry args={[0.42, 0.72, 0.02]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* 小庇（ドア上） */}
        <mesh position={[0, 0.36, penthouse.depth / 2 + 0.06]}>
          <boxGeometry args={[0.55, 0.02, 0.12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* 5. パラペット壁 ＆ 金属笠木 */}
      {/* 南北パラペット壁 */}
      {[-zOffset, zOffset].map((z, idx) => (
        <group key={`parapet-z-${idx}`}>
          <mesh position={[0, parapetY, z]}>
            <boxGeometry args={[slab.width, parapet.height, parapet.thickness]} />
            <meshStandardMaterial color="#8e9296" roughness={0.88} />
          </mesh>
          {/* 金属笠木 */}
          <mesh position={[0, capY, z]}>
            <boxGeometry args={[slab.width + 0.02, parapet.capThickness, parapet.thickness + 0.03]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 東西パラペット壁 */}
      {[-xOffset, xOffset].map((x, idx) => (
        <group key={`parapet-x-${idx}`}>
          <mesh position={[x, parapetY, 0]}>
            <boxGeometry args={[parapet.thickness, parapet.height, innerDepth]} />
            <meshStandardMaterial color="#8e9296" roughness={0.88} />
          </mesh>
          {/* 金属笠木 */}
          <mesh position={[x, capY, 0]}>
            <boxGeometry args={[parapet.thickness + 0.03, parapet.capThickness, innerDepth]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </>
  )
}
