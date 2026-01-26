"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

interface EpochStatsProps {
  totalRecords: number
  decisionsMade: number
  decisionsNotMade: number
  silencePeriods: number
  memberSince: string
}

export function EpochStats({
  totalRecords,
  decisionsMade,
  decisionsNotMade,
  silencePeriods,
  memberSince,
}: EpochStatsProps) {
  const { t, locale } = useI18n()

  const formatDate = (dateStr: string) => {
    const localeMap: Record<string, string> = {
      ja: "ja-JP",
      en: "en-US",
      zh: "zh-CN",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      ko: "ko-KR",
      pt: "pt-BR",
      ar: "ar-SA",
      hi: "hi-IN",
    }
    return new Date(dateStr).toLocaleDateString(localeMap[locale] || "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-card border-border mb-8">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <p className="text-2xl font-semibold text-foreground">{totalRecords}</p>
            <p className="text-xs text-muted-foreground">{t("stats.total_records")}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{decisionsMade}</p>
            <p className="text-xs text-muted-foreground">{t("record.decision_made")}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{decisionsNotMade}</p>
            <p className="text-xs text-muted-foreground">{t("record.decision_not_made")}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{silencePeriods}</p>
            <p className="text-xs text-muted-foreground">{t("record.period_of_silence")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{formatDate(memberSince)}</p>
            <p className="text-xs text-muted-foreground">{t("stats.since")}</p>
          </div>
        </div>

        <p className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">{t("stats.fact_only")}</p>
      </CardContent>
    </Card>
  )
}
