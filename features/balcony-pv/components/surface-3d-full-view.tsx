'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { CheckCircle2, FileText, PanelRightClose, PanelRightOpen, ShieldAlert, Sparkles, XCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import {
  DEFAULT_LIVING_CONTEXT,
  getCountryArchitectureConfig,
  getPanelTiltOption,
  getTiltMetric,
  listArchitectureCatalog,
  resolveDefaultTiltMode,
  resolveLivingMetrics,
  resolveSupportedTiltModes,
  type ArchitectureProfile,
  type LivingContext,
  type PanelTiltMode,
  type SurfaceTiltAngle,
} from '../data'
import { Surface3DViewer } from './surface-3d-viewer'

export type Surface3DFocus = {
  countryId: string
  profileId: string
}

export type Surface3DFullViewProps = {
  initialFocus?: Surface3DFocus | null
  className?: string
  /** Controlled install-style (variable tilt / 出仕舞い). */
  tiltMode?: PanelTiltMode
  onTiltModeChange?: (mode: PanelTiltMode) => void
  /** Controlled living / weather scenario (optional). */
  livingContext?: LivingContext
  onLivingContextChange?: (ctx: LivingContext) => void
  /** Controlled sidebar visibility (optional; defaults to internal state). */
  sidebarOpen?: boolean
  onSidebarOpenChange?: (open: boolean) => void
  /** Hide the built-in toggle when the parent renders one. */
  hideSidebarToggle?: boolean
}

type AnglePreset = '0°' | '30°' | '90°' | '-30°'
type PanelMode = 'structure' | 'legal' | 'panels'

function resolveInitialProfile(
  focus: Surface3DFocus | null | undefined,
  catalog: ReturnType<typeof listArchitectureCatalog>,
): { countryId: string; profile: ArchitectureProfile } {
  if (focus) {
    const cfg =
      getCountryArchitectureConfig(focus.countryId) ??
      getCountryArchitectureConfig(focus.profileId)
    const fromFocus = cfg?.profiles.find((p) => p.id === focus.profileId)
    if (fromFocus && cfg) {
      return {
        countryId: cfg.regionIds[0] ?? focus.countryId,
        profile: fromFocus,
      }
    }
    const byProfile = catalog.find((r) => r.profile.id === focus.profileId)
    if (byProfile) return { countryId: byProfile.countryId, profile: byProfile.profile }
  }
  const first = catalog[0]
  return { countryId: first.countryId, profile: first.profile }
}

