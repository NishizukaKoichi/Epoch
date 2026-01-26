"use client"

import { useState } from "react"
import { Copy, Check, Plus, History, ChevronRight } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"

// Mock data
const mockPersonId = "019426a2-7def-7e8a-9c1b-4f8e2a3b5c6d"

const mockCredentials = [
  { id: "cred-1", type: "email_magiclink", issuedAt: "2024-01-15T10:30:00Z", revokedAt: null },
  { id: "cred-2", type: "oauth_google", issuedAt: "2024-01-15T10:32:00Z", revokedAt: null },
  { id: "cred-3", type: "passkey", issuedAt: "2024-02-01T14:20:00Z", revokedAt: null },
  { id: "cred-4", type: "phone_otp", issuedAt: "2024-01-20T09:00:00Z", revokedAt: "2024-03-01T12:00:00Z" },
]

const mockFlags = {
  has_email: true,
  has_phone: false,
  has_oauth: true,
  has_payment: false,
  has_passkey: true,
}

const mockEvents = [
  { id: "evt-1", type: "person_created", recordedAt: "2024-01-15T10:30:00Z" },
  { id: "evt-2", type: "credential_added", recordedAt: "2024-01-15T10:30:00Z", payload: { type: "email_magiclink" } },
  { id: "evt-3", type: "credential_added", recordedAt: "2024-01-15T10:32:00Z", payload: { type: "oauth_google" } },
  { id: "evt-4", type: "credential_added", recordedAt: "2024-01-20T09:00:00Z", payload: { type: "phone_otp" } },
  { id: "evt-5", type: "credential_added", recordedAt: "2024-02-01T14:20:00Z", payload: { type: "passkey" } },
]

export default function TalismanDashboardPage() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const activeCredentials = mockCredentials.filter(c => !c.revokedAt)
  const score = activeCredentials.length

  const copyPersonId = () => {
    navigator.clipboard.writeText(mockPersonId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Person ID */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("talisman.person_id")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm text-foreground">
              {mockPersonId}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyPersonId}
              className="bg-transparent"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Score & Flags */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("talisman.score")}</CardTitle>
            <CardDescription>{t("talisman.score_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-light text-foreground">{score}</div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              = count(Credential where revoked_at == null)
            </p>
          </CardContent>
        </Card>

        {/* Flags */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t("talisman.flags")}</CardTitle>
            <CardDescription>{t("talisman.flags_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 font-mono text-sm">
              {Object.entries(mockFlags).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={value ? "text-cyan-400" : "text-muted-foreground/50"}>
                    {value ? "true" : "false"}
                  </span>
                  <span className="text-muted-foreground">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credentials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">{t("talisman.credentials")}</CardTitle>
              <CardDescription>{t("talisman.credentials_desc")}</CardDescription>
            </div>
            <Link href="/talisman/credentials">
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                {t("talisman.add_credential")}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {mockCredentials.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              {t("talisman.no_credentials")}
            </p>
          ) : (
            <div className="space-y-2">
              {mockCredentials.slice(0, 4).map((cred) => (
                <div
                  key={cred.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    cred.revokedAt ? "border-border/50 bg-muted/30 opacity-60" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${cred.revokedAt ? "bg-muted-foreground" : "bg-cyan-400"}`} />
                    <div>
                      <p className="font-medium text-foreground">
                        {t(`talisman.cred.${cred.type}`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(cred.issuedAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs ${cred.revokedAt ? "text-muted-foreground" : "text-cyan-400"}`}>
                    {cred.revokedAt ? t("talisman.revoked") : t("talisman.active")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">{t("talisman.events")}</CardTitle>
              <CardDescription>{t("talisman.events_desc")}</CardDescription>
            </div>
            <Link href="/talisman/events">
              <Button variant="ghost" size="sm" className="gap-1">
                <History className="h-4 w-4" />
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded border border-border bg-muted/30 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {t(`talisman.event.${event.type}`)}
                  </span>
                  {event.payload && (
                    <span className="text-xs text-muted-foreground">
                      ({event.payload.type})
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(event.recordedAt)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
