"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { 
  ChevronLeft, 
  Globe, 
  BookOpen, 
  Users, 
  Download, 
  Calendar,
  Building2,
  Target,
  CheckCircle2,
  AlertCircle
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"

// Mock data for public space detail
const mockPublicSpaces: Record<string, {
  id: string
  name: string
  author: string
  authorOrg: string
  purpose: string
  decisions: string[]
  doneStrictness: "high" | "medium" | "low"
  responsibility: string
  chapters: { id: string; title: string; summary: string }[]
  adoptedCount: number
  createdAt: string
  updatedAt: string
  category: string
}> = {
  "techcorp-eng": {
    id: "techcorp-eng",
    name: "Engineering Onboarding",
    author: "Tanaka Taro",
    authorOrg: "TechCorp Inc.",
    purpose: "新規エンジニアが最初の30日で理解すべき術式を事前開示する",
    decisions: [
      "コードレビューの承認基準",
      "技術的負債の許容範囲",
      "ドキュメント更新の優先度",
    ],
    doneStrictness: "high",
    responsibility: "エンジニアリングチームに所属する全員",
    chapters: [
      { id: "1", title: "術式の前提条件", summary: "この術式が適用される範囲と条件" },
      { id: "2", title: "発動条件", summary: "術式が発動するトリガーとなる状況" },
      { id: "3", title: "日常的に発生する判断", summary: "日々の業務で遭遇する判断基準" },
      { id: "4", title: "完了条件（Done定義）", summary: "タスクが完了と見なされる条件" },
      { id: "5", title: "権限と責任の境界", summary: "誰が何を決定できるか" },
      { id: "6", title: "例外・逸脱時の扱い", summary: "術式から外れる場合の対処" },
    ],
    adoptedCount: 47,
    createdAt: "2025-11-01",
    updatedAt: "2026-01-15",
    category: "engineering",
  },
  "designstudio-ds": {
    id: "designstudio-ds",
    name: "Design System Guidelines",
    author: "Yamada Hanako",
    authorOrg: "DesignStudio",
    purpose: "デザインシステムの運用と意思決定の基準を事前開示する",
    decisions: [
      "新規コンポーネントの追加基準",
      "既存コンポーネントの変更プロセス",
      "例外的なデザインの許容範囲",
    ],
    doneStrictness: "medium",
    responsibility: "デザインチームおよびフロントエンドエンジニア",
    chapters: [
      { id: "1", title: "術式の前提条件", summary: "デザインシステムが適用される範囲" },
      { id: "2", title: "発動条件", summary: "デザイン判断が必要になる状況" },
      { id: "3", title: "日常的に発生する判断", summary: "コンポーネント選択の基準" },
      { id: "4", title: "完了条件（Done定義）", summary: "デザインレビューの完了条件" },
    ],
    adoptedCount: 23,
    createdAt: "2025-12-01",
    updatedAt: "2026-01-10",
    category: "design",
  },
}

const strictnessLabels = {
  high: { label: "厳格", color: "text-red-500" },
  medium: { label: "標準", color: "text-amber-500" },
  low: { label: "柔軟", color: "text-green-500" },
}

export default function SigilExploreDetailPage() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams()
  const spaceId = params.spaceId as string
  
  const [adoptDialog, setAdoptDialog] = useState(false)
  const [adopted, setAdopted] = useState(false)

  const space = mockPublicSpaces[spaceId] || mockPublicSpaces["techcorp-eng"]

  const handleAdopt = () => {
    setAdopted(true)
    setAdoptDialog(false)
  }

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
          <h1 className="text-2xl font-semibold text-foreground">{space.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {space.authorOrg} / {space.author}
          </p>
        </div>
        <Button
          onClick={() => adopted ? null : setAdoptDialog(true)}
          disabled={adopted}
          className="gap-2"
        >
          {adopted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              採用済み
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              採用する
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Globe className="h-4 w-4" />
          公開
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          {space.chapters.length}章
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {space.adoptedCount}件採用
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          更新: {space.updatedAt}
        </span>
      </div>

      <Separator />

      {/* Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              目的
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{space.purpose}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              責任範囲
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{space.responsibility}</p>
          </CardContent>
        </Card>
      </div>

      {/* Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">想定される判断</CardTitle>
          <CardDescription>この術式で扱われる主な判断事項</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {space.decisions.map((decision, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Done Strictness */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Done条件の厳しさ</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className={strictnessLabels[space.doneStrictness].color}>
            {strictnessLabels[space.doneStrictness].label}
          </Badge>
        </CardContent>
      </Card>

      {/* Chapters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">章構成</CardTitle>
          <CardDescription>術式に含まれる章の概要</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {space.chapters.map((chapter, index) => (
              <div 
                key={chapter.id}
                className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-sm">{chapter.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{chapter.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adopt Dialog */}
      <Dialog open={adoptDialog} onOpenChange={setAdoptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sigil.explore.adopt_confirm")}</DialogTitle>
            <DialogDescription>
              {t("sigil.explore.adopt_desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>術式の全章がコピーされます</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>内容は自由に編集できます</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
              <span>元の術式が更新された場合、同期するか選択できます</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdoptDialog(false)} className="bg-transparent">
              キャンセル
            </Button>
            <Button onClick={handleAdopt} className="gap-2">
              <Download className="h-4 w-4" />
              採用する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