export function Surface3DFullView({
  initialFocus = null,
  className,
  tiltMode: tiltModeProp,
  onTiltModeChange,
  livingContext: livingContextProp,
  onLivingContextChange,
  sidebarOpen: sidebarOpenProp,
  onSidebarOpenChange,
  hideSidebarToggle = false,
}: Surface3DFullViewProps) {
  const t = useTranslations('worldPv.architecture')
  const tFull = useTranslations('worldPv.architecture.surface3d.fullView')
  const tPv = useTranslations('balconyPv')
  const isEn = useLocale() === 'en'
  const catalog = useMemo(() => listArchitectureCatalog(), [])
  const initial = useMemo(
    () => resolveInitialProfile(initialFocus, catalog),
    [initialFocus, catalog],
  )

  const [sidebarOpenInternal, setSidebarOpenInternal] = useState(true)
  const sidebarOpen = sidebarOpenProp ?? sidebarOpenInternal
  const setSidebarOpen = (open: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof open === 'function' ? open(sidebarOpen) : open
    if (onSidebarOpenChange) onSidebarOpenChange(next)
    else setSidebarOpenInternal(next)
  }
  const [countryId, setCountryId] = useState(initial.countryId)
  const [profileId, setProfileId] = useState(initial.profile.id)
  // Match card-list preview: always open on the oblique overview (not panel tiltAngle).
  const [angle, setAngle] = useState<AnglePreset>('30°')
  const [panelMode, setPanelMode] = useState<PanelMode>('structure')
  const [tiltModeInternal, setTiltModeInternal] = useState<PanelTiltMode>('optimal_tilt')
  const [livingContextInternal, setLivingContextInternal] =
    useState<LivingContext>(DEFAULT_LIVING_CONTEXT)

  const profile = useMemo(() => {
    const cfg = getCountryArchitectureConfig(countryId)
    return cfg?.profiles.find((p) => p.id === profileId) ?? initial.profile
  }, [countryId, profileId, initial.profile])

  const typology = useMemo(() => {
    return (
      catalog.find((r) => r.profile.id === profile.id)?.typology ??
      catalog[0]?.typology
    )
  }, [catalog, profile.id])

  const supportedTiltModes = useMemo(
    () =>
      typology
        ? resolveSupportedTiltModes(typology)
        : (['horizontal', 'optimal_tilt', 'vertical', 'retracted'] as PanelTiltMode[]),
    [typology],
  )

  const tiltMode = tiltModeProp ?? tiltModeInternal
  const setTiltMode = (mode: PanelTiltMode) => {
    if (onTiltModeChange) onTiltModeChange(mode)
    else setTiltModeInternal(mode)
  }

  const livingContext = livingContextProp ?? livingContextInternal

  useEffect(() => {
    if (tiltModeProp !== undefined) return
    if (!typology) return
    setTiltModeInternal(resolveDefaultTiltMode(typology))
  }, [typology, tiltModeProp])

  useEffect(() => {
    if (livingContext.weather !== 'typhoon_alert') return
    if (!supportedTiltModes.includes('retracted')) return
    if (tiltMode === 'retracted') return
    setTiltMode('retracted')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to weather / supported modes
  }, [livingContext.weather, supportedTiltModes])

  const tiltOption = getPanelTiltOption(tiltMode)
  const tiltMetric = getTiltMetric(tiltMode)
  const livingMetrics = useMemo(
    () => resolveLivingMetrics(livingContext, tiltMode, typology?.id),
    [livingContext, tiltMode, typology?.id],
  )
  const isRetracted = tiltMode === 'retracted'

  const angleMatches = (tilt: SurfaceTiltAngle) => {
    if (angle === '0°') return tilt === '0°'
    if (angle === '30°') return tilt === '30°' || tilt === '45°'
    return tilt === '90°'
  }

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-6 overflow-hidden bg-slate-950 lg:flex-row',
        className,
      )}
    >
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950">
        <Surface3DViewer
          profileId={profile.model3dId}
          variant="full"
          cameraPreset={angle}
          tiltDeg={tiltOption.tiltDeg}
          isRetracted={isRetracted}
          className="h-full rounded-none border-0"
        />
        {!hideSidebarToggle ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-3 right-3 z-20 inline-flex size-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/90 text-slate-200 shadow-sm transition-colors hover:bg-slate-800/90"
            aria-label={
              sidebarOpen
                ? isEn
                  ? 'Collapse sidebar'
                  : 'サイドバーを閉じる'
                : isEn
                  ? 'Expand sidebar'
                  : 'サイドバーを開く'
            }
          >
            {sidebarOpen ? (
              <PanelRightClose className="size-4" aria-hidden />
            ) : (
              <PanelRightOpen className="size-4" aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      {sidebarOpen ? (
        <aside className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto lg:w-[380px]">
          {/* 1. 観察角度 */}
          <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
            <p className="text-base font-semibold tracking-tight text-slate-100">
              {tFull('angleLabel')}
            </p>
            <ToggleGroup
              value={[angle]}
              onValueChange={(v) => v[0] && setAngle(v[0] as AnglePreset)}
              variant="outline"
              className="flex w-full"
            >
              {(['0°', '30°', '90°', '-30°'] as const).map((a) => (
                <ToggleGroupItem className="flex-1 font-mono text-xs" key={a} value={a}>
                  {a}
                  {angleMatches(profile.tiltAngle) && a === angle ? (
                    <span className="sr-only">{tFull('angleNative')}</span>
                  ) : null}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="text-xs text-slate-400">
              {tFull('angleHint', { tilt: profile.tiltAngle })}
            </p>
          </section>

          {/* 2. 角度効率・生活適応メーター */}
          <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
            <p className="text-sm font-bold tracking-tight text-slate-100">
              {tPv('livingMetrics.cardTitle')}
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-slate-400">
                  {tPv('livingMetrics.relativeEfficiency')}
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-200">
                  {livingMetrics.displayEfficiencyPct}%
                  {tPv.has(`livingMetrics.efficiencyNote.${tiltMode}`)
                    ? ` ${tPv(`livingMetrics.efficiencyNote.${tiltMode}`)}`
                    : tiltMetric.efficiencyNote
                      ? ` （${tiltMetric.efficiencyNote}）`
                      : null}
                </span>
              </div>
              <Progress value={livingMetrics.displayEfficiencyPct} className="h-1.5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-slate-400">
                  {tPv('livingMetrics.lifeCompliance')}
                </span>
                <span className="font-mono text-xs tabular-nums text-emerald-400">
                  {livingMetrics.lifeCompliancePct}%
                </span>
              </div>
              <Progress value={livingMetrics.lifeCompliancePct} className="h-1.5" />
            </div>
          </section>

          {/* 3. 制約・法規制・推奨パネル */}
          <section className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
            <ToggleGroup
              value={[panelMode]}
              onValueChange={(v) => v[0] && setPanelMode(v[0] as PanelMode)}
              variant="outline"
              className="flex w-full"
            >
              <ToggleGroupItem value="structure" className="flex-1 text-xs">
                {tFull('tabStructure')}
              </ToggleGroupItem>
              <ToggleGroupItem value="legal" className="flex-1 text-xs">
                {tFull('tabLegal')}
              </ToggleGroupItem>
              <ToggleGroupItem value="panels" className="flex-1 text-xs">
                {tFull('tabPanels')}
              </ToggleGroupItem>
            </ToggleGroup>

            {panelMode === 'structure' ? (
              <div className="space-y-4">
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <ShieldAlert className="size-3.5" />
                    <span>{tFull('structureTitle')}</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-200">
                    {tFull('structureDesc')}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-400 border-t border-slate-800/60 pt-2">
                    {tFull('structureScope')}
                  </p>
                </div>

                {profile.model3dId === 'japanese-evacuation-balcony' && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {isEn ? 'Design Specifications (CAD / Codes)' : '基本設計寸法（CAD / 法規準拠）'}
                    </div>
                    <div className="mt-3 divide-y divide-slate-800/60 text-xs">
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Floor Slab (Depth × Width)' : '床スラブ（有効出幅×間口）'}</span>
                        <span className="font-mono text-slate-200">1,550 × 2,800 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Railing Height (Order Art. 126)' : '手すり天端高（令第126条）'}</span>
                        <span className="font-mono font-medium text-emerald-400">H = 1,100 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Baluster Pitch (Head Safety)' : '縦格子ピッチ（頭部侵入防止）'}</span>
                        <span className="font-mono text-slate-200">約 115 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Egress Corridor Clearance' : '消防避難動線（有効幅基準）'}</span>
                        <span className="font-mono font-medium text-emerald-400">600 mm 以上確保</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Evacuation Hatch Cover' : '避難ハッチ蓋（SUS標準）'}</span>
                        <span className="font-mono text-slate-200">620 × 620 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Drainage Gutter Step' : '水抜き排水側溝'}</span>
                        <span className="font-mono text-slate-200">幅 140 mm / 段差 15 mm</span>
                      </div>
                    </div>
                  </div>
                )}

                {profile.model3dId === 'concrete-parapet' && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {isEn ? 'Design Specifications (DIN / Eurocodes)' : '基本設計寸法（DIN / 欧州法規準拠）'}
                    </div>
                    <div className="mt-3 divide-y divide-slate-800/60 text-xs">
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Balcony Slab (DIN 18065)' : '床スラブ有効寸法（DIN 18065）'}</span>
                        <span className="font-mono text-slate-200">1,650 × 2,700 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Parapet Height (LBO Standard)' : '腰壁天端高（各州建築基準法）'}</span>
                        <span className="font-mono font-medium text-emerald-400">H = 1,050 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Concrete Parapet Thickness' : 'RC腰壁躯体厚み'}</span>
                        <span className="font-mono text-slate-200">220 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Capping Flashing (Width)' : '笠木水切り天端幅'}</span>
                        <span className="font-mono text-slate-200">260 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Roller Shutter (Rollladen Box)' : '外付けシャッター格納箱'}</span>
                        <span className="font-mono text-slate-200">1,480 × 220 mm</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">{isEn ? 'Inverter Clearance (VDE AR-N 4105)' : 'インバータ設置離隔（VDE規格）'}</span>
                        <span className="font-mono font-medium text-emerald-400">通風 150 mm 以上</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : panelMode === 'legal' ? (
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <FileText className="size-3.5" />
                  <span>{tFull('legalTitle')}</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-200">
                  {tFull('legalDesc')}
                </p>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Sparkles className="size-3.5" />
                  <span>{tFull('tabPanels')}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                    <p className="text-xs font-medium text-emerald-300">
                      {tFull('panelsRec1')}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                    <p className="text-xs font-medium text-emerald-300">
                      {tFull('panelsRec2')}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5">
                    <XCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                    <p className="text-xs font-medium text-rose-300">
                      {tFull('panelsUnfit')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </aside>
      ) : null}
    </div>
  )
}
