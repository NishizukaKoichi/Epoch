"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Copy } from "@/components/icons"
import { useState } from "react"

interface EpochSaveErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRetry: () => void
  error: {
    code: string
    message: string
    timestamp: string
    draftContent?: string
  }
}

export function EpochSaveErrorDialog({
  open,
  onOpenChange,
  onRetry,
  error,
}: EpochSaveErrorDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyDraft = async () => {
    if (error.draftContent) {
      await navigator.clipboard.writeText(error.draftContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-destructive max-w-lg">
        {/* Critical warning banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-destructive rounded-t-lg" />
        
        <DialogHeader className="pt-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 animate-pulse">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-destructive text-lg font-semibold">
                Recordは保存されていません
              </DialogTitle>
              <p className="text-xs text-destructive/80 font-mono mt-0.5">
                CRITICAL: UNSAVED
              </p>
            </div>
          </div>
          <DialogDescription className="text-muted-foreground leading-relaxed">
            確定処理中にエラーが発生しました。<strong className="text-foreground">このRecordはまだ記録されていません。</strong>
            内容は失われていないため、再試行するか、テキストをコピーして保存してください。
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 bg-destructive/5 border border-destructive/20 rounded-md">
          <div className="text-xs font-mono text-muted-foreground space-y-1">
            <p>エラーコード: {error.code}</p>
            <p>発生時刻: {new Date(error.timestamp).toLocaleString("ja-JP")}</p>
            <p className="text-destructive">{error.message}</p>
          </div>
        </div>

        {error.draftContent && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">下書き内容（未保存）:</p>
            <div className="p-3 bg-secondary rounded-md text-sm text-foreground max-h-32 overflow-y-auto">
              {error.draftContent.length > 200
                ? error.draftContent.slice(0, 200) + "..."
                : error.draftContent}
            </div>
          </div>
        )}

        <div className="p-3 bg-secondary/50 border border-border rounded-md">
          <p className="text-xs text-muted-foreground leading-relaxed">
            重要: このダイアログを閉じても、下書きはローカルに保持されます。
            ただし、ブラウザを閉じると失われる可能性があります。
            再試行が失敗し続ける場合は、内容をコピーして別の場所に保存してください。
          </p>
        </div>

        <DialogFooter className="gap-2 mt-4">
          {error.draftContent && (
            <Button
              variant="outline"
              onClick={handleCopyDraft}
              className="border-border bg-transparent"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "コピーしました" : "下書きをコピー"}
            </Button>
          )}
          <Button
            onClick={onRetry}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            再試行
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
