"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 閉じたループ内を流れる電力エネルギー粒子
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
      <lineBasicMaterial color={color} transparent opacity={0.75} linewidth={2} />
    </line>
  );
}

/**
 * ③ 独立電源型（完全オフグリッド）の3Dアイソメトリック空間
 * ※ 電柱・電線・スマートメーター・壁コンセント等の系統設備は一切存在しない
 */
export function StandaloneScene() {
  return (
    <group position={[0, -0.6, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. 建築ベース（テラス・室内床壁・開口サッシ）
         ───────────────────────────────────────────────────────────── */}
      {/* 屋外テラスデッキ */}
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

      {/* テラス手すり立ち上がり */}
      <mesh position={[-2.95, 0.5, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.8, 3.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      <mesh position={[-2.95, 0.92, 0]}>
        <boxGeometry args={[0.22, 0.04, 3.6]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* サッシ開口部（透明ガラス） */}
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
          2. 自立型ソーラー ＆ DCチャージコントローラー
         ───────────────────────────────────────────────────────────── */}
      <group position={[-3.15, 0.85, 0]} rotation={[0, 0, -0.32]}>
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.03, 1.25, 2.8]} />
          <meshStandardMaterial
            color="#091815"
            emissive="#047857"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.05, 1.3, 2.86]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>

        {/* 自立スタンド脚 */}
        <mesh position={[0.3, -0.5, 0.8]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        <mesh position={[0.3, -0.5, -0.8]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>

      </group>

      {/* DCチャージコントローラー（手すり下） */}
      <mesh position={[-2.3, 0.3, -1.0]}>
        <boxGeometry args={[0.15, 0.25, 0.3]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          3. 独立蓄電ハブ（オフグリッドEMS）
         ───────────────────────────────────────────────────────────── */}
      <group position={[1.4, 0.4, -0.4]}>
        <mesh>
          <boxGeometry args={[0.7, 0.55, 0.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.1, 0.26]}>
          <boxGeometry args={[0.4, 0.18, 0.02]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, -0.12, 0.26]}>
          <boxGeometry args={[0.45, 0.12, 0.02]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. 生活自給設備（ポータブルDC冷蔵庫 ＆ ワークデスク ＆ LED照明）
         ───────────────────────────────────────────────────────────── */}
      {/* ポータブル保冷庫（DC直結） */}
      <group position={[2.6, 0.45, -1.0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.65, 0.6]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <boxGeometry args={[0.68, 0.06, 0.58]} />
          <meshStandardMaterial color="#334155" metalness={0.5} />
        </mesh>
        <mesh position={[0.25, 0.2, 0.31]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* PCデスク ＆ 通信ルーター */}
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

        {/* ノートPC */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.42, 0.02, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, -0.14]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.42, 0.26, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.65} />
        </mesh>

        {/* 卓上LEDランタン */}
        <group position={[0.5, 0.18, -0.15]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.08, 0.24, 12]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#eab308"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. 物理配線（閉じた自給ループのみ）
         ───────────────────────────────────────────────────────────── */}
      {/* 配線1: パネル ➔ コントローラー ➔ 蓄電ハブ */}
      <Line
        points={[
          [-3.15, 0.65, -0.6],
          [-2.3, 0.3, -1.0],
          [1.1, 0.65, -0.6],
          [1.4, 0.4, -0.4],
        ]}
        color="#10b981"
      />
      {/* 配線2: 蓄電ハブ ➔ ノートPC・LED */}
      <Line
        points={[
          [1.4, 0.4, -0.4],
          [0.75, 0.45, 0.5],
          [0.5, 0.55, 0.7],
        ]}
        color="#10b981"
      />
      {/* 配線3: 蓄電ハブ ➔ 小型保冷庫 */}
      <Line
        points={[
          [1.4, 0.4, -0.4],
          [2.1, 0.45, -0.5],
          [2.6, 0.45, -1.0],
        ]}
        color="#10b981"
      />

      {/* ─────────────────────────────────────────────────────────────
          6. エネルギー粒子アニメーション（完全自律ループのみ）
         ───────────────────────────────────────────────────────────── */}
      {/* ① 発電チャージ: 自立パネル ➔ 独立蓄電ハブ (エメラルド) */}
      <PowerFlowParticles
        path={[
          [-3.15, 0.65, -0.6],
          [-2.3, 0.3, -1.0],
          [1.1, 0.65, -0.6],
          [1.4, 0.4, -0.4],
        ]}
        color="#10b981"
        count={12}
        size={0.07}
        speed={1.4}
      />

      {/* ② 自給給電A: 蓄電ハブ ➔ ノートPC / 通信 (エメラルド) */}
      <PowerFlowParticles
        path={[
          [1.4, 0.4, -0.4],
          [0.75, 0.45, 0.5],
          [0.5, 0.55, 0.7],
        ]}
        color="#10b981"
        count={6}
        size={0.055}
        speed={1.0}
      />

      {/* ③ 自給給電B: 蓄電ハブ ➔ 小型保冷庫 (エメラルド) */}
      <PowerFlowParticles
        path={[
          [1.4, 0.4, -0.4],
          [2.1, 0.45, -0.5],
          [2.6, 0.45, -1.0],
        ]}
        color="#10b981"
        count={6}
        size={0.06}
        speed={1.0}
      />
    </group>
  );
}
