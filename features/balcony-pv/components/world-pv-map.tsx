'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, Minus, Plus, RotateCcw } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import {
  CountryPvDetail,
  AFRICA_LEAPFROG_TIMELINE,
  ASIA_OCEANIA_TRANSITION_TIMELINE,
  INDIA_LIVELIHOOD_TIMELINE,
  MOVEMENT_HISTORY_PHASES,
  SOUTHEAST_ASIA_ISLAND_TIMELINE,
  WORLD_BALCONY_PV_COUNTRIES,
  getAfricaLeapfrogPhaseById,
  getAsiaOceaniaPhaseById,
  getIndiaLivelihoodPhaseById,
  getMaturityScore,
  getMovementPhaseById,
  getSoutheastAsiaIslandPhaseById,
  matchesModelFilter,
  resolveRegionCategory,
  type AfricaLeapfrogPhaseId,
  type AsiaOceaniaPhaseId,
  type IndiaLivelihoodPhaseId,
  type MilestoneKeyActor,
  type MovementHistoryPhaseId,
  type MovementMilestone,
  type RegionCategory,
  type SoutheastAsiaIslandPhaseId,
} from '../data';

export type { MovementHistoryPhaseId };

interface WorldPvMapProps {
  selectedCountryId: string;
  onSelectCountry: (country: CountryPvDetail | null) => void;
  isRankingOpen: boolean;
  onRankingOpenChange: (open: boolean) => void;
  isMovementHistoryOpen: boolean;
  onMovementHistoryOpenChange: (open: boolean) => void;
  historyPhase: MovementHistoryPhaseId | null;
  onHistoryPhaseChange: (phase: MovementHistoryPhaseId | null) => void;
  /** サイドバーのマイルストーン連動用。regionId を渡すとピン強調・パンする */
  historyFocusRegionId?: string | null;
}

type RegionFocus = 'all' | RegionCategory;

type MapCamera = { center: [number, number]; zoom: number };

/** Mobile width (< sm / 768px) → europe; desktop → all. */
function getDefaultRegionFocus(): RegionFocus {
  if (typeof window === 'undefined') return 'all';
  return window.matchMedia('(max-width: 767px)').matches ? 'europe' : 'all';
}

const PARENT_IDS_WITH_CHILDREN = new Set(
  WORLD_BALCONY_PV_COUNTRIES.map((c) => c.parentId).filter((id): id is string => Boolean(id))
);

/** Leaf (and non-grouped) regions rendered as map pins. */
const MAP_PIN_COUNTRIES = WORLD_BALCONY_PV_COUNTRIES.filter(
  (c) => !PARENT_IDS_WITH_CHILDREN.has(c.id)
);

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const MIN_ZOOM = 1;
const MAX_ZOOM = 14;
const ZOOM_STEP = 1.25;
const COUNTRY_CAMERA_ZOOM = 8;

const REGION_CAMERA: Record<RegionFocus, MapCamera> = {
  all: { center: [10, 20], zoom: 1 },
  europe: { center: [15, 50], zoom: 3.5 },
  africa: { center: [25, 2], zoom: 3.2 },
  'asia-oceania': { center: [120, 5], zoom: 2.0 },
  americas: { center: [-70, 10], zoom: 2.2 },
};

const FOCUS_TABS: readonly {
  id: RegionFocus;
  labelKey: string;
  label: string;
  zoom?: boolean;
}[] = [
  { id: 'all', labelKey: 'focusAll', label: '地域' },
  { id: 'europe', labelKey: 'focusEurope', label: '欧州', zoom: true },
  { id: 'africa', labelKey: 'focusAfrica', label: 'アフリカ', zoom: true },
  { id: 'asia-oceania', labelKey: 'focusAsiaOceania', label: 'アジア・オセアニア', zoom: true },
  { id: 'americas', labelKey: 'focusAmericas', label: '北米・米州', zoom: true },
];

function clampZoom(z: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}

/** Per-country label offset so dense clusters (W. Europe / E. Africa) don't overlap. */
const getLabelOffset = (id: string): { x: number; y: number; textAnchor: 'middle' | 'start' | 'end' } => {
  switch (id) {
    // 西欧クラスタ
    case 'gb':
      return { x: -12, y: -16, textAnchor: 'end' }; // イギリス: 左上
    case 'be':
      return { x: -8, y: -12, textAnchor: 'end' }; // ベルギー: 左上寄り
    case 'de':
      return { x: 12, y: -16, textAnchor: 'start' }; // ドイツ: 右上
    case 'fr':
      return { x: -16, y: 0, textAnchor: 'end' }; // フランス: 左横
    case 'ch':
      return { x: 0, y: -13, textAnchor: 'middle' }; // スイス: 真上
    case 'at':
      return { x: 16, y: -6, textAnchor: 'start' }; // オーストリア: 右横
    case 'it':
      return { x: 0, y: 16, textAnchor: 'middle' }; // イタリア: 下

    // 東アフリカクラスタ
    case 'et':
      return { x: 12, y: -12, textAnchor: 'start' }; // エチオピア: 右上
    case 'ug':
      return { x: -12, y: -12, textAnchor: 'end' }; // ウガンダ: 左上
    case 'ke':
      return { x: 14, y: 0, textAnchor: 'start' }; // ケニア: 右横
    case 'rw':
      return { x: -14, y: 8, textAnchor: 'end' }; // ルワンダ: 左下
    case 'tz':
      return { x: 0, y: 18, textAnchor: 'middle' }; // タンザニア: 下

    // 北米クラスタ
    case 'us-ca':
      return { x: -14, y: 0, textAnchor: 'end' }; // カリフォルニア: 左横
    case 'us-ut':
      return { x: 12, y: -12, textAnchor: 'start' }; // ユタ: 右上

    default:
      return { x: 0, y: -14, textAnchor: 'middle' };
  }
};

