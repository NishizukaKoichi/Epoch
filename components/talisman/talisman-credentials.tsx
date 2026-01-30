"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, Phone, Chrome, Apple, Plus, Key, CreditCard, X as XIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n/context"
import { ensurePersonId } from "@/lib/talisman/client"

const credentialTypes = [
  { type: "email_magiclink", icon: Mail, available: true },
  { type: "phone_otp", icon: Phone, available: true },
  { type: "oauth_google", icon: Chrome, available: true },
  { type: "oauth_apple", icon: Apple, available: true },
  { type: "oauth_microsoft", icon: XIcon, available: true },
  { type: "oauth_x", icon: XIcon, available: true },
  { type: "passkey", icon: Key, available: true },
  { type: "payment_card", icon: CreditCard, available: true },
]

type CredentialType = (typeof credentialTypes)[number]["type"]

type CredentialItem = {
  id: string
  type: CredentialType
  normalizedHash: string
  issuedAt: string
  revokedAt: string | null
  issuer: string
}

export function TalismanCredentials() {
  const { t } = useI18n()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedCredential, setSelectedCredential] = useState<CredentialItem | null>(null)
  const [personId, setPersonId] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<CredentialItem[]>([])
  const [selectedType, setSelectedType] = useState<CredentialType | null>(null)
  const [rawValue, setRawValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const issuer = "talisman-ui"

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  const getIcon = (type: string) => {
    const found = credentialTypes.find(c => c.type === type)
    return found?.icon || Key
  }

  const activeCount = credentials.filter(c => !c.revokedAt).length
  const revokedCount = credentials.filter(c => c.revokedAt).length
  const totalCount = credentials.length
  const addPlaceholder = useMemo(() => {
    switch (selectedType) {
      case "email_magiclink":
        return "you@example.com"
      case "phone_otp":
        return "+81 90 0000 0000"
      case "oauth_google":
      case "oauth_apple":
      case "oauth_microsoft":
      case "oauth_x":
        return "provider_user_id"
      case "passkey":
        return "passkey_credential_id"
      case "payment_card":
        return "network:last4:fingerprint"
      default:
        return "value"
    }
  }, [selectedType])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const id = await ensurePersonId()
        if (!active) return
        setPersonId(id)

        const response = await fetch(`/api/v1/talisman/credentials?person_id=${encodeURIComponent(id)}`)
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || "Credentialの取得に失敗しました")
        }
        const data = (await response.json()) as {
          credentials: Array<{
            credential_id: string
            type: CredentialType
            normalized_hash: string
            issuer: string
            issued_at: string
            revoked_at: string | null
          }>
        }
        if (!active) return
        setCredentials(
          data.credentials.map((cred) => ({
            id: cred.credential_id,
            type: cred.type,
            normalizedHash: cred.normalized_hash,
            issuer: cred.issuer,
            issuedAt: cred.issued_at,
            revokedAt: cred.revoked_at,
          }))
        )
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
  }, [])

  useEffect(() => {
    if (!addDialogOpen) {
      setSelectedType(null)
      setRawValue("")
    }
  }, [addDialogOpen])

  const handleAddCredential = async () => {
    if (!personId || !selectedType || !rawValue.trim()) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/v1/talisman/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_id: personId,
          type: selectedType,
          raw_value: rawValue.trim(),
          issuer,
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "Credentialの追加に失敗しました")
      }
      const data = (await response.json()) as {
        credential_id: string
        type: CredentialType
        normalized_hash: string
        issuer: string
        issued_at: string
        revoked_at: string | null
      }
      const newCredential: CredentialItem = {
        id: data.credential_id,
        type: data.type,
        normalizedHash: data.normalized_hash,
        issuer: data.issuer,
        issuedAt: data.issued_at,
        revokedAt: data.revoked_at,
      }
      setCredentials((prev) => [newCredential, ...prev])
      setAddDialogOpen(false)
      setSelectedType(null)
      setRawValue("")
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Credentialの追加に失敗しました"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRevoke = async (credential: CredentialItem) => {
    setRevokingId(credential.id)
    try {
      const response = await fetch("/api/v1/talisman/credentials/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential_id: credential.id,
          actor: "user",
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "Credentialの撤回に失敗しました")
      }
      const revokedAt = new Date().toISOString()
      setCredentials((prev) =>
        prev.map((item) => (item.id === credential.id ? { ...item, revokedAt } : item))
      )
      setRevokeDialogOpen(false)
      setSelectedCredential(null)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Credentialの撤回に失敗しました"
      setError(message)
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-light text-foreground">{totalCount}</div>
            <p className="text-sm text-muted-foreground">Total Credentials</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-light text-talisman-primary">{activeCount}</div>
            <p className="text-sm text-muted-foreground">{t("talisman.active")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-light text-muted-foreground">{revokedCount}</div>
            <p className="text-sm text-muted-foreground">{t("talisman.revoked")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Credential List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("talisman.credentials")}</CardTitle>
              <CardDescription>{t("talisman.credentials_desc")}</CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  {t("talisman.add_credential")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("talisman.add_credential")}</DialogTitle>
                  <DialogDescription>
                    Select a credential type to add
                  </DialogDescription>
                </DialogHeader>
                {!selectedType ? (
                  <div className="grid gap-2 py-4">
                    {credentialTypes.map((cred) => {
                      const Icon = cred.icon
                      return (
                        <button
                          key={cred.type}
                          className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary"
                          onClick={() => setSelectedType(cred.type)}
                        >
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{t(`talisman.cred.${cred.type}`)}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                      {t(`talisman.cred.${selectedType}`)}
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder={addPlaceholder}
                        value={rawValue}
                        onChange={(event) => setRawValue(event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        issuer: {issuer}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedType(null)} className="bg-transparent">
                        Back
                      </Button>
                      <Button onClick={handleAddCredential} disabled={!rawValue.trim() || isSubmitting}>
                        {isSubmitting ? "Saving..." : "Add"}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              {isLoading ? t("common.loading") : t("talisman.no_credentials")}
            </p>
          ) : (
            <div className="space-y-3">
              {credentials.map((cred) => {
              const Icon = getIcon(cred.type)
              const isRevoked = !!cred.revokedAt
              
              return (
                <div
                  key={cred.id}
                  className={`rounded-lg border p-4 ${
                    isRevoked ? "border-border/50 bg-muted/30 opacity-60" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-2 ${isRevoked ? "bg-muted" : "bg-talisman-primary/10"}`}>
                        <Icon className={`h-4 w-4 ${isRevoked ? "text-muted-foreground" : "text-talisman-primary"}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {t(`talisman.cred.${cred.type}`)}
                        </p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          hash: {cred.normalizedHash}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          issuer: {cred.issuer}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Issued: {formatDate(cred.issuedAt)}
                        </p>
                        {cred.revokedAt && (
                          <p className="text-xs text-destructive">
                            Revoked: {formatDate(cred.revokedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isRevoked ? (
                        <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {t("talisman.revoked")}
                        </span>
                      ) : (
                        <>
                          <span className="rounded bg-talisman-primary/10 px-2 py-1 text-xs text-talisman-primary">
                            {t("talisman.active")}
                          </span>
                          <Dialog open={revokeDialogOpen && selectedCredential?.id === cred.id} onOpenChange={(open) => {
                            setRevokeDialogOpen(open)
                            if (!open) setSelectedCredential(null)
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setSelectedCredential(cred)}
                              >
                                {t("talisman.revoke")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Revoke Credential</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to revoke this credential? This action will decrease your score.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="rounded-lg border border-border bg-muted/30 p-4">
                                <p className="font-medium">{t(`talisman.cred.${cred.type}`)}</p>
                                <p className="mt-1 font-mono text-xs text-muted-foreground">
                                  {cred.normalizedHash}
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setRevokeDialogOpen(false)} className="bg-transparent">
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRevoke(cred)}
                                  disabled={revokingId === cred.id}
                                >
                                  {revokingId === cred.id ? "Revoking..." : "Revoke"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <p className="text-center text-xs text-muted-foreground">
        * All credential types are treated as equivalent observation points. No hierarchy exists.
      </p>
    </div>
  )
}
