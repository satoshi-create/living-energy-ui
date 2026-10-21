"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function PowerFlowParticles({
  path,
  count = 10,
  speed = 1.2,
  color = "#10B981",
  size = 0.08,
}: {
  path: [number, number, number][];
  count?: number;
  speed?: number;
  color?: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const curve = useMemo(() => {
    const points = path.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.1);
  }, [path]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => i / count),
    [count]
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      offsets[i] = (offsets[i] + delta * speed * 0.35) % 1;
      const point = curve.getPointAt(offsets[i]);
      dummy.position.copy(point);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}

function Line({
  points,
  color,
  dashed = false,
}: {
  points: [number, number, number][];
  color: string;
  dashed?: boolean;
}) {
  const lineGeometry = useMemo(() => {
    const pts = points.map((p) => new THREE.Vector3(...p));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [points]);

  return (
    // @ts-ignore
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={dashed ? 0.35 : 0.7}
        linewidth={2}
      />
    </line>
  );
}

/**
 * ② 蓄電ハイブリッド型（直結制限対策）の3Dアイソメトリック空間
 */
export function StorageHybridScene() {
  return (
    <group position={[0, -0.6, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. 建築ベース（明色コンクリート・外壁・ガラス戸）
         ───────────────────────────────────────────────────────────── */}
      {/* ベランダ床スラブ */}
      <mesh position={[-1.8, 0, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.2, 3.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* 室内床 */}
      <mesh position={[1.4, 0, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.2, 3.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>

      {/* 室内背面壁 */}
      <mesh position={[1.4, 1.8, -1.8]} receiveShadow>
        <boxGeometry args={[4.0, 3.4, 0.15]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>

      {/* ベランダ腰壁 */}
      <mesh position={[-2.95, 0.5, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.8, 3.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* 手すり天端 */}
      <mesh position={[-2.95, 0.92, 0]}>
        <boxGeometry args={[0.22, 0.04, 3.6]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* サッシ枠・ガラスパーテーション */}
      <group position={[-0.6, 1.7, 0]}>
        <mesh position={[0, 0, -1.75]}>
          <boxGeometry args={[0.08, 3.2, 0.1]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 1.75]}>
          <boxGeometry args={[0.08, 3.2, 0.1]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.08, 0.1, 3.6]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.02, 3.1, 3.4]} />
          <meshStandardMaterial
            color="#94a3b8"
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. ベランダ手すり外側 ＆ ソーラーパネル ＆ 充電コントローラー
         ───────────────────────────────────────────────────────────── */}
      <group position={[-3.15, 0.85, 0]} rotation={[0, 0, -0.32]}>
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.03, 1.25, 3.0]} />
          <meshStandardMaterial
            color="#091815"
            emissive="#047857"
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.05, 1.3, 3.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>

      </group>

      {/* 充電コントローラー（手すり内側） */}
      <mesh position={[-2.75, 0.6, -1.0]}>
        <boxGeometry args={[0.12, 0.28, 0.32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          3. 室内蓄電ユニット（ポータブル電源・中央ハブ）
         ───────────────────────────────────────────────────────────── */}
      <group position={[1.4, 0.35, -0.5]}>
        {/* バッテリー本体 */}
        <mesh>
          <boxGeometry args={[0.65, 0.5, 0.45]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* バッテリー液晶インジケーター（エメラルド発光） */}
        <mesh position={[0, 0.08, 0.23]}>
          <boxGeometry args={[0.35, 0.16, 0.02]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* ハンドル */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.3, 0.06, 0.08]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>

      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. 室内家電（大型冷蔵庫 ＆ PCデスク）
         ───────────────────────────────────────────────────────────── */}
      {/* 冷蔵庫 */}
      <group position={[2.7, 1.25, -1.0]}>
        <mesh>
          <boxGeometry args={[0.9, 2.3, 0.85]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.25} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.65, 0.44]}>
          <boxGeometry args={[0.86, 0.8, 0.03]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.32, 0.44]}>
          <boxGeometry args={[0.86, 1.05, 0.03]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} />
        </mesh>
        <mesh position={[-0.32, 0.15, 0.47]}>
          <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* PCデスク */}
      <group position={[0.5, 0.45, 0.7]}>
        <mesh>
          <boxGeometry args={[1.5, 0.06, 0.9]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>
        <mesh position={[-0.65, -0.22, 0.35]}>
          <boxGeometry args={[0.05, 0.42, 0.05]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.65, -0.22, 0.35]}>
          <boxGeometry args={[0.05, 0.42, 0.05]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.65, -0.22, -0.35]}>
          <boxGeometry args={[0.05, 0.42, 0.05]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.65, -0.22, -0.35]}>
          <boxGeometry args={[0.05, 0.42, 0.05]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.42, 0.02, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, -0.14]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.42, 0.26, 0.02]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.65}
          />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. 屋外送電系統 ＆ 遮断壁コンセント
         ───────────────────────────────────────────────────────────── */}
      {/* 遮断中の壁コンセント */}
      <group position={[-0.7, 0.65, -1.3]}>
        <mesh>
          <boxGeometry args={[0.08, 0.22, 0.18]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} />
        </mesh>

      </group>

      {/* スマートメーター（非連系） */}
      <group position={[3.5, 1.2, -1.75]}>
        <mesh>
          <boxGeometry args={[0.36, 0.5, 0.08]} />
          <meshStandardMaterial color="#334155" metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.08, 0.05]}>
          <boxGeometry args={[0.24, 0.14, 0.02]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

      </group>

      {/* 送電柱 */}
      <group position={[5.0, 2.1, -2.0]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.14, 4.6, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
        <mesh position={[-0.25, 1.4, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.65, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. 物理配線
         ───────────────────────────────────────────────────────────── */}
      {/* 実線1: パネル ➔ コントローラー ➔ サッシ貫通 ➔ 蓄電ユニット */}
      <Line
        points={[
          [-1.8, 0.7, -0.5],
          [-2.75, 0.6, -1.0],
          [-3.1, 0.7, -1.2],
          [0.0, 0.35, 0.2],
          [1.1, 0.35, 0.6],
          [1.4, 0.35, -0.5],
        ]}
        color="#10b981"
      />
      {/* 実線2: 蓄電ユニット ➔ デスクPC */}
      <Line
        points={[
          [1.4, 0.35, -0.5],
          [0.75, 0.35, 0.45],
          [0.5, 0.45, 0.7],
        ]}
        color="#10b981"
      />
      {/* 実線3: 蓄電ユニット ➔ 冷蔵庫 */}
      <Line
        points={[
          [1.4, 0.35, -0.5],
          [2.15, 0.35, 0.2],
          [2.25, 0.45, -1.0],
        ]}
        color="#10b981"
      />
      {/* 破線4: 遮断された系統線（電柱 ➔ メーター ➔ 壁コンセント：薄いグレー） */}
      <Line
        points={[
          [4.8, 3.4, -2.0],
          [3.5, 1.2, -1.75],
          [1.5, 0.6, -2.0],
          [-0.7, 0.65, -1.3],
        ]}
        color="#475569"
        dashed
      />

      {/* ─────────────────────────────────────────────────────────────
          7. エネルギー粒子アニメーション（蓄電 ＆ 専用家電のみ）
         ───────────────────────────────────────────────────────────── */}
      {/* ① パネル発電 ➔ 蓄電ユニット急速チャージ (エメラルド) */}
      <PowerFlowParticles
        path={[
          [-1.8, 0.7, -0.5],
          [-2.75, 0.6, -1.0],
          [-3.1, 0.7, -1.2],
          [0.0, 0.35, 0.2],
          [1.1, 0.35, 0.6],
          [1.4, 0.35, -0.5],
        ]}
        color="#10b981"
        count={12}
        size={0.07}
        speed={1.5}
      />

      {/* ② 自給給電A: 蓄電ユニット ➔ ノートPC (エメラルド) */}
      <PowerFlowParticles
        path={[
          [1.4, 0.35, -0.5],
          [0.75, 0.35, 0.45],
          [0.5, 0.45, 0.7],
        ]}
        color="#10b981"
        count={6}
        size={0.055}
        speed={1.0}
      />

      {/* ③ 自給給電B: 蓄電ユニット ➔ 冷蔵庫 (エメラルド) */}
      <PowerFlowParticles
        path={[
          [1.4, 0.35, -0.5],
          [2.15, 0.35, 0.2],
          [2.25, 0.45, -1.0],
        ]}
        color="#10b981"
        count={6}
        size={0.06}
        speed={1.0}
      />
    </group>
  );
}
