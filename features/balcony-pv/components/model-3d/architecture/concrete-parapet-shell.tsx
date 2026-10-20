'use client'

import { GERMAN_BALCONY_DIMS } from '../constants/dimensions'
import { MATERIALS } from '../constants/materials'

/**
 * ドイツ式コンクリートバルコニーの静的躯体。
 * RC外壁・側壁・床スラブ・窓サッシ・腰壁パラペット。
 */
export function ConcreteParapetShell() {
  return (
    <>
      {/* 1. 建築躯体（コンクリート打放し・外壁・側壁） */}
      {/* 奥の外壁 */}
      <mesh position={[0, 1.15, -0.78]}>
        <boxGeometry args={[2.6, 2.3, 0.18]} />
        <meshStandardMaterial {...MATERIALS.concreteWall} />
      </mesh>

      {/* 左袖壁（側壁コンクリート・半透明シースルー） */}
      <mesh position={[-1.25, 1.15, 0.05]}>
        <boxGeometry args={[0.2, 2.3, 1.6]} />
        <meshStandardMaterial
          color="#b2b5b3"
          roughness={0.9}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* 右袖壁（側壁コンクリート・半透明シースルー） */}
      <mesh position={[1.25, 1.15, 0.05]}>
        <boxGeometry args={[0.2, 2.3, 1.6]} />
        <meshStandardMaterial
          color="#b2b5b3"
          roughness={0.9}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      {/* 床コンクリートスラブ */}
      <mesh position={[0, -0.06, GERMAN_BALCONY_DIMS.slab.z]}>
        <boxGeometry
          args={[
            GERMAN_BALCONY_DIMS.slab.width,
            GERMAN_BALCONY_DIMS.slab.thickness,
            GERMAN_BALCONY_DIMS.slab.depth,
          ]}
        />
        <meshStandardMaterial {...MATERIALS.concreteSlab} />
      </mesh>

      {/* 2. 窓まわり（ドイツ風テラスドア＋外付けシャッター Rollladen） */}
      {/* 掃き出し窓＋固定窓サッシ枠 */}
      <mesh position={[0.2, 1.05, -0.68]}>
        <boxGeometry args={[1.4, 1.85, 0.04]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* ガラス窓 */}
      <mesh position={[0.2, 1.05, -0.66]}>
        <boxGeometry args={[1.3, 1.75, 0.01]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.25} roughness={0.1} transparent opacity={0.4} />
      </mesh>
      {/* Rollladen（巻き上げシャッターボックス） */}
      <mesh position={[0.2, 1.95, -0.62]}>
        <boxGeometry args={[1.48, 0.22, 0.14]} />
        <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 左側の細身ガラスドア枠 */}
      <mesh position={[-0.75, 1.05, -0.68]}>
        <boxGeometry args={[0.5, 1.85, 0.04]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[-0.75, 1.05, -0.66]}>
        <boxGeometry args={[0.42, 1.75, 0.01]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.25} roughness={0.1} transparent opacity={0.4} />
      </mesh>

      {/* 3. ドイツ式コンクリート腰壁（シースルー・半透明プレキャストパラペット） */}
      {/* 腰壁メイン躯体（内部配線・インバータ視認用半透明マテリアル） */}
      <mesh position={[0, 0.5, GERMAN_BALCONY_DIMS.parapet.z]}>
        <boxGeometry
          args={[
            GERMAN_BALCONY_DIMS.parapet.width,
            GERMAN_BALCONY_DIMS.parapet.height,
            GERMAN_BALCONY_DIMS.parapet.thickness,
          ]}
        />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.8}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
      {/* 腰壁天端 笠木水切り（わずかに透過させつつエッジを保持） */}
      <mesh position={[0, GERMAN_BALCONY_DIMS.cap.y, GERMAN_BALCONY_DIMS.parapet.z]}>
        <boxGeometry
          args={[
            GERMAN_BALCONY_DIMS.cap.width,
            GERMAN_BALCONY_DIMS.cap.thickness,
            GERMAN_BALCONY_DIMS.cap.depth,
          ]}
        />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
