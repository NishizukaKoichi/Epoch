"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EpochPrinciplesDialog } from "@/components/epoch-principles-dialog"
import { EpochSearchUser } from "@/components/epoch-search-user"
import { EpochLanguageSelector } from "@/components/epoch-language-selector"
import { EpochContextSwitcher } from "@/components/epoch-context-switcher"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"
import { User, Settings, Search, Bell, ChevronLeft, Shield } from "@/components/icons"
import { useRouter, usePathname } from "next/navigation"

// Mock data - 現在従事している組織（兼業・副業で複数可）
const mockCurrentOrganizations = [
  { id: "org_001", name: "株式会社テクノロジー", role: "エンジニア" },
  // 兼業の例: { id: "org_002", name: "副業株式会社", role: "アドバイザー" },
]
// 未所属の場合: const mockCurrentOrganizations = []

const mockCurrentOrganization = mockCurrentOrganizations[0]; // Declare mockCurrentOrganization variable

export function EpochHeader() {
  const [showPrinciples, setShowPrinciples] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [currentContext, setCurrentContext] = useState<"personal" | { orgId: string; orgName: string }>("personal")
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useI18n()
  const { isLoggedIn } = useAuth()

  const pendingScouts = 1

  // Always show back button for navigation consistency
  const showBackButton = true

  const handleBack = () => {
    router.back()
  }

  const handleContextSwitch = (context: "personal" | string) => {
    if (context === "personal") {
      setCurrentContext("personal")
      router.push("/")
    } else {
      const org = mockCurrentOrganizations.find((o) => o.id === context)
      if (org) {
        setCurrentContext({ orgId: org.id, orgName: org.name })
        router.push(`/org/${org.id}`)
      }
    }
  }

  const handleSelectUser = (userId: string) => {
    router.push(`/user/${userId}`)
  }

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="戻る"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <Link
              href="/"
              className="text-lg font-medium tracking-tight text-foreground hover:text-foreground/80 transition-colors"
            >
              Epoch
            </Link>

            <div className="h-6 w-px bg-border" />

            <EpochContextSwitcher
              currentContext={currentContext}
              currentOrganizations={mockCurrentOrganizations}
              onSwitch={handleContextSwitch}
            />

            <div className="h-6 w-px bg-border" />

            <button
              onClick={() => setShowPrinciples(true)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("header.principles")}
            </button>
            <Link href="/browse" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t("header.browse")}
            </Link>
            <Link href="/scout" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t("header.scout")}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mr-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              <span>{t("header.recording")}</span>
            </div>

            <EpochLanguageSelector />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Link href="/scout" className="relative">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                {pendingScouts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-amber-500 text-[10px] font-medium text-background flex items-center justify-center">
                    {pendingScouts}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            {isLoggedIn ? (
              <Link href="/talisman">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Shield className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/talisman/landing">
                <Button variant="outline" size="sm" className="text-sm bg-transparent">
                  {t("header.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <EpochPrinciplesDialog open={showPrinciples} onOpenChange={setShowPrinciples} />
      <EpochSearchUser open={showSearch} onOpenChange={setShowSearch} onSelectUser={handleSelectUser} />
    </>
  )
}
