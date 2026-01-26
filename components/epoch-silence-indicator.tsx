"use client"

import { Clock } from "@/components/icons"

interface SilencePeriod {
  start: string
  end: string
  duration: string
}

interface EpochSilenceIndicatorProps {
  period: SilencePeriod
}

export function EpochSilenceIndicator({ period }: EpochSilenceIndicatorProps) {
  return (
    <div className="relative py-8">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="flex items-center gap-4 pl-8">
        <div className="absolute left-[13px] w-2 h-2 rounded-full bg-muted-foreground/30" />

        <div className="flex-1 border border-dashed border-border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-mono">period_of_silence</span>
          </div>

          <div className="text-sm text-muted-foreground">
            <span>{period.duration}</span>
            <span className="mx-2 text-border">|</span>
            <span className="font-mono text-xs">
              {period.start} — {period.end}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
