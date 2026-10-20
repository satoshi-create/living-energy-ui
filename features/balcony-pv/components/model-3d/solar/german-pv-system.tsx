'use client'

import { MathUtils } from 'three'
import { GERMAN_BALCONY_DIMS } from '../constants/dimensions'
import { MATERIALS } from '../constants/materials'
import { usePanelTilt } from '../scene/tilt-context'

/** マイクロインバータ＋壁・床密着プラグイン配線システム。 */
export function GermanInverterSystem() {
  return (
    <>
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
          <meshStandardMaterial {...MATERIALS.cable} />
        </mesh>
        {/* ② 床面を這って奥の壁面へ向かうDCライン（Z: 0.60 ➔ -0.66） */}
        <mesh position={[-0.35, 0.006, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 1.26, 8]} />
          <meshStandardMaterial {...MATERIALS.cable} />
        </mesh>
        {/* ③ 奥の壁面を立ち上がりインバータ右下端子へ接続 */}
        <mesh position={[-0.35, 0.35, -0.66]}>
          <cylinderGeometry args={[0.005, 0.005, 0.68, 8]} />
          <meshStandardMaterial {...MATERIALS.cable} />
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
    </>
  )
}

/** 室内Schuko（F型）230V壁コンセント＋差し込みプラグ（PLUG & PLAY）。 */
export function GermanWallOutlet() {
  return (
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
  )
}

/** 腰壁用引っ掛けブラケット金具＋傾斜連動ソーラーパネル。 */
export function GermanPanelMount() {
  const { tiltDeg, isRetracted } = usePanelTilt()
  const tiltRad = MathUtils.degToRad(isRetracted ? 0 : tiltDeg)

  return (
    <>
      {/* 6. 専用コンクリート腰壁用引っ掛けブラケット金具（2基） */}
      {[-0.52, 0.52].map((x, i) => (
        <group key={`de-bracket-${i}`} position={[x, 0, 0.72]}>
          {/* 天端跨ぎ金具（笠木を上から抱え込む） */}
          <mesh position={[0, 1.035, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.3]} />
            <meshStandardMaterial {...MATERIALS.steelHardware} />
          </mesh>
          {/* 外側垂直支持レール */}
          <mesh position={[0, 0.65, 0.15]}>
            <boxGeometry args={[0.04, 0.75, 0.03]} />
            <meshStandardMaterial {...MATERIALS.steelHardware} />
          </mesh>
          {/* 内側固定クランプ */}
          <mesh position={[0, 0.92, -0.14]}>
            <boxGeometry args={[0.05, 0.18, 0.03]} />
            <meshStandardMaterial color="#475569" metalness={0.75} roughness={0.3} />
          </mesh>
          {/* 下部壁当てストッパーボルト */}
          <mesh position={[0, 0.32, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.04, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 7. ソーラーパネル本体（ドイツ標準 400W〜800W級 結晶Si / 化合物薄膜） */}
      <group position={[0, 0.62, GERMAN_BALCONY_DIMS.panel.z]}>
        <group rotation={[isRetracted ? 0 : -tiltRad * 0.4, 0, 0]}>
          {/* パネル枠・バックシート */}
          <mesh castShadow>
            <boxGeometry
              args={[
                GERMAN_BALCONY_DIMS.panel.width,
                GERMAN_BALCONY_DIMS.panel.height,
                GERMAN_BALCONY_DIMS.panel.thickness,
              ]}
            />
            <meshStandardMaterial {...MATERIALS.pvFrame} />
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
    </>
  )
}
