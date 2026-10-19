'use client'

import { createContext, Suspense, useContext, useLayoutEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MathUtils } from 'three'
import { useLocale, useTranslations } from 'next-intl'
import type { Surface3dModelId } from '../data'
import { cn } from '@/lib/utils'

export type Surface3DCameraPreset = '0°' | '30°' | '90°'

export type Surface3DViewerProps = {
  profileId: Surface3dModelId
  className?: string
  /** Compact sidebar preview (default) or large full-tab canvas. */
  variant?: 'preview' | 'full'
  /** Orbit camera azimuth preset for the full viewer. */
  cameraPreset?: Surface3DCameraPreset
  /** Panel tilt from horizontal (degrees). */
  tiltDeg?: number
  /** Stow / 出仕舞い pose. */
  isRetracted?: boolean
}

type PanelTiltContextValue = {
  tiltDeg: number
  isRetracted: boolean
}

const PanelTiltContext = createContext<PanelTiltContextValue>({
  tiltDeg: 30,
  isRetracted: false,
})


function LabelSprite({
  text,
  subText,
  badge,
  accentColor = '#10b981',
  position,
  scale = [0.75, 0.26, 1],
}: {
  text: string
  subText?: string
  badge?: string
  accentColor?: string
  position: [number, number, number]
  scale?: [number, number, number]
}) {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 420
    canvas.height = 130
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // 前面描画の重複を防ぐためキャンバス全面をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 背景角丸ピル
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(10, 10, 400, 110, 24)
    ctx.fill()
    ctx.stroke()

    // 番号・記号バッジ
    let textStartX = 36
    if (badge) {
      ctx.fillStyle = accentColor
      ctx.beginPath()
      ctx.arc(65, 65, 28, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = 'bold 32px sans-serif'
      ctx.fillStyle = '#0f172a'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(badge, 65, 66)
      textStartX = 114
    }

    if (subText) {
      // 1行目: 部位名
      ctx.font = 'bold 32px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif'
      ctx.fillStyle = '#f8fafc'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, textStartX, 46)

      // 2行目: 役割（エメラルド / シアン強調）
      ctx.font = '500 24px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif'
      ctx.fillStyle = accentColor
      ctx.fillText(subText, textStartX, 84)
    } else {
      ctx.font = 'bold 36px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif'
      ctx.fillStyle = '#f8fafc'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, textStartX, 65)
    }

    const tex = new (require('three').CanvasTexture)(canvas)
    tex.needsUpdate = true
    return tex
  }, [text, subText, badge, accentColor])

  if (!texture) return null

  return (
    <sprite position={position} scale={scale}>
      <spriteMaterial map={texture} depthTest={false} transparent />
    </sprite>
  )
}

function Panel({
  position,
  rotation,
  args = [0.55, 0.04, 0.9],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  args?: [number, number, number]
}) {
  const { tiltDeg, isRetracted } = useContext(PanelTiltContext)
  const base = rotation ?? [0, 0, 0]
  const tiltRad = MathUtils.degToRad(isRetracted ? 0 : tiltDeg)
  const rotX = isRetracted ? base[0] : base[0] + (base[0] === 0 ? tiltRad : 0)
  const pos: [number, number, number] = isRetracted
    ? [position[0], Math.min(position[1], 0.22), position[2] * 0.45]
    : position
  const size: [number, number, number] = isRetracted
    ? [args[0], args[1] * 0.6, args[2] * 0.35]
    : args

  return (
    <mesh position={pos} rotation={[rotX, base[1], base[2]]} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#1a6b4a"
        metalness={0.35}
        roughness={0.45}
        opacity={isRetracted ? 0.55 : 1}
        transparent={isRetracted}
      />
    </mesh>
  )
}

