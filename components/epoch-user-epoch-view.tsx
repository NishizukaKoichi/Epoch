"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { EpochRecordCard } from "@/components/epoch-record-card"
import { EpochPaymentDialog } from "@/components/epoch-payment-dialog"
import { EpochScoutDialog } from "@/components/epoch-scout-dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Lock,
  Send,
  CheckCircle,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  FileText,
  Link2,
  ExternalLink,
} from "@/components/icons"
import { useAuth } from "@/lib/auth/context"
import { mapRecordToView, type EpochApiRecord, type EpochRecordView } from "@/lib/epoch/record-utils"

type LinkType =
  | "website"
  | "github"
  | "linkedin"
  | "twitter"
  | "youtube"
  | "instagram"
  | "portfolio"
  | "blog"
  | "other"

interface ProfileLink {
  id: string
  type: string
  url: string
  label?: string | null
}

const linkIcons: Record<LinkType, React.ReactNode> = {
  website: <Globe className="h-4 w-4" />,
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  portfolio: <FileText className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />,
  other: <Link2 className="h-4 w-4" />,
}

const linkLabels: Record<LinkType, string> = {
  website: "Website",
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "X",
  youtube: "YouTube",
  instagram: "Instagram",
  portfolio: "Portfolio",
  blog: "Blog",
  other: "Link",
}

interface EpochUserViewProps {
  userId: string
}

interface PublicUserProfile {
  userId: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  createdAt: string
  links?: ProfileLink[]
}

export function EpochUserView({ userId }: EpochUserViewProps) {
  const { userId: viewerId } = useAuth()
  const [user, setUser] = useState<PublicUserProfile | null>(null)
  const [records, setRecords] = useState<EpochRecordView[]>([])
  const [hasAccess, setHasAccess] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showScout, setShowScout] = useState(false)
  const [accessInfo, setAccessInfo] = useState<{
    type: "time_window" | "read_session"
    expiresAt: string
  } | null>(null)
  const [grantId, setGrantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (iso: string) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso))
  }

  const loadProfile = useCallback(async () => {
    setError(null)
    try {
      const response = await fetch(`/api/epoch/users/${userId}`)
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "ユーザー情報の取得に失敗しました")
      }
      const data = (await response.json()) as { user: PublicUserProfile }
      setUser(data.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : "ユーザー情報の取得に失敗しました"
      setError(message)
    }
  }, [userId])

  const loadRecords = useCallback(
    async (grantOverride?: string | null) => {
      if (!viewerId) {
        setHasAccess(false)
        setRecords([])
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set("scout", "1")
        const resolvedGrantId = grantOverride ?? grantId
        if (resolvedGrantId) {
          params.set("grantId", resolvedGrantId)
        }
        const response = await fetch(`/api/records/${userId}?${params.toString()}`)
        if (response.status === 403) {
          setHasAccess(false)
          setRecords([])
          return
        }
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || "履歴の取得に失敗しました")
        }
        const data = (await response.json()) as { records: EpochApiRecord[] }
        const mapped = (data.records ?? []).map(mapRecordToView)
        mapped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        setRecords(mapped)
        setHasAccess(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : "履歴の取得に失敗しました"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [grantId, userId, viewerId],
  )

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const handlePaymentSuccess = (grant: {
    type: "time_window" | "read_session"
    endsAt?: string
    windowEnd?: string
    windowStart?: string
    grantId: string
  }) => {
    setHasAccess(true)
    setGrantId(grant.grantId)
    const expiresAt = grant.endsAt ?? grant.windowEnd ?? grant.windowStart ?? new Date().toISOString()
    setAccessInfo({ type: grant.type, expiresAt })
    loadRecords(grant.grantId)
  }

  const displayName = useMemo(() => {
    return user?.displayName ?? user?.userId ?? userId
  }, [user, userId])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {error && (
        <div className="mb-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* User Header */}
      <div className="mb-8 p-6 border border-border bg-card">
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatarUrl || undefined} />
            <AvatarFallback className="bg-secondary text-muted-foreground text-xl">
              {displayName?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-lg font-medium text-foreground">{displayName}</h1>
            {user?.bio && <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>}
            <p className="mt-2 text-xs font-mono text-muted-foreground">
              記録開始: {user?.createdAt ? formatDate(user.createdAt) : "-"}
            </p>

            {/* Links */}
            {user?.links && user.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.links.map((link) => {
                  const type = (link.type as LinkType) in linkIcons ? (link.type as LinkType) : "other"
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-secondary border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
                    >
                      {linkIcons[type]}
                      <span>{link.label || linkLabels[type]}</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowScout(true)}
            variant="outline"
            size="sm"
            className="border-border text-foreground bg-transparent"
          >
            <Send className="h-4 w-4 mr-2" />
            スカウト
          </Button>
        </div>
      </div>

      {hasAccess && accessInfo && (
        <div className="mb-6 p-4 border border-border bg-secondary/30 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-foreground">
                {accessInfo.type === "read_session" ? "Read Session" : "Time Window"} で閲覧中
              </p>
              <p className="text-xs text-muted-foreground font-mono">有効期限: {formatDate(accessInfo.expiresAt)}</p>
            </div>
          </div>

          {/* Viewing restrictions notice */}
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">閲覧制約（仕様書 第3条）:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>閲覧内容に対する評価やコメントの書き込みは禁止されています</li>
              <li>内容のコピー・保存・スクリーンショットは禁止されています</li>
              <li>第三者への抜粋・引用・共有は禁止されています</li>
              <li>閲覧事実は自動的に記録されます</li>
            </ul>
          </div>
        </div>
      )}

      {/* Access Gate or Timeline */}
      {hasAccess ? (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">履歴</h2>
            <span className="text-xs font-mono text-muted-foreground">{records.length} records</span>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-1">
              {records.map((record, index) => (
                <EpochRecordCard
                  key={record.id}
                  record={record}
                  isFirst={index === 0}
                  isOwner={false}
                />
              ))}
            </div>
          </div>

          {isLoading && <div className="mt-6 text-xs text-muted-foreground">読み込み中...</div>}
        </section>
      ) : (
        <div className="border border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-6">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">閲覧には権限が必要です</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
            他人のEpochを判断材料として読む場合のみ課金が発生します。
            支払いは情報量ではなく、不確実性の除去に対して行われます。
          </p>
          <Button
            onClick={() => setShowPayment(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            閲覧権限を取得
          </Button>
        </div>
      )}

      {user && (
        <EpochPaymentDialog
          open={showPayment}
          onOpenChange={setShowPayment}
          targetUser={user}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {user && (
        <EpochScoutDialog
          open={showScout}
          onOpenChange={setShowScout}
          targetUser={{ displayName, userId }}
          mode="send"
        />
      )}
    </div>
  )
}
