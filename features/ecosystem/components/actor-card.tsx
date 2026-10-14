'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ActorCategory, EcosystemActor } from '../data'

const CATEGORY_BADGE_CLASS: Record<ActorCategory, string> = {
  corporate: 'border-sky-500/40 bg-sky-500/15 text-sky-300',
  npo: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  coop: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  ecosystem: 'border-violet-500/40 bg-violet-500/15 text-violet-300',
}

type ActorCardProps = {
  actor: EcosystemActor
}

export function ActorCard({ actor }: ActorCardProps) {
  const t = useTranslations('ecosystem')

  return (
    <Card className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-200 hover:border-slate-700/80 md:p-6">
      <CardHeader className="space-y-4 p-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Badge
            variant="outline"
            className={cn('font-medium', CATEGORY_BADGE_CLASS[actor.category])}
          >
            {t(`categoryLabels.${actor.categoryLabel}` as Parameters<typeof t>[0])}
          </Badge>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="border border-slate-700/60 bg-slate-900/80 text-slate-300">
              {t(`regionBadge.${actor.region}`)}
            </Badge>
            <Badge variant="secondary" className="border border-slate-700/60 bg-slate-900/80 text-slate-300">
              {t(
                `formFactorBadge.${actor.formFactor === 'balcony' ? 'balcony' : 'nonBalcony'}`
              )}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-base font-semibold leading-snug text-slate-100">
          {t(`actors.${actor.id}.name` as Parameters<typeof t>[0])}
        </CardTitle>
        <p className="text-xs font-medium tracking-wide text-slate-400">
          {t(`actors.${actor.id}.subtitle` as Parameters<typeof t>[0])}
        </p>
      </CardHeader>
      <CardContent className="mt-4 flex flex-col space-y-4 p-0">
        <p className="text-sm leading-relaxed text-slate-300">
          {t(`actors.${actor.id}.description` as Parameters<typeof t>[0])}
        </p>

        {actor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {actor.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-slate-700/50 bg-transparent text-xs text-slate-400"
              >
                {t(`tags.${tag}` as Parameters<typeof t>[0])}
              </Badge>
            ))}
          </div>
        )}

        {actor.metrics && actor.metrics.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actor.metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2"
              >
                <p className="text-xs font-medium tracking-wide text-slate-400">
                  {t(
                    `actors.${actor.id}.metrics.${metric.id}.label` as Parameters<typeof t>[0]
                  )}
                </p>
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {t(
                    `actors.${actor.id}.metrics.${metric.id}.value` as Parameters<typeof t>[0]
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