function HaussmannBalconet() {
  return (
    <group>
      {/* façade */}
      <mesh position={[0, 0.9, -0.55]}>
        <boxGeometry args={[2.4, 2.2, 0.18]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.85} />
      </mesh>
      {/* shallow stone floor */}
      <mesh position={[0, 0.05, -0.12]}>
        <boxGeometry args={[1.6, 0.08, 0.42]} />
        <meshStandardMaterial color="#b8aea0" roughness={0.9} />
      </mesh>
      {/* decorative iron balustrade */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = -0.7 + i * 0.175
        return (
          <group key={i}>
            <mesh position={[x, 0.42, 0.08]}>
              <cylinderGeometry args={[0.018, 0.018, 0.7, 8]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[x, 0.55, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.07, 0.012, 8, 16]} />
              <meshStandardMaterial color="#1f1f1f" metalness={0.75} roughness={0.3} />
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, 0.78, 0.08]}>
        <boxGeometry args={[1.55, 0.04, 0.04]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* articulated louver shutter (living furniture) */}
      <group position={[-0.55, 0.95, -0.42]} rotation={[0, 0.35, 0]}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[0, 0.35 - i * 0.14, 0]} rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.42, 0.05, 0.9]} />
            <meshStandardMaterial color="#1a6b4a" metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function ConcreteParapet() {
  const { tiltDeg, isRetracted } = useContext(PanelTiltContext)
  const tiltRad = MathUtils.degToRad(isRetracted ? 0 : tiltDeg)
  const isEn = useLocale() === 'en'

  return (
    <group>
      {/* 1. 建築躯体（コンクリート打放し・外壁・側壁） */}
      {/* 奥の外壁 */}
      <mesh position={[0, 1.15, -0.78]}>
        <boxGeometry args={[2.6, 2.3, 0.18]} />
        <meshStandardMaterial color="#c4c7c5" roughness={0.92} />
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
      <mesh position={[0, -0.06, 0.05]}>
        <boxGeometry args={[2.7, 0.12, 1.65]} />
        <meshStandardMaterial color="#7a7d7b" roughness={0.95} />
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
      <mesh position={[0, 0.5, 0.72]}>
        <boxGeometry args={[2.4, 1.0, 0.22]} />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.8}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
      {/* 腰壁天端 笠木水切り（わずかに透過させつつエッジを保持） */}
      <mesh position={[0, 1.01, 0.72]}>
        <boxGeometry args={[2.44, 0.03, 0.26]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* 4. マイクロインバータ ＋ 壁・床密着プラグイン配線システム */}
      <group position={[-0.35, 0.82, -0.66]}>
        {/* インバータ本体（アルミシルバー放熱フィン付き筐体） */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.18, 0.24, 0.04]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* 放熱フィン（縦スリット） */}
        {[-0.06, -0.02, 0.02, 0.06].map((fx, fi) => (
          <mesh key={`fin-${fi}`} position={[fx, 0, 0.022]}>
            <boxGeometry args={[0.008, 0.2, 0.008]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
        {/* 通電LEDインジケーター（エメラルド点灯） */}
        <mesh position={[-0.06, 0.08, 0.023]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        {/* Wi-Fi通信アンテナ */}
        <mesh position={[0.06, 0.14, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.06, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* パネル裏面からインバータへ向かうDC配線（床・腰壁内面吸着） */}
      <group position={[0, 0, 0]}>
        {/* ① 腰壁天端裏から内面を下りる配線 */}
        <mesh position={[-0.35, 0.5, 0.60]}>
          <cylinderGeometry args={[0.005, 0.005, 0.95, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* ② 床面を這って奥の壁面へ向かうDCライン（Z: 0.60 ➔ -0.66） */}
        <mesh position={[-0.35, 0.006, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 1.26, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* ③ 奥の壁面を立ち上がりインバータ右下端子へ接続 */}
        <mesh position={[-0.35, 0.35, -0.66]}>
          <cylinderGeometry args={[0.005, 0.005, 0.68, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      {/* AC 230V 密着配線（インバータ左下 ➔ 壁面立下げ ➔ 巾木床面 ➔ コンセントプラグ） */}
      <group position={[0, 0, 0]}>
        {/* ① インバータ直下から壁面（Z = -0.66）沿いに床面まで垂直に下りるケーブル */}
        <mesh position={[-0.39, 0.35, -0.66]}>
          <cylinderGeometry args={[0.006, 0.006, 0.70, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
        {/* ② 床面左コーナーエルボ */}
        <mesh position={[-0.39, 0.006, -0.66]}>
          <sphereGeometry args={[0.007, 8, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
        {/* ③ 床面・巾木沿いを水平に走るACライン（Y = 0.006, Z = -0.66） */}
        <mesh position={[0.08, 0.006, -0.66]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006, 0.006, 0.94, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
        {/* ④ コンセント直下コーナーエルボ */}
        <mesh position={[0.55, 0.006, -0.66]}>
          <sphereGeometry args={[0.007, 8, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
        {/* ⑤ 床からコンセントプラグへ立ち上がる垂直ケーブル */}
        <mesh position={[0.55, 0.12, -0.66]}>
          <cylinderGeometry args={[0.006, 0.006, 0.23, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.4} />
        </mesh>
      </group>


{/* --- 部位解説アノテーション（EN / JA ロケール連動2行ラベル表示） --- */}
      {/* ① ソーラーパネル */}
      <group position={[0, 0.88, 0.95]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <LabelSprite
          badge="1"
          text={isEn ? 'Solar Panels' : '太陽光パネル'}
          subText={isEn ? 'Solar Generation (DC)' : '太陽光で発電（DC）'}
          accentColor="#10b981"
          position={[0, 0.15, 0]}
          scale={isEn ? [0.92, 0.25, 1] : [0.82, 0.25, 1]}
        />
      </group>

      {/* ② マイクロインバータ */}
      <group position={[-0.35, 1.02, -0.66]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.06, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <LabelSprite
          badge="2"
          text={isEn ? 'Microinverter' : 'インバータ'}
          subText={isEn ? 'Household Conversion (AC)' : '家庭用に変換（AC）'}
          accentColor="#38bdf8"
          position={[0, 0.15, 0]}
          scale={isEn ? [0.96, 0.25, 1] : [0.82, 0.25, 1]}
        />
      </group>

   {/* ④ 壁コンセント直挿し（Plug & Play） */}
   <group position={[0.55, 0.45, -0.62]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.08, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <LabelSprite
          badge="✓"
          text={isEn ? 'Wall Outlet Plug-in' : '壁コンセント直挿し'}
          subText={isEn ? 'Plug & Play Feed-in' : '部屋へ給電（工事不要）'}
          accentColor="#10b981"
          position={[0, 0.08, 0.02]}
          scale={isEn ? [0.96, 0.25, 1] : [0.82, 0.24, 1]}
        />
      </group>


      {/* 5. 室内Schuko（F型）230V壁コンセント ＋ 差し込みプラグ（PLUG & PLAY） */}
      <group position={[0.55, 0.28, -0.67]}>
        {/* コンセントプレート化粧枠（壁面 Z = -0.68 に密着） */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.16, 0.012]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* 丸型コンセント挿し込み口（Schukoソケット凹み：2基） */}
        {[0.04, -0.04].map((sy, si) => (
          <group key={`socket-${si}`} position={[0, sy, 0.006]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.024, 0.024, 0.004, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
            </mesh>
            {/* ピン挿入穴 */}
            {[-0.009, 0.009].map((px, pi) => (
              <mesh key={`pin-${pi}`} position={[px, 0, 0.002]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.003, 0.003, 0.004, 8]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
            ))}
          </group>
        ))}

     {/* 差し込まれたSchukoプラグ本体（直角アングル型・ブラック） */}
     <group position={[0, -0.04, 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.4} />
          </mesh>
          {/* 下向きケーブル引き出しブーツ（垂直ケーブルと合致） */}
          <mesh position={[0, -0.016, -0.01]}>
            <boxGeometry args={[0.014, 0.018, 0.014]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      </group>

      {/* 6. 専用コンクリート腰壁用引っ掛けブラケット金具（2基） */}
      {[-0.52, 0.52].map((x, i) => (
        <group key={`de-bracket-${i}`} position={[x, 0, 0.72]}>
          {/* 天端跨ぎ金具（笠木を上から抱え込む） */}
          <mesh position={[0, 1.035, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.3]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* 外側垂直支持レール */}
          <mesh position={[0, 0.65, 0.15]}>
            <boxGeometry args={[0.04, 0.75, 0.03]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* 内側固定クランプ */}
          <mesh position={[0, 0.92, -0.14]}>
            <boxGeometry args={[0.05, 0.18, 0.03]} />
            <meshStandardMaterial color="#475569" metalness={0.75} roughness={0.3} />
          </mesh>
          {/* 下部壁当てストッパーボルト */}
          <mesh position={[0, 0.32, 0.13]}>
            <cylinderGeometry args={[0.012, 0.012, 0.04, 8]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 7. ソーラーパネル本体（ドイツ標準 400W〜800W級 結晶Si / 化合物薄膜） */}
      <group position={[0, 0.62, 0.88]}>
        <group rotation={[isRetracted ? 0 : -tiltRad * 0.4, 0, 0]}>
          {/* パネル枠・バックシート */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.72, 0.035]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* セル表面（ダークネイビー・結晶Siスリット） */}
          <mesh position={[0, 0, 0.019]}>
            <boxGeometry args={[1.44, 0.66, 0.002]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.25} />
          </mesh>
          {/* 左右パネル分割フレームライン */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.015, 0.66, 0.003]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

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
    </group>
  )
}

function JapaneseEvacuationBalcony() {
  const isEn = useLocale() === 'en'

  return (
    <group>
      {/* 1. 外壁（RC躯体＋サッシ枠ライン） */}
      <mesh position={[0, 1.1, -0.78]}>
        <boxGeometry args={[2.8, 2.2, 0.16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.88} />
      </mesh>
      {/* 掃き出し窓サッシ枠 */}
      <mesh position={[-0.2, 1.05, -0.69]}>
        <boxGeometry args={[1.8, 1.9, 0.04]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 複層ガラス */}
      <mesh position={[-0.2, 1.05, -0.67]}>
        <boxGeometry args={[1.68, 1.78, 0.01]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.1} transparent opacity={0.45} />
      </mesh>

      {/* 壁付け物干し金物（ホスクリーン型アーム：左右2基 ＋ SUS物干し竿） */}
      <group position={[0, 0, -0.68]}>
        {[-1.2, 0.85].map((x, i) => (
          <group key={`dryer-arm-${i}`} position={[x, 1.55, 0]}>
            <mesh position={[0, 0, 0.015]}>
              <boxGeometry args={[0.05, 0.3, 0.03]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
            <group position={[0, 0.08, 0.03]} rotation={[0.6, 0, 0]}>
              <mesh position={[0, 0, 0.28]}>
                <boxGeometry args={[0.025, 0.04, 0.55]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.52]}>
                <boxGeometry args={[0.03, 0.07, 0.05]} />
                <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          </group>
        ))}

        <mesh position={[-0.18, 1.33, 0.46]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.2, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 2. 床コンクリートスラブ（厚み150mm・長尺塩ビシート仕上げ） */}
      <mesh position={[0, -0.075, 0]}>
        <boxGeometry args={[2.8, 0.15, 1.55]} />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>

      {/* 3. 排水側溝（手すり側の一段下がった水抜き溝） */}
      <mesh position={[0, -0.005, 0.65]}>
        <boxGeometry args={[2.8, 0.015, 0.14]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* 4. JIS準拠 アルミ手すり（天端H=1,100mm・ピッチ110mm格子） */}
      <group position={[0, 0, 0.7]}>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[2.8, 0.04, 0.08]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[2.8, 0.03, 0.03]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        {[-1.3, -0.42, 0.42, 1.3].map((x, i) => (
          <mesh key={`post-${i}`} position={[x, 0.55, 0]}>
            <boxGeometry args={[0.04, 1.1, 0.04]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        {Array.from({ length: 23 }).map((_, i) => {
          const x = -1.26 + i * 0.115
          if (Math.abs(x - -0.42) < 0.05 || Math.abs(x - 0.42) < 0.05) return null
          return (
            <mesh key={`baluster-${i}`} position={[x, 0.61, 0]}>
              <boxGeometry args={[0.014, 0.95, 0.014]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.35} />
            </mesh>
          )
        })}
      </group>

  
  {/* 5. 隔て板（蹴破り戸：アルミ枠＋シースルー半透明パネル＋避難標示） */}
  <group position={[1.36, 0.85, -0.05]}>
        {/* アルミ外枠（輪郭を維持） */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 1.7, 1.45]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
        {/* ケイカル板メイン面（奥の配線・室外機が見えるよう半透明化） */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.015, 1.62, 1.37]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.8}
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
        {/* 避難ステッカー枠（アクセントとして視認維持） */}
        <mesh position={[-0.01, 0.1, 0]}>
          <boxGeometry args={[0.002, 0.2, 0.42]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.5}
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 6. 避難ハッチ金物（SUS製 600角：外枠段差・蓋天板・格納式取っ手・ラッチ部） */}
      <group position={[0.75, 0, 0.2]}>
        <mesh position={[0, 0.004, 0]}>
          <boxGeometry args={[0.62, 0.008, 0.62]} />
          <meshStandardMaterial color="#64748b" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.009, 0]}>
          <boxGeometry args={[0.58, 0.004, 0.58]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.55, 0.004, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.0145, 0.16]}>
          <boxGeometry args={[0.12, 0.002, 0.05]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.016, 0.16]}>
          <boxGeometry args={[0.08, 0.003, 0.012]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.015, -0.18]}>
          <boxGeometry args={[0.06, 0.003, 0.03]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.0145, -0.02]}>
          <boxGeometry args={[0.22, 0.001, 0.1]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
      </group>

      {/* 7. エアコン室外機＋据付架台＋配管化粧カバー */}
      <group position={[0.88, 0, -0.48]}>
        {[-0.26, 0.26].map((x, i) => (
          <mesh key={`cu-base-${i}`} position={[x, 0.04, 0]}>
            <boxGeometry args={[0.12, 0.08, 0.38]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[0.78, 0.56, 0.3]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.45} />
        </mesh>
        <mesh position={[-0.1, 0.36, 0.155]}>
          <cylinderGeometry args={[0.19, 0.19, 0.01, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.1, 0.36, 0.16]}>
          <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.395, 0.28, -0.02]}>
          <boxGeometry args={[0.03, 0.22, 0.12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.34, 1.15, -0.2]}>
          <boxGeometry args={[0.075, 1.3, 0.065]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </mesh>
        <mesh position={[0.34, 0.45, -0.1]}>
          <boxGeometry args={[0.07, 0.12, 0.14]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
      </group>

      {/* 8. 消防避難動線（60cm幅クリアライン床面ガイド） */}
      <mesh position={[0.42, 0.002, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 1.25]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
      </mesh>

      {/* 9. 日本式バルコニー発電スタイル（手すり内側・着脱退避フック金具） */}
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
          <meshStandardMaterial
            color="#1a6b4a"
            metalness={0.35}
            roughness={0.45}
          />
        </mesh>
      </group>

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
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* 床面を壁方向へ這うDC配線 */}
        <mesh position={[-0.35, 0.006, 0.0]}>
          <boxGeometry args={[0.008, 0.008, 1.28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* 壁際からポータブル電源へ向かう横配線 */}
        <mesh position={[-0.65, 0.006, -0.62]}>
          <boxGeometry args={[0.6, 0.008, 0.008]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
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

      {/* 12. 部位解説アノテーション（EN / JA ロケール連動2行ラベル表示） */}
      {/* ① 太陽光パネル */}
      <group position={[-0.35, 0.86, 0.68]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.06, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <LabelSprite
          badge="1"
          text={isEn ? 'Solar Panel' : '太陽光パネル'}
          subText={isEn ? 'Inner-rail Manual Stow' : '手すり内側・手動退避式'}
          accentColor="#10b981"
          position={[0, 0.14, 0]}
          scale={isEn ? [0.92, 0.25, 1] : [0.85, 0.25, 1]}
        />
      </group>

      {/* ② ポータブル蓄電（一時蓄電） */}
      <group position={[-0.95, 0.42, -0.62]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.06, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <LabelSprite
          badge="2"
          text={isEn ? 'Portable Battery' : 'ポータブル蓄電'}
          subText={isEn ? 'Buffer Storage (Zero Export)' : '一時蓄電（逆潮流防止）'}
          accentColor="#38bdf8"
          position={[0, 0.14, 0]}
          scale={isEn ? [0.96, 0.25, 1] : [0.85, 0.25, 1]}
        />
      </group>

      {/* ③ 室内引き込み給電 */}
      <group position={[0.45, 0.52, -0.70]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.08, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <LabelSprite
          badge="✓"
          text={isEn ? 'Indoor Feed-in' : '室内引き込み給電'}
          subText={isEn ? 'Window Cable / Self-use' : '窓すきま配線・家電自給'}
          accentColor="#10b981"
          position={[0, 0.10, 0]}
          scale={isEn ? [0.94, 0.25, 1] : [0.88, 0.25, 1]}
        />
      </group>
    </group>
  )
}


function JapaneseKawaraRoof() {
  const pitch = (30 * Math.PI) / 180
  return (
    <group>
      {/* walls */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.0, 0.7, 1.4]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.9} />
      </mesh>
      {/* gable / hip kawara planes */}
      <mesh position={[0, 0.95, 0.35]} rotation={[pitch, 0, 0]}>
        <boxGeometry args={[2.2, 0.06, 1.1]} />
        <meshStandardMaterial color="#4a3a35" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.95, -0.35]} rotation={[-pitch, 0, 0]}>
        <boxGeometry args={[2.2, 0.06, 1.1]} />
        <meshStandardMaterial color="#4a3a35" roughness={0.85} />
      </mesh>
      {/* ridge */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.15, 10]} />
        <meshStandardMaterial color="#3a2e2a" roughness={0.8} />
      </mesh>
      {/* mounting brackets + panel */}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 1.05, 0.55]} rotation={[pitch, 0, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <meshStandardMaterial color="#666" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}
      <Panel position={[0, 1.12, 0.5]} rotation={[pitch, 0, 0]} args={[1.0, 0.04, 0.7]} />
    </group>
  )
}

function FrenchMansardRoof() {
  const steep = (60 * Math.PI) / 180
  const shallow = (25 * Math.PI) / 180
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.0, 0.5, 1.5]} />
        <meshStandardMaterial color="#cfc6b8" roughness={0.88} />
      </mesh>
      {/* lower steep mansard (zinc) */}
      <mesh position={[0, 0.7, 0.55]} rotation={[steep * 0.55, 0, 0]}>
        <boxGeometry args={[2.15, 0.05, 0.75]} />
        <meshStandardMaterial color="#8a9498" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.7, -0.55]} rotation={[-steep * 0.55, 0, 0]}>
        <boxGeometry args={[2.15, 0.05, 0.75]} />
        <meshStandardMaterial color="#8a9498" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* upper shallow pitch */}
      <mesh position={[0, 1.15, 0.22]} rotation={[shallow, 0, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.7]} />
        <meshStandardMaterial color="#7a868a" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.15, -0.22]} rotation={[-shallow, 0, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.7]} />
        <meshStandardMaterial color="#7a868a" metalness={0.5} roughness={0.45} />
      </mesh>
      {/* dormer */}
      <mesh position={[0.35, 0.85, 0.72]}>
        <boxGeometry args={[0.45, 0.4, 0.35]} />
        <meshStandardMaterial color="#c8bfb0" roughness={0.85} />
      </mesh>
      <mesh position={[0.35, 1.1, 0.72]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.4]} />
        <meshStandardMaterial color="#6a767a" metalness={0.45} roughness={0.5} />
      </mesh>
      <Panel position={[-0.45, 0.95, 0.78]} rotation={[-0.55, 0, 0]} args={[0.7, 0.04, 0.55]} />
    </group>
  )
}

function FlatConcreteRoof() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.2, 0.4, 1.8]} />
        <meshStandardMaterial color="#9a9a96" roughness={0.95} />
      </mesh>
      {/* flat slab */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[2.4, 0.1, 2.0]} />
        <meshStandardMaterial color="#a8a8a4" roughness={0.92} />
      </mesh>
      {/* shade pergola frame */}
      {[-0.85, 0.85].map((x) =>
        [-0.7, 0.7].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.95, z]}>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
            <meshStandardMaterial color="#6b5a3e" roughness={0.75} />
          </mesh>
        )),
      )}
      {[-0.7, 0, 0.7].map((z) => (
        <mesh key={z} position={[0, 1.42, z]}>
          <boxGeometry args={[1.8, 0.06, 0.08]} />
          <meshStandardMaterial color="#5c4c32" roughness={0.7} />
        </mesh>
      ))}

      <Panel position={[0, 1.48, 0]} args={[1.4, 0.04, 1.1]} />
    </group>
  )
}

/** UK Juliet: no deck — French doors + flush rail; window louvers as harvest plane. */
function UkJulietBalcony() {
  return (
    <group>
      <mesh position={[0, 0.95, -0.42]}>
        <boxGeometry args={[2.4, 2.1, 0.16]} />
        <meshStandardMaterial color="#cfc8bc" roughness={0.88} />
      </mesh>
      {/* French door pair (glazing) */}
      {[-0.32, 0.32].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.85, -0.32]}>
            <boxGeometry args={[0.48, 1.35, 0.06]} />
            <meshStandardMaterial color="#3a4550" metalness={0.35} roughness={0.45} />
          </mesh>
          <mesh position={[x, 0.95, -0.28]}>
            <boxGeometry args={[0.38, 0.55, 0.02]} />
            <meshStandardMaterial color="#7ec8e8" metalness={0.2} roughness={0.15} transparent opacity={0.55} />
          </mesh>
          <mesh position={[x, 0.35, -0.28]}>
            <boxGeometry args={[0.38, 0.45, 0.02]} />
            <meshStandardMaterial color="#7ec8e8" metalness={0.2} roughness={0.15} transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
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
      {/* articulated louver shutter along window plane */}
      <group position={[-0.85, 0.9, -0.28]} rotation={[0, 0.25, 0]}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[0, 0.32 - i * 0.13, 0]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.38, 0.045, 0.85]} />
            <meshStandardMaterial color="#1a6b4a" metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** UK recessed loggia: side cheeks + soffit shade; table / clamp furniture. */
function UkRecessedBalcony() {
  return (
    <group>
      {/* outer façade wings */}
      <mesh position={[-1.05, 0.95, 0.15]}>
        <boxGeometry args={[0.35, 2.0, 1.1]} />
        <meshStandardMaterial color="#b8b2a8" roughness={0.9} />
      </mesh>
      <mesh position={[1.05, 0.95, 0.15]}>
        <boxGeometry args={[0.35, 2.0, 1.1]} />
        <meshStandardMaterial color="#b8b2a8" roughness={0.9} />
      </mesh>
      {/* setback back wall */}
      <mesh position={[0, 0.95, -0.55]}>
        <boxGeometry args={[1.75, 2.0, 0.14]} />
        <meshStandardMaterial color="#d4cfc6" roughness={0.85} />
      </mesh>
      {/* soffit */}
      <mesh position={[0, 1.85, -0.05]}>
        <boxGeometry args={[1.75, 0.08, 1.0]} />
        <meshStandardMaterial color="#9a948c" roughness={0.92} />
      </mesh>
      {/* recessed floor */}
      <mesh position={[0, 0.04, -0.05]}>
        <boxGeometry args={[1.7, 0.08, 0.95]} />
        <meshStandardMaterial color="#6e6a64" roughness={0.9} />
      </mesh>
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
      {/* solar table furniture */}
      <mesh position={[0.15, 0.28, -0.05]}>
        <boxGeometry args={[0.7, 0.06, 0.45]} />
        <meshStandardMaterial color="#5c4c32" roughness={0.7} />
      </mesh>
      {[-0.25, 0.25].map((x) =>
        [-0.15, 0.15].map((z) => (
          <mesh key={`${x}-${z}`} position={[0.15 + x, 0.14, -0.05 + z]}>
            <cylinderGeometry args={[0.025, 0.025, 0.22, 8]} />
            <meshStandardMaterial color="#4a3c28" roughness={0.75} />
          </mesh>
        )),
      )}
      <Panel position={[0.15, 0.38, -0.05]} rotation={[-0.35, 0, 0]} args={[0.65, 0.04, 0.4]} />
    </group>
  )
}

/** UK roof terrace: wide flat deck + shade pergola living furniture. */
function UkRoofTerrace() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.3, 0.3, 2.0]} />
        <meshStandardMaterial color="#8a8680" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[2.5, 0.08, 2.15]} />
        <meshStandardMaterial color="#a09c94" roughness={0.9} />
      </mesh>
      {/* low parapet */}
      <mesh position={[0, 0.55, 1.0]}>
        <boxGeometry args={[2.5, 0.4, 0.12]} />
        <meshStandardMaterial color="#9a9690" roughness={0.92} />
      </mesh>
      <mesh position={[-1.2, 0.55, 0]}>
        <boxGeometry args={[0.12, 0.4, 2.0]} />
        <meshStandardMaterial color="#9a9690" roughness={0.92} />
      </mesh>
      {/* pergola posts + beams */}
      {[-0.75, 0.75].map((x) =>
        [-0.55, 0.55].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.95, z]}>
            <cylinderGeometry args={[0.04, 0.04, 1.15, 8]} />
            <meshStandardMaterial color="#6b5a3e" roughness={0.75} />
          </mesh>
        )),
      )}
      {[-0.55, 0, 0.55].map((z) => (
        <mesh key={z} position={[0, 1.5, z]}>
          <boxGeometry args={[1.65, 0.06, 0.08]} />
          <meshStandardMaterial color="#5c4c32" roughness={0.7} />
        </mesh>
      ))}
      <Panel position={[0, 1.56, 0]} args={[1.35, 0.04, 1.05]} />
    </group>
  )
}

