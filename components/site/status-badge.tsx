"use client"

import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "draft" | "final" | "deprecated"
  size?: "sm" | "md"
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const { t } = useI18n()

  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    final: "bg-foreground/10 text-foreground",
    deprecated: "bg-destructive/10 text-destructive",
  }

  return (
    <span className={cn(
      "uppercase tracking-wider rounded",
      statusColors[status],
      size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
    )}>
      {t(`site.status.${status}` as Parameters<typeof t>[0])}
    </span>
  )
}
