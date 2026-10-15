'use client'

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import type { SolarCellTypeId } from '../data'

export type CellViewAngle = 0 | 30 | 90

export type Cell3DModelProps = {
  type: SolarCellTypeId
  interactive?: boolean
  className?: string
  /** 観察角度プリセット（度）。未指定時は表面30°の静止表示。 */
  viewAngle?: CellViewAngle
}

/** Panels face +Z; camera stays in the +Z hemisphere so the cell face stays readable. */
const CAMERA_TARGET: [number, number, number] = [0, 0.1, 0]
const CAMERA_BY_ANGLE: Record<
  CellViewAngle,
  { position: [number, number, number] }
> = {
  0: { position: [0, 1.1, 4.4] },
  /** Oblique front overview — list cards and detail default. */
  30: { position: [2.2, 1.7, 3.8] },
  90: { position: [4.0, 1.5, 1.2] },
}

/** Si主流：アルミフレームの頑丈さと約35mm厚の重厚感を強調 */
function SiliconPanel() {
  const rows = 4
  const cols = 6
  const cellW = 0.28
  const cellH = 0.22
  const gap = 0.02
  const panelW = cols * cellW + (cols - 1) * gap
  const panelH = rows * cellH + (rows - 1) * gap
  /** ~35mm相当の視覚厚み */
  const frameDepth = 0.14
  const frameBezel = 0.1

  return (
    /* Cell face on +Z toward the default camera. */
    <group>
      {/* Aluminum frame — thick glossy structural extrusion */}
      <mesh position={[0, 0, -frameDepth / 2]} castShadow receiveShadow>
        <boxGeometry
          args={[panelW + frameBezel * 2, panelH + frameBezel * 2, frameDepth]}
        />
        <meshStandardMaterial color="#b8c0cc" metalness={0.88} roughness={0.22} />
      </mesh>
      {/* Inner frame lip — recessed channel for glass */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry
          args={[panelW + frameBezel * 1.4, panelH + frameBezel * 1.4, 0.04]}
        />
        <meshStandardMaterial color="#9aa3b2" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Backsheet */}
      <mesh position={[0, 0, -0.008]}>
        <boxGeometry args={[panelW + 0.02, panelH + 0.02, 0.024]} />
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Glass cover — subtle silicon reflection */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[panelW + 0.04, panelH + 0.04, 0.008]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.22}
        />
      </mesh>
      {/* Silicon cells + busbars */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const x = -panelW / 2 + cellW / 2 + c * (cellW + gap)
          const y = panelH / 2 - cellH / 2 - r * (cellH + gap)
          return (
            <group key={`${r}-${c}`} position={[x, y, 0.012]}>
              <mesh>
                <boxGeometry args={[cellW, cellH, 0.012]} />
                <meshStandardMaterial
                  color="#1e40af"
                  metalness={0.45}
                  roughness={0.25}
                />
              </mesh>
              {[-0.06, 0, 0.06].map((bx) => (
                <mesh key={bx} position={[bx, 0, 0.008]}>
                  <boxGeometry args={[0.012, cellH * 0.92, 0.004]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
                </mesh>
              ))}
            </group>
          )
        }),
      )}
    </group>
  )
}

