"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function SiteFooter() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Links */}
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/site/library" className="hover:text-foreground transition-colors">
              {t("site.nav.library")}
            </Link>
            <Link href="/site/notes" className="hover:text-foreground transition-colors">
              {t("site.nav.notes")}
            </Link>
            <Link href="/site/about" className="hover:text-foreground transition-colors">
              {t("site.nav.about")}
            </Link>
            <Link href="/site/contact" className="hover:text-foreground transition-colors">
              {t("site.nav.contact")}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            {currentYear} Koichi Nishizuka
          </p>
        </div>
      </div>
    </footer>
  )
}
