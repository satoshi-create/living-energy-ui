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
  corporate: 'border-slate-600 bg-slate-800/80 text-slate-200',
  coop: 'border-emerald-700/60 bg-emerald-950/50 text-emerald-300',
  npo: 'border-cyan-700/60 bg-cyan-950/50 text-cyan-300',
  ecosystem: 'border-violet-700/60 bg-violet-950/50 text-violet-300',
}

const FIT_BADGE: Record<
  NonNullable<EcosystemActor['fundamental']>['decentralizedFit'],
  string
> = {
  High: 'border-emerald-600/50 bg-emerald-950/60 text-emerald-300',
  Mid: 'border-amber-600/50 bg-amber-950/50 text-amber-300',
  Low: 'border-slate-600 bg-slate-800/70 text-slate-400',
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
                        <span className="font-mono text-[10px] text-slate-500">
                          {f.ticker}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'w-fit rounded border px-1.5 py-0.5 text-[10px] font-medium',
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
                        'inline-flex w-fit items-center rounded border px-1.5 py-0.5 text-[11px] font-medium',
                        f.innovationType === 'disruptive'
                          ? 'border-cyan-600/50 bg-emerald-950/50 text-cyan-300'
                          : 'border-slate-600 bg-slate-800/80 text-slate-400'
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
                        'inline-flex rounded border px-1.5 py-0.5 text-[11px] font-medium',
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
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {t(`filters.region.${actor.region}`)}
                    </span>
                    <span className="rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-300">
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