/** UK pitched gable: ~45° slate / clay terrace-house roof. */
function UkPitchedGable() {
  const pitch = (45 * Math.PI) / 180
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.0, 0.7, 1.5]} />
        <meshStandardMaterial color="#c4b8a8" roughness={0.9} />
      </mesh>
      {/* brick chimney stub */}
      <mesh position={[0.7, 1.15, -0.15]}>
        <boxGeometry args={[0.28, 0.7, 0.28]} />
        <meshStandardMaterial color="#8b4a3a" roughness={0.88} />
      </mesh>
      {/* slate / clay gable planes */}
      <mesh position={[0, 0.95, 0.4]} rotation={[pitch, 0, 0]}>
        <boxGeometry args={[2.2, 0.05, 1.15]} />
        <meshStandardMaterial color="#3a3e45" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.95, -0.4]} rotation={[-pitch, 0, 0]}>
        <boxGeometry args={[2.2, 0.05, 1.15]} />
        <meshStandardMaterial color="#3a3e45" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[2.25, 0.06, 0.08]} />
        <meshStandardMaterial color="#2a2e34" roughness={0.75} />
      </mesh>
      {/* heavy-duty clamp mounts along pitch */}
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 1.05, 0.55]} rotation={[pitch, 0, 0]}>
          <boxGeometry args={[0.1, 0.14, 0.1]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <Panel position={[0, 1.12, 0.52]} rotation={[pitch, 0, 0]} args={[1.05, 0.04, 0.65]} />
    </group>
  )
}

