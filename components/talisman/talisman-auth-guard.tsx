"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, ArrowRight } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { getStoredPersonId } from "@/lib/talisman/client"

interface TalismanAuthGuardProps {
  children: React.ReactNode
  serviceName: "Epoch" | "Sigil" | "Pact"
  serviceIcon: React.ReactNode
}

type CredentialSummary = {
  credential_id: string
  revoked_at: string | null
}

const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const personId = getStoredPersonId()
        if (!personId) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/v1/talisman/credentials?person_id=${personId}`)
        if (!response.ok) {
          throw new Error("認証状態の取得に失敗しました")
        }
        const data = (await response.json()) as { credentials: CredentialSummary[] }
        const hasActiveCredential = data.credentials.some(
          (credential) => !credential.revoked_at
        )
        setIsAuthenticated(hasActiveCredential)
        setIsLoading(false)
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : "認証状態の取得に失敗しました"
        setError(message)
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  return { isAuthenticated, isLoading, error }
}

export function TalismanAuthGuard({
  children,
  serviceName,
  serviceIcon,
}: TalismanAuthGuardProps) {
  const router = useRouter()
  const { t } = useI18n()
  const { isAuthenticated, isLoading, error } = useAuthStatus()

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

            {error && (
              <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

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
