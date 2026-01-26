"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Sparkles, LayoutDashboard, FolderOpen, Settings, ChevronLeft, Compass, Download, BarChart3, Shield } from "@/components/icons"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/sigil", icon: LayoutDashboard, labelKey: "sigil.dashboard" },
  { href: "/sigil/spaces", icon: FolderOpen, labelKey: "sigil.spaces" },
  { href: "/sigil/explore", icon: Compass, labelKey: "sigil.explore" },
  { href: "/sigil/adopted", icon: Download, labelKey: "sigil.adopted" },
  { href: "/sigil/analytics", icon: BarChart3, labelKey: "sigil.analytics" },
  { href: "/sigil/settings", icon: Settings, labelKey: "sigil.settings" },
]

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/sigil") {
    return pathname === "/sigil"
  }
  return pathname.startsWith(href)
}

export function SigilHeader() {
  const { t } = useI18n()
  const { isLoggedIn } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isLandingPage = pathname === "/sigil/landing"
  
  // Landing/Spec page doesn't need this header - GlobalNav is enough
  if (isLandingPage) {
    return null
  }

  const isHomePage = pathname === "/sigil"
  const showBackButton = !isHomePage

  const handleBack = () => {
    router.back()
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-4xl px-4">
        {/* Top bar */}
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Link href="/sigil/landing" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-foreground">{t("sigil.title")}</span>
            </Link>
          </div>
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

        {/* Navigation */}
        <nav className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isNavActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey as Parameters<typeof t>[0])}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
