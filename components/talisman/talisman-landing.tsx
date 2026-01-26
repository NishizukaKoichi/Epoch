"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, ArrowRight, Eye, Hash, ToggleLeft, Database, RefreshCw, Users, ChevronLeft, Key, Fingerprint, Mail, Phone, Globe } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

const principles = [
  { icon: Eye, titleKey: "talisman.principle.1.title", descKey: "talisman.principle.1.desc" },
  { icon: Hash, titleKey: "talisman.principle.2.title", descKey: "talisman.principle.2.desc" },
  { icon: ToggleLeft, titleKey: "talisman.principle.3.title", descKey: "talisman.principle.3.desc" },
  { icon: Database, titleKey: "talisman.principle.4.title", descKey: "talisman.principle.4.desc" },
  { icon: RefreshCw, titleKey: "talisman.principle.5.title", descKey: "talisman.principle.5.desc" },
  { icon: Users, titleKey: "talisman.principle.6.title", descKey: "talisman.principle.6.desc" },
]

const credentialTypes = [
  { icon: Fingerprint, label: "Passkey / WebAuthn", desc: "最も安全な認証方式" },
  { icon: Mail, label: "Email", desc: "メールアドレスで認証" },
  { icon: Phone, label: "Phone", desc: "電話番号で認証" },
  { icon: Globe, label: "OAuth", desc: "Google, GitHub等" },
  { icon: Key, label: "Recovery Key", desc: "バックアップ用" },
]

export function TalismanLanding() {
  const { t } = useI18n()
  const router = useRouter()

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
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="font-semibold text-foreground">{t("talisman.title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/talisman/login">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent"
              >
                {t("talisman.landing.login_btn")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
            {t("talisman.subtitle")}
          </p>
          <h1 className="mb-8 text-4xl font-light tracking-tight text-foreground md:text-5xl text-balance">
            {t("talisman.landing.headline")}
          </h1>
          <div className="mx-auto max-w-2xl space-y-2 text-muted-foreground">
            <p>{t("talisman.landing.desc1")}</p>
            <p>{t("talisman.landing.desc2")}</p>
            <p>{t("talisman.landing.desc3")}</p>
          </div>
        </div>
      </section>

      {/* Score Example */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Observation Output Example
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Score */}
              <div className="rounded border border-border bg-muted/30 p-4">
                <div className="mb-2 text-xs text-muted-foreground font-mono">score</div>
                <div className="text-4xl font-light text-foreground">3</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  = count(valid Credentials)
                </p>
              </div>
              {/* Flags */}
              <div className="rounded border border-border bg-muted/30 p-4">
                <div className="mb-2 text-xs text-muted-foreground font-mono">flags</div>
                <div className="space-y-1 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-talisman-primary">true</span>
                    <span className="text-muted-foreground">has_email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">false</span>
                    <span className="text-muted-foreground">has_phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-talisman-primary">true</span>
                    <span className="text-muted-foreground">has_oauth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-talisman-primary">true</span>
                    <span className="text-muted-foreground">has_passkey</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              * score is not a trust indicator. flags contain no evaluative meaning.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-xl font-medium text-foreground">
            {t("landing.principles_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-talisman-primary" />
                    <h3 className="font-medium text-foreground">
                      {t(principle.titleKey)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(principle.descKey)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-xl font-medium text-foreground">
            Architecture
          </h2>
          <div className="rounded-lg border border-border bg-card p-6 font-mono text-sm">
            <pre className="overflow-x-auto text-muted-foreground">
{`[ Client / Product ]
        ↓
[ Talisman API Layer ]    ← stateless, JSON over HTTPS
        ↓
[ Core Resolution Layer ] ← normalize, resolve, calculate
        ↓
[ Event Store + View ]    ← append-only, materialized`}
            </pre>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-xl font-medium text-foreground">
            {t("talisman.landing.how_it_works")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mb-1 font-medium text-foreground">{t("talisman.landing.step1_title")}</h3>
              <p className="text-sm text-muted-foreground">{t("talisman.landing.step1_desc")}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mb-1 font-medium text-foreground">{t("talisman.landing.step2_title")}</h3>
              <p className="text-sm text-muted-foreground">{t("talisman.landing.step2_desc")}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mb-1 font-medium text-foreground">{t("talisman.landing.step3_title")}</h3>
              <p className="text-sm text-muted-foreground">{t("talisman.landing.step3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Credentials */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-xl font-medium text-foreground">
            {t("talisman.landing.supported_credentials")}
          </h2>
          <div className="grid gap-3 md:grid-cols-5">
            {credentialTypes.map((cred, index) => {
              const Icon = cred.icon
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-3 text-center"
                >
                  <Icon className="mx-auto mb-2 h-6 w-6 text-talisman-primary" />
                  <p className="text-sm font-medium text-foreground">{cred.label}</p>
                  <p className="text-xs text-muted-foreground">{cred.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-6 text-muted-foreground">
            {t("talisman.landing.cta_desc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/talisman/credentials/new">
              <Button
                size="lg"
                className="gap-2"
              >
                {t("talisman.landing.start")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/talisman/login">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent"
              >
                {t("talisman.landing.login_btn")}
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("talisman.landing.consent")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <Link href="/talisman/terms" className="hover:text-foreground transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="/talisman/privacy" className="hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
            </div>
            <span>Talisman observes. It does not judge.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
