'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import {
  CountryPvDetail,
  GLOBAL_PV_VENDORS,
  WORLD_BALCONY_PV_COUNTRIES,
  getMaturityScore,
  getMovementPhaseById,
  matchesModelFilter,
  resolveRegionCategory,
  type MovementHistoryPhaseId,
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

type RegionFocus = 'all' | 'europe' | 'asia' | 'africa' | 'north_america' | 'asia-us';

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
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.25;

const REGION_CAMERA: Record<RegionFocus, MapCamera> = {
  all: { center: [10, 20], zoom: 1 },
  europe: { center: [15, 50], zoom: 3.5 },
  north_america: { center: [-95, 40], zoom: 2.8 },
  africa: { center: [20, 5], zoom: 2.5 },
  asia: { center: [110, 30], zoom: 2.2 },
  'asia-us': { center: [10, 20], zoom: 1 },
};

const FOCUS_TABS: readonly {
  id: RegionFocus;
  labelKey: string;
  label: string;
  zoom?: boolean;
}[] = [
  { id: 'all', labelKey: 'focusAll', label: '全域' },
  { id: 'europe', labelKey: 'focusEurope', label: '欧州', zoom: true },
  { id: 'asia', labelKey: 'focusAsia', label: 'アジア', zoom: true },
  { id: 'africa', labelKey: 'focusAfrica', label: 'アフリカ', zoom: true },
  { id: 'north_america', labelKey: 'focusNorthAmerica', label: '北米（州別）', zoom: true },
  { id: 'asia-us', labelKey: 'focusOthers', label: '他地域' },
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
): 'europe' | 'north_america' | null {
  if (!phase) return null;
  return phase === 'usSpread' ? 'north_america' : 'europe';
}