/** UK mansard + dormer: steep outer pitch with dormer cheeks. */
function UkPitchedMansardDormer() {
  const steep = (55 * Math.PI) / 180
  const shallow = (20 * Math.PI) / 180
  return (
    <group>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.05, 0.55, 1.55]} />
        <meshStandardMaterial color="#b8a898" roughness={0.9} />
      </mesh>
      {/* steep outer faces (slate) */}
      <mesh position={[0, 0.75, 0.58]} rotation={[steep * 0.5, 0, 0]}>
        <boxGeometry args={[2.15, 0.05, 0.8]} />
        <meshStandardMaterial color="#4a5058" roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.75, -0.58]} rotation={[-steep * 0.5, 0, 0]}>
        <boxGeometry args={[2.15, 0.05, 0.8]} />
        <meshStandardMaterial color="#4a5058" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* shallow upper deck */}
      <mesh position={[0, 1.2, 0.2]} rotation={[shallow, 0, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.65]} />
        <meshStandardMaterial color="#3e444c" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.2, -0.2]} rotation={[-shallow, 0, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.65]} />
        <meshStandardMaterial color="#3e444c" roughness={0.78} />
      </mesh>
      {/* dormer body + cheeks */}
      <mesh position={[0.4, 0.9, 0.78]}>
        <boxGeometry args={[0.55, 0.5, 0.4]} />
        <meshStandardMaterial color="#cfc4b4" roughness={0.86} />
      </mesh>
      <mesh position={[0.4, 0.9, 0.98]}>
        <boxGeometry args={[0.4, 0.35, 0.04]} />
        <meshStandardMaterial color="#6a90a8" metalness={0.15} roughness={0.2} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.4, 1.2, 0.78]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.62, 0.04, 0.48]} />
        <meshStandardMaterial color="#3a4048" roughness={0.75} />
      </mesh>
      {/* window-shutter harvest beside dormer */}
      <group position={[-0.35, 0.85, 0.72]} rotation={[-0.35, 0, 0]}>
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={i} position={[0, 0.22 - i * 0.11, 0]} rotation={[0.35, 0, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.7]} />
            <meshStandardMaterial color="#1a6b4a" metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** Shared look-at for card preview and full detail (model mid-height). */
