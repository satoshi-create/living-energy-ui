'use client';

import React, {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useTranslations } from 'next-intl';
import { Info, Minus, Plus, RotateCcw, ZoomIn } from 'lucide-react';
import { CountryPvDetail, WORLD_BALCONY_PV_COUNTRIES } from '../data';

interface WorldPvMapProps {
  selectedCountryId: string;
  onSelectCountry: (country: CountryPvDetail) => void;
}

type RegionFocus = 'all' | 'europe' | 'asia' | 'asia-us';

type Transform = { x: number; y: number; k: number };

type ViewBox = { x: number; y: number; w: number; h: number };

const ASIA_COUNTRY_IDS = new Set(['china', 'japan']);
const EUROPE_COUNTRY_IDS = new Set([
  'germany',
  'austria',
  'italy',
  'uk',
  'france',
  'belgium',
  'switzerland',
]);

const SVG_W = 1000;
const SVG_H = 460;
/** Absolute scale in SVG user space (world fit ≈ 1; region presets up to ~3.5). */
const MIN_SCALE = 0.5;
const MAX_SCALE = 6;
const DRAG_THRESHOLD_PX = 5;
const ZOOM_STEP = 1.25;

const REGION_VIEW: Record<RegionFocus, ViewBox> = {
  all: { x: 0, y: 0, w: 1000, h: 460 },
  europe: { x: 380, y: 90, w: 240, h: 150 },
  asia: { x: 690, y: 130, w: 220, h: 130 },
  'asia-us': { x: 80, y: 80, w: 280, h: 220 },
};

function filledStarCount(rating: string): number {
  return (rating.match(/★/g) ?? []).length;
}

function clampScale(k: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, k));
}

/** Map a region viewBox window into SVG user-space translate+scale (meet). */
function viewBoxToTransform(vb: ViewBox): Transform {
  const k = Math.min(SVG_W / vb.w, SVG_H / vb.h);
  const tx = (SVG_W - vb.w * k) / 2 - vb.x * k;
  const ty = (SVG_H - vb.h * k) / 2 - vb.y * k;
  return { x: tx, y: ty, k };
}

/** Relative zoom factor vs full-world fit (k=1 for "all"). */
function relativeScale(k: number) {
  return k / viewBoxToTransform(REGION_VIEW.all).k;
}

function zoomAtPoint(prev: Transform, nextK: number, px: number, py: number): Transform {
  const k = clampScale(nextK);
  const ratio = k / prev.k;
  return {
    k,
    x: px - (px - prev.x) * ratio,
    y: py - (py - prev.y) * ratio,
  };
}

function clientToSvgPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const local = pt.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
}

