"use client";

import React, { Suspense, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { DirectPluginScene } from "./scene/direct-plugin-scene";
import { StorageHybridScene } from "./scene/storage-hybrid-scene";
import { StandaloneScene } from "./scene/standalone-scene";
import type { EcosystemModelId } from "../ecosystem-3d-full-view";

interface PinData {
  id: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  subtitle: string;
  subColor: string;
  borderColor: string;
  worldPos: [number, number, number];
}

/**
 * 3D空間のワールド座標をスクリーン(px)座標へ変換し、DOMへ通知するコンポーネント
 * （Canvas 内部で動作するが DOM createRoot を生成しないため React 19 で 100% 安全）
 */
function ScreenProjector({
  pins,
  onUpdate,
}: {
  pins: PinData[];
  onUpdate: (coords: { id: string; x: number; y: number; visible: boolean }[]) => void;
}) {
  const { camera, size } = useThree();
  const v = useRef(new THREE.Vector3());

  useFrame(() => {
    const coords = pins.map((pin) => {
      v.current.set(...pin.worldPos);
      v.current.project(camera);

      const isBehind = v.current.z > 1;
      const x = ((v.current.x + 1) * size.width) / 2;
      const y = ((-v.current.y + 1) * size.height) / 2;

      return {
        id: pin.id,
        x,
        y,
        visible: !isBehind,
      };
    });
    onUpdate(coords);
  });

  return null;
}

interface Ecosystem3DViewerProps {
  modelId: EcosystemModelId;
}

export function Ecosystem3DViewer({ modelId }: Ecosystem3DViewerProps) {
  const t = useTranslations("worldPv");
  const [screenCoords, setScreenCoords] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});

  const pins: PinData[] = React.useMemo(() => {
    if (modelId === "direct-plugin") {
      return [
        {
          id: "solar",
          badge: "1",
          badgeBg: "bg-emerald-500",
          badgeText: "text-slate-950",
          title: t("ecosystem.pins3d.directPlugin.solar.title"),
          subtitle: t("ecosystem.pins3d.directPlugin.solar.subtitle"),
          subColor: "text-emerald-400",
          borderColor: "border-emerald-500/60",
          worldPos: [-3.3, 1.4, 0],
        },
        {
          id: "inverter",
          badge: "2",
          badgeBg: "bg-sky-500",
          badgeText: "text-slate-950",
          title: t("ecosystem.pins3d.directPlugin.inverter.title"),
          subtitle: t("ecosystem.pins3d.directPlugin.inverter.subtitle"),
          subColor: "text-sky-400",
          borderColor: "border-sky-500/60",
          worldPos: [-2.75, 1.0, -1.0],
        },
        {
          id: "outlet",
          badge: "✓",
          badgeBg: "bg-emerald-500/20",
          badgeText: "text-emerald-400",
          title: t("ecosystem.pins3d.directPlugin.outlet.title"),
          subtitle: t("ecosystem.pins3d.directPlugin.outlet.subtitle"),
          subColor: "text-emerald-400",
          borderColor: "border-emerald-500/60",
          worldPos: [-0.7, 0.9, -1.3],
        },
      ];
    }
    if (modelId === "storage-hybrid") {
      return [
        {
          id: "solar",
          badge: "1",
          badgeBg: "bg-emerald-500",
          badgeText: "text-slate-950",
          title: t("ecosystem.pins3d.storageHybrid.solar.title"),
          subtitle: t("ecosystem.pins3d.storageHybrid.solar.subtitle"),
          subColor: "text-emerald-400",
          borderColor: "border-emerald-500/60",
          worldPos: [-3.3, 1.4, 0],
        },
        {
          id: "battery",
          badge: "2",
          badgeBg: "bg-emerald-500",
          badgeText: "text-slate-950",
          title: t("ecosystem.pins3d.storageHybrid.battery.title"),
          subtitle: t("ecosystem.pins3d.storageHybrid.battery.subtitle"),
          subColor: "text-emerald-400",
          borderColor: "border-emerald-500/60",
          worldPos: [1.4, 0.9, -0.4],
        },
        {
          id: "grid-cutoff",
          badge: "✕",
          badgeBg: "bg-rose-500/20",
          badgeText: "text-rose-400",
          title: t("ecosystem.pins3d.storageHybrid.gridCutoff.title"),
          subtitle: t("ecosystem.pins3d.storageHybrid.gridCutoff.subtitle"),
          subColor: "text-rose-400",
          borderColor: "border-rose-500/50",
          worldPos: [3.5, 1.6, -1.75],
        },
      ];
    }
    return [
      {
        id: "solar",
        badge: "1",
        badgeBg: "bg-emerald-500",
        badgeText: "text-slate-950",
        title: t("ecosystem.pins3d.offgridStandalone.solar.title"),
        subtitle: t("ecosystem.pins3d.offgridStandalone.solar.subtitle"),
        subColor: "text-emerald-400",
        borderColor: "border-emerald-500/60",
        worldPos: [-3.3, 1.4, 0],
      },
      {
        id: "hub",
        badge: "2",
        badgeBg: "bg-emerald-500",
        badgeText: "text-slate-950",
        title: t("ecosystem.pins3d.offgridStandalone.hub.title"),
        subtitle: t("ecosystem.pins3d.offgridStandalone.hub.subtitle"),
        subColor: "text-emerald-400",
        borderColor: "border-emerald-500/60",
        worldPos: [1.4, 0.9, -0.4],
      },
      {
        id: "living",
        badge: "3",
        badgeBg: "bg-sky-500",
        badgeText: "text-slate-950",
        title: t("ecosystem.pins3d.offgridStandalone.living.title"),
        subtitle: t("ecosystem.pins3d.offgridStandalone.living.subtitle"),
        subColor: "text-sky-400",
        borderColor: "border-sky-500/60",
        worldPos: [0.5, 1.0, 0.7],
      },
    ];
  }, [modelId, t]);

  return (
    <div className="w-full h-full relative min-h-0 overflow-hidden">
      {pins.map((pin) => {
        const coord = screenCoords[pin.id];
        if (!coord || !coord.visible) return null;

        return (
          <div
            key={pin.id}
            className="absolute pointer-events-none select-none z-10 -translate-x-1/2 -translate-y-full transition-transform duration-75"
            style={{
              left: `${coord.x}px`,
              top: `${coord.y - 12}px`,
            }}
          >
            <div
              className={`flex items-center gap-1.5 bg-slate-950/90 backdrop-blur border ${pin.borderColor} px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap`}
            >
              <span
                className={`w-4 h-4 rounded-full ${pin.badgeBg} ${pin.badgeText} font-bold text-[10px] flex items-center justify-center`}
              >
                {pin.badge}
              </span>
              <div>
                <div className="text-xs font-bold text-slate-100">{pin.title}</div>
                <div className={`text-[10px] ${pin.subColor} font-medium`}>
                  {pin.subtitle}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [7, 6, 9],
          fov: 45,
          near: 0.1,
          far: 50,
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#0B0F17"]} />

        <ambientLight intensity={0.85} color="#ffffff" />
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.5}
          color="#fffbeb"
          castShadow
        />
        <directionalLight
          position={[-10, 8, -6]}
          intensity={0.65}
          color="#94a3b8"
        />
        <hemisphereLight
          args={["#bae6fd", "#334155", 0.6]}
          position={[0, 20, 0]}
        />

        <Suspense fallback={null}>
          {modelId === "direct-plugin" && <DirectPluginScene key="direct-plugin" />}
          {modelId === "storage-hybrid" && <StorageHybridScene key="storage-hybrid" />}
          {modelId === "offgrid-standalone" && (
            <StandaloneScene key="offgrid-standalone" />
          )}

          <ScreenProjector
            pins={pins}
            onUpdate={(coords) => {
              setScreenCoords((prev) => {
                const next: Record<string, { x: number; y: number; visible: boolean }> =
                  {};
                for (const c of coords) {
                  next[c.id] = c;
                }
                return next;
              });
            }}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
