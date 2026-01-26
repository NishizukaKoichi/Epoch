"use client"

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Sparkles, ChevronLeft, ArrowRight, BookOpen } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

// Mock chapter content - IDs match dashboard
const chapterContent: Record<string, Record<string, { title: string; scope: string; content: string[] }>> = {
  "eng-team": {
    "prerequisites": {
      title: "術式の前提条件",
      scope: "Engineering Team 全員",
      content: [
        "本術式は、ソフトウェア開発における判断と成果物の品質基準を定義する。",
        "すべての判断は、この術式に記載された基準に基づいて行われる。",
        "術式に記載のない判断が必要な場合は、最も近い基準を適用するか、術式の改訂を提案する。",
        "「なんとなく」「経験的に」「普通は」といった曖昧な判断根拠は認められない。",
      ],
    },
    "activation": {
      title: "発動条件",
      scope: "開発業務開始時",
      content: [
        "本術式は、以下の条件で発動する：",
        "・開発タスクの着手時",
        "・コードレビューの実施時",
        "・リリース判断の実施時",
        "・技術選定の議論時",
        "・障害対応の開始時",
        "発動後は、術式の効力が完全に適用される。部分的な適用は認められない。",
      ],
    },
    "daily-decisions": {
      title: "日常的に発生する判断",
      scope: "日常業務",
      content: [
        "以下の判断は、本術式に基づいて行う：",
        "【コードレビュー】承認基準を満たしているか否かの二値判定。「まあいいか」は存在しない。",
        "【リリース判断】Doneの定義を満たしているか否かの二値判定。部分リリースは別タスクとして扱う。",
        "【技術選定】選定基準に基づく論理的根拠の明示が必須。好みや慣れは根拠とならない。",
        "【障害対応】優先度マトリクスに基づく機械的判定。感情的な緊急度判断は排除する。",
      ],
    },
    "done": {
      title: "完了条件（Done定義）",
      scope: "すべての成果物",
      content: [
        "成果物は以下の条件をすべて満たした場合のみ「Done」となる：",
        "1. コードレビューで承認済み（修正要求がすべて解決済み）",
        "2. 自動テストがすべてパス（カバレッジ基準を満たす）",
        "3. ドキュメントが更新済み（該当する場合）",
        "4. ステージング環境で動作確認済み",
        "5. レビュアーがDoneを宣言",
        "上記のいずれかが欠けている状態は「Done」ではない。「ほぼDone」は存在しない。",
      ],
    },
    "boundaries": {
      title: "権限と責任の境界",
      scope: "組織構造",
      content: [
        "【開発者】自身の成果物の品質に責任を持つ。レビュー指摘への対応義務あり。",
        "【レビュアー】レビュー基準に基づく判断に責任を持つ。感情的配慮は範囲外。",
        "【テックリード】技術選定の最終判断権を持つ。判断根拠の文書化義務あり。",
        "【プロダクトマネージャー】リリース判断の最終権限を持つ。Doneの定義変更権限はない。",
        "権限の範囲外の判断を行った場合、その判断は無効となる。",
      ],
    },
    "exceptions": {
      title: "例外・逸脱時の扱い",
      scope: "緊急時のみ",
      content: [
        "本術式からの逸脱は、以下の条件をすべて満たす場合のみ許容される：",
        "1. 緊急の本番障害対応である",
        "2. 逸脱の内容と理由が事前に文書化される",
        "3. テックリードまたはそれ以上の承認がある",
        "4. 事後に術式の改訂要否が検討される",
        "上記を満たさない逸脱は、術式違反として扱う。",
        "「忙しかった」「時間がなかった」は逸脱の理由として認められない。",
      ],
    },
  },
  "design-team": {
    "prerequisites": {
      title: "デザイン原則", 
      scope: "Design Team 全員",
      content: [
        "本術式は、デザインにおける判断基準を定義する。",
        "ユーザー体験を最優先とし、すべてのデザイン判断はこの原則に基づく。",
        "「見た目が良い」だけでは承認理由にならない。ユーザー価値を明示すること。",
      ],
    },
    "activation": {
      title: "レビュープロセス",
      scope: "デザインレビュー時",
      content: [
        "デザインレビューの開始時点で本術式が発動する。",
        "レビュアーはデザイン原則に照らして判断する。",
      ],
    },
    "daily-decisions": {
      title: "フィードバックの扱い",
      scope: "日常業務",
      content: [
        "フィードバックは「原則に基づく指摘」と「好みの表明」を区別して扱う。",
        "好みの表明は参考情報として扱い、判断の根拠としない。",
      ],
    },
    "done": {
      title: "完了条件",
      scope: "すべての成果物",
      content: [
        "デザインレビューで承認され、実装可能な状態になった時点でDoneとなる。",
      ],
    },
    "exceptions": {
      title: "例外対応",
      scope: "緊急時のみ",
      content: [
        "リードデザイナー承認のもとでのみ逸脱を許容する。",
      ],
    },
  },
  "sales-team": {
    "prerequisites": {
      title: "営業プロセス", 
      scope: "Sales Team 全員",
      content: [
        "本術式は、営業活動における判断基準を定義する。",
        "顧客との信頼関係構築を最優先とする。",
      ],
    },
    "activation": {
      title: "価格ポリシー",
      scope: "価格交渉時",
      content: [
        "価格交渉の開始時点で本術式が発動する。",
        "定価からの割引は承認フローに従う。",
      ],
    },
    "daily-decisions": {
      title: "契約条件",
      scope: "契約締結時",
      content: [
        "標準契約書からの逸脱は法務確認必須。",
      ],
    },
    "exceptions": {
      title: "例外処理",
      scope: "緊急時のみ",
      content: [
        "営業部長承認のもとでのみ逸脱を許容する。",
      ],
    },
  },
}

