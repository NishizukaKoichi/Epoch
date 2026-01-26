"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, X } from "@/components/icons"
import { EpochFinalConfirmation } from "./epoch-final-confirmation"
import { useI18n } from "@/lib/i18n/context"

type RecordType = "decision_made" | "decision_not_made" | "revised" | "period_of_silence"
type Visibility = "private" | "org_only" | "scout_visible" | "public"

export function EpochRecordForm() {
  const [content, setContent] = useState("")
  const [recordType, setRecordType] = useState<RecordType>("decision_made")
  const [visibility, setVisibility] = useState<Visibility>("private")
  const [attachment, setAttachment] = useState<File | null>(null)
  const [isDraft, setIsDraft] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useI18n()

  const recordTypeLabels: Record<RecordType, string> = {
    decision_made: t("record.decision_made"),
    decision_not_made: t("record.decision_not_made"),
    revised: t("record.revised"),
    period_of_silence: t("record.period_of_silence"),
  }

  const visibilityLabels: Record<Visibility, string> = {
    private: t("visibility.private"),
    org_only: "組織限定",
    scout_visible: t("visibility.scout_visible"),
    public: t("visibility.public"),
  }

  const visibilityDescriptions: Record<Visibility, string> = {
    private: "自分のみ閲覧可能",
    org_only: "所属組織のメンバーのみ閲覧可能",
    scout_visible: "URLを知る人のみ閲覧可能",
    public: "すべての人が閲覧可能",
  }

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment(file)
    }
  }

  const removeAttachment = () => {
    setAttachment(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRequestSubmit = () => {
    if (!content.trim()) return
    setShowConfirmation(true)
  }

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false)
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsDraft(false)

    setContent("")
    setAttachment(null)
    setIsDraft(true)
  }

  const canSubmit = content.trim().length > 0 && !isSubmitting

  return (
    <div className="mb-12 border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={recordType} onValueChange={(v) => setRecordType(v as RecordType)}>
            <SelectTrigger className="w-44 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(recordTypeLabels) as [RecordType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={visibility} onValueChange={(v) => setVisibility(v as Visibility)}>
            <SelectTrigger className="w-40 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(visibilityLabels) as [Visibility, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  <div className="flex flex-col">
                    <span>{label}</span>
                    <span className="text-xs text-muted-foreground">{visibilityDescriptions[value]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          {isDraft ? t("form.draft") : t("form.confirmed")}
        </span>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("form.placeholder")}
        className="min-h-32 resize-none bg-background border-border text-foreground placeholder:text-muted-foreground"
      />

      {attachment && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-secondary rounded-md">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground flex-1 truncate">{attachment.name}</span>
          <button
            onClick={removeAttachment}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Remove attachment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAttachment}
            className="hidden"
            id="attachment-input"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {t("form.attach_image")}
          </Button>
        </div>

        <Button
          onClick={handleRequestSubmit}
          disabled={!canSubmit}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? t("form.confirming") : t("form.confirm")}
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("form.warning")}</p>

      <EpochFinalConfirmation
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirmedSubmit}
        recordType={recordTypeLabels[recordType]}
        summary={content.length > 100 ? content.slice(0, 100) + "..." : content}
      />
    </div>
  )
}
