"use client"

import { UserPlus, KeyRound, EyeOff as KeyOff, Filter } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n/context"

const mockEvents = [
  { id: "evt-6", type: "credential_revoked", recordedAt: "2024-03-01T12:00:00Z", actor: "product", payload: { type: "phone_otp", credential_id: "cred-4" } },
  { id: "evt-5", type: "credential_added", recordedAt: "2024-02-01T14:20:00Z", actor: "system", payload: { type: "passkey", credential_id: "cred-3" } },
  { id: "evt-4", type: "credential_added", recordedAt: "2024-01-20T09:00:00Z", actor: "system", payload: { type: "phone_otp", credential_id: "cred-4" } },
  { id: "evt-3", type: "credential_added", recordedAt: "2024-01-15T10:32:00Z", actor: "system", payload: { type: "oauth_google", credential_id: "cred-2" } },
  { id: "evt-2", type: "credential_added", recordedAt: "2024-01-15T10:30:00Z", actor: "system", payload: { type: "email_magiclink", credential_id: "cred-1" } },
  { id: "evt-1", type: "person_created", recordedAt: "2024-01-15T10:30:00Z", actor: "system", payload: {} },
]

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
                <DropdownMenuItem>All Events</DropdownMenuItem>
                <DropdownMenuItem>Person Created</DropdownMenuItem>
                <DropdownMenuItem>Credential Added</DropdownMenuItem>
                <DropdownMenuItem>Credential Revoked</DropdownMenuItem>
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
          {mockEvents.map((event, index) => {
            const Icon = eventIcons[event.type as keyof typeof eventIcons] || KeyRound
            const colorClass = eventColors[event.type as keyof typeof eventColors] || "text-muted-foreground bg-muted"
            
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
                      {event.payload?.type && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t(`talisman.cred.${event.payload.type}`)}
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
                    {event.payload?.credential_id && (
                      <div className="text-muted-foreground">
                        <span className="text-foreground">credential_id:</span> {event.payload.credential_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-muted-foreground">
        * All state changes are recorded as events. Score and flags are derived from this event history.
      </p>
    </div>
  )
}
