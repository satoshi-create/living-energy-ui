'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTranslations } from 'next-intl'
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
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#1a6b4a" metalness={0.35} roughness={0.45} />
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
  return (
    <group>
      <mesh position={[0, 0.7, -0.7]}>
        <boxGeometry args={[2.2, 1.8, 0.2]} />
        <meshStandardMaterial color="#8a8a88" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[2.0, 0.1, 1.2]} />
        <meshStandardMaterial color="#7a7a78" roughness={0.95} />
      </mesh>
      {/* thick parapet */}
      <mesh position={[0, 0.45, 0.52]}>
        <boxGeometry args={[2.0, 0.85, 0.22]} />
        <meshStandardMaterial color="#9a9a96" roughness={0.92} />
      </mesh>
      {/* clamp mounts */}
      {[-0.45, 0.45].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.55, 0.66]}>
            <boxGeometry args={[0.12, 0.28, 0.08]} />
            <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[x, 0.55, 0.38]}>
            <boxGeometry args={[0.12, 0.28, 0.08]} />
            <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <Panel position={[0, 0.72, 0.72]} rotation={[-0.15, 0, 0]} args={[1.1, 0.05, 0.7]} />
    </group>
  )
}

function JapaneseEvacuationBalcony() {
  return (
    <group>
      <mesh position={[0, 1.0, -0.85]}>
        <boxGeometry args={[2.4, 2.0, 0.16]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.85} />
      </mesh>
      {/* standard-depth floor */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[2.2, 0.08, 1.4]} />
        <meshStandardMaterial color="#6b6b68" roughness={0.9} />
      </mesh>
      {/* aluminium railing */}
      <mesh position={[0, 0.55, 0.68]}>
        <boxGeometry args={[2.15, 0.04, 0.04]} />
        <meshStandardMaterial color="#c8cdd2" metalness={0.65} roughness={0.35} />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[-1.0 + i * 0.2, 0.3, 0.68]}>
          <boxGeometry args={[0.03, 0.5, 0.03]} />
          <meshStandardMaterial color="#b8bec4" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* evacuation kick-out panel */}
      <mesh position={[0.85, 0.28, 0.68]}>
        <boxGeometry args={[0.35, 0.45, 0.05]} />
        <meshStandardMaterial color="#a8adb2" metalness={0.5} roughness={0.45} />
      </mesh>
      {/* stowable endai bench + panel */}
      <mesh position={[-0.35, 0.18, 0.1]}>
        <boxGeometry args={[0.9, 0.28, 0.45]} />
        <meshStandardMaterial color="#8b6914" roughness={0.7} />
      </mesh>
      <Panel position={[-0.35, 0.42, 0.05]} rotation={[-0.55, 0, 0]} args={[0.75, 0.04, 0.55]} />
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

const CAMERA_PRESETS: Record<
  Surface3DCameraPreset,
  { position: [number, number, number] }
> = {
  '0°': { position: [0, 1.6, 3.6] },
  '30°': { position: [2.4, 1.8, 2.8] },
  '90°': { position: [3.6, 1.5, 0.2] },
}

function CameraPresetController({
  preset,
  enabled,
}: {
  preset: Surface3DCameraPreset
  enabled: boolean
}) {
  const { camera } = useThree()

  useEffect(() => {
    if (!enabled) return
    const { position } = CAMERA_PRESETS[preset]
    camera.position.set(...position)
    camera.lookAt(0, 0.6, 0)
    camera.updateProjectionMatrix()
  }, [preset, enabled, camera])

  if (!enabled) return null

  return (
    <OrbitControls
      enablePan
      minDistance={2.0}
      maxDistance={10}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 0.6, 0]}
    />
  )
}

function SurfaceScene({
  profileId,
  cameraPreset,
  full,
}: {
  profileId: Surface3dModelId
  cameraPreset: Surface3DCameraPreset
  full: boolean
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

  return (
    <>
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
        <OrbitControls
          enablePan={false}
          minDistance={2.2}
          maxDistance={7}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.6, 0]}
        />
      )}
    </>
  )
}

export function Surface3DViewer({
  profileId,
  className,
  variant = 'preview',
  cameraPreset = '30°',
}: Surface3DViewerProps) {
  const t = useTranslations('worldPv.architecture.surface3d')
  const full = variant === 'full'
  const cam = CAMERA_PRESETS[cameraPreset]

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
            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
              …
            </div>
          }
        >
          <Canvas
            key={`${profileId}-${full ? cameraPreset : 'preview'}`}
            dpr={[1, full ? 2 : 1.5]}
            camera={{
              position: cam.position,
              fov: full ? 38 : 42,
              near: 0.1,
              far: 40,
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
            />
          </Canvas>
        </Suspense>
      </div>
      {!full && (
        <>
          <p className="border-t border-border/40 px-2.5 py-1.5 text-[10px] leading-snug text-muted-foreground">
            {t(`models.${profileId}`)}
          </p>
          <p className="px-2.5 pb-2 text-[10px] text-slate-500">{t('hint')}</p>
        </>
      )}
    </div>
  )
}
