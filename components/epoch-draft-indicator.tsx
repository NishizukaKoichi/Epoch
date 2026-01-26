"use client"

import { FileText, Trash2 } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface Draft {
  id: string
  content: string
  recordType: string
  createdAt: string
}

interface EpochDraftIndicatorProps {
  drafts: Draft[]
  onSelect: (draft: Draft) => void
  onDelete: (id: string) => void
}

export function EpochDraftIndicator({ drafts, onSelect, onDelete }: EpochDraftIndicatorProps) {
  if (drafts.length === 0) return null

  const formatTime = (iso: string) => {
    return new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso))
  }

  return (
    <div className="mb-6 border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">下書き</span>
        <span className="text-xs font-mono text-muted-foreground">({drafts.length})</span>
      </div>

      <div className="space-y-2">
        {drafts.map((draft) => (
          <div key={draft.id} className="flex items-center gap-3 p-3 bg-secondary border border-border">
            <button onClick={() => onSelect(draft)} className="flex-1 text-left">
              <p className="text-sm text-foreground truncate">{draft.content || "（内容なし）"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {draft.recordType} · {formatTime(draft.createdAt)}
              </p>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(draft.id)}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
              aria-label="下書きを削除"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        下書きはローカルに保存されます。確定はオンライン時のみ可能です。
      </p>
    </div>
  )
}
