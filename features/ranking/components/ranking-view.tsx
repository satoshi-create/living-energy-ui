"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WORLD_REGIONS, WORLD_TIMELINE } from "../data"

export function RankingView() {
  const t = useTranslations("worldPv")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {t("title")}
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("timeline.heading")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative flex flex-col gap-6 border-l border-border/60 pl-6">
            {WORLD_TIMELINE.map((id) => (
              <li key={id} className="relative">
                <span
                  className="absolute -left-[1.625rem] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background"
                  aria-hidden="true"
                />
                <p className="font-mono text-xs tabular-nums text-primary">
                  {t(`timeline.${id}.period`)}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {t(`timeline.${id}.title`)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t(`timeline.${id}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {WORLD_REGIONS.map((region) => (
          <Card key={region.id} className="border-border/60">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap gap-1.5">
                {region.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="border border-border/60 bg-muted/60 text-foreground"
                  >
                    {t(`tags.${tag}`)}
                  </Badge>
                ))}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {t(`regions.${region.id}.name`)}
              </p>
              <CardTitle className="text-sm font-semibold leading-snug">
                {t(`regions.${region.id}.headline`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(`regions.${region.id}.body`)}
              </p>
              <ul className="flex flex-col gap-2">
                {region.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-2 text-xs leading-relaxed text-foreground"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span>{t(`regions.${region.id}.bullets.${bullet}`)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
