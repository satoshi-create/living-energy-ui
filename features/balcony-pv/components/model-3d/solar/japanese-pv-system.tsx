'use client'

import { MATERIALS } from '../constants/materials'

/**
 * 日本式バルコニー発電スタイル。
 * 手すり内側の着脱退避パネル、ポータブル蓄電、床面配線、室内給電口。
 */

/** 手すり笠木からのSUS引っ掛け金具＋手すり内側垂直パネル。 */
export function JapaneseRailPvMount() {
  return (
    <group position={[-0.35, 0.60, 0.66]}>
      {/* 手すり笠木からのSUS引っ掛け金具（内側吊り下げ固定） */}
      {[-0.38, 0.38].map((x, i) => (
        <group key={`jp-hook-${i}`} position={[x, 0.38, 0]}>
          <mesh position={[0, 0.12, 0.02]}>
            <boxGeometry args={[0.035, 0.04, 0.06]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 0.28, 0.02]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 太陽光パネル本体（手すり内側垂直・エメラルドグリーン） */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[1.05, 0.03, 0.65]} />
        <meshStandardMaterial {...MATERIALS.pvPanel} />
      </mesh>
    </group>
  )
}

/** ポータブル電源＋DC/AC配線＋室内壁コンセント。 */
export function JapanesePowerSystem() {
  return (
    <>
      {/* 10. 日本仕様の蓄電・給電システム（ポータブル電源 ＋ 床面密着配線） */}
      {/* 小型ベランダ蓄電／ポータブル電源（サッシ左脇・避難動線外） */}
      <group position={[-0.95, 0.12, -0.62]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.22, 0.18]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* 状態インジケーター液晶 */}
        <mesh position={[0, 0.02, 0.092]}>
          <boxGeometry args={[0.12, 0.06, 0.002]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        {/* 持ち運び用ハンドル */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.16, 0.02, 0.04]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      </group>

      {/* DC入力配線（パネル内面 ➔ 側溝・床沿い ➔ ポータブル電源） */}
      <group position={[0, 0, 0]}>
        {/* パネル下部から床面への縦配線 */}
        <mesh position={[-0.35, 0.15, 0.65]}>
          <cylinderGeometry args={[0.004, 0.004, 0.3, 8]} />
          <meshStandardMaterial {...MATERIALS.cable} />
        </mesh>
        {/* 床面を壁方向へ這うDC配線 */}
        <mesh position={[-0.35, 0.006, 0.0]}>
          <boxGeometry args={[0.008, 0.008, 1.28]} />
          <meshStandardMaterial {...MATERIALS.cable} />
        </mesh>
        {/* 壁際からポータブル電源へ向かう横配線 */}
        <mesh position={[-0.65, 0.006, -0.62]}>
          <boxGeometry args={[0.6, 0.008, 0.008]} />
          <meshStandardMaterial {...MATERIALS.cable} />
        </mesh>
      </group>

      {/* 室内AC給電フラット配線（ポータブル電源 ➔ サッシ下隙間引き込み ➔ 室内壁面） */}
      <group position={[0, 0, 0]}>
        {/* ポータブル電源からサッシ中央下（X: -0.95 ➔ 0.45）へ巾木沿いに這う給電ライン */}
        <mesh position={[-0.25, 0.008, -0.68]}>
          <boxGeometry args={[1.4, 0.008, 0.008]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
        {/* 室内壁コンセントへの立ち上がり（X = 0.45, 室外機から離れた窓サッシ内壁面） */}
        <mesh position={[0.45, 0.16, -0.71]}>
          <cylinderGeometry args={[0.004, 0.004, 0.3, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
      </group>

      {/* 11. 室内壁コンセント（窓奥・室内側の壁面 Z = -0.72） */}
      <group position={[0.45, 0.32, -0.72]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.01]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* コンセント差し込みプラグヘッド */}
        <mesh position={[0, -0.015, 0.015]}>
          <boxGeometry args={[0.03, 0.04, 0.02]} />
          <meshStandardMaterial color="#334155" metalness={0.4} />
        </mesh>
      </group>
    </>
  )
}
