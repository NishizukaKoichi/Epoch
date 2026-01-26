"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ArrowRight, FileText, Lock, Users, Globe } from "@/components/icons"
import { EpochFinalConfirmation } from "./epoch-final-confirmation"

type Visibility = "private" | "scout_visible" | "public"

interface OriginalRecord {
  id: string
  type: string
  content: string
  timestamp: string
}

interface EpochRevisionFormProps {
  originalRecord: OriginalRecord
  onCancel: () => void
  onSubmit: (data: { content: string; visibility: Visibility }) => void
}

const visibilityOptions = [
  { value: "private", label: "非公開", icon: Lock, description: "自分のみ閲覧可能" },
  { value: "scout_visible", label: "スカウト公開", icon: Users, description: "スカウト権限を持つ人が閲覧可能" },
  { value: "public", label: "公開", icon: Globe, description: "課金者が閲覧可能" },
]

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function EpochRevisionForm({ originalRecord, onCancel, onSubmit }: EpochRevisionFormProps) {
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState<Visibility>("private")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSubmit = () => {
    if (content.trim()) {
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    onSubmit({ content, visibility })
    setShowConfirmation(false)
  }

  return (
    <>
      <div className="border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-medium">改訂Recordの作成</h3>
        </div>

        {/* Original Record Reference */}
        <div className="border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">参照元Record</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">ID:</span>
              <code className="text-xs font-mono text-foreground">{originalRecord.id}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">日時:</span>
              <span className="text-xs text-foreground">{formatTimestamp(originalRecord.timestamp)}</span>
            </div>
            <p className="text-sm text-foreground mt-2 p-3 bg-background border border-border">
              {originalRecord.content}
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-amber-500 font-medium">改訂について</p>
            <p className="text-muted-foreground mt-1">
              改訂Recordは元のRecordを上書きしません。新しいRecordとして追加され、元のRecordへの参照が記録されます。
              両方のRecordが永続的に残ります。
            </p>
          </div>
        </div>

        {/* Revision Content */}
        <div className="space-y-3">
          <Label htmlFor="revision-content" className="text-sm font-medium text-foreground">
            改訂内容
          </Label>
          <Textarea
            id="revision-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="元の判断に対する補足、訂正、または追加情報を記述してください..."
            className="min-h-[150px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
          />
          <p className="text-xs text-muted-foreground">
            元のRecordを参照しながら、改訂の理由や内容を明確に記述してください。
          </p>
        </div>

        {/* Visibility */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">可視性</Label>
          <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {visibilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-foreground">
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                    <span className="text-xs text-muted-foreground">- {option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            確認画面へ
          </Button>
        </div>
      </div>

      <EpochFinalConfirmation
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirm}
        recordData={{
          type: "revised",
          content,
          visibility,
          references: originalRecord.id,
        }}
      />
    </>
  )
}
