'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { CountryCode } from '@/lib/country-codes'
import {
  ECOSYSTEM_ACTORS,
  filterActors,
  filterActorsByCountry,
  type FormFactor,
  type RegionScope,
} from '../data'
import { ActorCard } from './actor-card'
import { EcosystemTable } from './ecosystem-table'

const REGION_OPTIONS: RegionScope[] = ['all', 'japan', 'global']
const FORM_OPTIONS: FormFactor[] = ['balcony', 'non-balcony']

const COUNTRY_LABELS: Record<CountryCode, string> = {
  DE: 'ドイツ',
  AT: 'オーストリア',
  IT: 'イタリア',
  GB: 'イギリス',
  FR: 'フランス',
  BE: 'ベルギー',
  CH: 'スイス',
  CN: '中国',
  JP: '日本',
  US: 'アメリカ',
  EU: 'EU',
}

type ViewMode = 'cards' | 'table'

export type EcosystemViewProps = {
  initialCountryCode?: CountryCode
}

export function EcosystemView({ initialCountryCode }: EcosystemViewProps) {
  const t = useTranslations('ecosystem')
  const [regionScope, setRegionScope] = useState<RegionScope>('all')
  const [formFactor, setFormFactor] = useState<FormFactor>('balcony')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode | null>(
    initialCountryCode ?? null
  )

  const baseActors = filterActors(ECOSYSTEM_ACTORS, regionScope, formFactor)
  const actors = selectedCountryCode
    ? filterActorsByCountry(baseActors, selectedCountryCode)
    : baseActors

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {t('title')}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{t('lead')}</p>
      </div>

      {selectedCountryCode && (
        <button
          type="button"
          onClick={() => setSelectedCountryCode(null)}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          {COUNTRY_LABELS[selectedCountryCode]}({selectedCountryCode}) 関連組織
          <X className="size-3" />
        </button>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <Tabs
          value={formFactor}
          onValueChange={(value) => {
            if (value === 'balcony' || value === 'non-balcony') {
              setFormFactor(value)
            }
          }}
        >
          <TabsList>
            {FORM_OPTIONS.map((option) => (
              <TabsTrigger key={option} value={option} className="px-3 text-xs">
                {t(
                  `filters.formFactor.${option === 'non-balcony' ? 'nonBalcony' : option}`
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {t('filters.region.label')}:
          </span>
          <Select
            value={regionScope}
            onValueChange={(value) => {
              if (value != null) setRegionScope(value as RegionScope)
            }}
          >
            <SelectTrigger size="sm" className="min-w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(`filters.region.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 sm:ml-auto">
          <ToggleGroup
            value={[viewMode]}
            onValueChange={(group) => {
              const next = group[0] as ViewMode | undefined
              if (next) setViewMode(next)
            }}
            variant="outline"
            size="sm"
            spacing={0}
            className="rounded-lg border border-border/60 bg-muted/40 p-0.5"
          >
            <ToggleGroupItem
              value="cards"
              className="rounded-md border-0 px-3 text-xs shadow-none aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
            >
              {t('viewMode.cards')}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="table"
              className="rounded-md border-0 px-3 text-xs shadow-none aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
            >
              {t('viewMode.table')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {actors.map((actor) => (
            <ActorCard key={actor.id} actor={actor} />
          ))}
        </div>
      ) : (
        <EcosystemTable actors={actors} />
      )}

      {actors.length === 0 && viewMode === 'cards' && (
        <p className="text-sm text-muted-foreground">{t('filters.empty')}</p>
      )}
    </div>
  )
}
