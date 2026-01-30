"use client"

import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EpochLegalPageProps {
  type: "terms" | "privacy"
}

export function EpochLegalPage({ type }: EpochLegalPageProps) {
  const isTerms = type === "terms"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link href="/epoch" className="text-lg font-medium tracking-tight text-foreground">
            Epoch
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
            <Link href="/epoch/terms" className="hover:text-foreground transition-colors">
              利用規約
            </Link>
            <span>|</span>
            <Link href="/epoch/privacy" className="hover:text-foreground transition-colors">
              プライバシーポリシー
            </Link>
            <span>|</span>
            <Link href="/epoch/status" className="hover:text-foreground transition-colors">
              サービス状態
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
            Epoch（以下「本サービス」）は、ユーザーの判断と行動を時系列で不可逆に記録するサービスです。
            本サービスは以下の原則に基づいて運営されます：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>確定したRecordは削除・編集できません</li>
            <li>本サービスはユーザーのRecordを評価・要約・最適化しません</li>
            <li>AIによる自動生成、推薦、ランキングは提供されません</li>
            <li>運営者の操作もユーザーと同一形式で監査ログに記録されます</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">2. 不可逆性の理解</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            本サービスを利用することにより、ユーザーは以下を理解し同意したものとみなされます：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>一度確定したRecordは、いかなる理由があっても削除・編集できません</li>
            <li>誤って記録した内容は、改訂（Revision）Recordとして追記することのみ可能です</li>
            <li>可視性の変更は新しいRecordとして記録され、過去の可視性設定も履歴として残ります</li>
            <li>アカウントを削除しても、Recordデータは保持されます（ユーザー識別情報のみ削除）</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">3. 課金と返金</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            他人のEpochを閲覧する際に課金が発生します。課金は以下の形式で行われます：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Time Window: 特定期間のRecordへのアクセス権</li>
            <li>Read Session: 一定時間の全Recordへのアクセス権</li>
          </ul>
          <p>
            課金は情報の「量」ではなく「不確実性の除去」に対する対価です。
            Record単体での課金は行われません。
          </p>
          <p>
            技術的障害により閲覧できなかった時間については、セッション期間の延長で対応します。
            返金は原則として行われません。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">4. 禁止事項</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <ul className="list-disc pl-6 space-y-2">
            <li>虚偽の情報を意図的に記録する行為</li>
            <li>他者になりすましてRecordを作成する行為</li>
            <li>本サービスの技術的制限を回避しようとする行為</li>
            <li>他者のRecordを無断で複製・配布する行為</li>
            <li>本サービスを利用した詐欺・ハラスメント行為</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">5. サービス終了時の対応</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            本サービスが終了する場合、以下の対応を行います：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>終了の最低6ヶ月前に告知します</li>
            <li>全ユーザーに対して、自身のEpochデータを検証可能な形式（JSON + hash chain）でエクスポートする機能を提供します</li>
            <li>エクスポートされたデータは、第三者による検証が可能な形式で提供されます</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">6. 免責事項</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            本サービスは「現状有姿」で提供されます。以下について、当社は責任を負いません：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ユーザーが記録した内容の正確性・真実性</li>
            <li>Recordに基づいて行われた第三者の判断・行動</li>
            <li>技術的障害によるサービスの一時的な利用不能</li>
            <li>ユーザー間のスカウト・取引に関する紛争</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">7. 準拠法と管轄</h2>
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
          <h3 className="text-foreground font-medium mt-4">アカウント情報</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>認証情報（Passkey公開鍵、メールアドレス）</li>
            <li>表層データ（表示名、アバター、自己紹介）- これらは履歴を持ちません</li>
          </ul>

          <h3 className="text-foreground font-medium mt-4">Recordデータ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>ユーザーが作成したRecord（テキスト、添付ファイル）</li>
            <li>タイムスタンプ、hash chain情報</li>
            <li>可視性設定の履歴</li>
          </ul>

          <h3 className="text-foreground font-medium mt-4">監査ログ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>ログイン/ログアウト履歴</li>
            <li>Record作成/閲覧履歴</li>
            <li>課金セッション履歴</li>
            <li>運営者の操作履歴</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">2. 情報の利用目的</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>収集した情報は以下の目的でのみ使用されます：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>サービスの提供と運営</li>
            <li>ユーザー認証とセキュリティ維持</li>
            <li>課金処理</li>
            <li>法的要請への対応</li>
          </ul>
          <p className="font-medium text-foreground mt-4">
            重要: 本サービスはユーザーのRecordを分析・プロファイリング・広告ターゲティングに使用しません。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">3. 情報の共有</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>ユーザーの情報は以下の場合にのみ共有されます：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ユーザーが「公開」または「スカウト公開」に設定したRecord</li>
            <li>法的要請に基づく開示（裁判所命令など）- この場合、監査ログに記録されます</li>
            <li>サービス運営に必要な外部サービス（決済処理など）- 最小限の情報のみ</li>
          </ul>
          <p>
            第三者への情報販売、広告目的での共有は一切行いません。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">4. データの保持</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            Recordデータは不可逆に保存され、原則として削除されません。
            これは本サービスの中核的な価値提案です。
          </p>
          <p>
            アカウント削除を要求した場合：
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ユーザー識別情報（表示名、メールアドレスなど）は削除されます</li>
            <li>Recordデータは匿名化された状態で保持されます</li>
            <li>削除処理自体も監査ログに記録されます</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">5. セキュリティ</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>ユーザーのデータを保護するために以下の措置を講じています：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>通信の暗号化（TLS）</li>
            <li>データベースの暗号化</li>
            <li>Passkey（WebAuthn）による強力な認証</li>
            <li>運営者アクセスの監査ログ記録</li>
            <li>定期的なセキュリティ監査</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">6. ユーザーの権利</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>ユーザーは以下の権利を有します：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>自身のRecordデータへのアクセス</li>
            <li>自身のRecordデータのエクスポート（検証可能な形式）</li>
            <li>表層データ（表示名、アバターなど）の変更</li>
            <li>アカウント識別情報の削除要求</li>
            <li>監査ログの閲覧</li>
          </ul>
          <p className="mt-4">
            ただし、確定済みRecordの削除・編集はサービスの性質上、認められません。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">7. Cookie</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            本サービスはセッション管理のために必要最小限のCookieを使用します。
            トラッキング目的のCookie、第三者Cookieは使用しません。
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">8. お問い合わせ</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            プライバシーに関するお問い合わせは、以下までご連絡ください：
          </p>
          <p className="font-mono">privacy@epoch.example.com</p>
        </div>
      </section>
    </div>
  )
}