function statusColor(status: CountryPvDetail['status']): string {
  switch (status) {
    case 'legal_plug':
      return '#10b981';
    case 'plug_exemption':
      return '#06b6d4';
    case 'appliance_notified':
      return '#3b82f6';
    case 'storage_only':
      return '#f59e0b';
    case 'productive_offgrid':
      return '#8b5cf6';
    case 'micro_solar_kit':
      return '#f43f5e';
    case 'strict_code':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

function historyPhaseRegion(
  phase: MovementHistoryPhaseId | null
): 'europe' | 'americas' | null {
  if (!phase) return null;
  return phase === 'usSpread' ? 'americas' : 'europe';
}

/** マイルストーン内の非営利団体・突破アクションサブカード（欧米・アフリカ共通） */
function MilestoneKeyActorCard({
  actor,
  isEn,
  barrierLabel,
  milestoneLabel,
}: {
  actor: MilestoneKeyActor;
  isEn: boolean;
  barrierLabel: string;
  milestoneLabel: string;
}) {
  const name = isEn && actor.nameEn ? actor.nameEn : actor.name;
  const roleBadge = isEn && actor.roleBadgeEn ? actor.roleBadgeEn : actor.roleBadge;
  const barrier = isEn && actor.barrierEn ? actor.barrierEn : actor.barrier;
  const achievement = isEn && actor.achievementEn ? actor.achievementEn : actor.achievement;
  return (
    <div className="mt-1.5 rounded-md border border-slate-600/70 bg-slate-900/70 px-2.5 py-2">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold leading-relaxed text-slate-100">{name}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{roleBadge}</p>
        </div>
        {actor.url ? (
          <a
            href={actor.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} official site`}
            className="shrink-0 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-700/80 hover:text-emerald-300"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ExternalLink className="size-3.5" />
          </a>
        ) : null}
      </div>
      <p className="text-xs leading-relaxed text-orange-300/95">
        ⚡ <span className="font-medium">{barrierLabel}</span>: {barrier}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-emerald-300/95">
        🎯 <span className="font-medium">{milestoneLabel}</span>: {achievement}
      </p>
    </div>
  );
}

function MilestoneCard({
  ms,
  focused,
  onFocus,
  isEn,
  barrierLabel,
  milestoneLabel,
}: {
  ms: MovementMilestone;
  focused: boolean;
  onFocus: () => void;
  isEn: boolean;
  barrierLabel: string;
  milestoneLabel: string;
}) {
  const regionName = isEn && ms.regionNameEn ? ms.regionNameEn : ms.regionName;
  const summary = isEn && ms.summaryEn ? ms.summaryEn : ms.summary;
  return (
    <li className="relative pl-3">
      <span
        aria-hidden
        className="absolute top-3 left-0 size-1.5 rounded-full bg-slate-500 ring-2 ring-slate-800"
      />
      <div
        className={`rounded-md border transition-colors ${
          focused
            ? 'border-cyan-500/50 bg-cyan-500/15'
            : 'border-transparent hover:border-slate-600 hover:bg-slate-800/60'
        }`}
      >
        <button
          type="button"
          onClick={onFocus}
          className="w-full px-2.5 py-2 text-left"
        >
          <div className="mb-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-mono text-sm font-medium text-slate-400">{ms.date}</span>
            <span className="text-sm font-medium text-emerald-300">{regionName}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
        </button>
        {ms.keyActor ? (
          <div className="px-2.5 pb-2">
            <MilestoneKeyActorCard
              actor={ms.keyActor}
              isEn={isEn}
              barrierLabel={barrierLabel}
              milestoneLabel={milestoneLabel}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}

type TimelinePhaseView = {
  id: string;
  period: string;
  title: string;
  milestones: MovementMilestone[];
};

type TimelineSidebarAccent = {
  activeBorder: string;
  activeBg: string;
  chevron: string;
  period: string;
};

type TimelineSidebarProps = {
  title: string;
  subtitle?: string;
  phases: TimelinePhaseView[];
  openPhaseIds: ReadonlySet<string>;
  activePhaseId: string | null;
  focusRegionId: string | null;
  accent: TimelineSidebarAccent;
  closeLabel: string;
  isEn: boolean;
  barrierLabel: string;
  milestoneLabel: string;
  onClose: () => void;
  onTogglePhase: (id: string) => void;
  onFocusMilestone: (phaseId: string, regionId: string) => void;
};

/** 欧米伝播史・アフリカ跳躍史で共用するタイムラインサイドバー */
function TimelineSidebar({
  title,
  subtitle,
  phases,
  openPhaseIds,
  activePhaseId,
  focusRegionId,
  accent,
  closeLabel,
  isEn,
  barrierLabel,
  milestoneLabel,
  onClose,
  onTogglePhase,
  onFocusMilestone,
}: TimelineSidebarProps) {
  return (
    <aside
      className="absolute top-0 right-0 z-30 flex h-full w-[min(90vw,520px)] max-w-[90vw] flex-col border-l border-border/60 bg-card/95 shadow-xl backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          aria-label={closeLabel}
          className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
        >
          {closeLabel}
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {phases.map((phase) => {
          const isOpen = openPhaseIds.has(phase.id);
          const isActive = activePhaseId === phase.id;
          return (
            <div
              key={phase.id}
              className={`rounded-lg border ${
                isActive
                  ? `${accent.activeBorder} ${accent.activeBg}`
                  : 'border-border/50 bg-background/60'
              }`}
            >
              <button
                type="button"
                onClick={() => onTogglePhase(phase.id)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
              >
                <span className={`mt-0.5 text-sm ${accent.chevron}`}>{isOpen ? '▾' : '▸'}</span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-xs font-medium tracking-wide uppercase ${accent.period}`}
                  >
                    {phase.period}
                  </span>
                  <span className="block text-base font-semibold leading-snug text-foreground">
                    {phase.title}
                  </span>
                </span>
              </button>
              {isOpen ? (
                <ul className="relative space-y-1.5 border-t border-border/40 px-3 py-2.5 before:absolute before:top-3 before:bottom-3 before:left-[calc(0.75rem+3px)] before:w-px before:bg-slate-700/80">
                  {phase.milestones.map((ms) => {
                    const focused =
                      focusRegionId === ms.regionId && activePhaseId === phase.id;
                    return (
                      <MilestoneCard
                        key={ms.id}
                        ms={ms}
                        focused={focused}
                        onFocus={() => onFocusMilestone(phase.id, ms.regionId)}
                        isEn={isEn}
                        barrierLabel={barrierLabel}
                        milestoneLabel={milestoneLabel}
                      />
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

const CYAN_TIMELINE_ACCENT: TimelineSidebarAccent = {
  activeBorder: 'border-cyan-500/40',
  activeBg: 'bg-cyan-500/10',
  chevron: 'text-cyan-300',
  period: 'text-cyan-300/90',
};

const VIOLET_TIMELINE_ACCENT: TimelineSidebarAccent = {
  activeBorder: 'border-violet-500/40',
  activeBg: 'bg-violet-500/10',
  chevron: 'text-violet-300',
  period: 'text-violet-300/90',
};

const EMERALD_TIMELINE_ACCENT: TimelineSidebarAccent = {
  activeBorder: 'border-emerald-500/40',
  activeBg: 'bg-emerald-500/10',
  chevron: 'text-emerald-300',
  period: 'text-emerald-300/90',
};

const AMBER_TIMELINE_ACCENT: TimelineSidebarAccent = {
  activeBorder: 'border-amber-500/40',
  activeBg: 'bg-amber-500/10',
  chevron: 'text-amber-300',
  period: 'text-amber-300/90',
};

const SKY_TIMELINE_ACCENT: TimelineSidebarAccent = {
  activeBorder: 'border-sky-500/40',
  activeBg: 'bg-sky-500/10',
  chevron: 'text-sky-300',
  period: 'text-sky-300/90',
};

const SOUTHEAST_ASIA_PIN_IDS = new Set(['vn', 'sg', 'indonesia', 'philippines']);

const MOVEMENT_PHASE_FALLBACKS: Record<
  MovementHistoryPhaseId,
  { period: string; title: string }
> = {
  guerrilla: { period: '2019〜2021', title: 'ドイツ・ゲリラ連系時代' },
  energyCrisis: { period: '2020〜2023', title: 'エネルギー危機と欧州拡大' },
  euDomino: { period: '2023〜2025', title: '欧州ドミノ / Solarpaket I' },
  usSpread: { period: '2025〜2026', title: '米国 1,200W免除・蓄電シフト' },
};

const PHASE_CAMERA_ZOOM = 4.2;
const MILESTONE_CAMERA_ZOOM = 8;

function cameraForRegionIds(regionIds: string[]): MapCamera | null {
  const pts = regionIds
    .map((id) => WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === id)?.coordinates)
    .filter((c): c is [number, number] => Boolean(c));
  if (pts.length === 0) return null;
  const lng = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const lat = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return { center: [lng, lat], zoom: PHASE_CAMERA_ZOOM };
}

export function WorldPvMap({
  selectedCountryId,
  onSelectCountry,
  isRankingOpen,
  onRankingOpenChange,
  isMovementHistoryOpen,
  onMovementHistoryOpenChange,
  historyPhase,
  onHistoryPhaseChange,
  historyFocusRegionId = null,
}: WorldPvMapProps) {
  const t = useTranslations('worldPv');
  const locale = useLocale();
  const isEn = locale === 'en';
  const closeLabel = t('detail.close');
  const barrierLabel = t('analysis.barrierOvercome');
  const milestoneLabel = t('analysis.keyMilestone');
  const [regionFocus, setRegionFocus] = useState<RegionFocus>('all');
  const [selectedModelType, setSelectedModelType] = useState<string>('all');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number]>(REGION_CAMERA.all.center);
  const [zoom, setZoom] = useState(REGION_CAMERA.all.zoom);
  const [isAfricaLeapfrogOpen, setIsAfricaLeapfrogOpen] = useState(false);
  const [africaPhase, setAfricaPhase] = useState<AfricaLeapfrogPhaseId | null>(null);
  const [africaFocusRegionId, setAfricaFocusRegionId] = useState<string | null>(null);
  const [africaOpenPhases, setAfricaOpenPhases] = useState<Set<AfricaLeapfrogPhaseId>>(
    () => new Set()
  );
  const [isAsiaOceaniaOpen, setIsAsiaOceaniaOpen] = useState(false);
  const [asiaPhase, setAsiaPhase] = useState<AsiaOceaniaPhaseId | null>(null);
  const [asiaFocusRegionId, setAsiaFocusRegionId] = useState<string | null>(null);
  const [asiaOpenPhases, setAsiaOpenPhases] = useState<Set<AsiaOceaniaPhaseId>>(() => new Set());
  const [isIndiaLivelihoodOpen, setIsIndiaLivelihoodOpen] = useState(false);
  const [indiaPhase, setIndiaPhase] = useState<IndiaLivelihoodPhaseId | null>(null);
  const [indiaFocusRegionId, setIndiaFocusRegionId] = useState<string | null>(null);
  const [indiaOpenPhases, setIndiaOpenPhases] = useState<Set<IndiaLivelihoodPhaseId>>(
    () => new Set()
  );
  const [isSoutheastAsiaOpen, setIsSoutheastAsiaOpen] = useState(false);
  const [seaPhase, setSeaPhase] = useState<SoutheastAsiaIslandPhaseId | null>(null);
  const [seaFocusRegionId, setSeaFocusRegionId] = useState<string | null>(null);
  const [seaOpenPhases, setSeaOpenPhases] = useState<Set<SoutheastAsiaIslandPhaseId>>(
    () => new Set()
  );
  const [movementOpenPhases, setMovementOpenPhases] = useState<Set<MovementHistoryPhaseId>>(
    () => new Set()
  );
  const [movementFocusRegionId, setMovementFocusRegionId] = useState<string | null>(null);

  const activePhase = getMovementPhaseById(historyPhase);
  const activeAfricaPhase = getAfricaLeapfrogPhaseById(africaPhase);
  const activeAsiaPhase = getAsiaOceaniaPhaseById(asiaPhase);
  const activeIndiaPhase = getIndiaLivelihoodPhaseById(indiaPhase);
  const activeSeaPhase = getSoutheastAsiaIslandPhaseById(seaPhase);
  const historyHighlightRegion: RegionCategory | null = isMovementHistoryOpen
    ? historyPhaseRegion(historyPhase)
    : isAfricaLeapfrogOpen
      ? 'africa'
      : isIndiaLivelihoodOpen || isAsiaOceaniaOpen || isSoutheastAsiaOpen
        ? 'asia-oceania'
        : null;
  const historyTargetIds = new Set(
    isAfricaLeapfrogOpen
      ? (activeAfricaPhase?.targetRegionIds ?? [])
      : isSoutheastAsiaOpen
        ? (activeSeaPhase?.targetRegionIds ?? ['vn', 'sg'])
        : isIndiaLivelihoodOpen
          ? (activeIndiaPhase?.targetRegionIds ?? ['in'])
          : isAsiaOceaniaOpen
            ? (activeAsiaPhase?.targetRegionIds ?? [])
            : (activePhase?.targetRegionIds ?? [])
  );
  const focusedMilestoneRegionId =
    isAfricaLeapfrogOpen && africaFocusRegionId
      ? africaFocusRegionId
      : isSoutheastAsiaOpen && seaFocusRegionId
        ? seaFocusRegionId
        : isIndiaLivelihoodOpen && indiaFocusRegionId
          ? indiaFocusRegionId
          : isAsiaOceaniaOpen && asiaFocusRegionId
            ? asiaFocusRegionId
            : isMovementHistoryOpen && (movementFocusRegionId || historyFocusRegionId)
              ? (movementFocusRegionId ?? historyFocusRegionId)
              : null;
  const isAnyHistoryOpen =
    isMovementHistoryOpen ||
    isAfricaLeapfrogOpen ||
    isAsiaOceaniaOpen ||
    isIndiaLivelihoodOpen ||
    isSoutheastAsiaOpen;

  const didInitRegionRef = useRef(false);

  // SP (< 768px) のみ初期リージョンを欧州に。SSR/ハイドレーション不一致を避けるためマウント後に判定。
  useLayoutEffect(() => {
    if (didInitRegionRef.current) return;
    didInitRegionRef.current = true;
    const initial = getDefaultRegionFocus();
    if (initial !== 'all') {
      setRegionFocus(initial);
      const cam = REGION_CAMERA[initial];
      setCenter(cam.center);
      setZoom(cam.zoom);
    }
  }, []);

  useLayoutEffect(() => {
    if (!isMovementHistoryOpen || !historyPhase) return;
    if (movementFocusRegionId || historyFocusRegionId) return;
    const phase = getMovementPhaseById(historyPhase);
    if (!phase) return;
    const cam =
      cameraForRegionIds(phase.targetRegionIds) ??
      REGION_CAMERA[historyPhaseRegion(historyPhase) ?? 'europe'];
    setCenter(cam.center);
    setZoom(cam.zoom);
    const macro = historyPhaseRegion(historyPhase);
    if (macro) setRegionFocus(macro);
  }, [isMovementHistoryOpen, historyPhase, historyFocusRegionId, movementFocusRegionId]);

  useLayoutEffect(() => {
    const focusId = movementFocusRegionId || historyFocusRegionId;
    if (!isMovementHistoryOpen || !focusId) return;
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === focusId);
    if (!country) return;
    setCenter(country.coordinates);
    setZoom(clampZoom(MILESTONE_CAMERA_ZOOM));
    setHoveredRegionId(focusId);
  }, [isMovementHistoryOpen, historyFocusRegionId, movementFocusRegionId]);

  // アフリカ跳躍史オープン時: 大陸中心へパン＆ズーム
  useLayoutEffect(() => {
    if (!isAfricaLeapfrogOpen) return;
    if (africaFocusRegionId) return;
    if (africaPhase) {
      const phase = getAfricaLeapfrogPhaseById(africaPhase);
      if (phase) {
        const cam = cameraForRegionIds(phase.targetRegionIds) ?? REGION_CAMERA.africa;
        setCenter(cam.center);
        setZoom(cam.zoom);
        setRegionFocus('africa');
        return;
      }
    }
    const cam = REGION_CAMERA.africa;
    setCenter(cam.center);
    setZoom(cam.zoom);
    setRegionFocus('africa');
  }, [isAfricaLeapfrogOpen, africaPhase, africaFocusRegionId]);

  useLayoutEffect(() => {
    if (!isAfricaLeapfrogOpen || !africaFocusRegionId) return;
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === africaFocusRegionId);
    if (!country) return;
    setCenter(country.coordinates);
    setZoom(clampZoom(MILESTONE_CAMERA_ZOOM));
    setHoveredRegionId(africaFocusRegionId);
  }, [isAfricaLeapfrogOpen, africaFocusRegionId]);

  // アジア・オセアニア転換史オープン時: 域内中心へパン＆ズーム
  useLayoutEffect(() => {
    if (!isAsiaOceaniaOpen) return;
    if (asiaFocusRegionId) return;
    if (asiaPhase) {
      const phase = getAsiaOceaniaPhaseById(asiaPhase);
      if (phase) {
        const cam = cameraForRegionIds(phase.targetRegionIds) ?? REGION_CAMERA['asia-oceania'];
        setCenter(cam.center);
        setZoom(cam.zoom);
        setRegionFocus('asia-oceania');
        return;
      }
    }
    const cam = REGION_CAMERA['asia-oceania'];
    setCenter(cam.center);
    setZoom(cam.zoom);
    setRegionFocus('asia-oceania');
  }, [isAsiaOceaniaOpen, asiaPhase, asiaFocusRegionId]);

  useLayoutEffect(() => {
    if (!isAsiaOceaniaOpen || !asiaFocusRegionId) return;
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === asiaFocusRegionId);
    if (!country) return;
    setCenter(country.coordinates);
    setZoom(clampZoom(MILESTONE_CAMERA_ZOOM));
    setHoveredRegionId(asiaFocusRegionId);
  }, [isAsiaOceaniaOpen, asiaFocusRegionId]);

  // インド生計跳躍史オープン時: インド中心へパン＆ズーム
  useLayoutEffect(() => {
    if (!isIndiaLivelihoodOpen) return;
    if (indiaFocusRegionId) return;
    if (indiaPhase) {
      const phase = getIndiaLivelihoodPhaseById(indiaPhase);
      if (phase) {
        const cam = cameraForRegionIds(phase.targetRegionIds) ?? REGION_CAMERA['asia-oceania'];
        setCenter(cam.center);
        setZoom(cam.zoom);
        setRegionFocus('asia-oceania');
        return;
      }
    }
    const cam = cameraForRegionIds(['in']) ?? REGION_CAMERA['asia-oceania'];
    setCenter(cam.center);
    setZoom(cam.zoom);
    setRegionFocus('asia-oceania');
  }, [isIndiaLivelihoodOpen, indiaPhase, indiaFocusRegionId]);

  useLayoutEffect(() => {
    if (!isIndiaLivelihoodOpen || !indiaFocusRegionId) return;
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === indiaFocusRegionId);
    if (!country) return;
    setCenter(country.coordinates);
    setZoom(clampZoom(MILESTONE_CAMERA_ZOOM));
    setHoveredRegionId(indiaFocusRegionId);
  }, [isIndiaLivelihoodOpen, indiaFocusRegionId]);

  // 東南アジア島嶼・分散跳躍史オープン時: 域内中心へパン＆ズーム
  useLayoutEffect(() => {
    if (!isSoutheastAsiaOpen) return;
    if (seaFocusRegionId) return;
    if (seaPhase) {
      const phase = getSoutheastAsiaIslandPhaseById(seaPhase);
      if (phase) {
        const cam = cameraForRegionIds(phase.targetRegionIds) ?? REGION_CAMERA['asia-oceania'];
        setCenter(cam.center);
        setZoom(cam.zoom);
        setRegionFocus('asia-oceania');
        return;
      }
    }
    const cam = cameraForRegionIds(['vn', 'sg']) ?? REGION_CAMERA['asia-oceania'];
    setCenter(cam.center);
    setZoom(cam.zoom);
    setRegionFocus('asia-oceania');
  }, [isSoutheastAsiaOpen, seaPhase, seaFocusRegionId]);

  useLayoutEffect(() => {
    if (!isSoutheastAsiaOpen || !seaFocusRegionId) return;
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === seaFocusRegionId);
    if (!country) return;
    setCenter(country.coordinates);
    setZoom(clampZoom(MILESTONE_CAMERA_ZOOM));
    setHoveredRegionId(seaFocusRegionId);
  }, [isSoutheastAsiaOpen, seaFocusRegionId]);

  // 欧米伝播史が親から開いたら他年表を閉じる（排他）
  useLayoutEffect(() => {
    if (isMovementHistoryOpen) {
      setIsAfricaLeapfrogOpen(false);
      setAfricaPhase(null);
      setAfricaFocusRegionId(null);
      setIsAsiaOceaniaOpen(false);
      setAsiaPhase(null);
      setAsiaFocusRegionId(null);
      setIsIndiaLivelihoodOpen(false);
      setIndiaPhase(null);
      setIndiaFocusRegionId(null);
      setIsSoutheastAsiaOpen(false);
      setSeaPhase(null);
      setSeaFocusRegionId(null);
      if (historyPhase) {
        setMovementOpenPhases(new Set([historyPhase]));
      }
    }
  }, [isMovementHistoryOpen, historyPhase]);

  function focusRegion(region: RegionFocus) {
    setRegionFocus(region);
    const cam = REGION_CAMERA[region];
    setCenter(cam.center);
    setZoom(cam.zoom);
  }

  function zoomBy(factor: number) {
    setZoom((prev) => clampZoom(prev * factor));
  }

  function resetView() {
    const cam = REGION_CAMERA[regionFocus];
    setCenter(cam.center);
    setZoom(cam.zoom);
  }

  const closeAllTimelines = () => {
    onMovementHistoryOpenChange(false);
    onHistoryPhaseChange(null);
    setIsAfricaLeapfrogOpen(false);
    setAfricaPhase(null);
    setAfricaFocusRegionId(null);
    setIsAsiaOceaniaOpen(false);
    setAsiaPhase(null);
    setAsiaFocusRegionId(null);
    setIsIndiaLivelihoodOpen(false);
    setIndiaPhase(null);
    setIndiaFocusRegionId(null);
    setIndiaOpenPhases(new Set());
    setIsSoutheastAsiaOpen(false);
    setSeaPhase(null);
    setSeaFocusRegionId(null);
    setSeaOpenPhases(new Set());
    setMovementOpenPhases(new Set());
    setMovementFocusRegionId(null);
  };

  const handleDeselect = () => {
    onSelectCountry(null);
    setHoveredRegionId(null);
    onRankingOpenChange(false);
    closeAllTimelines();
  };

  /** 欧米普及ムーブメント: クリック時のみ排他トグル（ホバー開閉なし） */
  const openMovementHistory = () => {
    const next = !isMovementHistoryOpen;
    onMovementHistoryOpenChange(next);
    if (next) {
      onSelectCountry(null);
      onRankingOpenChange(false);
      setIsAfricaLeapfrogOpen(false);
      setAfricaPhase(null);
      setAfricaFocusRegionId(null);
      setIsAsiaOceaniaOpen(false);
      setAsiaPhase(null);
      setAsiaFocusRegionId(null);
      setIsIndiaLivelihoodOpen(false);
      setIndiaPhase(null);
      setIndiaFocusRegionId(null);
      setIsSoutheastAsiaOpen(false);
      setSeaPhase(null);
      setSeaFocusRegionId(null);
      setMovementFocusRegionId(null);
      if (!historyPhase) {
        onHistoryPhaseChange('guerrilla');
        setMovementOpenPhases(new Set(['guerrilla']));
      }
    } else {
      onHistoryPhaseChange(null);
      setMovementOpenPhases(new Set());
      setMovementFocusRegionId(null);
    }
  };

  const openAfricaLeapfrog = () => {
    const next = !isAfricaLeapfrogOpen;
    setIsAfricaLeapfrogOpen(next);
    if (next) {
      onSelectCountry(null);
      onRankingOpenChange(false);
      onMovementHistoryOpenChange(false);
      onHistoryPhaseChange(null);
      setIsAsiaOceaniaOpen(false);
      setAsiaPhase(null);
      setAsiaFocusRegionId(null);
      setIsIndiaLivelihoodOpen(false);
      setIndiaPhase(null);
      setIndiaFocusRegionId(null);
      setIsSoutheastAsiaOpen(false);
      setSeaPhase(null);
      setSeaFocusRegionId(null);
      setAfricaFocusRegionId(null);
      setMovementOpenPhases(new Set());
      setMovementFocusRegionId(null);
      if (!africaPhase) {
        setAfricaPhase('deKerosene');
        setAfricaOpenPhases(new Set(['deKerosene']));
      }
    } else {
      setAfricaPhase(null);
      setAfricaFocusRegionId(null);
    }
  };

  const openAsiaOceania = () => {
    const next = !isAsiaOceaniaOpen;
    setIsAsiaOceaniaOpen(next);
    if (next) {
      onSelectCountry(null);
      onRankingOpenChange(false);
      onMovementHistoryOpenChange(false);
      onHistoryPhaseChange(null);
      setIsAfricaLeapfrogOpen(false);
      setAfricaPhase(null);
      setAfricaFocusRegionId(null);
      setIsIndiaLivelihoodOpen(false);
      setIndiaPhase(null);
      setIndiaFocusRegionId(null);
      setIsSoutheastAsiaOpen(false);
      setSeaPhase(null);
      setSeaFocusRegionId(null);
      setAsiaFocusRegionId(null);
      setMovementOpenPhases(new Set());
      setMovementFocusRegionId(null);
      if (!asiaPhase) {
        setAsiaPhase('exportAndStorage');
        setAsiaOpenPhases(new Set(['exportAndStorage']));
      }
    } else {
      setAsiaPhase(null);
      setAsiaFocusRegionId(null);
    }
  };

  /** @param forceOpen true のときトグルせず必ず開く（インドピン連動用） */
  const openIndiaLivelihood = (forceOpen = false) => {
    const next = forceOpen ? true : !isIndiaLivelihoodOpen;
    setIsIndiaLivelihoodOpen(next);
    if (next) {
      onSelectCountry(null);
      onRankingOpenChange(false);
      onMovementHistoryOpenChange(false);
      onHistoryPhaseChange(null);
      setIsAfricaLeapfrogOpen(false);
      setAfricaPhase(null);
      setAfricaFocusRegionId(null);
      setIsAsiaOceaniaOpen(false);
      setAsiaPhase(null);
      setAsiaFocusRegionId(null);
      setIsSoutheastAsiaOpen(false);
      setSeaPhase(null);
      setSeaFocusRegionId(null);
      setMovementOpenPhases(new Set());
      setMovementFocusRegionId(null);
      if (!indiaPhase) {
        setIndiaPhase('dawnLightingMicrofinance');
        setIndiaOpenPhases(new Set(['dawnLightingMicrofinance']));
      }
      if (forceOpen) {
        setIndiaFocusRegionId('in');
      } else {
        setIndiaFocusRegionId(null);
      }
    } else {
      setIndiaPhase(null);
      setIndiaFocusRegionId(null);
    }
  };

  /** @param forcePinId マップピン連動時にフォーカスする国 id（`vn` / `sg` / `indonesia` / `philippines`） */
  const openSoutheastAsiaIsland = (forcePinId?: string) => {
    const forceOpen = Boolean(forcePinId);
    const next = forceOpen ? true : !isSoutheastAsiaOpen;
    setIsSoutheastAsiaOpen(next);
    if (next) {
      onSelectCountry(null);
      onRankingOpenChange(false);
      onMovementHistoryOpenChange(false);
      onHistoryPhaseChange(null);
      setIsAfricaLeapfrogOpen(false);
      setAfricaPhase(null);
      setAfricaFocusRegionId(null);
      setIsAsiaOceaniaOpen(false);
      setAsiaPhase(null);
      setAsiaFocusRegionId(null);
      setIsIndiaLivelihoodOpen(false);
      setIndiaPhase(null);
      setIndiaFocusRegionId(null);
      setMovementOpenPhases(new Set());
      setMovementFocusRegionId(null);
      if (!seaPhase) {
        setSeaPhase('isolatedDieselPicoHydro');
        setSeaOpenPhases(new Set(['isolatedDieselPicoHydro']));
      }
      setSeaFocusRegionId(forcePinId ?? null);
    } else {
      setSeaPhase(null);
      setSeaFocusRegionId(null);
    }
  };

  const toggleMovementPhase = (id: MovementHistoryPhaseId) => {
    if (movementOpenPhases.has(id)) {
      setMovementOpenPhases(new Set());
      if (historyPhase === id) {
        onHistoryPhaseChange(null);
        setMovementFocusRegionId(null);
      }
    } else {
      setMovementOpenPhases(new Set([id]));
      onHistoryPhaseChange(id);
      setMovementFocusRegionId(null);
    }
  };

  const toggleAfricaPhase = (id: AfricaLeapfrogPhaseId) => {
    if (africaOpenPhases.has(id)) {
      setAfricaOpenPhases(new Set());
      if (africaPhase === id) {
        setAfricaPhase(null);
        setAfricaFocusRegionId(null);
      }
    } else {
      setAfricaOpenPhases(new Set([id]));
      setAfricaPhase(id);
      setAfricaFocusRegionId(null);
    }
  };

  const toggleAsiaPhase = (id: AsiaOceaniaPhaseId) => {
    if (asiaOpenPhases.has(id)) {
      setAsiaOpenPhases(new Set());
      if (asiaPhase === id) {
        setAsiaPhase(null);
        setAsiaFocusRegionId(null);
      }
    } else {
      setAsiaOpenPhases(new Set([id]));
      setAsiaPhase(id);
      setAsiaFocusRegionId(null);
    }
  };

  const toggleIndiaPhase = (id: IndiaLivelihoodPhaseId) => {
    if (indiaOpenPhases.has(id)) {
      setIndiaOpenPhases(new Set());
      if (indiaPhase === id) {
        setIndiaPhase(null);
        setIndiaFocusRegionId(null);
      }
    } else {
      setIndiaOpenPhases(new Set([id]));
      setIndiaPhase(id);
      setIndiaFocusRegionId(null);
    }
  };

  const toggleSeaPhase = (id: SoutheastAsiaIslandPhaseId) => {
    if (seaOpenPhases.has(id)) {
      setSeaOpenPhases(new Set());
      if (seaPhase === id) {
        setSeaPhase(null);
        setSeaFocusRegionId(null);
      }
    } else {
      setSeaOpenPhases(new Set([id]));
      setSeaPhase(id);
      setSeaFocusRegionId(null);
    }
  };

  const focusAfricaMilestone = (regionId: string) => {
    setAfricaFocusRegionId(regionId);
    setHoveredRegionId(regionId);
  };

  const focusAsiaMilestone = (regionId: string) => {
    setAsiaFocusRegionId(regionId);
    setHoveredRegionId(regionId);
  };

  const focusIndiaMilestone = (regionId: string) => {
    setIndiaFocusRegionId(regionId);
    setHoveredRegionId(regionId);
  };

  const focusSeaMilestone = (regionId: string) => {
    setSeaFocusRegionId(regionId);
    setHoveredRegionId(regionId);
  };

  const focusMovementMilestone = (phaseId: MovementHistoryPhaseId, regionId: string) => {
    onHistoryPhaseChange(phaseId);
    setMovementOpenPhases(new Set([phaseId]));
    setMovementFocusRegionId(regionId);
    setHoveredRegionId(regionId);
  };

  const isInFocus = (country: CountryPvDetail) => {
    if (regionFocus === 'all') return true;
    return resolveRegionCategory(country) === regionFocus;
  };

  function mapLabel(labelKey: string, fallback: string) {
    const key = `map.${labelKey}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : fallback;
  }

  function countryField(country: CountryPvDetail, field: 'name' | 'powerLimit' | 'statusLabel') {
    const key = `countries.${country.id}.${field}` as Parameters<typeof t>[0];
    if (t.has(key)) return t(key);
    if (field === 'name' && isEn && country.nameEn) return country.nameEn;
    return country[field === 'statusLabel' ? 'statusLabel' : field];
  }

  function movementPhaseLabel(id: MovementHistoryPhaseId, field: 'period' | 'title') {
    const key = `movementHistory.phases.${id}.${field}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : MOVEMENT_PHASE_FALLBACKS[id][field];
  }

  function africaPhaseLabel(id: AfricaLeapfrogPhaseId, field: 'period' | 'title') {
    const key = `africaLeapfrog.phases.${id}.${field}` as Parameters<typeof t>[0];
    const phase = AFRICA_LEAPFROG_TIMELINE.find((p) => p.id === id);
    if (t.has(key)) return t(key);
    if (isEn && phase) {
      return field === 'period' ? (phase.periodEn ?? phase.period) : (phase.titleEn ?? phase.title);
    }
    return phase ? phase[field] : id;
  }

  function asiaPhaseLabel(id: AsiaOceaniaPhaseId, field: 'period' | 'title') {
    const key = `asiaOceaniaTransition.phases.${id}.${field}` as Parameters<typeof t>[0];
    const phase = ASIA_OCEANIA_TRANSITION_TIMELINE.find((p) => p.id === id);
    if (t.has(key)) return t(key);
    if (isEn && phase) {
      return field === 'period' ? (phase.periodEn ?? phase.period) : (phase.titleEn ?? phase.title);
    }
    return phase ? phase[field] : id;
  }

  function indiaPhaseLabel(id: IndiaLivelihoodPhaseId, field: 'period' | 'title') {
    const key = `indiaLivelihood.phases.${id}.${field}` as Parameters<typeof t>[0];
    const phase = INDIA_LIVELIHOOD_TIMELINE.find((p) => p.id === id);
    if (t.has(key)) return t(key);
    if (isEn && phase) {
      return field === 'period' ? (phase.periodEn ?? phase.period) : (phase.titleEn ?? phase.title);
    }
    return phase ? phase[field] : id;
  }

  function seaPhaseLabel(id: SoutheastAsiaIslandPhaseId, field: 'period' | 'title') {
    const key = `southeastAsiaIsland.phases.${id}.${field}` as Parameters<typeof t>[0];
    const phase = SOUTHEAST_ASIA_ISLAND_TIMELINE.find((p) => p.id === id);
    if (t.has(key)) return t(key);
    if (isEn && phase) {
      return field === 'period' ? (phase.periodEn ?? phase.period) : (phase.titleEn ?? phase.title);
    }
    return phase ? phase[field] : id;
  }

  const movementTimelinePhases: TimelinePhaseView[] = MOVEMENT_HISTORY_PHASES.map((phase) => ({
    id: phase.id,
    period: movementPhaseLabel(phase.id, 'period'),
    title: movementPhaseLabel(phase.id, 'title'),
    milestones: phase.milestones,
  }));

  const africaTimelinePhases: TimelinePhaseView[] = AFRICA_LEAPFROG_TIMELINE.map((phase) => ({
    id: phase.id,
    period: africaPhaseLabel(phase.id, 'period'),
    title: africaPhaseLabel(phase.id, 'title'),
    milestones: phase.milestones,
  }));

  const asiaTimelinePhases: TimelinePhaseView[] = ASIA_OCEANIA_TRANSITION_TIMELINE.map((phase) => ({
    id: phase.id,
    period: asiaPhaseLabel(phase.id, 'period'),
    title: asiaPhaseLabel(phase.id, 'title'),
    milestones: phase.milestones,
  }));

  const indiaTimelinePhases: TimelinePhaseView[] = INDIA_LIVELIHOOD_TIMELINE.map((phase) => ({
    id: phase.id,
    period: indiaPhaseLabel(phase.id, 'period'),
    title: indiaPhaseLabel(phase.id, 'title'),
    milestones: phase.milestones,
  }));

  const seaTimelinePhases: TimelinePhaseView[] = SOUTHEAST_ASIA_ISLAND_TIMELINE.map((phase) => ({
    id: phase.id,
    period: seaPhaseLabel(phase.id, 'period'),
    title: seaPhaseLabel(phase.id, 'title'),
    milestones: phase.milestones,
  }));

  const modelFilterLabel = (key: string, fallback: string) => {
    const full = `map.modelFilter.${key}` as Parameters<typeof t>[0];
    return t.has(full) ? t(full) : fallback;
  };

  const isDetailZoom = zoom >= 2.6;

  // ホバー/選択/フィルター一致ピンを DOM 末尾へ回し、ラベルが最前面に来るようにする
  const sortedPinCountries = [...MAP_PIN_COUNTRIES].sort((a, b) => {
    const aMatch = matchesModelFilter(a, selectedModelType) ? 1 : 0;
    const bMatch = matchesModelFilter(b, selectedModelType) ? 1 : 0;
    if (aMatch !== bMatch) return aMatch - bMatch;
    const aHist =
      a.id === focusedMilestoneRegionId ||
      a.id === hoveredRegionId ||
      historyTargetIds.has(a.id)
        ? 1
        : 0;
    const bHist =
      b.id === focusedMilestoneRegionId ||
      b.id === hoveredRegionId ||
      historyTargetIds.has(b.id)
        ? 1
        : 0;
    if (aHist !== bHist) return aHist - bHist;
    const aTop = a.id === selectedCountryId || a.id === hoveredRegionId ? 1 : 0;
    const bTop = b.id === selectedCountryId || b.id === hoveredRegionId ? 1 : 0;
    return aTop - bTop;
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-background/50 select-none">
      {/* SP/PC共通: 市場モデル → 地域 → 実装度ランキング → 関連資料（左寄せ・折り返し対応） */}
      <div
        className={`absolute top-2 left-2 z-20 flex flex-wrap items-center justify-start gap-2 rounded-md border border-border/50 bg-card/90 p-0.5 shadow-sm backdrop-blur ${
          isAfricaLeapfrogOpen ||
          isMovementHistoryOpen ||
          isAsiaOceaniaOpen ||
          isIndiaLivelihoodOpen ||
          isSoutheastAsiaOpen
            ? 'max-w-[calc(100%-min(90vw,520px)-0.75rem)]'
            : 'max-w-[calc(100%-1rem)]'
        }`}
      >
        <div className="relative inline-block shrink-0">
          <select
            value={selectedModelType}
            onChange={(e) => setSelectedModelType(e.target.value)}
            aria-label={modelFilterLabel('ariaLabel', 'Solar adoption model filter')}
            className="cursor-pointer rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs font-medium text-slate-100 shadow-sm backdrop-blur hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            <option value="all">{modelFilterLabel('all', '⚡ Market Models')}</option>

            <optgroup label={modelFilterLabel('groupGridPlugIn', '① Grid present · plug-in allowed')} className="bg-slate-900 text-slate-200 font-semibold">
              <option value="grid_plug_in">{modelFilterLabel('grid_plug_in', '① Grid present · plug-in allowed (all)')}</option>
              <option value="plug_800w">{modelFilterLabel('plug_800w', '🟢 800W plug certified')}</option>
              <option value="plug_1200w">{modelFilterLabel('plug_1200w', '🔵 1,200W waiver')}</option>
              <option value="plug_600w">{modelFilterLabel('plug_600w', '🔷 600W notice / urban BIPV')}</option>
              <option value="net_metering">{modelFilterLabel('net_metering', '🌐 Export / net metering')}</option>
            </optgroup>

            <optgroup label={modelFilterLabel('groupGridNoPlug', '② Grid present · plug-in banned')} className="bg-slate-900 text-slate-200 font-semibold">
              <option value="grid_no_plug">{modelFilterLabel('grid_no_plug', '② Grid present · plug-in banned (all)')}</option>
              <option value="offgrid_storage">{modelFilterLabel('offgrid_storage', '🟠 No export · storage self-supply')}</option>
              <option value="nec_strict">{modelFilterLabel('nec_strict', '🔴 No outlet tie · licensed work')}</option>
            </optgroup>

            <optgroup label={modelFilterLabel('groupNoGridLeapfrog', '③ No/weak grid · solar leapfrog')} className="bg-slate-900 text-slate-200 font-semibold">
              <option value="no_grid_leapfrog">{modelFilterLabel('no_grid_leapfrog', '③ No/weak grid · solar leapfrog (all)')}</option>
              <option value="productive_offgrid">{modelFilterLabel('productive_offgrid', '🟣 Agri & cold-chain infra')}</option>
              <option value="micro_solar_kit">{modelFilterLabel('micro_solar_kit', '🌸 Life kits / PayGo')}</option>
            </optgroup>
          </select>
        </div>
        <div className="relative inline-block shrink-0">
          <select
            value={regionFocus}
            onChange={(e) => focusRegion(e.target.value as RegionFocus)}
            aria-label={mapLabel('regionAria', 'Region')}
            className="cursor-pointer rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs font-medium text-slate-100 shadow-sm backdrop-blur hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            {FOCUS_TABS.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.zoom ? '🔍 ' : ''}
                {mapLabel(tab.labelKey, tab.label)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            const next = !isRankingOpen;
            onRankingOpenChange(next);
            if (next) {
              onSelectCountry(null);
              closeAllTimelines();
            }
          }}
          className="shrink-0 rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs font-medium text-slate-100 transition-colors hover:border-slate-500"
        >
          {mapLabel('ranking', '★ Rankings')}
        </button>
        <div className="relative inline-block shrink-0">
          <select
            value={
              isMovementHistoryOpen
                ? 'movement'
                : isAfricaLeapfrogOpen
                  ? 'africa'
                  : isIndiaLivelihoodOpen
                    ? 'india'
                    : isSoutheastAsiaOpen
                      ? 'southeast-asia'
                      : isAsiaOceaniaOpen
                        ? 'asia-oceania'
                        : ''
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'movement') {
                if (!isMovementHistoryOpen) openMovementHistory();
              } else if (value === 'africa') {
                if (!isAfricaLeapfrogOpen) openAfricaLeapfrog();
              } else if (value === 'india') {
                if (!isIndiaLivelihoodOpen) openIndiaLivelihood();
              } else if (value === 'southeast-asia') {
                if (!isSoutheastAsiaOpen) openSoutheastAsiaIsland();
              } else if (value === 'asia-oceania') {
                if (!isAsiaOceaniaOpen) openAsiaOceania();
              } else {
                closeAllTimelines();
              }
            }}
            aria-label={mapLabel('documents', 'Documents & Timelines')}
            className="cursor-pointer rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-xs font-medium text-slate-100 shadow-sm backdrop-blur hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            <option value="">📚 {mapLabel('documentsShort', 'Documents & Timelines')}</option>
            <option value="movement">📖 {mapLabel('timelineWestern', 'Western PV Movements')}</option>
            <option value="africa">🌍 {mapLabel('timelineAfrica', 'African Leapfrog Evolution')}</option>
            <option value="india">🇮🇳 {mapLabel('timelineIndia', "India's Livelihood Revolution")}</option>
            <option value="southeast-asia">🏝️ {mapLabel('timelineSoutheastAsia', "Southeast Asia's Island & Microgrid Leap")}</option>
            <option value="asia-oceania">🌏 {mapLabel('timelineAsiaOceania', 'Asia-Oceania Transition')}</option>
          </select>
        </div>
      </div>

      {/* TopoJSON 地図 + ピン（サイドバー開閉に依存せず常に全面） */}
      <div
        className="absolute inset-0 h-full w-full outline-none focus:outline-none select-none [&_*]:outline-none [&_*]:focus:outline-none"
        onClick={handleDeselect}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120 }}
          className="h-full w-full outline-none focus:outline-none select-none [&_*]:outline-none [&_*]:focus:outline-none"
          style={{ width: '100%', height: '100%', outline: 'none' }}
          tabIndex={-1}
        >
          <ZoomableGroup
            center={center}
            zoom={zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveEnd={(pos) => {
              setCenter(pos.coordinates as [number, number]);
              setZoom(pos.zoom);
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={-1}
                    onClick={handleDeselect}
                    className="cursor-default select-none focus:outline-none focus:ring-0"
                    style={{
                      default: {
                        fill: '#1e293b',
                        stroke: '#334155',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#334155',
                        stroke: '#334155',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#475569',
                        stroke: '#334155',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                    }}
                  />
                ))
              }
            </Geographies>

            {sortedPinCountries.map((country) => {
              const isSelected = country.id === selectedCountryId;
              const isHovered = hoveredRegionId === country.id;
              const focused = isInFocus(country);
              const isMatchFilter = matchesModelFilter(country, selectedModelType);
              const isMilestoneFocus = focusedMilestoneRegionId === country.id;
              const isPhaseTarget = historyTargetIds.has(country.id);
              const inHistoryHighlight =
                historyHighlightRegion !== null &&
                (isMilestoneFocus ||
                  (focusedMilestoneRegionId === null && isPhaseTarget) ||
                  (focusedMilestoneRegionId === null &&
                    historyTargetIds.size === 0 &&
                    resolveRegionCategory(country) === historyHighlightRegion));
              const markerOpacity =
                historyHighlightRegion !== null
                  ? inHistoryHighlight
                    ? 1
                    : isPhaseTarget
                      ? 0.45
                      : 0.12
                  : !focused
                    ? 0.22
                    : isMatchFilter
                      ? 1
                      : 0.15;
              const isFilterHighlight = selectedModelType !== 'all' && isMatchFilter;
              const isHistoryEmphasized =
                isAnyHistoryOpen && (isMilestoneFocus || (isPhaseTarget && !focusedMilestoneRegionId));
              const pinScale =
                (1 / zoom) *
                (isFilterHighlight || isHistoryEmphasized ? 1.25 : 1) *
                (isMilestoneFocus ? 1.15 : 1);
              const color = statusColor(country.status);
              const stars = getMaturityScore(country);
              const countryName = countryField(country, 'name');
              // 高ズーム時のみ全ピンラベル。未満はホバー/選択のみ表示（ディム時は非表示）
              const showLabel =
                isMatchFilter &&
                (isHovered || isSelected || isDetailZoom || isMilestoneFocus || isHistoryEmphasized);
              const emphasizeLabel = isHovered || isSelected || isMilestoneFocus;
              const keyFocusSuffix =
                country.id === 'in' || SOUTHEAST_ASIA_PIN_IDS.has(country.id)
                  ? ` (${mapLabel('keyFocus', 'Key Focus')})`
                  : '';
              const tooltipLabel = `${countryName} ★${stars}${keyFocusSuffix}`;
              // fontSize 12 に合わせた幅・高さ（文字がはみ出さないよう余白を確保）
              const tooltipW = Math.max(tooltipLabel.length * 7.2 + 14, 48);
              const tooltipH = 18;
              const labelOffset = getLabelOffset(country.id);
              const rectX =
                labelOffset.textAnchor === 'start'
                  ? -3
                  : labelOffset.textAnchor === 'end'
                    ? -tooltipW + 3
                    : -tooltipW / 2;
              const textY = tooltipH / 2 - 4;

              const selectPin = (e?: { stopPropagation: () => void }) => {
                if (!isMatchFilter) return;
                e?.stopPropagation();
                onRankingOpenChange(false);
                // 全ピン共通: 国別詳細サイドバーを開く（タイムラインはドキュメント選択からのみ）
                closeAllTimelines();
                setCenter(country.coordinates);
                setZoom(clampZoom(COUNTRY_CAMERA_ZOOM));
                onSelectCountry(country);
              };
              const hoverPin = () => {
                if (!isMatchFilter) return;
                setHoveredRegionId(country.id);
              };
              const leavePin = () => setHoveredRegionId(null);

              return (
                <Marker
                  key={country.id}
                  coordinates={country.coordinates}
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectPin();
                  }}
                  className={`group select-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
                    isMatchFilter ? 'cursor-pointer' : 'pointer-events-none'
                  }`}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                    pointerEvents: isMatchFilter ? 'auto' : 'none',
                  }}
                >
                  <g
                    transform={`scale(${pinScale})`}
                    data-country-node
                    data-selected={isSelected ? 'true' : undefined}
                    className={`select-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
                      isMatchFilter ? 'cursor-pointer' : 'pointer-events-none'
                    }`}
                    style={{ outline: 'none', pointerEvents: isMatchFilter ? 'auto' : 'none' }}
                    opacity={markerOpacity}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPin();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectPin();
                      }
                    }}
                    role="button"
                    tabIndex={-1}
                    aria-label={countryName}
                    aria-pressed={isSelected}
                    aria-hidden={!isMatchFilter}
                  >
                    <circle
                      r={10}
                      fill="transparent"
                      tabIndex={-1}
                      className="cursor-pointer select-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                      style={{ outline: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPin();
                      }}
                      onMouseEnter={hoverPin}
                      onMouseLeave={leavePin}
                    />
                    {isSelected || isMilestoneFocus ? (
                      <circle
                        r={12}
                        fill="none"
                        stroke={isMilestoneFocus && !isSelected ? '#22d3ee' : '#38bdf8'}
                        strokeWidth={2}
                        tabIndex={-1}
                        className="animate-ping opacity-75 select-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                        style={{ outline: 'none' }}
                      />
                    ) : null}
                    <circle
                      r={isFilterHighlight || isHistoryEmphasized ? 10 : 9}
                      fill={color}
                      opacity={
                        isSelected || isFilterHighlight || isMilestoneFocus || isHistoryEmphasized
                          ? 0.55
                          : 0.22
                      }
                      tabIndex={-1}
                      className="cursor-pointer select-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                      style={{ outline: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPin();
                      }}
                      onMouseEnter={hoverPin}
                      onMouseLeave={leavePin}
                    />
                    <circle
                      r={isFilterHighlight || isMilestoneFocus ? 5.5 : 5}
                      fill={color}
                      stroke={
                        isSelected
                          ? '#38bdf8'
                          : isMilestoneFocus
                            ? '#22d3ee'
                            : isFilterHighlight || isHistoryEmphasized
                              ? '#f8fafc'
                              : 'var(--background)'
                      }
                      strokeWidth={
                        isSelected || isMilestoneFocus
                          ? 2
                          : isFilterHighlight || isHistoryEmphasized
                            ? 2.5
                            : 1.5
                      }
                      tabIndex={-1}
                      className="cursor-pointer select-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                      style={{ outline: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectPin();
                      }}
                      onMouseEnter={hoverPin}
                      onMouseLeave={leavePin}
                    />
                    {showLabel ? (
                      <g
                        transform={`translate(${labelOffset.x}, ${labelOffset.y})`}
                        className="pointer-events-none select-none"
                        tabIndex={-1}
                        style={{ outline: 'none' }}
                      >
                        <rect
                          x={rectX}
                          y={-tooltipH / 2 - 1}
                          width={tooltipW}
                          height={tooltipH}
                          rx={4}
                          fill={emphasizeLabel ? '#0f172a' : '#1e293b'}
                          opacity={emphasizeLabel ? 0.95 : 0.82}
                          stroke="none"
                          tabIndex={-1}
                          className="select-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                          style={{ outline: 'none' }}
                        />
                        <text
                          y={textY}
                          textAnchor={labelOffset.textAnchor}
                          tabIndex={-1}
                          fontSize="12"
                          fontWeight="600"
                          className="select-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                          style={{ outline: 'none' }}
                          fill={emphasizeLabel ? '#f8fafc' : '#cbd5e1'}
                        >
                          {tooltipLabel}
                        </text>
                      </g>
                    ) : null}
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* 欧米伝播史・アフリカ跳躍史（共通 TimelineSidebar） */}
      {isMovementHistoryOpen ? (
        <TimelineSidebar
          title={(() => {
            const key = 'movementHistory.sidebarTitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : mapLabel('timelineWestern', 'Western PV Movements');
          })()}
          subtitle={(() => {
            const key = 'movementHistory.sidebarSubtitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : 'Balcony solar adoption history';
          })()}
          phases={movementTimelinePhases}
          openPhaseIds={movementOpenPhases}
          activePhaseId={historyPhase}
          focusRegionId={movementFocusRegionId ?? historyFocusRegionId ?? null}
          accent={CYAN_TIMELINE_ACCENT}
          closeLabel={closeLabel}
          isEn={isEn}
          barrierLabel={barrierLabel}
          milestoneLabel={milestoneLabel}
          onClose={() => {
            onMovementHistoryOpenChange(false);
            onHistoryPhaseChange(null);
            setMovementOpenPhases(new Set());
            setMovementFocusRegionId(null);
          }}
          onTogglePhase={(id) => toggleMovementPhase(id as MovementHistoryPhaseId)}
          onFocusMilestone={(phaseId, regionId) =>
            focusMovementMilestone(phaseId as MovementHistoryPhaseId, regionId)
          }
        />
      ) : null}

      {isAfricaLeapfrogOpen ? (
        <TimelineSidebar
          title={(() => {
            const key = 'africaLeapfrog.sidebarTitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : mapLabel('timelineAfrica', 'African Leapfrog Evolution');
          })()}
          subtitle={(() => {
            const key = 'africaLeapfrog.sidebarSubtitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : 'Leapfrog Revolution';
          })()}
          phases={africaTimelinePhases}
          openPhaseIds={africaOpenPhases}
          activePhaseId={africaPhase}
          focusRegionId={africaFocusRegionId}
          accent={VIOLET_TIMELINE_ACCENT}
          closeLabel={closeLabel}
          isEn={isEn}
          barrierLabel={barrierLabel}
          milestoneLabel={milestoneLabel}
          onClose={() => {
            setIsAfricaLeapfrogOpen(false);
            setAfricaPhase(null);
            setAfricaFocusRegionId(null);
          }}
          onTogglePhase={(id) => toggleAfricaPhase(id as AfricaLeapfrogPhaseId)}
          onFocusMilestone={(phaseId, regionId) => {
            setAfricaPhase(phaseId as AfricaLeapfrogPhaseId);
            setAfricaOpenPhases(new Set([phaseId as AfricaLeapfrogPhaseId]));
            focusAfricaMilestone(regionId);
          }}
        />
      ) : null}

      {isAsiaOceaniaOpen ? (
        <TimelineSidebar
          title={(() => {
            const key = 'asiaOceaniaTransition.sidebarTitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : mapLabel('timelineAsiaOceania', 'Asia-Oceania Transition');
          })()}
          subtitle={(() => {
            const key = 'asiaOceaniaTransition.sidebarSubtitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : 'Storage · Tenant rights · National schemes';
          })()}
          phases={asiaTimelinePhases}
          openPhaseIds={asiaOpenPhases}
          activePhaseId={asiaPhase}
          focusRegionId={asiaFocusRegionId}
          accent={EMERALD_TIMELINE_ACCENT}
          closeLabel={closeLabel}
          isEn={isEn}
          barrierLabel={barrierLabel}
          milestoneLabel={milestoneLabel}
          onClose={() => {
            setIsAsiaOceaniaOpen(false);
            setAsiaPhase(null);
            setAsiaFocusRegionId(null);
          }}
          onTogglePhase={(id) => toggleAsiaPhase(id as AsiaOceaniaPhaseId)}
          onFocusMilestone={(phaseId, regionId) => {
            setAsiaPhase(phaseId as AsiaOceaniaPhaseId);
            setAsiaOpenPhases(new Set([phaseId as AsiaOceaniaPhaseId]));
            focusAsiaMilestone(regionId);
          }}
        />
      ) : null}

      {isIndiaLivelihoodOpen ? (
        <TimelineSidebar
          title={(() => {
            const key = 'indiaLivelihood.sidebarTitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : mapLabel('timelineIndia', "India's Livelihood Revolution");
          })()}
          subtitle={(() => {
            const key = 'indiaLivelihood.sidebarSubtitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : 'Livelihood & Asset Creation';
          })()}
          phases={indiaTimelinePhases}
          openPhaseIds={indiaOpenPhases}
          activePhaseId={indiaPhase}
          focusRegionId={indiaFocusRegionId}
          accent={AMBER_TIMELINE_ACCENT}
          closeLabel={closeLabel}
          isEn={isEn}
          barrierLabel={barrierLabel}
          milestoneLabel={milestoneLabel}
          onClose={() => {
            setIsIndiaLivelihoodOpen(false);
            setIndiaPhase(null);
            setIndiaFocusRegionId(null);
          }}
          onTogglePhase={(id) => toggleIndiaPhase(id as IndiaLivelihoodPhaseId)}
          onFocusMilestone={(phaseId, regionId) => {
            setIndiaPhase(phaseId as IndiaLivelihoodPhaseId);
            setIndiaOpenPhases(new Set([phaseId as IndiaLivelihoodPhaseId]));
            focusIndiaMilestone(regionId);
          }}
        />
      ) : null}

      {isSoutheastAsiaOpen ? (
        <TimelineSidebar
          title={(() => {
            const key = 'southeastAsiaIsland.sidebarTitle' as Parameters<typeof t>[0];
            return t.has(key)
              ? t(key)
              : mapLabel('timelineSoutheastAsia', "Southeast Asia's Island & Microgrid Leap");
          })()}
          subtitle={(() => {
            const key = 'southeastAsiaIsland.sidebarSubtitle' as Parameters<typeof t>[0];
            return t.has(key) ? t(key) : 'Island & River Basin Microgrids';
          })()}
          phases={seaTimelinePhases}
          openPhaseIds={seaOpenPhases}
          activePhaseId={seaPhase}
          focusRegionId={seaFocusRegionId}
          accent={SKY_TIMELINE_ACCENT}
          closeLabel={closeLabel}
          isEn={isEn}
          barrierLabel={barrierLabel}
          milestoneLabel={milestoneLabel}
          onClose={() => {
            setIsSoutheastAsiaOpen(false);
            setSeaPhase(null);
            setSeaFocusRegionId(null);
          }}
          onTogglePhase={(id) => toggleSeaPhase(id as SoutheastAsiaIslandPhaseId)}
          onFocusMilestone={(phaseId, regionId) => {
            setSeaPhase(phaseId as SoutheastAsiaIslandPhaseId);
            setSeaOpenPhases(new Set([phaseId as SoutheastAsiaIslandPhaseId]));
            focusSeaMilestone(regionId);
          }}
        />
      ) : null}

      {/* ズームコントロール（伝播史は親サイドバーに集約） */}
      <div className={`absolute bottom-3 z-20 flex flex-col gap-1 rounded-lg border border-border/50 bg-zinc-900/80 p-1 shadow-lg backdrop-blur-sm ${isAfricaLeapfrogOpen || isMovementHistoryOpen || isAsiaOceaniaOpen || isIndiaLivelihoodOpen || isSoutheastAsiaOpen ? 'right-[min(90vw,520px)] mr-3' : 'right-3'}`}>
        <button
          type="button"
          aria-label={mapLabel('zoomIn', '拡大')}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={() => zoomBy(ZOOM_STEP)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          aria-label={mapLabel('zoomOut', '縮小')}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={() => zoomBy(1 / ZOOM_STEP)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          aria-label={mapLabel('resetView', '表示をリセット')}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={resetView}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
