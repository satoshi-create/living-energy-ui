'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { EcosystemActor } from '../data'

type EcosystemTableProps = {
  actors: EcosystemActor[]
}

const CATEGORY_BADGE: Record<
  EcosystemActor['category'],
  string
> = {
  corporate:
    'rounded-md border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  coop: 'rounded-md border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  npo: 'rounded-md border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  ecosystem:
    'rounded-md border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
}

const FIT_BADGE: Record<
  NonNullable<EcosystemActor['fundamental']>['decentralizedFit'],
  string
> = {
  High: 'rounded-md border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  Mid: 'rounded-md border-slate-700/60 bg-slate-900/80 text-slate-300',
  Low: 'rounded-md border-slate-700/60 bg-slate-900/80 text-slate-400',
}

export function EcosystemTable({ actors }: EcosystemTableProps) {
  const t = useTranslations('ecosystem')

  if (actors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t('filters.empty')}</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-xs text-slate-400">
            <th className="px-3 py-2.5 font-medium">{t('table.columns.org')}</th>
            <th className="px-3 py-2.5 font-medium">
              {t('table.columns.approach')}
            </th>
            <th className="px-3 py-2.5 font-medium">
              {t('table.columns.powerSource')}
            </th>
            <th className="px-3 py-2.5 font-medium">
              {t('table.columns.decentralizedFit')}
            </th>
            <th className="px-3 py-2.5 font-medium">
              {t('table.columns.bosRatio')}
            </th>
            <th className="px-3 py-2.5 font-medium">
              {t('table.columns.financialHealth')}
            </th>
            <th className="px-3 py-2.5 font-medium">
              {t('table.columns.regionForm')}
            </th>
          </tr>
        </thead>
        <tbody>
          {actors.map((actor) => {
            const f = actor.fundamental
            return (
              <tr
                key={actor.id}
                className="border-b border-slate-800/80 last:border-0 hover:bg-slate-800/30"
              >
                <td className="px-3 py-3 align-top">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="font-medium text-slate-100">
                        {t(`actors.${actor.id}.name`)}
                      </span>
                      {f?.ticker && (
                        <span className="font-mono text-xs text-slate-400">
                          {f.ticker}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'w-fit border px-2 py-0.5 text-xs font-medium',
                        CATEGORY_BADGE[actor.category]
                      )}
                    >
                      {t(`categories.${actor.category}`)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 align-top">
                  {f && (
                    <span
                      className={cn(
                        'inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                        f.innovationType === 'disruptive'
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-700/60 bg-slate-900/80 text-slate-300'
                      )}
                    >
                      {f.innovationType === 'disruptive'
                        ? t('table.innovation.disruptive')
                        : t('table.innovation.sustaining')}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 align-top text-slate-300">
                  {f?.powerSource ?? '—'}
                </td>
                <td className="px-3 py-3 align-top">
                  {f && (
                    <span
                      className={cn(
                        'inline-flex border px-2 py-0.5 text-xs font-medium',
                        FIT_BADGE[f.decentralizedFit]
                      )}
                    >
                      {f.decentralizedFit}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 align-top text-slate-300">
                  {f?.bosRatio ?? '—'}
                </td>
                <td className="px-3 py-3 align-top text-slate-300">
                  {f?.financialHealth ?? '—'}
                </td>
                <td className="px-3 py-3 align-top">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-slate-700/60 bg-slate-900/80 px-2 py-0.5 text-xs text-slate-300">
                      {t(`filters.region.${actor.region}`)}
                    </span>
                    <span className="rounded-md border border-slate-700/60 bg-slate-900/80 px-2 py-0.5 text-xs text-slate-300">
                      {t(
                        `filters.formFactor.${
                          actor.formFactor === 'non-balcony'
                            ? 'nonBalcony'
                            : actor.formFactor
                        }`
                      )}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
