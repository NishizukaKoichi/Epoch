"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ArrowRight, Clock, PenLine, Eye, Users, Shield, Search, MessageSquare, Building } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

// Epochでできること
const features = [
  { icon: PenLine, titleKey: "epoch.feature.record.title", descKey: "epoch.feature.record.desc" },
  { icon: Eye, titleKey: "epoch.feature.view.title", descKey: "epoch.feature.view.desc" },
  { icon: Search, titleKey: "epoch.feature.browse.title", descKey: "epoch.feature.browse.desc" },
  { icon: MessageSquare, titleKey: "epoch.feature.scout.title", descKey: "epoch.feature.scout.desc" },
  { icon: Building, titleKey: "epoch.feature.org.title", descKey: "epoch.feature.org.desc" },
]

// Recordの種類
const recordTypes = [
  { key: "epoch.record_type.decision", color: "text-amber-500" },
  { key: "epoch.record_type.action", color: "text-blue-500" },
  { key: "epoch.record_type.outcome", color: "text-green-500" },
  { key: "epoch.record_type.reflection", color: "text-violet-500" },
]

export function EpochLanding() {
  const { t } = useI18n()
  const router = useRouter()

  const principles = [
    { title: t("principle.1.title"), description: t("principle.1.desc") },
    { title: t("principle.2.title"), description: t("principle.2.desc") },
    { title: t("principle.3.title"), description: t("principle.3.desc") },
    { title: t("principle.4.title"), description: t("principle.4.desc") },
    { title: t("principle.5.title"), description: t("principle.5.desc") },
    { title: t("principle.6.title"), description: t("principle.6.desc") },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("landing.title")}</h1>
          </div>
          <Link href="/talisman">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              {t("landing.login")}
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-6 text-balance">{t("landing.headline")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("landing.desc1")}</p>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("landing.desc2")}</p>
          <p className="text-muted-foreground leading-relaxed">{t("landing.desc3")}</p>
        </section>

        {/* できること */}
        <section className="mb-16">
          <h3 className="text-lg font-medium text-foreground mb-6 border-b border-border pb-4">
            {t("epoch.features_title")}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-border">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                        <Icon className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">
                          {t(feature.titleKey as Parameters<typeof t>[0])}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t(feature.descKey as Parameters<typeof t>[0])}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Recordの種類 */}
        <section className="mb-16">
          <h3 className="text-lg font-medium text-foreground mb-6 border-b border-border pb-4">
            {t("epoch.record_types_title")}
          </h3>
          <div className="flex flex-wrap gap-3">
            {recordTypes.map((type) => (
              <div
                key={type.key}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card"
              >
                <Clock className={`h-4 w-4 ${type.color}`} />
                <span className="text-sm text-foreground">
                  {t(type.key as Parameters<typeof t>[0])}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {t("epoch.record_types_note")}
          </p>
        </section>

        {/* 原則 */}
        <section className="mb-16">
          <h3 className="text-lg font-medium text-foreground mb-8 border-b border-border pb-4">
            {t("landing.principles_title")}
          </h3>
          <div className="space-y-8">
            {principles.map((principle, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-4">
                  <span className="text-xs text-muted-foreground font-mono mt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">{principle.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-medium text-foreground mb-4">{t("landing.billing_title")}</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{t("landing.billing1")}</p>
            <p>{t("landing.billing2")}</p>
            <p>{t("landing.billing3")}</p>
          </div>
        </section>

        <section className="text-center">
          <Link href="/talisman">
            <Button
              className="px-8 py-6 text-base bg-foreground text-background hover:bg-foreground/90 gap-2"
            >
              {t("landing.start")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">{t("landing.consent")}</p>
        </section>
      </main>
    </div>
  )
}
