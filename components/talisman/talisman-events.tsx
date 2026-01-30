"use client"

import { useEffect, useMemo, useState } from "react"
import { UserPlus, KeyRound, EyeOff as KeyOff, Filter } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n/context"
import { ensurePersonId } from "@/lib/talisman/client"

type EventType = "person_created" | "credential_added" | "credential_revoked"

type EventItem = {
  id: string
  type: EventType
  recordedAt: string
  actor: string
  payload: Record<string, unknown>
}

const eventIcons = {
  person_created: UserPlus,
  credential_added: KeyRound,
  credential_revoked: KeyOff,
}

const eventColors = {
  person_created: "text-blue-500 bg-blue-500/10",
  credential_added: "text-talisman-primary bg-talisman-primary/10",
  credential_revoked: "text-destructive bg-destructive/10",
}

export function TalismanEvents() {
  const { t } = useI18n()
  const [events, setEvents] = useState<EventItem[]>([])
  const [filter, setFilter] = useState<"all" | EventType>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events
    return events.filter((event) => event.type === filter)
  }, [events, filter])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const personId = await ensurePersonId()
        if (!active) return
        const response = await fetch(`/api/v1/talisman/events?person_id=${encodeURIComponent(personId)}&limit=100`)
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || "Eventの取得に失敗しました")
        }
        const data = (await response.json()) as {
          events: Array<{
            event_id: string
            event_type: EventType
            payload: Record<string, unknown>
            actor: string
            recorded_at: string
          }>
        }
        if (!active) return
        setEvents(
          data.events.map((event) => ({
            id: event.event_id,
            type: event.event_type,
            payload: event.payload ?? {},
            actor: event.actor,
            recordedAt: event.recorded_at,
          }))
        )
        setError(null)
      } catch (err) {
        if (!active) return
        const message = err instanceof Error ? err.message : "Eventの取得に失敗しました"
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("talisman.events")}</CardTitle>
              <CardDescription>{t("talisman.events_desc")}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setFilter("all")}>All Events</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter("person_created")}>Person Created</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter("credential_added")}>Credential Added</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter("credential_revoked")}>Credential Revoked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Events are append-only and immutable. The current state can always be reconstructed from the event history.
          </p>
        </CardContent>
      </Card>

      {/* Event Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {error && (
            <Card className="border-destructive/50">
              <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
            </Card>
          )}
          {filteredEvents.map((event) => {
            const Icon = eventIcons[event.type as keyof typeof eventIcons] || KeyRound
            const colorClass = eventColors[event.type as keyof typeof eventColors] || "text-muted-foreground bg-muted"
            const payloadType = event.payload?.type
            const payloadCredentialId =
              (event.payload?.credential_id as string | undefined) ??
              (event.payload?.credentialId as string | undefined)
            
            return (
              <div key={event.id} className="relative flex gap-4 pl-4">
                {/* Icon */}
                <div className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full ${colorClass}`}>
                  <Icon className="h-3 w-3" />
                </div>

                {/* Content */}
                <div className="flex-1 rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {t(`talisman.event.${event.type}`)}
                      </p>
                      {payloadType && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t(`talisman.cred.${payloadType}`)}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDate(event.recordedAt)}
                    </span>
                  </div>

                  {/* Event details */}
                  <div className="mt-3 rounded bg-muted/50 p-2 font-mono text-xs">
                    <div className="text-muted-foreground">
                      <span className="text-foreground">event_id:</span> {event.id}
                    </div>
                    <div className="text-muted-foreground">
                      <span className="text-foreground">actor:</span> {event.actor}
                    </div>
                    {payloadCredentialId && (
                      <div className="text-muted-foreground">
                        <span className="text-foreground">credential_id:</span> {payloadCredentialId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {filteredEvents.length === 0 && !isLoading && !error && (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                {t("talisman.events_desc")}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-muted-foreground">
        * All state changes are recorded as events. Score and flags are derived from this event history.
      </p>
    </div>
  )
}
