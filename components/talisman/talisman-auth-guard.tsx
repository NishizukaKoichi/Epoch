"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, ArrowRight } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

interface TalismanAuthGuardProps {
  children: React.ReactNode
  serviceName: "Epoch" | "Sigil" | "Pact"
  serviceIcon: React.ReactNode
}

// Mock: 本来はTalisman APIで認証状態を確認
const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Demo: 常に認証済みとする（本番では実際の認証状態を確認）
      setIsAuthenticated(true)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  return { isAuthenticated, isLoading }
}

export function TalismanAuthGuard({
  children,
  serviceName,
  serviceIcon,
}: TalismanAuthGuardProps) {
  const router = useRouter()
  const { t } = useI18n()
  const { isAuthenticated, isLoading } = useAuthStatus()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-full bg-muted" />
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            {/* Service Icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {serviceIcon}
            </div>

            <h1 className="mb-2 text-xl font-semibold text-foreground">
              {serviceName}を利用するには認証が必要です
            </h1>

            <p className="mb-6 text-sm text-muted-foreground">
              Talismanで認証手段を登録し、ログインしてください。
              すべてのサービスに統一IDでアクセスできます。
            </p>

            {/* Talisman Badge */}
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Powered by Talisman</span>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full gap-2"
                onClick={() => router.push("/talisman/credentials/new")}
              >
                認証手段を登録する
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/talisman")}
              >
                Talismanにログイン
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              <Lock className="mr-1 inline h-3 w-3" />
              認証情報はTalismanで安全に管理されます
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
