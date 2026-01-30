"use client"

import { useEffect, useState } from "react"
import { Copy, Check, Plus, History, ChevronRight } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"
import { ensurePersonId } from "@/lib/talisman/client"
import Link from "next/link"

type CredentialItem = {
  id: string
  type: string
  issuedAt: string
  revokedAt: string | null
}

type EventItem = {
  id: string
  type: string
  recordedAt: string
  payload?: { type?: string } | null
}

type Signal = {
  score: number
  flags: Record<string, boolean>
}

export default function TalismanDashboardPage() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [personId, setPersonId] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<CredentialItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [signal, setSignal] = useState<Signal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const id = await ensurePersonId()
        if (!active) return
        setPersonId(id)

        const [signalRes, credRes, eventsRes] = await Promise.all([
          fetch(`/api/v1/talisman/persons/${id}/signal`),
          fetch(`/api/v1/talisman/credentials?person_id=${encodeURIComponent(id)}`),
          fetch(`/api/v1/talisman/events?person_id=${encodeURIComponent(id)}&limit=5`),
        ])

        if (!signalRes.ok || !credRes.ok || !eventsRes.ok) {
          const payload = await signalRes.json().catch(() => null)
          throw new Error(payload?.error || "Talismanのデータ取得に失敗しました")
        }

        const signalJson = (await signalRes.json()) as {
          score: number
          flags: Record<string, boolean>
        }
        const credentialsJson = (await credRes.json()) as {
          credentials: Array<{
            credential_id: string
            type: string
            issued_at: string
            revoked_at: string | null
          }>
        }
        const eventsJson = (await eventsRes.json()) as {
          events: Array<{
            event_id: string
            event_type: string
            recorded_at: string
            payload?: { type?: string } | null
          }>
        }

        if (!active) return
        setSignal({ score: signalJson.score, flags: signalJson.flags })
        setCredentials(
          credentialsJson.credentials.map((cred) => ({
            id: cred.credential_id,
            type: cred.type,
            issuedAt: cred.issued_at,
            revokedAt: cred.revoked_at,
          }))
        )
        setEvents(
          eventsJson.events.map((event) => ({
            id: event.event_id,
            type: event.event_type,
            recordedAt: event.recorded_at,
            payload: event.payload ?? null,
          }))
        )
        setError(null)
      } catch (err) {
        if (!active) return
        const message = err instanceof Error ? err.message : "Talismanのデータ取得に失敗しました"
        setError(message)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  const activeCredentials = credentials.filter((cred) => !cred.revokedAt)
  const score = signal?.score ?? activeCredentials.length
  const flags = signal?.flags ?? {
    has_email: false,
    has_phone: false,
    has_oauth: false,
    has_payment: false,
    has_passkey: false,
  }

  const copyPersonId = () => {
    if (!personId) return
    navigator.clipboard.writeText(personId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

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
              {personId ?? (isLoading ? t("common.loading") : "-")}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyPersonId}
              className="bg-transparent"
              disabled={!personId}
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
              {Object.entries(flags).map(([key, value]) => (
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
          {credentials.length === 0 && !isLoading ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              {t("talisman.no_credentials")}
            </p>
          ) : (
            <div className="space-y-2">
              {credentials.slice(0, 4).map((cred) => (
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
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded border border-border bg-muted/30 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {t(`talisman.event.${event.type}`)}
                  </span>
                  {event.payload?.type && (
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