const CAMERA_TARGET: [number, number, number] = [0, 0.7, 0]

/** Compact card-list framing. */
const CAMERA_PRESETS_PREVIEW: Record<
  Surface3DCameraPreset,
  { position: [number, number, number] }
> = {
  '0°': { position: [0, 1.6, 3.6] },
  '30°': { position: [2.4, 1.8, 2.8] },
  '90°': { position: [3.6, 1.5, 0.2] },
}

/**
 * Full detail framing — same angles as preview, pulled back so wall / roof
 * apex and floor stay inside the large viewport with padding.
 */
const CAMERA_PRESETS_FULL: Record<
  Surface3DCameraPreset,
  { position: [number, number, number] }
> = {
  '0°': { position: [0, 2.4, 5.6] },
  '30°': { position: [3.8, 2.9, 4.4] },
  '90°': { position: [5.6, 2.5, 0.35] },
}

function CameraPresetController({
  preset,
  enabled,
}: {
  preset: Surface3DCameraPreset
  enabled: boolean
}) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (!enabled) return
    const { position } = CAMERA_PRESETS_FULL[preset]
    camera.position.set(...position)
    camera.lookAt(...CAMERA_TARGET)
    camera.updateProjectionMatrix()
  }, [preset, enabled, camera])

  if (!enabled) return null

  return (
    <OrbitControls
      makeDefault
      enablePan
      minDistance={3.2}
      maxDistance={12}
      maxPolarAngle={Math.PI / 2.05}
      target={CAMERA_TARGET}
    />
  )
}

