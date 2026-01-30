"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Globe, Lock, Building2, ArrowRight } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useI18n } from "@/lib/i18n/context"

export default function CreateSpacePage() {
  const { t } = useI18n()
  const router = useRouter()
  const [name, setName] = useState("")
  const [purpose, setPurpose] = useState("")
  const [decisions, setDecisions] = useState("")
  const [doneStrictness, setDoneStrictness] = useState([50])
  const [responsibility, setResponsibility] = useState("")
  const [visibility, setVisibility] = useState("internal")

  const handleCreate = () => {
    // In real app, this would create the space and return the new ID
    const newSpaceId = `space-${Date.now()}`
    // Redirect to edit page to add chapters and content
    router.push(`/sigil/spaces/${newSpaceId}/edit`)
  }

  const strictnessLabels = ["緩い", "標準", "厳密"]
  const getStrictnessLabel = (value: number) => {
    if (value < 33) return strictnessLabels[0]
    if (value < 66) return strictnessLabels[1]
    return strictnessLabels[2]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t("sigil.create_space")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          新しい術式空間を作成します
        </p>
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
                placeholder="例: Engineering Team"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">{t("sigil.space.purpose")}</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="例: プロダクト開発を通じて価値を届ける"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                この場が存在する理由を一文で記述してください
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Decisions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sigil.space.decisions")}</CardTitle>
            <CardDescription>
              この場で日常的に発生する判断を列挙してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={decisions}
              onChange={(e) => setDecisions(e.target.value)}
              placeholder="例:&#10;- 技術選定&#10;- タスクの優先順位付け&#10;- コードレビューの承認/差し戻し"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Done strictness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sigil.space.done_strictness")}</CardTitle>
            <CardDescription>
              完了条件をどの程度厳密に運用するかを設定します
            </CardDescription>
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
            <CardDescription>
              この場の責任範囲を明確にします
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              placeholder="例: プロダクトの技術的品質に関する最終判断権を持つ"
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
                    誰でも閲覧可能
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
                    URLを直接知っている人のみ
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name || !purpose} className="gap-2">
            作成して章を追加する
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
