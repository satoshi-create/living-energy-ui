'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Sofa } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  type LivingHabit,
  type PanelTiltMode,
  type SolarFurnitureId,
  type SurfaceTiltAngle,
  type WeatherCondition,
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
}: Surface3DFullViewProps) {
  const t = useTranslations('worldPv.architecture')
  const tFull = useTranslations('worldPv.architecture.surface3d.fullView')
  const tPv = useTranslations('balconyPv')
  const catalog = useMemo(() => listArchitectureCatalog(), [])
  const initial = useMemo(
    () => resolveInitialProfile(initialFocus, catalog),
    [initialFocus, catalog],
  )

  const [countryId, setCountryId] = useState(initial.countryId)
  const [profileId, setProfileId] = useState(initial.profile.id)
  const [angle, setAngle] = useState<AnglePreset>(
    (['0°', '30°', '90°'] as const).includes(initial.profile.tiltAngle as AnglePreset)
      ? (initial.profile.tiltAngle as AnglePreset)
      : '30°',
  )
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
  const setLivingContext = (next: LivingContext) => {
    if (onLivingContextChange) onLivingContextChange(next)
    else setLivingContextInternal(next)
  }

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

  const countryProfiles = useMemo(() => {
    return getCountryArchitectureConfig(countryId)?.profiles ?? [profile]
  }, [countryId, profile])

  const selectProfile = (nextCountryId: string, nextProfile: ArchitectureProfile) => {
    setCountryId(nextCountryId)
    setProfileId(nextProfile.id)
    if ((['0°', '30°', '90°'] as const).includes(nextProfile.tiltAngle as AnglePreset)) {
      setAngle(nextProfile.tiltAngle as AnglePreset)
    }
    setFurnitureId(nextProfile.adaptedFurnitureIds[0] ?? null)
    const nextTypology =
      catalog.find((r) => r.profile.id === nextProfile.id)?.typology ?? typology
    if (nextTypology && tiltModeProp === undefined) {
      setTiltModeInternal(resolveDefaultTiltMode(nextTypology))
    }
  }

  const angleMatches = (tilt: SurfaceTiltAngle) => {
    if (angle === '0°') return tilt === '0°'
    if (angle === '30°') return tilt === '30°' || tilt === '45°'
    return tilt === '90°'
  }

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row',
        className,
      )}
    >
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-border/50 bg-slate-950">
        <Surface3DViewer
          profileId={profile.model3dId}
          variant="full"
          cameraPreset={angle}
          tiltDeg={tiltOption.tiltDeg}
          isRetracted={isRetracted}
          className="h-full rounded-none border-0"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-4 py-3">
          <p className="text-xs font-medium text-primary/90">{tFull('eyebrow')}</p>
          <h2 className="text-base font-semibold text-white sm:text-lg">{t(profile.nameKey)}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
            {tFull('lead')}
          </p>
        </div>
        <div className="pointer-events-none absolute right-3 bottom-3 z-10">
          <Badge
            variant="outline"
            className="bg-background/85 font-mono text-[10px] shadow-sm ring-1 ring-border/50"
          >
            {tPv('operatingTilt', {
              deg: tiltOption.tiltDeg,
              label: tPv(`tiltMode.${tiltMode}`),
            })}
          </Badge>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-3 overflow-y-auto rounded-xl border border-border/60 bg-card/95 p-3 backdrop-blur-md lg:w-80 lg:max-w-sm">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">{tFull('profileSelect')}</p>
          <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto">
            {catalog.map(({ countryId: cid, profile: p, typology }) => {
              const active = p.id === profileId && cid === countryId
              return (
                <li key={`${cid}-${p.id}`}>
                  <button
                    type="button"
                    onClick={() => selectProfile(cid, p)}
                    className={cn(
                      'flex w-full flex-col gap-0.5 rounded-lg border px-2.5 py-2 text-left transition-colors',
                      active
                        ? 'border-primary/50 bg-primary/15 text-primary'
                        : 'border-border/40 bg-muted/30 text-foreground hover:border-border hover:bg-muted/50',
                    )}
                  >
                    <span className="text-xs font-medium">{t(p.nameKey)}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {p.tiltAngle} · {t(`opticalProfile.${typology.opticalProfile}`)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {countryProfiles.length > 1 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground">
              {tFull('sameFormCompare')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {countryProfiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectProfile(countryId, p)}
                  className={cn(
                    'rounded-md border px-2 py-1 text-[11px]',
                    p.id === profileId
                      ? 'border-primary/50 bg-primary/20 text-primary'
                      : 'border-border/50 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(`types.${p.type}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">
            {tPv('tiltModeLabel')}
          </p>
          <ToggleGroup
            value={[tiltMode]}
            onValueChange={(v) => v[0] && setTiltMode(v[0] as PanelTiltMode)}
            variant="outline"
            className="flex w-full flex-wrap"
          >
            {supportedTiltModes.map((mode) => (
              <ToggleGroupItem key={mode} value={mode} className="flex-1 text-xs">
                {tPv(`tiltMode.${mode}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">
            {tPv('conditions.livingHabit')}
          </p>
          <ToggleGroup
            value={[livingContext.habit]}
            onValueChange={(v) => {
              const habit = v[0] as LivingHabit | undefined
              if (habit) setLivingContext({ ...livingContext, habit })
            }}
            variant="outline"
            className="flex w-full flex-wrap"
          >
            {(
              [
                'laundry_drying',
                'view_preservation_terrace',
                'outdoor_unit_service',
              ] as const
            ).map((habit) => (
              <ToggleGroupItem key={habit} value={habit} className="flex-1 text-[10px]">
                {tPv(`livingHabit.${habit}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">
            {tPv('conditions.weather')}
          </p>
          <ToggleGroup
            value={[livingContext.weather]}
            onValueChange={(v) => {
              const weather = v[0] as WeatherCondition | undefined
              if (weather) setLivingContext({ ...livingContext, weather })
            }}
            variant="outline"
            className="flex w-full flex-wrap"
          >
            {(['clear', 'overcast_tsuyu', 'typhoon_alert'] as const).map((weather) => (
              <ToggleGroupItem key={weather} value={weather} className="flex-1 text-[10px]">
                {tPv(`weather.${weather}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Card className="border-border/50 bg-muted/40 shadow-none">
          <CardHeader className="space-y-0 px-3 pt-3 pb-1.5">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground">
              {tPv('livingMetrics.cardTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 px-3 pb-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {tPv('livingMetrics.relativeEfficiency')}
                </span>
                <span className="font-mono text-xs tabular-nums text-foreground">
                  {livingMetrics.displayEfficiencyPct}%
                  {tiltMetric.efficiencyNote ? ` (${tiltMetric.efficiencyNote})` : null}
                </span>
              </div>
              <Progress value={livingMetrics.displayEfficiencyPct} className="h-1.5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {tPv('livingMetrics.lifeCompliance')}
                </span>
                <span className="font-mono text-xs tabular-nums text-primary">
                  {livingMetrics.lifeCompliancePct}%
                </span>
              </div>
              <Progress value={livingMetrics.lifeCompliancePct} className="h-1.5" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="secondary"
                className="h-5 rounded-md px-1.5 text-[10px] font-medium"
              >
                {tiltMetric.winterAdvantage}
              </Badge>
              <Badge
                variant="outline"
                className="h-5 rounded-md px-1.5 text-[10px] font-medium"
              >
                {tPv('livingMetrics.windRisk')}: {tiltMetric.windRisk}
              </Badge>
            </div>
            {livingContext.weather === 'typhoon_alert' && (
              <p className="text-[10px] text-amber-300/90">
                {tPv('livingMetrics.typhoonStowHint')}
              </p>
            )}
            <p className="text-[11px] leading-relaxed text-slate-300">{tiltMetric.summary}</p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">{tFull('angleLabel')}</p>
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
          <p className="text-[10px] text-muted-foreground">
            {tFull('angleHint', { tilt: profile.tiltAngle })}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground">{tFull('panelModeLabel')}</p>
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
        </div>

        {panelMode === 'constraints' ? (
          <div className="rounded-lg bg-rose-500/10 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-rose-300">{t('constraintsLabel')}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">
              {t(profile.constraintsKey)}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-rose-200/70">
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
            <p className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <Sofa className="size-3" />
              {t('adaptedFurnitureLabel')}
            </p>
            <div className="flex flex-col gap-1.5">
              {profile.adaptedFurnitureIds.map((fid) => {
                const active = furnitureId === fid
                return (
                  <button
                    key={fid}
                    type="button"
                    onClick={() => setFurnitureId(fid)}
                    className={cn(
                      'rounded-md border px-2.5 py-2 text-left text-[11px] transition-colors',
                      active
                        ? 'border-primary/60 bg-primary/20 text-primary ring-1 ring-primary/40'
                        : 'border-border/50 bg-muted/40 text-slate-200 hover:border-primary/40',
                    )}
                  >
                    <span className="font-medium">{t(`furniture.${fid}.name`)}</span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">
                      {t(`furniture.${fid}.adaptation`)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-auto rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="font-mono text-[10px]">
              {tPv('operatingTilt', {
                deg: tiltOption.tiltDeg,
                label: tPv(`tiltMode.${tiltMode}`),
              })}
            </Badge>
            {typology ? (
              <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                {t(`opticalProfile.${typology.opticalProfile}`)}
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{t(profile.descriptionKey)}</p>
        </div>
      </aside>
    </div>
  )
}
