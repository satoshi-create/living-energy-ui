import { Building2, Briefcase, Handshake, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ORGS = [
  {
    id: "anker",
    category: "企業",
    name: "Anker Solix",
    role: "プラグイン蓄電・ベランダキット",
    summary: "工事レスの小容量蓄電・パネルキットで、賃貸・集合住宅向けの生活実感型導入を後押しするプレイヤー。",
    tags: ["蓄電", "キット", "EC"],
  },
  {
    id: "enphase",
    category: "企業",
    name: "Enphase",
    role: "マイクロインバータ・住宅再エネ",
    summary: "住宅向けモジュール単位の発電・監視技術。ベランダ／壁面規模への拡張と地域分散との接続が論点。",
    tags: ["インバータ", "住宅", "分散"],
  },
  {
    id: "coop",
    category: "非営利・協同",
    name: "市民協同体・エネルギー協同組合",
    role: "地域での共同購入・設置支援",
    summary: "住民が共同でパネルや蓄電を調達し、知識・手続きのハードルを下げる。賃貸向けの合意形成にも寄与。",
    tags: ["協同組合", "共同購入", "地域"],
  },
  {
    id: "ngo",
    category: "非営利",
    name: "再エネ・気候系NPO / NGO",
    role: "政策提言・啓発・途上国実装",
    summary: "規制緩和の政策対話、途上国オフグリッド支援、生活実感コミュニケーションの設計を担う層。",
    tags: ["政策", "啓発", "実装支援"],
  },
] as const

const JOB_FRAMES = [
  {
    title: "プロダクト / ハード",
    detail: "ベランダキット設計、安全規格、蓄電・インバータのローエンド製品開発。",
  },
  {
    title: "コミュニティ / 政策",
    detail: "自治体連携、協同組合運営、独法改正型の規制対話・普及活動。",
  },
  {
    title: "UX / 生活実感データ",
    detail: "発電量を家電価値へ翻訳するUI、地域ネットワークの可視化、採用・組織エコシステム連携。",
  },
] as const

export function EcosystemOrgsView() {
  return (
    <div className="flex flex-col space-y-8">
      <Card className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6">
        <CardHeader className="p-0">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-100">ベランダソーラーに関する企業・非営利団体</CardTitle>
              <CardDescription className="mt-1 text-pretty text-sm leading-relaxed text-slate-300">
                Anker、Enphase、市民協同体など、製品・組織・求人をつなぐエコシステムの骨組み一覧です（デモ）。
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ORGS.map((org) => (
          <Card
            key={org.id}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-200 hover:border-slate-700/80 md:p-6"
          >
            <CardHeader className="space-y-4 p-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {org.category}
                </Badge>
                {org.tags.map((tag) => (
                  <Badge key={tag} className="bg-muted text-muted-foreground text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-100">
                <Users className="size-4 text-primary" />
                {org.name}
              </CardTitle>
              <p className="text-xs font-medium tracking-wide text-slate-400">{org.role}</p>
            </CardHeader>
            <CardContent className="mt-4 space-y-4 p-0">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-slate-400">概要/役割</p>
                <p className="text-sm leading-relaxed text-slate-300">{org.summary}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6">
        <CardHeader className="space-y-4 p-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-100">
            <Briefcase className="size-4 text-primary" />
            求人・組織エコシステム連携（枠組み）
          </CardTitle>
          <CardDescription className="text-pretty text-sm leading-relaxed text-slate-300">
            企業採用情報と市民協同・実装現場をつなぐ枠組みのプレースホルダ。今後、外部求人・団体ディレクトリと接続予定。
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 grid grid-cols-1 gap-6 p-0 sm:grid-cols-3">
          {JOB_FRAMES.map((frame) => (
            <div
              key={frame.title}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-200 hover:border-slate-700/80 md:p-6"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                <Handshake className="size-3.5 text-primary" />
                {frame.title}
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{frame.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