/** CdTe：フレームレス強化ガラス鏡面 + リアルなガラス切断面エッジ（シアン排除） */
function CompoundThinFilmPanel() {
  const w = 1.6
  const h = 0.95
  const depth = 0.028
  const edge = 0.0045

  return (
    <group>
      {/* 斜めスペキュラ用 DirectionalLight — 大面積ガラス表面を走らせる */}
      <directionalLight position={[3.5, 2.5, 4]} intensity={1.8} color="#f1f5f9" />
      <directionalLight position={[-2, 1.5, 2]} intensity={0.55} color="#e2e8f0" />

      {/* 本体：ガラス積層内の薄膜吸収層 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w - edge * 2, h - edge * 2, depth * 0.55]} />
        <meshStandardMaterial color="#0a0f18" metalness={0.35} roughness={0.4} />
      </mesh>

      {/* 表面カバーガラス — 強い鏡面ハイライト（フレームレス） */}
      <mesh position={[0, 0, depth / 2 - 0.002]} castShadow>
        <boxGeometry args={[w, h, 0.01]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.04}
          metalness={0.05}
          transmission={0.15}
          thickness={0.4}
          transparent
          opacity={0.88}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* 裏面ガラス */}
      <mesh position={[0, 0, -(depth / 2 - 0.002)]}>
        <boxGeometry args={[w, h, 0.008]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ガラス切断面エッジ — 無色〜淡いグレーの断面（シアンなし） */}
      {/* 左右 */}
      <mesh position={[-(w / 2), 0, 0]}>
        <boxGeometry args={[edge, h, depth]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.18}
          metalness={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh position={[w / 2, 0, 0]}>
        <boxGeometry args={[edge, h, depth]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.18}
          metalness={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* 上下 */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, edge, depth]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, -(h / 2), 0]}>
        <boxGeometry args={[w, edge, depth]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

/** ペロブスカイト：1mm未満の剛体折り紙ヒンジ + 折り畳み／展開の動的変形 */
function PerovskiteFilmPanel({ animateFold = false }: { animateFold?: boolean }) {
  const leftWing = useRef<Group>(null)
  const rightWing = useRef<Group>(null)
  const phase = useRef(0)

  const filmMat = {
    color: '#10b981' as const,
    roughness: 0.25,
    metalness: 0.3,
    emissive: '#047857' as const,
    emissiveIntensity: 0.3,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92,
  }
  /** 視覚上 1mm未満の超薄フィルム */
  const thickness = 0.0035
  const panelH = 0.78
  const panelW = 0.48

  useFrame((_, delta) => {
    if (!animateFold) {
      const fold = 0.55
      if (leftWing.current) leftWing.current.rotation.y = fold
      if (rightWing.current) rightWing.current.rotation.y = -fold
      return
    }
    phase.current += delta * 0.55
    // 0 → 展開、π → 畳み：正弦で往復
    const t = (Math.sin(phase.current) + 1) / 2
    const fold = 0.08 + t * 1.15 // ~5°〜~70°
    if (leftWing.current) leftWing.current.rotation.y = fold
    if (rightWing.current) rightWing.current.rotation.y = -fold
  })

  return (
    <group>
      {/* 中央面（谷折り基準面） */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[panelW, panelH, thickness]} />
        <meshStandardMaterial {...filmMat} />
      </mesh>

      {/* 左翼 — 山折りヒンジ（動的） */}
      <group ref={leftWing} position={[-panelW / 2, 0, 0]} rotation={[0, animateFold ? 0 : 0.55, 0]}>
        <mesh position={[-panelW / 2, 0, 0]} castShadow>
          <boxGeometry args={[panelW, panelH, thickness]} />
          <meshStandardMaterial {...filmMat} color="#34d399" />
        </mesh>
      </group>

      {/* 右翼 — 谷折り反対側（動的） */}
      <group ref={rightWing} position={[panelW / 2, 0, 0]} rotation={[0, animateFold ? 0 : -0.55, 0]}>
        <mesh position={[panelW / 2, 0, 0]} castShadow>
          <boxGeometry args={[panelW, panelH, thickness]} />
          <meshStandardMaterial {...filmMat} color="#a78bfa" />
        </mesh>
      </group>

      {/* 折り目サポート — 極薄ヒンジライン */}
      <mesh position={[-panelW / 2, 0, 0.003]}>
        <boxGeometry args={[0.006, panelH * 0.98, 0.002]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.85}
          roughness={0.25}
          emissive="#64748b"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[panelW / 2, 0, 0.003]}>
        <boxGeometry args={[0.006, panelH * 0.98, 0.002]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.85}
          roughness={0.25}
          emissive="#64748b"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  )
}

