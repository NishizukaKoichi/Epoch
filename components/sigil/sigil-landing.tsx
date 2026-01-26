"use client"

import { useState } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  FileCheck, 
  BookOpen, 
  Scale, 
  HeartOff, 
  CheckCircle,
  ChevronLeft
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

const principles = [
  { icon: Brain, titleKey: "sigil.principle.1.title", descKey: "sigil.principle.1.desc" },
  { icon: FileCheck, titleKey: "sigil.principle.2.title", descKey: "sigil.principle.2.desc" },
  { icon: BookOpen, titleKey: "sigil.principle.3.title", descKey: "sigil.principle.3.desc" },
  { icon: Scale, titleKey: "sigil.principle.4.title", descKey: "sigil.principle.4.desc" },
  { icon: HeartOff, titleKey: "sigil.principle.5.title", descKey: "sigil.principle.5.desc" },
  { icon: CheckCircle, titleKey: "sigil.principle.6.title", descKey: "sigil.principle.6.desc" },
]

export function SigilLanding() {
  const { t } = useI18n()
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-foreground">{t("sigil.title")}</span>
          </div>
          <Link href="/talisman">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-transparent"
            >
              {t("landing.login")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="mb-2 text-sm text-muted-foreground font-mono">
            {t("sigil.subtitle")}
          </p>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
            {t("sigil.landing.headline")}
          </h2>
          <div className="space-y-2 text-muted-foreground">
            <p>{t("sigil.landing.desc1")}</p>
            <p>{t("sigil.landing.desc2")}</p>
            <p>{t("sigil.landing.desc3")}</p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h3 className="mb-8 text-lg font-semibold text-foreground">
            {t("landing.principles_title")}
          </h3>
          <div className="space-y-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                    <Icon className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {t(principle.titleKey as Parameters<typeof t>[0])}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(principle.descKey as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/talisman">
          <Button className="w-full bg-amber-500 text-background hover:bg-amber-600 sm:w-auto gap-2">
            {t("sigil.landing.start")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">
          {t("sigil.landing.consent")}
        </p>
      </section>
    </div>
  )
}
