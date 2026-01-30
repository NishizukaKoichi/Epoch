"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Shield, ChevronLeft, Copy, Check, AlertTriangle } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"
import { ensurePersonId } from "@/lib/talisman/client"

type CredentialDetail = {
  id: string
  type: string
  normalizedHash: string
  issuer: string
  issuedAt: string
  revokedAt: string | null
}

type Signal = {
  score: number
  flags: Record<string, boolean>
}

export default function CredentialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [credential, setCredential] = useState<CredentialDetail | null>(null)
  const [signal, setSignal] = useState<Signal | null>(null)
  const [personId, setPersonId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const credentialId = params.credentialId as string

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const id = await ensurePersonId()
        if (!active) return
        setPersonId(id)

        const [credRes, signalRes] = await Promise.all([
          fetch(`/api/v1/talisman/credentials?person_id=${encodeURIComponent(id)}`),
          fetch(`/api/v1/talisman/persons/${id}/signal`),
        ])

        if (!credRes.ok || !signalRes.ok) {
          const payload = await credRes.json().catch(() => null)
          throw new Error(payload?.error || "Credentialの取得に失敗しました")
        }

        const credJson = (await credRes.json()) as {
          credentials: Array<{
            credential_id: string
            type: string
            normalized_hash: string
            issuer: string
            issued_at: string
            revoked_at: string | null
          }>
        }
        const signalJson = (await signalRes.json()) as {
          score: number
          flags: Record<string, boolean>
        }

        const found = credJson.credentials.find((item) => item.credential_id === credentialId)
        if (!found) {
          throw new Error("Credentialが見つかりません")
        }

        if (!active) return
        setCredential({
          id: found.credential_id,
          type: found.type,
          normalizedHash: found.normalized_hash,
          issuer: found.issuer,
          issuedAt: found.issued_at,
          revokedAt: found.revoked_at,
        })
        setSignal({ score: signalJson.score, flags: signalJson.flags })
        setError(null)
      } catch (err) {
        if (!active) return
        const message = err instanceof Error ? err.message : "Credentialの取得に失敗しました"
        setError(message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [credentialId])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const status = credential?.revokedAt ? "revoked" : "active"
  const statusClass =
    status === "active"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-red-500/10 text-red-500 border-red-500/20"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Credential Detail</h1>
          <p className="text-sm text-muted-foreground">{credentialId}</p>
        </div>
        {credential && (
          <Badge className={statusClass}>
            {status === "active" ? "有効" : "失効"}
          </Badge>
        )}
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {t("common.loading")}
          </CardContent>
        </Card>
      ) : credential ? (
        <>
          {/* Credential Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Credential
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Normalized hash</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted px-3 py-2 rounded-md font-mono break-all">
                    {credential.normalizedHash}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(credential.normalizedHash)}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-medium">{t(`talisman.cred.${credential.type}`)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Issued</p>
                  <p className="text-sm font-medium">
                    {new Date(credential.issuedAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Issuer</p>
                  <p className="text-sm font-medium">{credential.issuer}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Person ID</p>
                  <p className="text-sm font-mono">{personId ?? "-"}</p>
                </div>
              </div>
              {credential.revokedAt && (
                <p className="text-xs text-destructive">
                  Revoked: {new Date(credential.revokedAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Signal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Signal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-light text-foreground">
                  {signal?.score ?? 0}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {signal &&
                      Object.entries(signal.flags).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}:{value ? "true" : "false"}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-amber-700">注意事項</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Credentialの撤回はスコアの再計算を引き起こします。撤回後は再登録が必要です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
