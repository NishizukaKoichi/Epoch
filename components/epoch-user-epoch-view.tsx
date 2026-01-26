"use client"

import React from "react"

import { useState } from "react"
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
  type: LinkType
  url: string
  label?: string
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
  user: {
    userId: string
    displayName: string
    bio: string
    avatarUrl: string | null
    createdAt: string
    links?: ProfileLink[]
  }
  initialHasAccess: boolean
}

// Mock records for the user
const mockRecords = [
  {
    id: "01J5QKXR8V0000000000000010",
    type: "decision_made" as const,
    content: "新しいプロジェクトへの参画を決定した。チームの方向性と自分のスキルセットが合致すると判断。",
    timestamp: "2024-08-10T09:00:00Z",
    hash: "f8k7h6g5j4i3l2m1n0o9p8q7r6s5t4u3",
    prevHash: "e7j6g5f2i3h8j9e1f2g3h4i5j6k7l8m9",
    visibility: "public" as const,
  },
  {
    id: "01J5QKXR8V0000000000000011",
    type: "decision_not_made" as const,
    content: "投資案件の検討を見送った。リスク評価の結果、現時点では判断を保留することにした。",
    timestamp: "2024-07-25T14:30:00Z",
    hash: "g9l8i7h6k5j4m3n2o1p0q9r8s7t6u5v4",
    prevHash: "f8k7h6g5j4i3l2m1n0o9p8q7r6s5t4u3",
    visibility: "public" as const,
  },
  {
    id: "01J5QKXR8V0000000000000012",
    type: "period_of_silence" as const,
    content: null,
    timestamp: "2024-07-01T00:00:00Z",
    hash: "h0m9j8i7l6k5n4o3p2q1r0s9t8u7v6w5",
    prevHash: "g9l8i7h6k5j4m3n2o1p0q9r8s7t6u5v4",
    visibility: "public" as const,
    silenceDuration: "2024-06-15T00:00:00Z ~ 2024-07-01T00:00:00Z",
  },
  {
    id: "01J5QKXR8V0000000000000013",
    type: "revision" as const,
    content: "以前の判断について補足。当時の状況では最善だったが、新しい情報により見方が変わった。",
    timestamp: "2024-06-14T11:00:00Z",
    hash: "i1n0k9j8m7l6o5p4q3r2s1t0u9v8w7x6",
    prevHash: "h0m9j8i7l6k5n4o3p2q1r0s9t8u7v6w5",
    visibility: "public" as const,
    refRecordId: "01J5QKXR8V0000000000000008",
  },
  {
    id: "01J5QKXR8V0000000000000014",
    type: "decision_made" as const,
    content: "転職オファーを受諾した。長期的なキャリアパスを考慮した結果。",
    timestamp: "2024-05-20T16:45:00Z",
    hash: "j2o1l0k9n8m7p6q5r4s3t2u1v0w9x8y7",
    prevHash: "i1n0k9j8m7l6o5p4q3r2s1t0u9v8w7x6",
    visibility: "public" as const,
  },
]

export function EpochUserView({ user, initialHasAccess }: EpochUserViewProps) {
  const [hasAccess, setHasAccess] = useState(initialHasAccess)
  const [showPayment, setShowPayment] = useState(false)
  const [showScout, setShowScout] = useState(false)
  const [accessInfo, setAccessInfo] = useState<{
    type: "time_window" | "read_session"
    expiresAt: string
  } | null>(null)

  const formatDate = (iso: string) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso))
  }

  const handlePaymentSuccess = (type: "time_window" | "read_session") => {
    setHasAccess(true)
    const expiresAt = new Date()
    if (type === "read_session") {
      expiresAt.setHours(expiresAt.getHours() + 24)
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30)
    }
    setAccessInfo({
      type,
      expiresAt: expiresAt.toISOString(),
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* User Header */}
      <div className="mb-8 p-6 border border-border bg-card">
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="bg-secondary text-muted-foreground text-xl">
              {user.displayName?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-lg font-medium text-foreground">{user.displayName}</h1>
            {user.bio && <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>}
            <p className="mt-2 text-xs font-mono text-muted-foreground">記録開始: {formatDate(user.createdAt)}</p>

            {/* Links */}
            {user.links && user.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-secondary border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
                  >
                    {linkIcons[link.type]}
                    <span>{link.label || linkLabels[link.type]}</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                ))}
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
            <span className="text-xs font-mono text-muted-foreground">{mockRecords.length} records</span>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-1">
              {mockRecords.map((record, index) => (
                <EpochRecordCard
                  key={record.id}
                  record={record}
                  isFirst={index === 0}
                  isLast={index === mockRecords.length - 1}
                />
              ))}
            </div>
          </div>
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

      <EpochPaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        targetUser={user}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <EpochScoutDialog open={showScout} onOpenChange={setShowScout} targetUser={user} mode="send" />
    </div>
  )
}
