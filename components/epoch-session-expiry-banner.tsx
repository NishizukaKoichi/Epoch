"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, X, AlertTriangle } from "@/components/icons"
import Link from "next/link"

interface SessionInfo {
  type: "time_window" | "read_session"
  targetUserId: string
  targetUserName: string
  expiresAt: string
}

interface EpochSessionExpiryBannerProps {
  sessions: SessionInfo[]
  onDismiss: (targetUserId: string) => void
}

export function EpochSessionExpiryBanner({ sessions, onDismiss }: EpochSessionExpiryBannerProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const getTimeRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return { expired: true, text: "期限切れ" }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return { expired: false, text: `残り ${days}日`, urgent: false }
    }
    if (hours > 0) {
      return { expired: false, text: `残り ${hours}時間${minutes}分`, urgent: hours < 2 }
    }
    return { expired: false, text: `残り ${minutes}分`, urgent: true }
  }

  const activeSessions = sessions.filter((session) => {
    const remaining = getTimeRemaining(session.expiresAt)
    return !remaining.expired
  })

  const expiredSessions = sessions.filter((session) => {
    const remaining = getTimeRemaining(session.expiresAt)
    return remaining.expired
  })

  if (sessions.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {/* Expired sessions */}
      {expiredSessions.map((session) => (
        <div
          key={session.targetUserId}
          className="p-4 bg-destructive/10 border border-destructive/30 rounded-md shadow-lg"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">閲覧期限が終了しました</p>
              <p className="text-xs text-muted-foreground mt-1">
                {session.targetUserName}さんの
                {session.type === "read_session" ? "Read Session" : "Time Window"}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link href={`/user/${session.targetUserId}`}>
                  <Button size="sm" variant="outline" className="text-xs border-border bg-transparent">
                    再購入
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss(session.targetUserId)}
                  className="text-xs text-muted-foreground"
                >
                  閉じる
                </Button>
              </div>
            </div>
            <button
              onClick={() => onDismiss(session.targetUserId)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Active sessions with warnings */}
      {activeSessions
        .filter((session) => getTimeRemaining(session.expiresAt).urgent)
        .map((session) => {
          const remaining = getTimeRemaining(session.expiresAt)
          return (
            <div
              key={session.targetUserId}
              className="p-4 bg-secondary border border-border rounded-md shadow-lg"
            >
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    閲覧期限が近づいています
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session.targetUserName}さんの
                    {session.type === "read_session" ? "Read Session" : "Time Window"}
                  </p>
                  <p className="text-xs font-mono text-foreground mt-1">{remaining.text}</p>
                </div>
                <button
                  onClick={() => onDismiss(session.targetUserId)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
    </div>
  )
}