/** ETFEフレキシブル：薄型プレート＋四隅ハトメ固定メタファー */
function EtfeFlexiblePanel() {
  const w = 1.55
  const h = 0.9
  const thickness = 0.012
  const grommetR = 0.028
  const grommetPositions: [number, number, number][] = [
    [-w / 2 + 0.08, h / 2 - 0.08, thickness / 2 + 0.004],
    [w / 2 - 0.08, h / 2 - 0.08, thickness / 2 + 0.004],
    [-w / 2 + 0.08, -h / 2 + 0.08, thickness / 2 + 0.004],
    [w / 2 - 0.08, -h / 2 + 0.08, thickness / 2 + 0.004],
  ]

  return (
    <group>
      {/* ETFE fluoropolymer sheet — thin translucent shell; cells face +Z. */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, thickness]} />
        <meshPhysicalMaterial
          color="#94a3b8"
          roughness={0.35}
          metalness={0.05}
          transmission={0.35}
          thickness={0.2}
          transparent
          opacity={0.88}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {/* Mono-Si cell lattice under the sheet (toward camera / +Z) */}
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => {
          const cw = 0.26
          const ch = 0.24
          const gap = 0.03
          const x = -((5 - 1) * (cw + gap)) / 2 + c * (cw + gap)
          const y = ((3 - 1) * (ch + gap)) / 2 - r * (ch + gap)
          return (
            <mesh key={`${r}-${c}`} position={[x, y, 0.002]} castShadow>
              <boxGeometry args={[cw, ch, 0.006]} />
              <meshStandardMaterial
                color="#1d4ed8"
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
          )
        }),
      )}
      {/* Corner grommets (ハトメ) */}
      {grommetPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <torusGeometry args={[grommetR, 0.006, 8, 24]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh>
            <circleGeometry args={[grommetR * 0.55, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
      {/* Soft curl hint — sheet edge lift */}
      <mesh position={[0, -h / 2 + 0.02, 0.01]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[w * 0.92, 0.04, 0.004]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.1}
          roughness={0.45}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

function CellMesh({
  type,
  animateFold,
}: {
  type: SolarCellTypeId
  animateFold: boolean
}) {
  switch (type) {
    case 'rigid_silicon':
      return <SiliconPanel />
    case 'bipv_thin_film':
      return <CompoundThinFilmPanel />
    case 'etfe_flexible_silicon':
      return <EtfeFlexiblePanel />
    case 'origami_perovskite':
      return <PerovskiteFilmPanel animateFold={animateFold} />
  }
}

/** 生活スケール基準：消防避難通路幅 60cm（0.6m）の半透明ガイドライン */
function EgressPathwayGuide() {
  /** 幅0.6m × 奥行き1.8m の破線長方形 */
  const rectPoints: [number, number, number][] = [
    [-0.3, 0.025, -0.9],
    [0.3, 0.025, -0.9],
    [0.3, 0.025, 0.9],
    [-0.3, 0.025, 0.9],
    [-0.3, 0.025, -0.9],
  ]

  return (
    <group position={[0, -0.82, 0]}>
      {/* 半透明リング：幅0.6mの物差し */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.28, 0.32, 48]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Line
        points={rectPoints}
        color="#3b82f6"
        dashed
        dashSize={0.08}
        gapSize={0.05}
        transparent
        opacity={0.45}
        lineWidth={1.5}
      />
    </group>
  )
}

function DisplayPedestal() {
  return (
    <group position={[0, -0.85, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#252a36" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[4.2, 5, 64]} />
        <meshStandardMaterial
          color="#2a3142"
          metalness={0.25}
          roughness={0.7}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

function CameraFraming({
  viewAngle,
  interactive,
}: {
  viewAngle: CellViewAngle
  interactive: boolean
}) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    const { position } = CAMERA_BY_ANGLE[viewAngle]
    camera.position.set(...position)
    camera.lookAt(...CAMERA_TARGET)
    camera.updateProjectionMatrix()
  }, [viewAngle, camera])

  if (!interactive) return null

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      minDistance={2.8}
      maxDistance={8}
      maxPolarAngle={Math.PI / 2.05}
      target={CAMERA_TARGET}
    />
  )
}

function CellStageGroup({
  type,
  animateFold,
}: {
  type: SolarCellTypeId
  animateFold: boolean
}) {
  return (
    <group position={[0, 0.15, 0]}>
      <CellMesh type={type} animateFold={animateFold} />
    </group>
  )
}

export function Cell3DModel({
  type,
  interactive = false,
  className,
  viewAngle,
}: Cell3DModelProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Defer Canvas until after paint so React 19 never sync-unmounts an R3F root mid-render.
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // List cards: static front 30°. Detail: sidebar angle (default 30°).
  const resolvedAngle: CellViewAngle = viewAngle ?? 30
  const cam = CAMERA_BY_ANGLE[resolvedAngle]

  if (!isMounted) {
    return (
      <div
        className={
          className ??
          'relative flex h-full w-full items-center justify-center rounded-xl bg-slate-950/60'
        }
      >
        <div className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  return (
    <div className={className ?? 'relative h-full w-full'}>
      {/* No key on Canvas — remounting mid-render races React 19; type changes via CellStageGroup. */}
      <Canvas
        camera={{
          position: cam.position,
          fov: interactive ? 42 : 40,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, interactive ? 2 : 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        shadows
      >
        <color attach="background" args={['#0b0f17']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 7]} intensity={2.2} castShadow />
        <directionalLight position={[-5, -2, -5]} intensity={0.8} />
        <pointLight position={[0, 4, 3]} intensity={1.0} color="#ffffff" />
        <Suspense fallback={null}>
          <DisplayPedestal />
          <EgressPathwayGuide />
          <CellStageGroup type={type} animateFold={interactive} />
          <CameraFraming viewAngle={resolvedAngle} interactive={interactive} />
        </Suspense>
      </Canvas>
    </div>
  )
}
