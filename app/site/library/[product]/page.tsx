"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, ExternalLink } from "@/components/icons"
import { useI18n } from "@/lib/i18n/context"
import { StatusBadge } from "@/components/site/status-badge"

// Product data with detailed information
const productData: Record<string, {
  nameKey: string
  definitionKey: string
  status: "draft" | "final" | "deprecated"
  nonGoals: string[]
  artifacts: {
    spec?: string
    value?: string
    mvp?: string
    flows?: string
    done?: string
  }
  integrationStance: string
}> = {
  sigil: {
    nameKey: "product.sigil.name",
    definitionKey: "product.sigil.definition",
    status: "final",
    nonGoals: [
      "人の内面（動機、価値観、感情）は扱わない",
      "教育・育成・評価は行わない",
      "感情的配慮は術式外に置かれる",
    ],
    artifacts: {
      spec: "/sigil/landing",
      mvp: "/sigil",
    },
    integrationStance: "Epochと組み合わせることで、術式の変更履歴を不可逆に記録できる。Talismanと組み合わせることで、術式を読了した人格を観測できる。",
  },
  epoch: {
    nameKey: "product.epoch.name",
    definitionKey: "product.epoch.definition",
    status: "final",
    nonGoals: [
      "事実の評価や解釈を行わない",
      "記録の要約や最適化を行わない",
      "ユーザーの行動を推薦しない",
    ],
    artifacts: {
      spec: "/landing",
      value: "/site/library/epoch/value",
      mvp: "/site/library/epoch/mvp",
      flows: "/site/library/epoch/flows",
      done: "/site/library/epoch/done",
    },
    integrationStance: "Sigilから識別子を受け取り、その変化を時間の層として記録できる。Pactの契約状態遷移を不可逆な履歴として保存できる。",
  },
  talisman: {
    nameKey: "product.talisman.name",
    definitionKey: "product.talisman.definition",
    status: "final",
    nonGoals: [
      "判断・制裁・推奨・結論は行わない",
      "Credentialに強弱や優劣をつけない",
      "scoreを信用指標として扱わない",
      "行動データの解析は行わない",
    ],
    artifacts: {
      spec: "/talisman/landing",
      mvp: "/talisman",
    },
    integrationStance: "Sigilから識別子を受け取り、その人格に紐づくCredentialを観測できる。Epochの記録をCredentialの根拠として参照できる。",
  },
  pact: {
    nameKey: "product.pact.name",
    definitionKey: "product.pact.definition",
    status: "final",
    nonGoals: [
      "人格評価を行わない",
      "感情的表現を保存しない",
      "基準を事後的に変更しない",
      "昇給や解雇を裁量判断にしない",
    ],
    artifacts: {
      spec: "/pact/landing",
      mvp: "/pact",
    },
    integrationStance: "Epochと組み合わせることで、契約状態の遷移を不可逆な履歴として記録できる。Sigilと組み合わせることで、役割定義を事前に開示できる。",
  },
}

export default function LibraryDetailPage() {
  const params = useParams()
  const product = params.product as string
  const { t } = useI18n()
  
  const data = productData[product]
  
  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-muted-foreground">Product not found</p>
        <Link href="/site/library" className="text-sm text-foreground hover:underline mt-4 inline-block">
          Back to Library
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Back link */}
      <Link 
        href="/site/library"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        Library
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <h1 className="text-2xl font-medium text-foreground">
          {t(data.nameKey as Parameters<typeof t>[0])}
        </h1>
        <StatusBadge status={data.status} size="md" />
      </div>

      {/* Definition */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {t("site.detail.definition")}
        </h2>
        <p className="text-foreground leading-relaxed">
          {t(data.definitionKey as Parameters<typeof t>[0])}
        </p>
      </section>

      {/* Non-Goals */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {t("site.detail.non_goals")}
        </h2>
        <ul className="space-y-2">
          {data.nonGoals.map((goal, index) => (
            <li key={index} className="text-sm text-foreground/80 flex items-start gap-2">
              <span className="text-muted-foreground">・</span>
              {goal}
            </li>
          ))}
        </ul>
      </section>

      {/* Artifacts */}
      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {t("site.detail.artifacts")}
        </h2>
        <div className="flex flex-wrap gap-4">
          {data.artifacts.spec && (
            <Link
              href={data.artifacts.spec}
              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80 transition-colors border border-border px-4 py-2 hover:border-foreground/30"
            >
              Spec
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
          {data.artifacts.value && (
            <Link
              href={data.artifacts.value}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 hover:border-foreground/30"
            >
              Value
            </Link>
          )}
          {data.artifacts.mvp && (
            <Link
              href={data.artifacts.mvp}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 hover:border-foreground/30"
            >
              MVP
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
          {data.artifacts.flows && (
            <Link
              href={data.artifacts.flows}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 hover:border-foreground/30"
            >
              Flows
            </Link>
          )}
          {data.artifacts.done && (
            <Link
              href={data.artifacts.done}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 hover:border-foreground/30"
            >
              Done
            </Link>
          )}
        </div>
      </section>

      {/* Integration Stance */}
      <section className="mb-12 border-t border-border pt-12">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {t("site.detail.integration")}
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {data.integrationStance}
        </p>
      </section>
    </div>
  )
}
