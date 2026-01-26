"use client"

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Sparkles, Target, Scale, CheckCircle, Shield, ArrowRight, ChevronLeft, BookOpen } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

// Mock space data - IDs match dashboard and spaces list
const mockSpaceData = {
  "eng-team": {
    name: "Engineering Team",
    purpose: "プロダクト開発を通じて価値を届ける",
    decisions: "コードレビュー承認、リリース判断、技術選定、障害対応優先度",
    doneStrictness: "厳格（曖昧さを許容しない）",
    responsibility: "開発チーム全員に適用。外部委託者も同様の術式下で活動する。",
    chapters: [
      { id: "prerequisites", title: "術式の前提条件" },
      { id: "activation", title: "発動条件" },
      { id: "daily-decisions", title: "日常的に発生する判断" },
      { id: "done", title: "完了条件（Done定義）" },
      { id: "boundaries", title: "権限と責任の境界" },
      { id: "exceptions", title: "例外・逸脱時の扱い" },
    ],
  },
  "design-team": {
    name: "Design Team",
    purpose: "ユーザー体験を設計する",
    decisions: "デザインシステムの更新、UIパターンの選定、ユーザビリティの判断",
    doneStrictness: "標準（一定の裁量を許容）",
    responsibility: "デザインチーム全員に適用。",
    chapters: [
      { id: "prerequisites", title: "デザイン原則" },
      { id: "activation", title: "レビュープロセス" },
      { id: "daily-decisions", title: "フィードバックの扱い" },
      { id: "done", title: "完了条件" },
      { id: "exceptions", title: "例外対応" },
    ],
  },
  "sales-team": {
    name: "Sales Team",
    purpose: "顧客との信頼関係を構築する",
    decisions: "商談の進め方、価格交渉の範囲、契約条件の調整",
    doneStrictness: "厳格（契約条件は明確に）",
    responsibility: "営業チーム全員に適用。",
    chapters: [
      { id: "prerequisites", title: "営業プロセス" },
      { id: "activation", title: "価格ポリシー" },
      { id: "daily-decisions", title: "契約条件" },
      { id: "exceptions", title: "例外処理" },
    ],
  },
}

const entryItems = [
  { icon: Target, labelKey: "sigil.space.purpose", dataKey: "purpose" },
  { icon: Scale, labelKey: "sigil.space.decisions", dataKey: "decisions" },
  { icon: CheckCircle, labelKey: "sigil.space.done_strictness", dataKey: "doneStrictness" },
  { icon: Shield, labelKey: "sigil.space.responsibility", dataKey: "responsibility" },
]

export default function SigilSpacePage() {
  const params = useParams()
  const spaceId = params.spaceId as string
  const { t } = useI18n()
  const router = useRouter()
  const space = mockSpaceData[spaceId as keyof typeof mockSpaceData]

  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Space not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-4xl items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-foreground">{space.name}</span>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {entryItems.map((item, index) => {
            const Icon = item.icon
            const value = space[item.dataKey as keyof typeof space]
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                      <Icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {t(item.labelKey as Parameters<typeof t>[0])}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Chapters */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              目次
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {space.chapters.map((chapter, index) => (
                <Link 
                  key={chapter.id}
                  href={`/sigil/space/${spaceId}/chapter/${chapter.id}`}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:border-amber-500/50 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-6">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium group-hover:text-amber-500 transition-colors">
                      {chapter.title}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