const PHASE_CAMERA_ZOOM = 4.2;
const MILESTONE_CAMERA_ZOOM = 5.5;

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
  const [regionFocus, setRegionFocus] = useState<RegionFocus>('all');
  const [selectedModelType, setSelectedModelType] = useState<string>('all');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number]>(REGION_CAMERA.all.center);
  const [zoom, setZoom] = useState(REGION_CAMERA.all.zoom);
  const [isVendorsOpen, setIsVendorsOpen] = useState(false);

  const activePhase = getMovementPhaseById(historyPhase);
  const historyHighlightRegion = isMovementHistoryOpen
    ? historyPhaseRegion(historyPhase)
    : null;
  const historyTargetIds = new Set(activePhase?.targetRegionIds ?? []);
  const focusedMilestoneRegionId =
    isMovementHistoryOpen && historyFocusRegionId ? historyFocusRegionId : null;

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
    if (historyFocusRegionId) return;
    const phase = getMovementPhaseById(historyPhase);
    if (!phase) return;
    const cam =
      cameraForRegionIds(phase.targetRegionIds) ??
      REGION_CAMERA[historyPhaseRegion(historyPhase) ?? 'europe'];
    setCenter(cam.center);
    setZoom(cam.zoom);
    const macro = historyPhaseRegion(historyPhase);
    if (macro) setRegionFocus(macro);
  }, [isMovementHistoryOpen, historyPhase, historyFocusRegionId]);

  useLayoutEffect(() => {
    if (!isMovementHistoryOpen || !historyFocusRegionId) return;
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === historyFocusRegionId);
    if (!country) return;
    setCenter(country.coordinates);
    setZoom(clampZoom(MILESTONE_CAMERA_ZOOM));
    setHoveredRegionId(historyFocusRegionId);
  }, [isMovementHistoryOpen, historyFocusRegionId]);

  // ランキング・伝播史が開いたら主要企業パネルを閉じる（排他）
  useLayoutEffect(() => {
    if (isRankingOpen || isMovementHistoryOpen) {
      setIsVendorsOpen(false);
    }
  }, [isRankingOpen, isMovementHistoryOpen]);

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

  const handleDeselect = () => {
    onSelectCountry(null);
    setHoveredRegionId(null);
    onRankingOpenChange(false);
    onMovementHistoryOpenChange(false);
    onHistoryPhaseChange(null);
    setIsVendorsOpen(false);
  };

  const openVendorsPanel = () => {
    setIsVendorsOpen(true);
    onSelectCountry(null);
    onRankingOpenChange(false);
    onMovementHistoryOpenChange(false);
    onHistoryPhaseChange(null);
  };

  const focusVendorRegion = (regionId: string) => {
    const country = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === regionId);
    if (!country) return;
    setIsVendorsOpen(false);
    onRankingOpenChange(false);
    onMovementHistoryOpenChange(false);
    onHistoryPhaseChange(null);
    setCenter(country.coordinates);
    setZoom(clampZoom(MILESTONE_CAMERA_ZOOM));
    setHoveredRegionId(country.id);
    onSelectCountry(country);
  };

  const isInFocus = (country: CountryPvDetail) => {
    if (regionFocus === 'all') return true;
    if (regionFocus === 'asia-us') return resolveRegionCategory(country) === 'other';
    return resolveRegionCategory(country) === regionFocus;
  };

  function mapLabel(labelKey: string, fallback: string) {
    const key = `map.${labelKey}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : fallback;
  }

  function countryField(country: CountryPvDetail, field: 'name' | 'powerLimit') {
    const key = `countries.${country.id}.${field}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : country[field];
  }

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
      {/* SP/PC共通: 地域フィルター + 実装モデル + 実装度ランキング（左側・サイドバーに隠れない） */}
      <div className="absolute top-2 left-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-1 rounded-md border border-border/50 bg-card/90 p-0.5 shadow-sm backdrop-blur sm:flex-nowrap lg:left-72">
        <div className="relative inline-block">
          <select
            value={selectedModelType}
            onChange={(e) => setSelectedModelType(e.target.value)}
            aria-label="ソーラー普及モデルフィルター"
            className="bg-slate-900/90 text-slate-100 text-sm font-medium py-1.5 px-3 rounded-lg border border-slate-700 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer backdrop-blur shadow-sm"
          >
            <option value="all">⚡ すべての市場モデルを表示</option>

            <optgroup label="① 系統あり・プラグイン可（送電網連系・公認）" className="bg-slate-900 text-slate-200 font-semibold">
              <option value="grid_plug_in">① 系統あり・プラグイン可（すべて）</option>
              <option value="plug_800w">🟢 800Wプラグ公認（独・英・欧州各州）</option>
              <option value="plug_1200w">🔵 1,200W免除（米ユタ・CA等）</option>
              <option value="plug_600w">🔷 600W届出・都市BIPV（墺・シンガポール等）</option>
              <option value="net_metering">🌐 余剰売電・ネット相殺（豪・伯・ケープタウン等）</option>
            </optgroup>

            <optgroup label="② 系統あり・プラグイン不可（送電網防衛・蓄電自衛）" className="bg-slate-900 text-slate-200 font-semibold">
              <option value="grid_no_plug">② 系統あり・プラグイン不可（すべて）</option>
              <option value="offgrid_storage">🟠 逆潮流禁止・蓄電自給（日・中・台湾・越等）</option>
              <option value="nec_strict">🔴 直結不可・電気工事必須（米保守州等）</option>
            </optgroup>

            <optgroup label="③ 系統なし（未発達）・ソーラー勃興（リープフロッグ）" className="bg-slate-900 text-slate-200 font-semibold">
              <option value="no_grid_leapfrog">③ 系統なし・ソーラー勃興（すべて）</option>
              <option value="productive_offgrid">🟣 農業・保冷インフラ（太陽光揚水・保冷 / 東アフリカ等）</option>
              <option value="micro_solar_kit">🌸 生活キット / PayGo（ルワンダ・ウガンダ等）</option>
            </optgroup>
          </select>
        </div>
        <div className="relative inline-block shrink-0">
          <select
            value={regionFocus}
            onChange={(e) => focusRegion(e.target.value as RegionFocus)}
            className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900/90 py-1.5 px-3 text-sm font-medium text-slate-100 shadow-sm backdrop-blur hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
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
              onMovementHistoryOpenChange(false);
              onHistoryPhaseChange(null);
              setIsVendorsOpen(false);
            }
          }}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            isRankingOpen
              ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
              : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          ★ 実装度ランキング
        </button>
        <button
          type="button"
          onClick={() => {
            const next = !isMovementHistoryOpen;
            onMovementHistoryOpenChange(next);
            if (next) {
              onSelectCountry(null);
              onRankingOpenChange(false);
              setIsVendorsOpen(false);
            } else {
              onHistoryPhaseChange(null);
            }
          }}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            isMovementHistoryOpen
              ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
              : 'border-slate-700 bg-slate-900/90 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {t('movementHistory.toggleLabel')}
        </button>
        <button
          type="button"
          onClick={() => {
            if (isVendorsOpen) {
              setIsVendorsOpen(false);
            } else {
              openVendorsPanel();
            }
          }}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            isVendorsOpen
              ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
              : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          主要企業
        </button>
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
                isMovementHistoryOpen && (isMilestoneFocus || (isPhaseTarget && !focusedMilestoneRegionId));
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
              const tooltipLabel = `${countryName} ★${stars}`;
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
                setIsVendorsOpen(false);
                onRankingOpenChange(false);
                onMovementHistoryOpenChange(false);
                onHistoryPhaseChange(null);
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

      {/* 主要企業（グローバルハードウェア）サイドバー */}
      {isVendorsOpen ? (
        <aside
          className="absolute top-0 right-0 z-30 flex h-full w-[min(100%,22rem)] flex-col border-l border-border/60 bg-card/95 shadow-xl backdrop-blur-md sm:w-96"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">主要企業</h2>
              <p className="text-xs text-muted-foreground">グローバルハードウェア</p>
            </div>
            <button
              type="button"
              aria-label="閉じる"
              className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setIsVendorsOpen(false)}
            >
              閉じる
            </button>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {GLOBAL_PV_VENDORS.map((vendor) => (
              <article
                key={vendor.id}
                className="rounded-lg border border-border/50 bg-background/60 p-3"
              >
                <div className="mb-1.5 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{vendor.name}</h3>
                    <p className="text-xs text-muted-foreground">{vendor.nameJa}</p>
                  </div>
                  <span className="shrink-0 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    {vendor.category}
                  </span>
                </div>
                <p className="mb-1 text-[11px] text-slate-400">本社: {vendor.hqCountry}</p>
                <p className="mb-2 text-xs leading-relaxed text-slate-300">{vendor.description}</p>
                {vendor.keyProducts.length > 0 ? (
                  <p className="mb-2 text-[11px] text-muted-foreground">
                    主力: {vendor.keyProducts.join(' / ')}
                  </p>
                ) : null}
                <div className="mb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  展開・適合地域
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.targetRegionIds.map((regionId) => {
                    const region = WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === regionId);
                    if (!region) return null;
                    const label = countryField(region, 'name');
                    return (
                      <button
                        key={regionId}
                        type="button"
                        onClick={() => focusVendorRegion(regionId)}
                        className="rounded-md border border-slate-600/80 bg-slate-800/70 px-2 py-0.5 text-[11px] text-slate-200 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-200"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {vendor.url ? (
                  <a
                    href={vendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[11px] text-emerald-400/90 hover:underline"
                  >
                    公式サイト
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </aside>
      ) : null}

      {/* ズームコントロール（伝播史は親サイドバーに集約） */}
      <div className={`absolute bottom-3 z-20 flex flex-col gap-1 rounded-lg border border-border/50 bg-zinc-900/80 p-1 shadow-lg backdrop-blur-sm ${isVendorsOpen ? 'right-[min(100%,22rem)] sm:right-96 mr-3' : 'right-3'}`}>
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
