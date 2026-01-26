"use client"

import Link from "next/link"
import { ArrowLeft } from "@/components/icons"

export default function EpochValuePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Back link */}
      <Link 
        href="/site/library/epoch"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        Epoch
      </Link>

      <h1 className="text-2xl font-medium text-foreground mb-8">
        Epoch Value
      </h1>

      <article className="space-y-8 text-sm text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            なぜEpochが存在するのか
          </h2>
          <p>
            多くのシステムは「便利さ」を追求する。
            より速く、より簡単に、より最適化されたものを提供しようとする。
          </p>
          <p className="mt-3">
            Epochは、その方向に進まない。
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            不可逆性の価値
          </h2>
          <p>
            事実は消えない。時間は戻らない。
          </p>
          <p className="mt-3">
            この当たり前のことを、デジタルの世界では簡単に破ってしまう。
            削除も編集も自由自在。都合の悪い過去は「なかったこと」にできる。
          </p>
          <p className="mt-3">
            Epochは、この「都合の良さ」を排除する。
            一度記録された事実は、永久に残る。
            それが、記録の信頼性の源泉となる。
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            評価しないという選択
          </h2>
          <p>
            Epochは事実を記録するが、評価しない。
            良いとも悪いとも言わない。スコアをつけない。要約もしない。
          </p>
          <p className="mt-3">
            事実の意味は、時間が明らかにする。
            または、読む人が自分で判断する。
          </p>
          <p className="mt-3">
            システムが「あなたにとって重要なのはこれです」と決めつけることを、
            Epochは行わない。
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            沈黙も履歴
          </h2>
          <p>
            何も記録しなかった期間も、Epochでは履歴として残る。
            空白は「何もなかった」ではなく「記録しなかった」という事実。
          </p>
          <p className="mt-3">
            この設計により、「書かなかったこと」自体が情報になる。
            沈黙は欠損ではなく、状態の一つとして扱われる。
          </p>
        </section>
      </article>

      {/* Links */}
      <div className="mt-16 pt-8 border-t border-border flex gap-6">
        <Link
          href="/landing"
          className="text-sm text-foreground hover:text-foreground/80 transition-colors"
        >
          Spec を見る
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          MVP を試す
        </Link>
      </div>
    </div>
  )
}
