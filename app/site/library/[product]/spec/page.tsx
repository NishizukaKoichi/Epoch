"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "@/components/icons"
import { SpecViewer } from "@/components/site/spec-viewer"
import { StatusBadge } from "@/components/site/status-badge"
import { use } from "react"

// Spec data for each product
const specData: Record<string, {
  title: string
  status: "draft" | "final" | "deprecated"
  sections: {
    id: string
    title: string
    level: number
    content: string
  }[]
}> = {
  sigil: {
    title: "Sigil Specification",
    status: "draft",
    sections: [
      {
        id: "purpose",
        title: "1. 目的",
        level: 1,
        content: `Sigilは、状態変化を許された識別子を扱うシステムである。

識別子とは、人や組織、物を一意に特定するための記号や番号を指す。
多くのシステムでは、識別子は不変であることが前提とされている。

しかし、現実の識別子は変化する。
・名前は変わりうる
・所属は移りうる
・役職は上下しうる

Sigilはこの「変化を許す」ことを設計の中心に置く。`,
      },
      {
        id: "scope",
        title: "2. スコープ",
        level: 1,
        content: `2.1 扱うもの
・識別子の現在の状態
・識別子の変更操作
・識別子の検証

2.2 扱わないもの
・識別子の変更履歴（→ Epochで扱う）
・識別子に紐づく信頼の証明（→ Talismanで扱う）
・識別子間の契約関係（→ Pactで扱う）`,
      },
      {
        id: "principles",
        title: "3. 原則",
        level: 1,
        content: `3.1 変化は許可される
識別子は、適切な権限と手続きを経て変更できる。

3.2 現在の状態のみを保持する
Sigilは「今の状態」だけを扱う。過去の状態は保持しない。

3.3 検証は常に可能
識別子が有効かどうかは、常に検証できる。`,
      },
    ],
  },
  talisman: {
    title: "Talisman Specification",
    status: "draft",
    sections: [
      {
        id: "purpose",
        title: "1. 目的",
        level: 1,
        content: `Talismanは、信頼の証明を持ち運び可能にするシステムである。

信頼は本来、関係性の中に存在する。
しかし、その信頼を別の場所で使いたい場合がある。

Talismanは、ある文脈で得られた信頼を
別の文脈に持ち運ぶための「お守り」を提供する。`,
      },
      {
        id: "scope",
        title: "2. スコープ",
        level: 1,
        content: `2.1 扱うもの
・信頼の証明の発行
・証明の携帯
・証明の提示

2.2 扱わないもの
・証明の長期保管（証明は短命）
・信頼の履歴（→ Epochで扱う）
・信頼の評価やスコアリング`,
      },
      {
        id: "principles",
        title: "3. 原則",
        level: 1,
        content: `3.1 証明は短命である
Talismanの証明には有効期限がある。永続的な証明は発行しない。

3.2 携帯可能性が優先される
軽量で、どこでも提示できることを優先する。

3.3 評価を行わない
証明の内容について、Talismanは評価しない。`,
      },
    ],
  },
  pact: {
    title: "Pact Specification",
    status: "draft",
    sections: [
      {
        id: "purpose",
        title: "1. 目的",
        level: 1,
        content: `Pactは、契約と約束の状態遷移を扱うシステムである。

契約は静的なものではない。
提案され、合意され、履行され、完了する。
または、破棄される。

Pactはこの「状態の遷移」を管理する。`,
      },
      {
        id: "scope",
        title: "2. スコープ",
        level: 1,
        content: `2.1 扱うもの
・契約の状態（提案、合意、履行中、完了、破棄）
・状態遷移のルール
・当事者の識別

2.2 扱わないもの
・契約内容の評価
・契約の推薦や最適化
・法的効力の保証
・状態遷移の履歴（→ Epochで扱う）`,
      },
      {
        id: "principles",
        title: "3. 原則",
        level: 1,
        content: `3.1 状態は有限である
契約が取りうる状態は、事前に定義された有限のものに限る。

3.2 遷移は明示的である
状態の変化は、明示的な操作によってのみ発生する。

3.3 評価を行わない
契約の良し悪しについて、Pactは判断しない。`,
      },
    ],
  },
}

export default function SpecPage() {
  const params = useParams()
  const product = params.product as string
  
  const spec = specData[product]
  
  if (!spec) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-muted-foreground">Specification not found</p>
        <Link href={`/site/library/${product}`} className="text-sm text-foreground hover:underline mt-4 inline-block">
          Back to Library Detail
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Back link */}
      <Link 
        href={`/site/library/${product}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        {product.charAt(0).toUpperCase() + product.slice(1)}
      </Link>

      {/* Status */}
      <div className="mb-8">
        <StatusBadge status={spec.status} size="md" />
      </div>

      {/* Spec Viewer */}
      <SpecViewer title={spec.title} sections={spec.sections} />
    </div>
  )
}
