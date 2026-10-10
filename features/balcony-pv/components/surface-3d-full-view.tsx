'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Sofa } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import {
  getCountryArchitectureConfig,
  listArchitectureCatalog,
  type ArchitectureProfile,
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

export function Surface3DFullView({ initialFocus = null, className }: Surface3DFullViewProps) {
  const t = useTranslations('worldPv.architecture')
  const tFull = useTranslations('worldPv.architecture.surface3d.fullView')
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
          className="h-full rounded-none border-0"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-4 py-3">
          <p className="text-xs font-medium text-primary/90">{tFull('eyebrow')}</p>
          <h2 className="text-base font-semibold text-white sm:text-lg">{t(profile.nameKey)}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
            {tFull('lead')}
          </p>
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
              {t('surface3d.tiltLabel')}: {profile.tiltAngle}
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
