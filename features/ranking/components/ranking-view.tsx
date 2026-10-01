'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorldPvMap } from '@/features/balcony-pv'
import {
  WORLD_BALCONY_PV_COUNTRIES,
  type CountryPvDetail,
} from '@/features/balcony-pv/data'
import { ECOSYSTEM_ORGS, ECOSYSTEM_CAREERS } from '../data'

type CountryCopyKey =
  | 'name'
  | 'statusLabel'
  | 'powerLimit'
  | 'connectionMethod'
  | 'tenantRights'
  | 'paybackYears'
  | 'costRange'
  | 'baseLoadCoverage'
  | 'incentives'
  | 'antiIslanding'
  | 'meterRequirement'
  | 'windSafety'
  | 'mountingRules'
  | 'summary'

export function RankingView() {
  const t = useTranslations('worldPv')
  const [selectedCountryId, setSelectedCountryId] = useState<string>('germany')
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  const country: CountryPvDetail =
    WORLD_BALCONY_PV_COUNTRIES.find((c) => c.id === selectedCountryId) ||
    WORLD_BALCONY_PV_COUNTRIES[0]

  const countryText = (field: CountryCopyKey) =>
    t(`countries.${country.id}.${field}` as Parameters<typeof t>[0])

  const handleSelectCountry = (c: CountryPvDetail) => {
    setSelectedCountryId(c.id)
    setIsSidebarOpen(true)
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-background">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div
          className={`relative flex min-h-0 w-full flex-1 flex-col overflow-hidden transition-[padding] duration-200 ${
            isSidebarOpen ? 'max-lg:pb-[min(48vh,360px)]' : ''
          }`}
        >
          <div className="relative h-full min-h-0 w-full flex-1">
            <WorldPvMap
              onSelectCountry={handleSelectCountry}
              selectedCountryId={selectedCountryId}
            />
          </div>
        </div>

        {isSidebarOpen && (
          <div className="absolute inset-x-0 bottom-0 z-30 flex h-[min(48vh,360px)] w-full flex-col overflow-hidden rounded-t-2xl border-t border-border/40 bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xl backdrop-blur lg:static lg:inset-auto lg:z-auto lg:flex lg:h-full lg:max-h-none lg:w-[380px] lg:flex-none lg:rounded-none lg:border-l lg:border-t-0 lg:p-0 lg:pb-0 lg:shadow-none">
            <div className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/30 lg:hidden" aria-hidden />
            <div className="flex shrink-0 items-center justify-between border-b border-border/30 pb-2 lg:p-3 lg:pb-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-base font-bold text-foreground">{countryText('name')}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  ({country.code})
                </span>
                <Badge className="px-1.5 py-0 font-mono text-[10px]" variant="outline">
                  {countryText('statusLabel')}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t('detail.close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain text-xs lg:p-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">{t('detail.progress')}</span>
                  <span className="text-sm font-bold tracking-wider text-amber-400">
                    {country.rating}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-border/30 bg-muted/40 p-2">
                    <div className="text-[10px] text-muted-foreground">{t('detail.powerLimit')}</div>
                    <div className="text-xs font-semibold leading-snug text-foreground">
                      {countryText('powerLimit')}
                    </div>
                  </div>
                  <div className="rounded border border-border/30 bg-muted/40 p-2">
                    <div className="text-[10px] text-muted-foreground">{t('detail.payback')}</div>
                    <div className="text-xs font-semibold leading-snug text-foreground">
                      {countryText('paybackYears')}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs className="flex w-full flex-col gap-2" defaultValue="reg">
                <TabsList className="grid h-7 w-full shrink-0 grid-cols-3 bg-muted/60 p-0.5">
                  <TabsTrigger className="py-1 text-[11px]" value="reg">
                    {t('detail.tabPolicy')}
                  </TabsTrigger>
                  <TabsTrigger className="py-1 text-[11px]" value="eco">
                    {t('detail.tabLife')}
                  </TabsTrigger>
                  <TabsTrigger className="py-1 text-[11px]" value="safe">
                    {t('detail.tabSafety')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  className="mt-0 flex flex-col gap-2.5 text-[11px] leading-relaxed data-[hidden]:hidden"
                  value="reg"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.connectionMethod')}</span>
                    <span className="font-medium text-foreground">{countryText('connectionMethod')}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.tenantRights')}</span>
                    <span className="font-medium text-foreground">{countryText('tenantRights')}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.regulation')}</span>
                    <span className="font-mono text-[10px] leading-relaxed text-foreground">
                      {country.regulation}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.meterRequirement')}</span>
                    <span className="leading-relaxed text-foreground">{countryText('meterRequirement')}</span>
                  </div>
                </TabsContent>

                <TabsContent
                  className="mt-0 flex flex-col gap-2.5 text-[11px] leading-relaxed data-[hidden]:hidden"
                  value="eco"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.costRange')}</span>
                    <span className="font-medium text-foreground">{countryText('costRange')}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.baseLoadCoverage')}</span>
                    <span className="font-medium text-foreground">{countryText('baseLoadCoverage')}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.incentives')}</span>
                    <span className="leading-relaxed text-foreground">{countryText('incentives')}</span>
                  </div>
                </TabsContent>

                <TabsContent
                  className="mt-0 flex flex-col gap-2.5 text-[11px] leading-relaxed data-[hidden]:hidden"
                  value="safe"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.windSafety')}</span>
                    <span className="font-medium text-foreground">{countryText('windSafety')}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.antiIslanding')}</span>
                    <span className="font-mono text-[10px] leading-relaxed text-foreground">
                      {countryText('antiIslanding')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t('detail.mountingRules')}</span>
                    <span className="leading-relaxed text-foreground">{countryText('mountingRules')}</span>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col gap-1 rounded border border-border/30 bg-muted/30 p-2 text-[11px] text-muted-foreground">
                <p className="leading-relaxed">{countryText('summary')}</p>
                <div className="text-right text-[9px] text-muted-foreground/70">
                  {t('detail.lastUpdated')}: {country.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function EcosystemView() {
  const t = useTranslations('ecosystem')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {t('title')}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{t('lead')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ECOSYSTEM_ORGS.map((org) => (
          <Card key={org.id} className="border-border/60">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap gap-1.5">
                {org.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="border border-border/60 bg-muted/60 text-foreground"
                  >
                    {t(`tags.${tag}`)}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-sm font-semibold leading-snug">
                {t(`orgs.${org.id}.name`)}
              </CardTitle>
              <p className="text-xs font-medium text-muted-foreground">
                {t(`orgs.${org.id}.subtitle`)}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(`orgs.${org.id}.body`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader className="gap-2">
          <CardTitle className="text-sm font-semibold">{t('careers.heading')}</CardTitle>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t('careers.description')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ECOSYSTEM_CAREERS.map((area) => (
              <div
                key={area}
                className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/30 p-4"
              >
                <p className="text-sm font-medium text-foreground">
                  {t(`careers.areas.${area}.title`)}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t(`careers.areas.${area}.description`)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
