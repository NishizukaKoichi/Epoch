"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, Users, Globe, AlertTriangle, Building2 } from "@/components/icons"

type Visibility = "private" | "org_only" | "scout_visible" | "public"

interface EpochVisibilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: {
    id: string
    currentVisibility: Visibility
  }
}

const visibilityOptions: Record<Visibility, { label: string; icon: typeof Lock; description: string }> = {
  private: {
    label: "非公開",
    icon: Lock,
    description: "自分のみ閲覧可能",
  },
  org_only: {
    label: "組織限定",
    icon: Building2,
    description: "所属組織のメンバーのみ閲覧可能",
  },
  scout_visible: {
    label: "スカウト公開",
    icon: Users,
    description: "URLを知る人のみ閲覧可能",
  },
  public: {
    label: "公開",
    icon: Globe,
    description: "すべての人が閲覧可能",
  },
}

export function EpochVisibilityDialog({ open, onOpenChange, record }: EpochVisibilityDialogProps) {
  const [newVisibility, setNewVisibility] = useState<Visibility>(record.currentVisibility)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasChanged = newVisibility !== record.currentVisibility

  const handleSubmit = async () => {
    if (!hasChanged) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">可視性を変更</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            可視性変更は状態変更Recordとして追記され、過去のRecordは書き換えられません。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">現在の可視性</label>
            <div className="flex items-center gap-2 p-3 bg-secondary border border-border">
              {(() => {
                const CurrentIcon = visibilityOptions[record.currentVisibility].icon
                return <CurrentIcon className="h-4 w-4 text-muted-foreground" />
              })()}
              <span className="text-sm text-foreground">{visibilityOptions[record.currentVisibility].label}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">新しい可視性</label>
            <Select value={newVisibility} onValueChange={(v) => setNewVisibility(v as Visibility)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(visibilityOptions).map(([value, option]) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {newVisibility && (
              <p className="text-xs text-muted-foreground">{visibilityOptions[newVisibility].description}</p>
            )}
          </div>

          {hasChanged && (
            <div className="flex items-start gap-2 p-3 bg-background border border-border">
              <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                この変更は新しいRecordとして追記されます。元に戻すことも、さらに別のRecordとして記録されます。
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border text-foreground"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!hasChanged || isSubmitting}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "変更中..." : "変更を確定"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
