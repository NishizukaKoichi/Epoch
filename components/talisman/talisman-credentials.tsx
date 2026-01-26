"use client"

import { useState } from "react"
import { Mail, Phone, Chrome, Apple, Plus, Key, CreditCard, X as XIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"

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

const mockCredentials = [
  { id: "cred-1", type: "email_magiclink", normalizedHash: "a1b2c3...d4e5f6", issuedAt: "2024-01-15T10:30:00Z", revokedAt: null, issuer: "talisman-auth" },
  { id: "cred-2", type: "oauth_google", normalizedHash: "g7h8i9...j0k1l2", issuedAt: "2024-01-15T10:32:00Z", revokedAt: null, issuer: "talisman-auth" },
  { id: "cred-3", type: "passkey", normalizedHash: "m3n4o5...p6q7r8", issuedAt: "2024-02-01T14:20:00Z", revokedAt: null, issuer: "talisman-auth" },
  { id: "cred-4", type: "phone_otp", normalizedHash: "s9t0u1...v2w3x4", issuedAt: "2024-01-20T09:00:00Z", revokedAt: "2024-03-01T12:00:00Z", issuer: "talisman-auth" },
]

export function TalismanCredentials() {
  const { t } = useI18n()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [selectedCredential, setSelectedCredential] = useState<typeof mockCredentials[0] | null>(null)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  const getIcon = (type: string) => {
    const found = credentialTypes.find(c => c.type === type)
    return found?.icon || Key
  }

  const activeCount = mockCredentials.filter(c => !c.revokedAt).length
  const revokedCount = mockCredentials.filter(c => c.revokedAt).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-light text-foreground">{mockCredentials.length}</div>
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
                <div className="grid gap-2 py-4">
                  {credentialTypes.map((cred) => {
                    const Icon = cred.icon
                    return (
                      <button
                        key={cred.type}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary"
                        onClick={() => setAddDialogOpen(false)}
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{t(`talisman.cred.${cred.type}`)}</span>
                      </button>
                    )
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCredentials.map((cred) => {
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
                                <Button variant="destructive" onClick={() => setRevokeDialogOpen(false)}>
                                  Revoke
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
        </CardContent>
      </Card>

      {/* Note */}
      <p className="text-center text-xs text-muted-foreground">
        * All credential types are treated as equivalent observation points. No hierarchy exists.
      </p>
    </div>
  )
}
