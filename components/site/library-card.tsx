"use client"

import Link from "next/link"
import { ArrowRight } from "@/components/icons"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export interface LibraryCardProps {
  id: string
  name: string
  definition: string
  handles: string
  notHandles: string
  status: "draft" | "final" | "deprecated"
  hasSpec?: boolean
  hasValue?: boolean
  specHref?: string
  compact?: boolean
  hasMvp?: boolean
}

export function LibraryCard({
  id,
  name,
  definition,
  handles,
  notHandles,
  status,
  hasSpec = true,
  hasValue = false,
  specHref,
  compact = false,
  hasMvp = false,
}: LibraryCardProps) {
  const { t } = useI18n()

  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    final: "bg-foreground/10 text-foreground",
    deprecated: "bg-destructive/10 text-destructive",
  }

  return (
    <div className={cn(
      "group border border-border bg-card p-6 transition-colors hover:border-foreground/20",
      compact && "p-4"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className={cn("font-medium text-foreground", compact ? "text-base" : "text-lg")}>
          {name}
        </h3>
        <span className={cn(
          "shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded",
          statusColors[status]
        )}>
          {t(`site.status.${status}` as Parameters<typeof t>[0])}
        </span>
      </div>

      {/* Definition */}
      <p className={cn(
        "text-muted-foreground mb-4",
        compact ? "text-sm" : "text-sm leading-relaxed"
      )}>
        {definition}
      </p>

      {/* Handles / Not Handles */}
      <div className="space-y-2 mb-6 text-xs">
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0">{t("site.handles")}:</span>
          <span className="text-foreground/80">{handles}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0">{t("site.not_handles")}:</span>
          <span className="text-foreground/60">{notHandles}</span>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        {hasSpec && (
          <Link
            href={specHref || `/library/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80 transition-colors"
          >
            {t("site.view_spec")}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
        {hasValue && (
          <Link
            href={`/library/${id}/value`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("site.view_value")}
          </Link>
        )}
      </div>
    </div>
  )
}