// Mock space names
const spaceNames: Record<string, string> = {
  "eng-team": "Engineering Team",
  "design-team": "Design Team",
  "sales-team": "Sales Team",
}

export default function SigilChapterPage() {
  const params = useParams()
  const spaceId = params.spaceId as string
  const chapterId = params.chapterId as string
  const { t } = useI18n()
  const router = useRouter()
  
  const spaceName = spaceNames[spaceId] || "Unknown Space"
  const spaceChapters = chapterContent[spaceId]
  const chapter = spaceChapters?.[chapterId]
  
  // Get chapter order from the space's chapters
  const chapterIds = spaceChapters ? Object.keys(spaceChapters) : []
  const currentIndex = chapterIds.indexOf(chapterId)
  const nextChapterId = currentIndex < chapterIds.length - 1 ? chapterIds[currentIndex + 1] : null

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Chapter not found</p>
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
          <span className="font-semibold text-foreground">{spaceName}</span>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Chapter indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <BookOpen className="h-4 w-4" />
          <span>Chapter {String(currentIndex + 1).padStart(2, "0")}</span>
          <span>·</span>
          <span>{t("sigil.chapter.scope")}: {chapter.scope}</span>
        </div>

        {/* Chapter title */}
        <h1 className="text-2xl font-semibold text-foreground mb-8">
          {chapter.title}
        </h1>

        {/* Chapter content - plain text, no decoration */}
        <div className="space-y-4 text-foreground leading-relaxed">
          {chapter.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link href={`/sigil/space/${spaceId}/toc`}>
            <Button variant="outline" className="bg-transparent">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("sigil.chapter.back_to_toc")}
            </Button>
          </Link>
          
          {nextChapterId ? (
            <Link href={`/sigil/space/${spaceId}/chapter/${nextChapterId}`}>
              <Button className="bg-amber-500 hover:bg-amber-600 text-background">
                {t("sigil.chapter.next")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/sigil/space/${spaceId}/toc`}>
              <Button className="bg-amber-500 hover:bg-amber-600 text-background">
                {t("sigil.chapter.back_to_toc")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
