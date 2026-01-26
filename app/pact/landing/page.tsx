"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, TrendingUp, Minus, AlertTriangle, AlertCircle, LogOut, Database, Cpu, FileOutput, ChevronLeft } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

const principles = [
  { key: "pact.principle.1" },
  { key: "pact.principle.2" },
  { key: "pact.principle.3" },
  { key: "pact.principle.4" },
  { key: "pact.principle.5" },
  { key: "pact.principle.6" },
]

const states = [
  { key: "pact.state.growth", icon: TrendingUp, color: "text-green-500" },
  { key: "pact.state.stable", icon: Minus, color: "text-blue-500" },
  { key: "pact.state.warning", icon: AlertTriangle, color: "text-yellow-500" },
  { key: "pact.state.critical", icon: AlertCircle, color: "text-orange-500" },
  { key: "pact.state.exit", icon: LogOut, color: "text-red-500" },
]

const layers = [
  { 
    titleKey: "pact.ledger", 
    descKey: "pact.ledger.desc", 
    icon: Database,
  },
  { 
    titleKey: "pact.threshold", 
    descKey: "pact.threshold.desc", 
    icon: Cpu,
  },
  { 
    titleKey: "pact.output", 
    descKey: "pact.output.desc", 
    icon: FileOutput,
  },
]

export default function PactLandingPage() {
  const { t } = useI18n()
  const router = useRouter()

  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="flex items-center justify-between -mx-4 px-4 py-3 border-b border-border -mt-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">Pact</span>
        </div>
        <Link href="/talisman">
          <Button variant="outline" size="sm" className="bg-transparent">
            {t("landing.login")}
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {t("pact.landing.title")}
        </h1>
        <p className="text-lg text-violet-500 mb-2">
          {t("pact.landing.subtitle")}
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          {t("pact.landing.desc")}
        </p>
        <Link href="/talisman">
          <Button className="bg-violet-500 hover:bg-violet-600 text-white gap-2">
            {t("pact.landing.start")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Core Concept */}
      <section>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          基本思想
        </h2>
        <Card className="border-violet-500/20">
          <CardContent className="pt-6">
            <p className="text-foreground leading-relaxed">
              給料が上がることと、雇用が終了することは、同一のロジック上に存在する状態遷移である。
            </p>
            <p className="text-muted-foreground mt-4 text-sm">
              条件を上回れば、報酬レンジが上がる。条件を満たせば、役割が維持される。条件を下回り続ければ、契約が終了する。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* State Transitions */}
      <section>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          状態遷移
        </h2>
        <div className="flex flex-wrap gap-3">
          {states.map((state) => {
            const Icon = state.icon
            return (
              <div
                key={state.key}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-card"
              >
                <Icon className={`h-4 w-4 ${state.color}`} />
                <span className="text-sm text-foreground">
                  {t(state.key as Parameters<typeof t>[0])}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Three Layers */}
      <section>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          システム構成
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {layers.map((layer) => {
            const Icon = layer.icon
            return (
              <Card key={layer.titleKey}>
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-violet-500 mb-4" />
                  <h3 className="font-medium text-foreground mb-2">
                    {t(layer.titleKey as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(layer.descKey as Parameters<typeof t>[0])}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Principles */}
      <section>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          絶対原則
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map((principle, index) => (
            <div
              key={principle.key}
              className="flex items-start gap-3 p-4 rounded-md border border-border"
            >
              <span className="text-xs text-muted-foreground font-mono mt-0.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-foreground">
                {t(principle.key as Parameters<typeof t>[0])}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Target Users */}
      <section className="border-t border-border pt-12">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          利用対象
        </h2>
        <ul className="space-y-2 text-sm text-foreground/80">
          <li className="flex items-start gap-2">
            <span className="text-muted-foreground">・</span>
            アメリカ企業の中間管理職
          </li>
          <li className="flex items-start gap-2">
            <span className="text-muted-foreground">・</span>
            HR部門
          </li>
          <li className="flex items-start gap-2">
            <span className="text-muted-foreground">・</span>
            法務部門
          </li>
          <li className="flex items-start gap-2">
            <span className="text-muted-foreground">・</span>
            報酬および雇用判断の説明責任を負うすべての立場
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          被雇用者本人は、自身に関するデータと最終レポートへの閲覧権を持つ。
        </p>
      </section>
    </div>
  )
}
