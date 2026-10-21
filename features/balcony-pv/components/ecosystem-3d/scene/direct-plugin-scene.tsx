"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 送電・流路に沿って流れる電力エネルギー粒子
 */
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

/** 簡易配線描画コンポーネント */
function Line({
  points,
  color,
}: {
  points: [number, number, number][];
  color: string;
}) {
  const lineGeometry = useMemo(() => {
    const pts = points.map((p) => new THREE.Vector3(...p));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [points]);

  return (
    // @ts-ignore
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={0.7} linewidth={2} />
    </line>
  );
}

/**
 * ① コンセント直結型（系統連系）の3Dアイソメトリック空間（建築形態トーン）
 */
export function DirectPluginScene() {
  return (
    <group position={[0, -0.6, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. 建築ベース（明るいコンクリート・外壁・ガラス戸）
         ───────────────────────────────────────────────────────────── */}
      {/* ベランダ床スラブ（明色コンクリート） */}
      <mesh position={[-1.8, 0, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.2, 3.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* 室内床（明るいフローリング調グレー） */}
      <mesh position={[1.4, 0, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.2, 3.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>

      {/* 室内背面壁（ホワイトコンクリート壁） */}
      <mesh position={[1.4, 1.8, -1.8]} receiveShadow>
        <boxGeometry args={[4.0, 3.4, 0.15]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>

      {/* ベランダ腰壁・手すり立ち上がり（明るいグレー） */}
      <mesh position={[-2.95, 0.5, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.8, 3.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* ベランダ手すり天端キャップ */}
      <mesh position={[-2.95, 0.92, 0]}>
        <boxGeometry args={[0.22, 0.04, 3.6]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* サッシ枠・ガラスパーテーション */}
      <group position={[-0.6, 1.7, 0]}>
        {/* サッシ外枠 */}
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
        {/* 透明ガラス面 */}
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
          2. ベランダ手すり外側 ＆ ソーラーパネル
         ───────────────────────────────────────────────────────────── */}
      {/* 太陽光パネル（手すり外側に露出傾斜設置） */}
      <group position={[-3.15, 0.85, 0]} rotation={[0, 0, -0.32]}>
        {/* パネル受光面（黒紺セル ＋ エメラルド反射） */}
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
        {/* パネルアルミ外枠 */}
        <mesh>
          <boxGeometry args={[0.05, 1.3, 3.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>

      </group>

      {/* 超小型マイクロインバータ（手すり内側に設置） */}
      <group position={[-2.75, 0.6, -1.0]}>
        <mesh>
          <boxGeometry args={[0.12, 0.28, 0.32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>

      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. プラグイン接続部（ベランダ外壁コンセントへ直挿し）
         ───────────────────────────────────────────────────────────── */}
      <group position={[-0.7, 0.65, -1.3]}>
        {/* コンセントボックス */}
        <mesh>
          <boxGeometry args={[0.08, 0.22, 0.18]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* 差し込みプラグ */}
        <mesh position={[-0.05, -0.02, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.08]} />
          <meshStandardMaterial color="#047857" />
        </mesh>

      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. 室内設備（白を基調とした大型冷蔵庫 ＆ PCデスク）
         ───────────────────────────────────────────────────────────── */}
      {/* 家電1: 大型冷蔵庫（ホワイト・シルバー調） */}
      <group position={[2.6, 1.25, -1.0]}>
        <mesh>
          <boxGeometry args={[0.9, 2.3, 0.85]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.25} metalness={0.2} />
        </mesh>
        {/* 冷凍室ドア */}
        <mesh position={[0, 0.65, 0.44]}>
          <boxGeometry args={[0.86, 0.8, 0.03]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} />
        </mesh>
        {/* 冷蔵室ドア */}
        <mesh position={[0, -0.32, 0.44]}>
          <boxGeometry args={[0.86, 1.05, 0.03]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} />
        </mesh>
        {/* ハンドル */}
        <mesh position={[-0.32, 0.15, 0.47]}>
          <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 家電2: デスク ＆ ノートPC ＆ 電源コード */}
      <group position={[0.7, 0.45, 0.6]}>
        {/* 木調・ライトグレー天板 */}
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

        {/* ノートPC */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.42, 0.02, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, -0.14]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.42, 0.26, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.65} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. 屋外送電系統（スマートメーター ＆ 電柱）
         ───────────────────────────────────────────────────────────── */}
      <group position={[3.5, 1.2, -1.75]}>
        <mesh>
          <boxGeometry args={[0.36, 0.5, 0.08]} />
          <meshStandardMaterial color="#334155" metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.08, 0.05]}>
          <boxGeometry args={[0.24, 0.14, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
      </group>

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
      {/* パネル ➔ インバータ ➔ コンセント */}
      <Line
        points={[
          [-3.1, 0.3, -1.0],
          [-2.75, 0.6, -1.0],
          [-0.7, 0.65, -1.3],
          [-1.8, 0.7, -0.8],
        ]}
        color="#047857"
      />
      {/* 室内コンセント ➔ PC */}
      <Line
        points={[
          [-0.5, 0.45, -1.7],
          [-0.65, 0.15, 0.3],
          [0.7, 0.48, 0.5],
          [0.95, 0.5, 0.45],
        ]}
        color="#475569"
      />
      {/* 室内コンセント ➔ 冷蔵庫 */}
      <Line
        points={[
          [-0.65, 0.45, -1.7],
          [0.8, 0.2, -1.2],
          [2.15, 0.45, 0.15],
        ]}
        color="#475569"
      />
      {/* 室内 ➔ スマートメーター ➔ 電柱 */}
      <Line
        points={[
          [-0.65, 0.45, -1.75],
          [1.5, 0.6, -2.0],
          [3.5, 1.2, -1.75],
          [4.8, 3.4, -2.0],
        ]}
        color="#0284c7"
      />

      {/* ─────────────────────────────────────────────────────────────
          7. エネルギー粒子アニメーション
         ───────────────────────────────────────────────────────────── */}
      {/* ① パネル発電 ➔ ベランダプラグイン直挿し (エメラルド) */}
      <PowerFlowParticles
        path={[
          [-3.1, 0.3, -1.0],
          [-2.75, 0.6, -1.0],
          [-0.7, 0.65, -1.3],
          [-1.8, 0.7, -0.8],
        ]}
        color="#10b981"
        count={8}
        size={0.07}
        speed={1.5}
      />

      {/* ② 家電自家消費A: コンセント ➔ ノートPC (エメラルド) */}
      <PowerFlowParticles
        path={[
          [-0.5, 0.45, -1.7],
          [-0.65, 0.15, 0.3],
          [0.7, 0.48, 0.5],
          [0.95, 0.5, 0.45],
        ]}
        color="#10b981"
        count={6}
        size={0.055}
        speed={1.1}
      />

      {/* ③ 家電自家消費B: コンセント ➔ 冷蔵庫 (エメラルド) */}
      <PowerFlowParticles
        path={[
          [-0.65, 0.45, -1.7],
          [0.8, 0.2, -1.2],
          [2.15, 0.45, 0.15],
        ]}
        color="#10b981"
        count={6}
        size={0.06}
        speed={1.1}
      />

      {/* ④ 余剰電力の売電・逆潮流: コンセント ➔ メーター ➔ 送電柱 (スカイブルー) */}
      <PowerFlowParticles
        path={[
          [-0.65, 0.45, -1.75],
          [1.5, 0.6, -2.0],
          [3.5, 1.2, -1.75],
          [4.8, 3.4, -2.0],
        ]}
        color="#38bdf8"
        count={10}
        size={0.075}
        speed={1.4}
      />
    </group>
  );
}
