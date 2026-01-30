"use client"

import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SpellLegalPageProps {
  type: "terms" | "privacy"
}

export function SpellLegalPage({ type }: SpellLegalPageProps) {
  const isTerms = type === "terms"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link href="/spell" className="text-lg font-medium tracking-tight text-foreground">
            Spell
          </Link>
          <span className="ml-2 text-muted-foreground">
            / {isTerms ? "利用規約" : "プライバシーポリシー"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-medium text-foreground mb-2">
          {isTerms ? "利用規約" : "プライバシーポリシー"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">最終更新日: 2024年1月15日</p>

        <ScrollArea className="h-auto">
          {isTerms ? <TermsContent /> : <PrivacyContent />}
        </ScrollArea>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/spell/terms" className="hover:text-foreground transition-colors">
              利用規約
            </Link>
            <span>|</span>
            <Link href="/spell/privacy" className="hover:text-foreground transition-colors">
              プライバシーポリシー
            </Link>
            <span>|</span>
            <Link href="/spell" className="hover:text-foreground transition-colors">
              Spell
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function TermsContent() {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">1. サービスの性質</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            Spell（以下「本サービス」）は、実行可否の判定と配布制御を提供するサービスです。
            本サービスは以下の原則に基づいて運営されます：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Entitlement が唯一の真実点です</li>
            <li>処理内容・価格・実行結果は扱いません</li>
            <li>実行可否は Yes / No のみを返します</li>
            <li>Webhook による決済確定のみを信頼します</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">2. 実行と責任の分離</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            本サービスは実行を行いません。実行は第三者の環境において行われます。
            本サービスは次の責任を負いません：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>処理内容の正確性、合法性、安全性</li>
            <li>実行結果の保証</li>
            <li>第三者環境の障害による影響</li>
            <li>価格設定や契約条件の妥当性</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">3. Entitlement と停止</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            Entitlement は実行可否を決定する唯一の情報です。
            未払い、不正利用、契約終了などの理由により Entitlement が失効した場合、
            本サービスは実行を拒否します。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">4. 禁止事項</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <ul className="list-disc pl-6 space-y-2">
            <li>本サービスの判定を回避する実行経路の構築</li>
            <li>不正な Entitlement の取得・利用</li>
            <li>本サービスの稼働を妨げる行為</li>
            <li>他者の識別子を無断で利用する行為</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">5. 免責事項</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            本サービスは「現状有姿」で提供されます。以下について責任を負いません：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>第三者による実行内容の損害</li>
            <li>Webhook や外部決済の障害</li>
            <li>通信障害による一時的な利用不能</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">6. 準拠法と管轄</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            本規約は日本法に準拠し、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </div>
      </section>
    </div>
  )
}

function PrivacyContent() {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">1. 収集する情報</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>本サービスは以下の情報を収集します：</p>
          <h3 className="text-foreground font-medium mt-4">開発者情報</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Developer Key の識別子</li>
            <li>アクセス権限（スコープ）</li>
          </ul>

          <h3 className="text-foreground font-medium mt-4">判定ログ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>scope_check の実行記録</li>
            <li>runtime_id、spell_id、user_identifier</li>
          </ul>

          <h3 className="text-foreground font-medium mt-4">監査ログ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Entitlement の付与・剥奪の記録</li>
            <li>Webhook 処理結果の記録</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">2. 情報の利用目的</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <ul className="list-disc pl-6 space-y-2">
            <li>実行可否の判定</li>
            <li>監査と不整合の検出</li>
            <li>不正利用の防止</li>
            <li>サービス品質の維持</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">3. 情報の保存期間</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            監査と説明責任のため、判定ログおよび監査ログは合理的な期間保存されます。
            保存期間の変更がある場合は事前に告知します。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">4. 第三者提供</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            法令に基づく場合を除き、本人の同意なく第三者に提供しません。
          </p>
        </div>
      </section>
    </div>
  )
}
