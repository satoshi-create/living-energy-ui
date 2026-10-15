'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { PanelRightClose, PanelRightOpen, Sofa } from 'lucide-react'
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
  type SolarFurnitureId,
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

type AnglePreset = '0°' | '30°' | '90°'
type PanelMode = 'constraints' | 'furniture'

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
  const [panelMode, setPanelMode] = useState<PanelMode>('constraints')
  const [furnitureId, setFurnitureId] = useState<SolarFurnitureId | null>(
    initial.profile.adaptedFurnitureIds[0] ?? null,
  )
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
            {(['0°', '30°', '90°'] as const).map((a) => (
              <ToggleGroupItem key={a} value={a} className="flex-1 font-mono text-xs">
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
                {tiltMetric.efficiencyNote ? ` (${tiltMetric.efficiencyNote})` : null}
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

        {/* 3. 解説パネル（構造的制約 / 生活家具型ソーラー） */}
        <section className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
          <ToggleGroup
            value={[panelMode]}
            onValueChange={(v) => v[0] && setPanelMode(v[0] as PanelMode)}
            variant="outline"
            className="flex w-full"
          >
            <ToggleGroupItem value="constraints" className="flex-1 text-xs">
              {tFull('modeConstraints')}
            </ToggleGroupItem>
            <ToggleGroupItem value="furniture" className="flex-1 text-xs">
              {tFull('modeFurniture')}
            </ToggleGroupItem>
          </ToggleGroup>

          {panelMode === 'constraints' ? (
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('constraintsLabel')}
              </p>
              <p className="text-sm font-medium leading-relaxed text-slate-200">
                {t(profile.constraintsKey)}
              </p>
              <p className="text-xs leading-relaxed text-slate-400">
                {t(
                  profile.constraintsKey.replace(
                    /\.constraints$/,
                    '.regionContext',
                  ) as Parameters<typeof t>[0],
                )}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <Sofa className="size-3" />
                {t('adaptedFurnitureLabel')}
              </p>
              <div className="flex flex-col gap-2">
                {profile.adaptedFurnitureIds.map((fid) => {
                  const active = furnitureId === fid
                  return (
                    <button
                      key={fid}
                      type="button"
                      onClick={() => setFurnitureId(fid)}
                      className={cn(
                        'rounded-md border px-2.5 py-2 text-left text-xs transition-colors',
                        active
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-700/60 bg-slate-900/80 text-slate-300 hover:border-slate-600',
                      )}
                    >
                      <span className="font-medium">{t(`furniture.${fid}.name`)}</span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {t(`furniture.${fid}.adaptation`)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </aside>
      ) : null}
    </div>
  )
}