export function WorldPvMap({ selectedCountryId, onSelectCountry }: WorldPvMapProps) {
  const t = useTranslations('worldPv');
  const [regionFocus, setRegionFocus] = useState<RegionFocus>('europe');
  const [showLegendMobile, setShowLegendMobile] = useState(false);
  const [transform, setTransform] = useState<Transform>(() =>
    viewBoxToTransform(REGION_VIEW.europe)
  );
  const [isPanning, setIsPanning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const panStartRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchStartRef = useRef<{
    dist: number;
    k: number;
    midX: number;
    midY: number;
    tx: number;
    ty: number;
  } | null>(null);
  const movedRef = useRef(false);

  const relK = relativeScale(transform.k);
  const isTightZoom = relK >= 2.4;
  const isZoomed = relK >= 1.3;

  useEffect(() => {
    setIsAnimating(true);
    setTransform(viewBoxToTransform(REGION_VIEW[regionFocus]));
    const id = window.setTimeout(() => setIsAnimating(false), 320);
    return () => window.clearTimeout(id);
  }, [regionFocus]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const el = svgRef.current;
      if (!el) return;
      const pt = clientToSvgPoint(el, e.clientX, e.clientY);
      const factor = e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
      const power = Math.min(3, Math.abs(e.deltaY) / 100);
      setTransform((prev) =>
        zoomAtPoint(prev, prev.k * Math.pow(factor, power), pt.x, pt.y)
      );
    }

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  function focusRegion(region: RegionFocus) {
    setRegionFocus(region);
  }

  function zoomBy(factor: number) {
    setTransform((prev) => zoomAtPoint(prev, prev.k * factor, SVG_W / 2, SVG_H / 2));
  }

  function resetView() {
    setIsAnimating(true);
    setTransform(viewBoxToTransform(REGION_VIEW[regionFocus]));
    window.setTimeout(() => setIsAnimating(false), 320);
  }

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as Element;
    const onCountry = Boolean(target.closest('[data-country-node]'));

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    movedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);

    if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = clientToSvgPoint(
        e.currentTarget,
        (pts[0].x + pts[1].x) / 2,
        (pts[0].y + pts[1].y) / 2
      );
      const tform = transformRef.current;
      pinchStartRef.current = {
        dist,
        k: tform.k,
        midX: mid.x,
        midY: mid.y,
        tx: tform.x,
        ty: tform.y,
      };
      panStartRef.current = null;
      setIsPanning(true);
      return;
    }

    // Allow pan from background, or from country after drag threshold (handled in move)
    const tform = transformRef.current;
    panStartRef.current = { x: e.clientX, y: e.clientY, tx: tform.x, ty: tform.y };
    if (!onCountry) setIsPanning(true);
  }

  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2 && pinchStartRef.current) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const start = pinchStartRef.current;
      if (start.dist <= 0) return;
      const nextK = clampScale(start.k * (dist / start.dist));
      const ratio = nextK / start.k;
      setTransform({
        k: nextK,
        x: start.midX - (start.midX - start.tx) * ratio,
        y: start.midY - (start.midY - start.ty) * ratio,
      });
      movedRef.current = true;
      return;
    }

    const start = panStartRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dist = Math.hypot(dx, dy);
    if (dist > DRAG_THRESHOLD_PX) {
      movedRef.current = true;
      if (!isPanning) setIsPanning(true);
    }
    if (!movedRef.current) return;

    const svg = svgRef.current;
    if (!svg) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    // Convert screen delta to SVG user units (viewBox space), then to pre-scale translate
    const kScreen = ctm.a; // uniform scale from SVG → screen
    const svgDx = dx / kScreen;
    const svgDy = dy / kScreen;
    setTransform((prev) => ({
      ...prev,
      x: start.tx + svgDx,
      y: start.ty + svgDy,
    }));
  }

  function onPointerUp(e: ReactPointerEvent<SVGSVGElement>) {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
      setIsPanning(false);
      // keep movedRef until click handler runs
      window.setTimeout(() => {
        movedRef.current = false;
      }, 0);
    } else if (pointersRef.current.size === 1) {
      const remaining = [...pointersRef.current.entries()][0];
      const tform = transformRef.current;
      panStartRef.current = {
        x: remaining[1].x,
        y: remaining[1].y,
        tx: tform.x,
        ty: tform.y,
      };
    }
  }

  function onCountryClick(e: ReactMouseEvent, country: CountryPvDetail) {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onSelectCountry(country);
  }

  const getStatusColor = (status: CountryPvDetail['status']) => {
    switch (status) {
      case 'legal_plug':
        return '#10b981';
      case 'appliance_notified':
        return '#3b82f6';
      case 'storage_only':
        return '#f59e0b';
      case 'strict_code':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const isInFocus = (id: string) => {
    if (regionFocus === 'all') return true;
    if (regionFocus === 'europe') return EUROPE_COUNTRY_IDS.has(id);
    if (regionFocus === 'asia') return ASIA_COUNTRY_IDS.has(id);
    return id === 'usa';
  };

  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-background/50 select-none">
      {/* SP/PC共通: フォーカス切り替えコントロール（右上） */}
      <div className="absolute top-2 right-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-end gap-0.5 rounded-md border border-border/50 bg-card/90 p-0.5 text-[11px] shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => focusRegion('all')}
          className={`rounded px-2 py-0.5 transition-colors ${
            regionFocus === 'all'
              ? 'bg-primary font-semibold text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('map.focusAll')}
        </button>
        <button
          type="button"
          onClick={() => focusRegion('europe')}
          className={`flex items-center gap-1 rounded px-2 py-0.5 transition-colors ${
            regionFocus === 'europe'
              ? 'bg-primary font-semibold text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ZoomIn className="h-3 w-3" />
          {t('map.focusEurope')}
        </button>
        <button
          type="button"
          onClick={() => focusRegion('asia')}
          className={`flex items-center gap-1 rounded px-2 py-0.5 transition-colors ${
            regionFocus === 'asia'
              ? 'bg-primary font-semibold text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ZoomIn className="h-3 w-3" />
          {t('map.focusAsia')}
        </button>
        <button
          type="button"
          onClick={() => focusRegion('asia-us')}
          className={`rounded px-2 py-0.5 transition-colors ${
            regionFocus === 'asia-us'
              ? 'bg-primary font-semibold text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('map.focusOthers')}
        </button>
      </div>

      {/* SP向け 凡例トグルボタン */}
      <div className="absolute top-2 left-2 z-20 lg:hidden">
        <button
          type="button"
          onClick={() => setShowLegendMobile(!showLegendMobile)}
          className="flex items-center gap-1.5 px-2 py-1 bg-card/90 backdrop-blur border border-border/50 rounded text-[10px] text-muted-foreground shadow-sm"
        >
          <Info className="w-3 h-3 text-emerald-500" />
          {t('map.legendTitle')} {showLegendMobile ? '×' : '+'}
        </button>
      </div>

      {/* 凡例パネル (PC: 常時表示 / SP: トグル開閉) */}
      <div
        className={`absolute top-2 left-2 lg:top-4 lg:left-4 z-10 bg-card/90 backdrop-blur-md border border-border/50 rounded-md p-2 lg:p-2.5 shadow-md space-y-1.5 text-[10px] lg:text-xs transition-all ${
          showLegendMobile ? 'block mt-7' : 'hidden lg:block'
        }`}
      >
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {t('map.legendTitle')}
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <span className="h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <span>{t('map.legendLegalPlug')}</span>
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <span className="h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />
          <span>{t('map.legendAppliance')}</span>
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <span className="h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />
          <span>{t('map.legendStorage')}</span>
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2">
          <span className="h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20" />
          <span>{t('map.legendStrictCode')}</span>
        </div>
      </div>

      {/* SVG地図 */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        preserveAspectRatio="xMidYMid meet"
        className={`world-pv-map-svg h-full w-full touch-none ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <g
          className={isAnimating ? 'transition-transform duration-300 ease-out' : undefined}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
            transformOrigin: '0 0',
          }}
        >
          {/* 海面（島国の離島感を強調する余白色） */}
          <rect
            x={0}
            y={0}
            width={1000}
            height={460}
            className="fill-[oklch(0.22_0.02_230)] dark:fill-[oklch(0.18_0.02_230)]"
            opacity={0.55}
          />

          <g fill="currentColor" className="text-muted/60 transition-colors pointer-events-none">
            {/* ユーラシア大陸：西端を東へ寄せ、イギリス海峡相当の海ギャップを確保 */}
            <path d="M470,78 Q560,52 680,72 Q760,100 800,125 Q850,160 820,205 Q780,250 705,220 Q610,240 540,280 Q500,350 470,400 Q445,350 450,280 Q455,220 470,175 Q460,120 470,78 Z" />
            {/* 南北アメリカ */}
            <path d="M160,50 Q240,70 280,145 Q240,205 260,240 Q320,300 290,420 Q240,420 220,320 Q200,245 150,205 Q100,150 160,50 Z" />
            {/* オーストラリア */}
            <path d="M750,305 Q830,295 850,350 Q800,400 740,370 Z" />
            {/* 日本列島（本州〜九州の離島シルエット。大陸東端から海を挟む） */}
            <path d="M848,168 Q862,162 868,178 Q872,198 862,212 Q848,220 842,205 Q838,188 848,168 Z" />
            <path d="M838,214 Q848,210 852,224 Q844,232 836,226 Q834,218 838,214 Z" />
            <path d="M856,158 Q862,154 864,162 Q860,166 856,162 Z" />
            {/* イギリス諸島（欧州西岸から海峡を隔てた島） */}
            <path d="M418,118 Q438,112 442,128 Q440,148 428,158 Q416,152 412,138 Q410,124 418,118 Z" />
            <path d="M422,162 Q430,160 432,170 Q426,176 420,170 Z" />
          </g>

          {WORLD_BALCONY_PV_COUNTRIES.map((country) => {
            const isSelected = country.id === selectedCountryId;
            const focused = isInFocus(country.id);
            const color = getStatusColor(country.status);
            const stars = filledStarCount(country.rating);
            const countryName = t(
              `countries.${country.id}.name` as Parameters<typeof t>[0]
            );
            const countryPowerLimit = t(
              `countries.${country.id}.powerLimit` as Parameters<typeof t>[0]
            );
            const pinR = isTightZoom
              ? isSelected
                ? 3.5
                : 2.5
              : isZoomed
                ? isSelected
                  ? 5
                  : 3.5
                : isSelected
                  ? 6
                  : 4.5;
            const hitR = isTightZoom ? 10 : isZoomed ? 16 : 24;
            const fontSize = isTightZoom ? 5 : isZoomed ? 8 : isSelected ? 11 : 10;
            const subFontSize = isTightZoom ? 4 : isZoomed ? 6.5 : 9;
            const labelScale = isTightZoom ? 0.4 : isZoomed ? 0.6 : 1;
            const isLeft = country.labelDx < 0;
            const lx = country.x + country.labelDx * labelScale;
            const ly = country.y + country.labelDy * labelScale;
            const lineEndX =
              country.x + country.labelDx * (isTightZoom ? 0.25 : isZoomed ? 0.35 : 0.45);
            const lineEndY =
              country.y + country.labelDy * (isTightZoom ? 0.35 : isZoomed ? 0.45 : 0.65);
            const labelHitW = isTightZoom ? 52 : isZoomed ? 78 : 110;
            const labelHitH = isTightZoom ? 14 : isZoomed ? 22 : 28;
            const labelHitX = isLeft ? lx - labelHitW : lx;
            const labelHitY = ly - (isTightZoom ? 5 : isZoomed ? 8 : 10);

            return (
              <g
                key={country.id}
                data-country-node
                className="group cursor-pointer"
                opacity={focused ? 1 : 0.22}
                onClick={(e) => onCountryClick(e, country)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!movedRef.current) onSelectCountry(country);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={countryName}
              >
                {/* ピン周辺ヒットエリア */}
                <circle cx={country.x} cy={country.y} r={hitR} fill="transparent" />

                {/* 国名ラベルヒットエリア（テキストクリックでサイドバーを開く） */}
                <rect
                  x={labelHitX}
                  y={labelHitY}
                  width={labelHitW}
                  height={labelHitH}
                  fill="transparent"
                  className="pointer-events-auto"
                />

                {/* 引出線 */}
                <line
                  x1={country.x}
                  y1={country.y}
                  x2={lineEndX}
                  y2={lineEndY}
                  stroke={color}
                  strokeWidth={isTightZoom ? 0.6 : isSelected ? 1.5 : 1}
                  strokeDasharray={isTightZoom ? '1,1' : '2,2'}
                  opacity={isSelected ? 0.9 : 0.4}
                  className="pointer-events-none"
                />

                {/* パルス */}
                <circle
                  cx={country.x}
                  cy={country.y}
                  r={pinR * 1.8}
                  fill={color}
                  opacity={isSelected ? 0.6 : 0.2}
                  className="pointer-events-none"
                >
                  <animate
                    attributeName="r"
                    values={`${pinR * 1.2};${pinR * 2.5};${pinR * 1.2}`}
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* ピン点 */}
                <circle
                  cx={country.x}
                  cy={country.y}
                  r={pinR}
                  fill={color}
                  stroke="var(--background)"
                  strokeWidth={isTightZoom ? 0.8 : 2}
                  className="pointer-events-none"
                />

                {/* 国名 + 進展度★ */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor={isLeft ? 'end' : 'start'}
                  fill="currentColor"
                  fontSize={fontSize}
                  fontWeight={isSelected ? 'bold' : '500'}
                  className={`world-pv-map-label select-none pointer-events-auto ${
                    isSelected
                      ? 'fill-foreground drop-shadow font-bold'
                      : 'fill-muted-foreground group-hover:fill-foreground'
                  }`}
                >
                  {countryName}{' '}
                  <tspan fill="#eab308" fontWeight="600">
                    ★{stars}
                  </tspan>
                </text>

                {/* 認可上限（2行目） */}
                <text
                  x={lx}
                  y={ly + (isTightZoom ? 6 : isZoomed ? 10 : 13)}
                  textAnchor={isLeft ? 'end' : 'start'}
                  fontSize={subFontSize}
                  className={`world-pv-map-label select-none pointer-events-auto ${
                    isSelected
                      ? 'fill-foreground/80'
                      : 'fill-muted-foreground/70 group-hover:fill-foreground/70'
                  }`}
                >
                  ({countryPowerLimit})
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* ズームコントロール */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1 rounded-lg border border-border/50 bg-zinc-900/80 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          aria-label={t('map.zoomIn')}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={() => zoomBy(ZOOM_STEP)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          aria-label={t('map.zoomOut')}
          className="flex size-8 items-center justify-center rounded-md text-zinc-200 transition-colors hover:bg-zinc-700/80"
          onClick={() => zoomBy(1 / ZOOM_STEP)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          aria-label={t('map.resetView')}
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
