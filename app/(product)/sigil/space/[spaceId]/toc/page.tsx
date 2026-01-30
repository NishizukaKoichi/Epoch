"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Sparkles, ChevronLeft, ChevronRight, Circle, CheckCircle2 } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

// Mock space data with chapters - matches dashboard
const mockSpaceData: Record<string, { name: string; chapters: { id: string; title: string }[] }> = {
  "eng-team": {
    name: "Engineering Team",
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
    chapters: [
      { id: "prerequisites", title: "営業プロセス" },
      { id: "activation", title: "価格ポリシー" },
      { id: "daily-decisions", title: "契約条件" },
      { id: "exceptions", title: "例外処理" },
    ],
  },
}

export default function SigilTocPage() {
  const params = useParams()
  const spaceId = params.spaceId as string
  const { t } = useI18n()
  const router = useRouter()
  
  const space = mockSpaceData[spaceId]
  const spaceName = space?.name || "Unknown Space"
  const chapters = space?.chapters || []
  
  // Track read status (in real app, this would be persisted)
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set())

  const markAsRead = (chapterId: string) => {
    setReadChapters(prev => new Set([...prev, chapterId]))
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
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {t("sigil.toc.title")}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {chapters.length}章 · {readChapters.size}章 {t("sigil.toc.read")}
        </p>

        {/* Chapter List */}
        <div className="space-y-2">
          {chapters.map((chapter, index) => {
            const isRead = readChapters.has(chapter.id)
            return (
              <Link
                key={chapter.id}
                href={`/sigil/space/${spaceId}/chapter/${chapter.id}`}
                onClick={() => markAsRead(chapter.id)}
                className={cn(
                  "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                  isRead 
                    ? "border-border bg-secondary/30" 
                    : "border-border hover:border-amber-500/50 hover:bg-secondary/50"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  {isRead ? (
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(
                      "font-medium",
                      isRead ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {chapter.title}
                    </span>
                  </div>
                </div>
                <ChevronRight className={cn(
                  "h-5 w-5",
                  isRead ? "text-muted-foreground/50" : "text-muted-foreground"
                )} />
              </Link>
            )
          })}
        </div>

        {/* Read status indicator */}
        <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            <span>{t("sigil.toc.unread")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
            <span>{t("sigil.toc.read")}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