/** Aim preview camera at the same target as OrbitControls (avoid origin look-at). */
function PreviewCameraAim() {
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.lookAt(...CAMERA_TARGET)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function SurfaceScene({
  profileId,
  cameraPreset,
  full,
  tiltDeg,
  isRetracted,
}: {
  profileId: Surface3dModelId
  cameraPreset: Surface3DCameraPreset
  full: boolean
  tiltDeg: number
  isRetracted: boolean
}) {
  const Model = useMemo(() => {
    switch (profileId) {
      case 'haussmann-balconet':
        return HaussmannBalconet
      case 'concrete-parapet':
        return ConcreteParapet
      case 'japanese-evacuation-balcony':
        return JapaneseEvacuationBalcony
      case 'japanese-kawara-roof':
        return JapaneseKawaraRoof
      case 'french-mansard-roof':
        return FrenchMansardRoof
      case 'flat-concrete-roof':
        return FlatConcreteRoof
      case 'uk-juliet-balcony':
        return UkJulietBalcony
      case 'uk-recessed-balcony':
        return UkRecessedBalcony
      case 'uk-roof-terrace':
        return UkRoofTerrace
      case 'uk-pitched-gable':
        return UkPitchedGable
      case 'uk-pitched-mansard-dormer':
        return UkPitchedMansardDormer
      default:
        return ConcreteParapet
    }
  }, [profileId])

  const tiltValue = useMemo(
    () => ({ tiltDeg, isRetracted }),
    [tiltDeg, isRetracted],
  )

  return (
    <PanelTiltContext.Provider value={tiltValue}>
      <color attach="background" args={['#0f1419']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
      <Model />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#12181f" roughness={1} />
      </mesh>
      <CameraPresetController preset={cameraPreset} enabled={full} />
      {!full && (
        <>
          <PreviewCameraAim />
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={2.2}
            maxDistance={7}
            maxPolarAngle={Math.PI / 2.05}
            target={CAMERA_TARGET}
          />
        </>
      )}
    </PanelTiltContext.Provider>
  )
}

export function Surface3DViewer({
  profileId,
  className,
  variant = 'preview',
  cameraPreset = '30°',
  tiltDeg = 30,
  isRetracted = false,
}: Surface3DViewerProps) {
  const t = useTranslations('worldPv.architecture.surface3d')
  const full = variant === 'full'
  const cam = (full ? CAMERA_PRESETS_FULL : CAMERA_PRESETS_PREVIEW)[cameraPreset]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border/50 bg-slate-950',
        full && 'flex h-full min-h-0 flex-col',
        className,
      )}
      role="img"
      aria-label={t(full ? 'fullView.viewerAria' : 'viewerAria')}
    >
      <div className={cn(full ? 'min-h-0 flex-1' : 'h-44 w-full sm:h-48')}>
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              …
            </div>
          }
        >
          <Canvas
            key={`${profileId}-${full ? cameraPreset : 'preview'}-${tiltDeg}-${isRetracted}`}
            dpr={[1, full ? 2 : 1.5]}
            camera={{
              position: cam.position,
              fov: 42,
              near: 0.1,
              far: 50,
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: full ? 'high-performance' : 'low-power',
            }}
          >
            <SurfaceScene
              profileId={profileId}
              cameraPreset={cameraPreset}
              full={full}
              tiltDeg={tiltDeg}
              isRetracted={isRetracted}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  )
}