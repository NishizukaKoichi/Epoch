"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "@/components/icons"
import { useI18n } from "@/lib/i18n/context"

interface EpochFinalConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  recordType: string
  summary: string
}

export function EpochFinalConfirmation({
  open,
  onOpenChange,
  onConfirm,
  recordType,
  summary,
}: EpochFinalConfirmationProps) {
  const { t } = useI18n()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {t("confirm.title")}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-muted-foreground">{t("confirm.warning")}</p>

              <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("confirm.type")}</span>
                  <span className="font-mono text-foreground">{recordType}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground block mb-1">{t("confirm.content")}</span>
                  <p className="text-foreground">{summary}</p>
                </div>
              </div>

              <div className="border-l-2 border-amber-500/50 pl-4 text-sm">
                <p className="text-foreground font-medium mb-2">{t("confirm.desc")}</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
            {t("confirm.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-foreground text-background hover:bg-foreground/90">
            {t("confirm.submit")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
