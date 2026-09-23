import { Globe2, Landmark, MapPin, Scale } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const REGIONS = [
  {
    id: "de",
    region: "ドイツ・EU",
    badge: "法規制緩和",
    title: "プラグイン太陽光 800W 枠の社会実装",
    body: "独法改正により、ベランダ設置のプラグインPVが届出簡素化・出力上限の明確化とともに普及。工事レスでコンセント接続できるローエンド破壊の先行事例。",
    points: ["出力上限の明確化（〜800W）", "賃貸・集合住宅での導入拡大", "家電価値換算での生活実感訴求"],
  },
  {
    id: "us",
    region: "米国",
    badge: "法制化動向",
    title: "州・自治体レベルでのプラグインPV制度化",
    body: "州ごとの電気規程・ネットメータリングの整理が進み、バルコニー／壁面設置型の小容量再エネが住宅政策と連動して議論されている。",
    points: ["州別の接続ルール整備", "賃貸向けインセンティブの検討", "既存屋根置きモデルとの差別化"],
  },
  {
    id: "africa",
    region: "アフリカ・途上国",
    badge: "オフグリッド",
    title: "オフグリッド／弱電網でのベランダ・壁面ソーラー",
    body: "系統が不安定な地域では、小容量パネル＋蓄電が照明・充電・在宅ワーク電源として社会実装。産業用メガソーラーではなく生活単位の導入が主役。",
    points: ["家電単位の電源確保", "マイクログリッドとの接続", "市民協同・NGO連携"],
  },
] as const

const TIMELINE = [
  { year: "〜2020", label: "屋根置き・FIT中心", detail: "持ち家屋根の産業・家庭用が主流。賃貸・ベランダは空白。" },
  { year: "2021〜", label: "EUプラグインPV拡大", detail: "ドイツ等で簡易接続・出力枠の議論が本格化。" },
  { year: "2023〜", label: "800W社会実装", detail: "独法改正・製品規格が追いつき、量販・EC経由の導入が加速。" },
  { year: "現在", label: "世界実装の分岐", detail: "先進国の規制緩和と途上国オフグリッドが並行して進む。" },
] as const

export function GlobalImplementationView() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Globe2 className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">世界各国におけるベランダソーラーの社会実装</CardTitle>
              <CardDescription className="mt-1 text-pretty">
                独法改正・欧米の法制化、アフリカ等のオフグリッド実装など、プラグインPVが「生活実感」で広がる動向の骨組みビューです（デモ）。
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Scale className="size-4 text-primary" />
          実装タイムライン
        </h2>
        <ol className="relative space-y-0 border-l border-border/60 pl-6">
          {TIMELINE.map((item) => (
            <li key={item.year} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[1.625rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" />
              <p className="font-mono text-xs text-primary">{item.year}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {REGIONS.map((item) => (
          <Card key={item.id} className="border-border/60">
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <MapPin className="size-3" />
                  {item.region}
                </Badge>
                <Badge className="bg-primary/90 text-primary-foreground text-xs">{item.badge}</Badge>
              </div>
              <CardTitle className="text-sm font-semibold leading-snug">{item.title}</CardTitle>
              <CardDescription className="text-pretty text-xs leading-relaxed">{item.body}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {item.points.map((point) => (
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
