"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Building2, ExternalLink, Globe2, Landmark, MapPin, Scale, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  AFRICA_LEAPFROG_TIMELINE,
  ASIA_OCEANIA_TRANSITION_TIMELINE,
  GLOBAL_PV_VENDORS,
  MOVEMENT_HISTORY_PHASES,
  VENDOR_CATEGORY_FILTERS,
  VENDOR_REGION_FILTERS,
  filterGlobalPvVendors,
  type GlobalPvVendorCategory,
  type MilestoneKeyActor,
  type MovementHistoryPhaseId,
  type MovementMilestone,
  type RegionCategory,
  type VendorCategoryFilter,
  type VendorRegionFilter,
} from "@/features/balcony-pv/data"

const CATEGORY_MSG_KEY: Record<"all" | GlobalPvVendorCategory, string> = {
  all: "all",
  マイクロインバータ: "microinverter",
  ベランダ蓄電キット: "balconyStorage",
  ポータブル電源: "portablePower",
  家庭用蓄電: "homeStorage",
  オフグリッドSHS: "offgridShs",
  PAYGフィンテック: "paygFintech",
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary/50 bg-primary/20 text-primary"
          : "border-border/50 bg-black/40 text-muted-foreground hover:border-border hover:bg-slate-900 hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}

/** 主要企業・銘柄の比較グリッド（世界実装マップのタブ2）。 */
export function MajorVendorsListView() {
  const t = useTranslations("worldPv.vendors")
  const locale = useLocale()
  const isEn = locale === "en"
  const [regionFilter, setRegionFilter] = useState<VendorRegionFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState<VendorCategoryFilter>("all")

  const vendors = useMemo(
    () => filterGlobalPvVendors(regionFilter, categoryFilter),
    [regionFilter, categoryFilter],
  )

  const regionLabel = (id: VendorRegionFilter | RegionCategory) =>
    t(`regions.${id}` as "regions.all")

  const categoryLabel = (id: VendorCategoryFilter) =>
    t(`categories.${CATEGORY_MSG_KEY[id]}` as "categories.all")

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto bg-slate-950/80 p-3 sm:p-4">
      <div className="shrink-0 space-y-3 rounded-xl border border-border/50 bg-black/60 p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">{t("title")}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("lead", { count: GLOBAL_PV_VENDORS.length })}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("hqFilter")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {VENDOR_REGION_FILTERS.map((id) => (
              <FilterChip
                key={id}
                active={regionFilter === id}
                label={regionLabel(id)}
                onClick={() => setRegionFilter(id)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("categoryFilter")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {VENDOR_CATEGORY_FILTERS.map((id) => (
              <FilterChip
                key={id}
                active={categoryFilter === id}
                label={categoryLabel(id)}
                onClick={() => setCategoryFilter(id)}
              />
            ))}
          </div>
        </div>
      </div>

      {vendors.length === 0 ? (
        <p className="rounded-xl border border-border/40 bg-black/40 px-4 py-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => {
            const displayName = isEn ? vendor.name : vendor.nameJa
            const hq = isEn && vendor.hqCountryEn ? vendor.hqCountryEn : vendor.hqCountry
            const description =
              isEn && vendor.descriptionEn ? vendor.descriptionEn : vendor.description
            return (
              <Card
                key={vendor.id}
                className="flex flex-col border-border/50 bg-slate-900/90 shadow-none"
              >
                <CardHeader className="gap-2 space-y-0 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {displayName}
                      </CardTitle>
                      {!isEn ? (
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {vendor.name}
                        </p>
                      ) : null}
                    </div>
                    <a
                      href={vendor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border/50 bg-black/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      aria-label={`${vendor.name} ${t("officialSite")}`}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="gap-1 border-border/60 text-[10px] font-normal text-slate-300"
                    >
                      <MapPin className="size-3" />
                      {t("hq")}: {hq}
                    </Badge>
                    <Badge className="border-primary/30 bg-primary/15 text-[10px] text-primary">
                      {categoryLabel(vendor.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 pt-0 text-xs">
                  <div>
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                      {t("overview")}
                    </p>
                    <p className="leading-relaxed text-slate-200">{description}</p>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">
                      {t("products")}
                    </p>
                    <ul className="flex flex-col gap-1">
                      {vendor.keyProducts.map((product) => (
                        <li
                          key={product}
                          className="rounded-md bg-black/50 px-2.5 py-1.5 text-slate-200"
                        >
                          {product}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">
                      {t("markets")}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.targetRegions.map((region) => (
                        <Badge
                          key={region}
                          variant="outline"
                          className="border-sky-500/30 bg-sky-500/10 text-[10px] font-normal text-sky-300"
                        >
                          {regionLabel(region)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function KeyActorCard({ actor }: { actor: MilestoneKeyActor }) {
  const t = useTranslations("worldPv.analysis")
  const locale = useLocale()
  const isEn = locale === "en"
  const isCompany = actor.kind === "company"
  const name = isEn && actor.nameEn ? actor.nameEn : actor.name
  const roleBadge = isEn && actor.roleBadgeEn ? actor.roleBadgeEn : actor.roleBadge
  const barrier = isEn && actor.barrierEn ? actor.barrierEn : actor.barrier
  const achievement = isEn && actor.achievementEn ? actor.achievementEn : actor.achievement
  return (
    <div
      className={
        isCompany
          ? "mt-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5"
          : "mt-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        {isCompany ? (
          <Building2 className="size-3.5 shrink-0 text-amber-400" />
        ) : (
          <Shield className="size-3.5 shrink-0 text-primary" />
        )}
        <p className="text-xs font-semibold text-foreground">{name}</p>
        <Badge
          variant="outline"
          className={
            isCompany
              ? "border-amber-500/40 text-[10px] text-amber-300"
              : "border-primary/40 text-[10px] text-primary"
          }
        >
          {isCompany ? t("company") : t("organization")} · {roleBadge}
        </Badge>
      </div>
      <dl className="mt-2 space-y-1.5 text-[11px] leading-relaxed">
        <div>
          <dt className="text-muted-foreground">{t("barrierOvercome")}</dt>
          <dd className="text-foreground/90">{barrier}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("keyMilestone")}</dt>
          <dd className="text-foreground/90">{achievement}</dd>
        </div>
      </dl>
      {actor.url ? (
        <a
          href={actor.url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isCompany
              ? "mt-2 inline-flex items-center gap-1 text-[11px] text-amber-300/90 underline-offset-2 hover:underline"
              : "mt-2 inline-flex items-center gap-1 text-[11px] text-primary underline-offset-2 hover:underline"
          }
        >
          {t("externalLink")}
          <ExternalLink className="size-3" />
        </a>
      ) : null}
    </div>
  )
}

function MilestoneItem({ milestone }: { milestone: MovementMilestone }) {
  const locale = useLocale()
  const isEn = locale === "en"
  const regionName = isEn && milestone.regionNameEn ? milestone.regionNameEn : milestone.regionName
  const summary = isEn && milestone.summaryEn ? milestone.summaryEn : milestone.summary
  return (
    <li className="relative pb-5 last:pb-0">
      <span className="absolute -left-[1.625rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" />
      <p className="font-mono text-xs text-primary">{milestone.date}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">
        {regionName}
        <span className="ml-2 text-xs font-normal text-muted-foreground">{summary}</span>
      </p>
      {milestone.keyActor ? <KeyActorCard actor={milestone.keyActor} /> : null}
    </li>
  )
}

const MOVEMENT_PHASE_LABELS: Record<MovementHistoryPhaseId, string> = {
  guerrilla: "ゲリラ〜市民DIY",
  energyCrisis: "エネルギー危機と量販拡大",
  euDomino: "EUドミノ法制化",
  usSpread: "米州への伝播",
}

const MOVEMENT_PHASE_LABELS_EN: Record<MovementHistoryPhaseId, string> = {
  guerrilla: "Guerrilla → citizen DIY",
  energyCrisis: "Energy crisis & retail scale-up",
  euDomino: "EU legalization domino",
  usSpread: "Spread to the Americas",
}

const REGIONS = [
  {
    id: "europe",
    region: "欧州",
    regionEn: "Europe",
    badge: "法規制緩和",
    badgeEn: "Regulatory relief",
    title: "プラグイン太陽光 800W 枠の社会実装",
    titleEn: "Social rollout of the 800W plug-in solar framework",
    body: "独法改正により、ベランダ設置のプラグインPVが届出簡素化・出力上限の明確化とともに普及。工事レスでコンセント接続できるローエンド破壊の先行事例。",
    bodyEn:
      "German legal reforms simplified balcony plug-in PV filings and clarified output caps—a pioneering no-construction, outlet-connected low-end disruption.",
    points: ["出力上限の明確化（〜800W）", "賃貸・集合住宅での導入拡大", "家電価値換算での生活実感訴求"],
    pointsEn: [
      "Clearer output caps (~800W)",
      "Expansion in rental and multifamily housing",
      "Appliance-value framing for lived experience",
    ],
  },
  {
    id: "africa",
    region: "アフリカ",
    regionEn: "Africa",
    badge: "跳躍（Leapfrog）",
    badgeEn: "Leapfrog",
    title: "オフグリッド／弱電網でのベランダ・壁面ソーラー",
    titleEn: "Balcony and facade solar on off-grid / weak grids",
    body: "系統が不安定な地域では、小容量パネル＋蓄電が照明・充電・在宅ワーク電源として社会実装。産業用メガソーラーではなく生活単位の導入が主役。",
    bodyEn:
      "Where grids are unstable, small panels plus storage power lighting, charging, and WFH—lived-unit installs lead, not utility mega-solar.",
    points: ["家電単位の電源確保", "PAYG・SHSによる電化", "生産電化（灌漑・保冷）"],
    pointsEn: ["Appliance-scale power access", "PAYG / SHS electrification", "Productive use (irrigation & cold chain)"],
  },
  {
    id: "asia-oceania",
    region: "アジア・オセアニア",
    regionEn: "Asia & Oceania",
    badge: "転換史",
    badgeEn: "Transition",
    title: "蓄電自給・国策キット・都市BIPVへの転換",
    titleEn: "Shift to storage self-supply, national kits, and urban BIPV",
    body: "日本・台湾のオフグリッド蓄電、豪・NZのテナント自給権、インド国策キット、シンガポール高層BIPVなど、地域ごとに制度収束の形が異なる。",
    bodyEn:
      "Japan/Taiwan off-grid storage, AU/NZ tenant self-supply rights, India’s national kits, Singapore high-rise BIPV—institutional paths diverge by region.",
    points: ["逆潮流禁止下の蓄電自給", "賃貸テナントの電力自給権", "国策助成と都市BIPV実証"],
    pointsEn: [
      "Storage self-supply under export bans",
      "Renter electricity self-supply rights",
      "National subsidies and urban BIPV pilots",
    ],
  },
  {
    id: "americas",
    region: "北米・米州",
    regionEn: "Americas",
    badge: "法制化動向",
    badgeEn: "Legislation trends",
    title: "州・連邦レベルでのプラグインPV制度化",
    titleEn: "State and federal institutionalization of plug-in PV",
    body: "米各州のプラグイン免除とブラジルのネット相殺など、州・連邦の電気規程整理が進み、バルコニー／壁面の小容量再エネが住宅政策と連動する。",
    bodyEn:
      "U.S. state plug-in waivers and Brazil’s net billing show electrical codes aligning balcony/facade small renewables with housing policy.",
    points: ["州別1,200W免除の拡大", "NEC厳格州の蓄電自衛", "ブラジルのネットメータリング"],
    pointsEn: [
      "Expanding state 1,200W waivers",
      "Storage self-supply in NEC-strict states",
      "Brazilian net metering",
    ],
  },
] as const

export function GlobalImplementationView() {
  const t = useTranslations("worldPv")
  const locale = useLocale()
  const isEn = locale === "en"

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Globe2 className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{t("title")}</CardTitle>
              <CardDescription className="mt-1 text-pretty">{t("lead")}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="size-4 text-primary" />
          📖 {t("map.timelineWestern")}
        </h2>
        <div className="flex flex-col gap-5">
          {MOVEMENT_HISTORY_PHASES.map((phase) => (
            <div key={phase.id}>
              <p className="mb-2 text-xs font-medium text-foreground">
                {isEn ? MOVEMENT_PHASE_LABELS_EN[phase.id] : MOVEMENT_PHASE_LABELS[phase.id]}
              </p>
              <ol className="relative space-y-0 border-l border-border/60 pl-6">
                {phase.milestones.map((m) => (
                  <MilestoneItem key={m.id} milestone={m} />
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="size-4 text-primary" />
          🌍 {t("map.timelineAfrica")}
        </h2>
        <div className="flex flex-col gap-5">
          {AFRICA_LEAPFROG_TIMELINE.map((phase) => (
            <div key={phase.id}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                <span className="font-mono text-primary">
                  {isEn && phase.periodEn ? phase.periodEn : phase.period}
                </span>
                <span className="ml-2 text-foreground">
                  {isEn && phase.titleEn ? phase.titleEn : phase.title}
                </span>
              </p>
              <ol className="relative space-y-0 border-l border-border/60 pl-6">
                {phase.milestones.map((m) => (
                  <MilestoneItem key={m.id} milestone={m} />
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="size-4 text-primary" />
          🌏 {t("map.timelineAsiaOceania")}
        </h2>
        <div className="flex flex-col gap-5">
          {ASIA_OCEANIA_TRANSITION_TIMELINE.map((phase) => (
            <div key={phase.id}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                <span className="font-mono text-primary">
                  {isEn && phase.periodEn ? phase.periodEn : phase.period}
                </span>
                <span className="ml-2 text-foreground">
                  {isEn && phase.titleEn ? phase.titleEn : phase.title}
                </span>
              </p>
              <ol className="relative space-y-0 border-l border-border/60 pl-6">
                {phase.milestones.map((m) => (
                  <MilestoneItem key={m.id} milestone={m} />
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {REGIONS.map((item) => (
          <Card key={item.id} className="border-border/60">
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <MapPin className="size-3" />
                  {isEn ? item.regionEn : item.region}
                </Badge>
                <Badge className="bg-primary/90 text-primary-foreground text-xs">
                  {isEn ? item.badgeEn : item.badge}
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold leading-snug">
                {isEn ? item.titleEn : item.title}
              </CardTitle>
              <CardDescription className="text-pretty text-xs leading-relaxed">
                {isEn ? item.bodyEn : item.body}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {(isEn ? item.pointsEn : item.points).map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-foreground"
                  >
                    <Landmark className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span>{point}</span>
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
