"use client"

import { useState } from "react"
import { Globe, Lock, Building2, Save, Users, Plus, X } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"

export default function SigilSettingsPage() {
  const { t } = useI18n()
  const [defaultVisibility, setDefaultVisibility] = useState("internal")
  const [saved, setSaved] = useState(false)
  const [allowedDomains, setAllowedDomains] = useState(["@example.com", "@example.co.jp"])
  const [newDomain, setNewDomain] = useState("")

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addDomain = () => {
    const domain = newDomain.trim().startsWith("@") ? newDomain.trim() : `@${newDomain.trim()}`
    if (domain.length > 1 && !allowedDomains.includes(domain)) {
      setAllowedDomains(prev => [...prev, domain])
      setNewDomain("")
    }
  }

  const removeDomain = (domain: string) => {
    setAllowedDomains(prev => prev.filter(d => d !== domain))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t("sigil.settings")}</h1>
      </div>

      {/* Visibility settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("sigil.settings.visibility")}</CardTitle>
          <CardDescription>
            新しいスペースのデフォルト公開設定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={defaultVisibility}
            onValueChange={setDefaultVisibility}
            className="space-y-3"
          >
            {/* Public */}
            <div className="flex items-start gap-3 p-3 rounded-md border border-border hover:border-muted-foreground/30 transition-colors">
              <RadioGroupItem value="public" id="public" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="h-4 w-4 text-green-500" />
                  公開
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  誰でも術式を閲覧できます。採用候補者や外部パートナーへの事前開示に。
                </p>
              </div>
            </div>

            {/* Internal */}
            <div className="flex items-start gap-3 p-3 rounded-md border border-border hover:border-muted-foreground/30 transition-colors">
              <RadioGroupItem value="internal" id="internal" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="internal" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4 text-amber-500" />
                  社内限定
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  許可されたドメインのメールアドレスを持つ社員のみ閲覧可能。社内マニュアルに。
                </p>
              </div>
            </div>

            {/* Private */}
            <div className="flex items-start gap-3 p-3 rounded-md border border-border hover:border-muted-foreground/30 transition-colors">
              <RadioGroupItem value="private" id="private" className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  非公開
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  URLを直接知っている人だけが閲覧可能。下書きや限定共有に。
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Internal access settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            社内アクセス設定
          </CardTitle>
          <CardDescription>
            「社内限定」スペースにアクセスできるメールドメインを設定
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {allowedDomains.map((domain) => (
              <Badge key={domain} variant="secondary" className="gap-1">
                {domain}
                <button
                  onClick={() => removeDomain(domain)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="@company.com"
              onKeyDown={(e) => e.key === "Enter" && addDomain()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={addDomain}
              disabled={!newDomain.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            これらのドメインのメールアドレスで認証されたユーザーのみ、社内限定スペースにアクセスできます
          </p>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {saved ? "保存しました" : "保存"}
        </Button>
      </div>
    </div>
  )
}
