"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"

interface EpochPrinciplesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EpochPrinciplesDialog({ open, onOpenChange }: EpochPrinciplesDialogProps) {
  const { t } = useI18n()

  const principles = [
    { title: t("principle.1.title"), description: t("principle.1.desc") },
    { title: t("principle.2.title"), description: t("principle.2.desc") },
    { title: t("principle.3.title"), description: t("principle.3.desc") },
    { title: t("principle.4.title"), description: t("principle.4.desc") },
    { title: t("principle.5.title"), description: t("principle.5.desc") },
    { title: t("principle.6.title"), description: t("principle.6.desc") },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("landing.principles_title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">{t("landing.desc3")}</p>

          <div className="space-y-3">
            {principles.map((principle, index) => (
              <div key={index} className="p-3 border border-border bg-background">
                <h3 className="text-sm font-medium text-foreground mb-1">{principle.title}</h3>
                <p className="text-xs text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
