"use client"

import { useState } from "react"
import { Mail, Settings, Save, X } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"

export default function ContactPage() {
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  
  // 編集可能なコンテンツ（実際はDBから取得）
  const [email, setEmail] = useState("contact@koichinishizuka.com")
  const [note, setNote] = useState("返信には時間がかかる場合があります。緊急の連絡には向いていません。")

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-medium text-foreground">
          {t("site.contact_title")}
        </h1>
        {isAdmin && (
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="gap-1">
                <X className="h-4 w-4" />
                キャンセル
              </Button>
              <Button size="sm" onClick={() => setIsEditing(false)} className="gap-1">
                <Save className="h-4 w-4" />
                保存
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-12">
        {t("site.contact_desc")}
      </p>

      {/* Contact Method */}
      {isEditing ? (
        <div className="border border-border p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">備考</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="border border-border p-6">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
                <Mail className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                  {t("site.contact_email")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </a>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground mt-8">
            {note}
          </p>
        </>
      )}
    </div>
  )
}
