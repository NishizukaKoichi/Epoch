"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { 
  ChevronLeft, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock,
  Target,
  ChevronRight
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"

// Mock data
const mockSpace = {
  id: "eng-team",
  name: "Engineering Team",
  purpose: "プロダクト開発を通じて価値を届ける",
  totalChapters: 6,
  estimatedTime: "約15分",
}

const mockChapters = [
  { id: "prerequisites", title: "術式の前提条件", read: true, readAt: "2026-01-20" },
  { id: "activation", title: "発動条件", read: true, readAt: "2026-01-20" },
  { id: "daily-decisions", title: "日常的に発生する判断", read: true, readAt: "2026-01-21" },
  { id: "done", title: "完了条件（Done定義）", read: false, readAt: null },
  { id: "boundaries", title: "権限と責任の境界", read: false, readAt: null },
  { id: "exceptions", title: "例外・逸脱時の扱い", read: false, readAt: null },
]

export default function ReaderProgressPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useI18n()
  const spaceId = params.spaceId as string

  const readCount = mockChapters.filter(c => c.read).length
  const progress = Math.round((readCount / mockChapters.length) * 100)
  const nextChapter = mockChapters.find(c => !c.read)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {mockSpace.name}
          </h1>
          <p className="text-sm text-muted-foreground">{mockSpace.purpose}</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-muted"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={`${progress}, 100`}
                  className="text-amber-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{progress}%</span>
                <span className="text-xs text-muted-foreground">読了</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{readCount} / {mockChapters.length} 章完了</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>推定残り時間: {mockSpace.estimatedTime}</span>
              </div>
              {progress === 100 ? (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  術式を読了しました
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Target className="h-3 w-3 mr-1" />
                  読了まであと {mockChapters.length - readCount} 章
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Reading */}
      {nextChapter && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-500 font-medium mb-1">続きを読む</p>
                <p className="font-medium text-foreground">{nextChapter.title}</p>
              </div>
              <Link href={`/sigil/space/${spaceId}/chapter/${nextChapter.id}`}>
                <Button className="gap-2">
                  読む
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapter List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">章一覧</CardTitle>
          <CardDescription>読了状況を確認</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {mockChapters.map((chapter, index) => (
              <Link
                key={chapter.id}
                href={`/sigil/space/${spaceId}/chapter/${chapter.id}`}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group"
              >
                {chapter.read ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${chapter.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {index + 1}. {chapter.title}
                  </p>
                  {chapter.readAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(chapter.readAt).toLocaleDateString("ja-JP")} に読了
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      {progress === 100 && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">術式の読了が完了しました</h3>
            <p className="text-sm text-muted-foreground">
              この術式の内容を理解したものとみなされます。<br />
              不明点がある場合は、術式構築者に確認してください。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
