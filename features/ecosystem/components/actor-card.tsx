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
    <Card className="border-border/60">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Badge
            variant="outline"
            className={cn('font-medium', CATEGORY_BADGE_CLASS[actor.category])}
          >
            {t(`categoryLabels.${actor.categoryLabel}` as Parameters<typeof t>[0])}
          </Badge>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="border border-border/60 bg-muted/60 text-foreground">
              {t(`regionBadge.${actor.region}`)}
            </Badge>
            <Badge variant="secondary" className="border border-border/60 bg-muted/60 text-foreground">
              {t(
                `formFactorBadge.${actor.formFactor === 'balcony' ? 'balcony' : 'nonBalcony'}`
              )}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-sm font-semibold leading-snug">
          {t(`actors.${actor.id}.name` as Parameters<typeof t>[0])}
        </CardTitle>
        <p className="text-xs font-medium text-muted-foreground">
          {t(`actors.${actor.id}.subtitle` as Parameters<typeof t>[0])}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t(`actors.${actor.id}.description` as Parameters<typeof t>[0])}
        </p>

        {actor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {actor.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-border/50 bg-transparent text-[10px] text-muted-foreground"
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
                className="rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5"
              >
                <p className="text-[10px] text-muted-foreground">
                  {t(
                    `actors.${actor.id}.metrics.${metric.id}.label` as Parameters<typeof t>[0]
                  )}
                </p>
                <p className="font-mono text-xs font-semibold text-foreground">
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
