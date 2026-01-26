"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function EpochFooter() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-foreground">Epoch</span>
            <span className="text-xs text-muted-foreground">v1.0</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/landing" className="hover:text-foreground transition-colors">
              {t("footer.principles")}
            </Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">
              {t("settings.title")}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              プライバシー
            </Link>
            <Link href="/status" className="hover:text-foreground transition-colors">
              ステータス
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
        </div>

        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {t("principle.1.title")} / {t("principle.2.title")} / {t("principle.3.title")} / {t("principle.4.title")}
          </p>
        </div>
      </div>
    </footer>
  )
}
