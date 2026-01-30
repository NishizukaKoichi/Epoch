"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Globe, Lock, Building2, Save, Plus, Trash2, GripVertical, Edit, Eye, BookOpen } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useI18n } from "@/lib/i18n/context"

// Mock data for different spaces - matches dashboard and spaces list
const mockSpacesData: Record<string, {
  name: string
  purpose: string
  decisions: string
  doneStrictness: number
  responsibility: string
  visibility: string
  chapters: { id: string; title: string; order: number }[]
}> = {
  "eng-team": {
    name: "Engineering Team",
    purpose: "プロダクト開発を通じて価値を届ける",
    decisions: "- 技術選定\n- タスクの優先順位付け\n- コードレビューの承認/差し戻し",
    doneStrictness: 65,
    responsibility: "プロダクトの技術的品質に関する最終判断権を持つ",
    visibility: "internal",
    chapters: [
      { id: "1", title: "術式の前提条件", order: 1 },
      { id: "2", title: "発動条件", order: 2 },
      { id: "3", title: "日常的に発生する判断", order: 3 },
      { id: "4", title: "完了条件（Done定義）", order: 4 },
      { id: "5", title: "権限と責任の境界", order: 5 },
      { id: "6", title: "例外・逸脱時の扱い", order: 6 },
    ],
  },
  "design-team": {
    name: "Design Team",
    purpose: "ユーザー体験を設計する",
    decisions: "- デザインシステムの更新\n- UIパターンの選定\n- ユーザビリティの判断",
    doneStrictness: 50,
    responsibility: "ユーザー体験の品質に関する最終判断権を持つ",
    visibility: "public",
    chapters: [
      { id: "1", title: "デザイン原則", order: 1 },
      { id: "2", title: "レビュープロセス", order: 2 },
      { id: "3", title: "フィードバックの扱い", order: 3 },
      { id: "4", title: "完了条件", order: 4 },
      { id: "5", title: "例外対応", order: 5 },
    ],
  },
  "sales-team": {
    name: "Sales Team",
    purpose: "顧客との信頼関係を構築する",
    decisions: "- 商談の進め方\n- 価格交渉の範囲\n- 契約条件の調整",
    doneStrictness: 80,
    responsibility: "顧客との契約に関する判断権を持つ",
    visibility: "private",
    chapters: [
      { id: "1", title: "営業プロセス", order: 1 },
      { id: "2", title: "価格ポリシー", order: 2 },
      { id: "3", title: "契約条件", order: 3 },
      { id: "4", title: "例外処理", order: 4 },
    ],
  },
}

// Default data for new spaces
const defaultSpaceData = {
  name: "",
  purpose: "",
  decisions: "",
  doneStrictness: 50,
  responsibility: "",
  visibility: "private",
  chapters: [] as { id: string; title: string; order: number }[],
}

export default function EditSpacePage() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams()
  const spaceId = params.spaceId as string
  
  // Get space data or use defaults for new spaces
  const spaceData = mockSpacesData[spaceId] || defaultSpaceData
  const isNewSpace = !mockSpacesData[spaceId]
  
  const [name, setName] = useState(spaceData.name)
  const [purpose, setPurpose] = useState(spaceData.purpose)
  const [decisions, setDecisions] = useState(spaceData.decisions)
  const [doneStrictness, setDoneStrictness] = useState([spaceData.doneStrictness])
  const [responsibility, setResponsibility] = useState(spaceData.responsibility)
  const [visibility, setVisibility] = useState(spaceData.visibility)
  const [chapters, setChapters] = useState(spaceData.chapters)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const strictnessLabels = ["緩い", "標準", "厳密"]
  const getStrictnessLabel = (value: number) => {
    if (value < 33) return strictnessLabels[0]
    if (value < 66) return strictnessLabels[1]
    return strictnessLabels[2]
  }

  const addChapter = () => {
    const newChapter = {
      id: String(Date.now()),
      title: "新しい章",
      order: chapters.length + 1,
    }
    setChapters([...chapters, newChapter])
  }

  const removeChapter = (id: string) => {
    setChapters(chapters.filter((c) => c.id !== id))
  }

  const updateChapterTitle = (id: string, title: string) => {
    setChapters(chapters.map((c) => (c.id === id ? { ...c, title } : c)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {isNewSpace ? "新しいスペースを作成" : "スペースを編集"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {name || (isNewSpace ? "スペース名を入力してください" : spaceId)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/sigil/space/${params.spaceId}`}>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              プレビュー
            </Button>
          </Link>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {saved ? "保存しました" : "保存"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">スペース名</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">{t("sigil.space.purpose")}</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chapters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              章構成
            </CardTitle>
            <CardDescription>
              章タイトルを編集するか、「編集」をクリックして内容を記述します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="flex items-center gap-2 p-3 rounded-md border border-border hover:border-muted-foreground/50 transition-colors group"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground cursor-grab" />
                <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                <Input
                  value={chapter.title}
                  onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                  className="flex-1 h-8"
                />
                <Link href={`/sigil/spaces/${params.spaceId}/chapters/${chapter.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 bg-transparent"
                  >
                    <Edit className="h-3 w-3" />
                    編集
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeChapter(chapter.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addChapter}
              className="w-full gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              章を追加
            </Button>
            
            {chapters.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                章がありません。「章を追加」をクリックして最初の章を作成してください。
              </p>
            )}
          </CardContent>
        </Card>

        {/* Decisions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sigil.space.decisions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={decisions}
              onChange={(e) => setDecisions(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Done strictness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sigil.space.done_strictness")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={doneStrictness}
              onValueChange={setDoneStrictness}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{strictnessLabels[0]}</span>
              <span className="font-medium text-foreground">
                {getStrictnessLabel(doneStrictness[0])}
              </span>
              <span>{strictnessLabels[2]}</span>
            </div>
          </CardContent>
        </Card>

        {/* Responsibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sigil.space.responsibility")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              rows={2}
            />
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sigil.settings.visibility")}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={visibility}
              onValueChange={setVisibility}
              className="space-y-3"
            >
              <div className="flex items-start gap-3 p-3 rounded-md border border-border hover:border-muted-foreground/30 transition-colors">
                <RadioGroupItem value="public" id="vis-public" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="vis-public" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="h-4 w-4 text-green-500" />
                    公開
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    誰でも閲覧可能（採用候補者・外部向け）
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md border border-border hover:border-muted-foreground/30 transition-colors">
                <RadioGroupItem value="internal" id="vis-internal" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="vis-internal" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    社内限定
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    許可されたドメインのメールを持つ社員のみ
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md border border-border hover:border-muted-foreground/30 transition-colors">
                <RadioGroupItem value="private" id="vis-private" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="vis-private" className="flex items-center gap-2 cursor-pointer">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    非公開
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    URLを直接知っている人のみ（下書き用）
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
