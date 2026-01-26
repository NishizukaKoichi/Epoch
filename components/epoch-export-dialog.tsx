"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileJson, CheckCircle2 } from "@/components/icons"

interface EpochExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EpochExportDialog({ open, onOpenChange }: EpochExportDialogProps) {
  const [exporting, setExporting] = useState(false)
  const [complete, setComplete] = useState(false)

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      setComplete(true)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">データエクスポート</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            すべてのEpochRecordをそのままエクスポートします
          </DialogDescription>
        </DialogHeader>

        {!complete ? (
          <div className="space-y-6">
            <div className="p-4 border border-border rounded-lg bg-muted/30">
              <h4 className="font-medium text-foreground mb-3">エクスポート内容</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  すべてのEpochRecord（JSON形式）
                </li>
                <li className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  添付画像（オリジナル形式）
                </li>
                <li className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  record_hash検証用データ
                </li>
              </ul>
            </div>

            <div className="text-sm text-muted-foreground border-l-2 border-border pl-4">
              <p>エクスポートされるデータは、Epochに記録された事実そのものです。</p>
              <p className="mt-2">意味変換、再構成、要約は行われません。</p>
            </div>

            <Button
              onClick={handleExport}
              disabled={exporting}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              {exporting ? (
                <>エクスポート中...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  エクスポートを開始
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-sm text-foreground font-medium">エクスポートが完了しました</p>
            </div>

            <div className="p-3 border border-border rounded-lg bg-muted/30 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>epoch_export_2024.zip</span>
                <span>12.4 MB</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setComplete(false)
                  onOpenChange(false)
                }}
                className="flex-1 border-border text-foreground"
              >
                閉じる
              </Button>
              <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                <Download className="h-4 w-4 mr-2" />
                ダウンロード
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
