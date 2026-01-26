"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, User } from "@/components/icons"

interface AuditEntry {
  id: string
  action: string
  timestamp: string
  details?: string
  actor: "user" | "operator"
  operatorId?: string
  operatorReason?: string
}

const mockAuditLog: AuditEntry[] = [
  {
    id: "audit_001",
    action: "record_created",
    timestamp: "2024-01-15T10:30:00Z",
    details: "decision_made",
    actor: "user",
  },
  {
    id: "audit_002",
    action: "visibility_changed",
    timestamp: "2024-01-15T10:25:00Z",
    details: "private → scout_visible",
    actor: "user",
  },
  {
    id: "audit_003",
    action: "auth_login",
    timestamp: "2024-01-15T10:00:00Z",
    details: "passkey",
    actor: "user",
  },
  {
    id: "audit_004",
    action: "operator_data_export",
    timestamp: "2024-01-14T22:00:00Z",
    details: "法的要請に基づくデータ開示",
    actor: "operator",
    operatorId: "admin_001",
    operatorReason: "裁判所命令 #2024-JP-1234",
  },
  {
    id: "audit_005",
    action: "record_created",
    timestamp: "2024-01-14T18:00:00Z",
    details: "decision_not_made",
    actor: "user",
  },
  {
    id: "audit_006",
    action: "billing_session_started",
    timestamp: "2024-01-14T14:00:00Z",
    details: "read_session",
    actor: "user",
  },
  {
    id: "audit_007",
    action: "epoch_viewed",
    timestamp: "2024-01-14T14:00:00Z",
    details: "user_abc123",
    actor: "user",
  },
  {
    id: "audit_008",
    action: "operator_account_review",
    timestamp: "2024-01-13T15:00:00Z",
    details: "定期セキュリティ監査",
    actor: "operator",
    operatorId: "admin_002",
    operatorReason: "四半期セキュリティレビュー",
  },
  {
    id: "audit_009",
    action: "billing_session_ended",
    timestamp: "2024-01-14T15:30:00Z",
    actor: "user",
  },
  {
    id: "audit_010",
    action: "attachment_added",
    timestamp: "2024-01-13T09:00:00Z",
    details: "image/jpeg",
    actor: "user",
  },
]

export function EpochAuditLog() {
  const [filter, setFilter] = useState<"all" | "user" | "operator">("all")

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      record_created: "Record作成",
      visibility_changed: "可視性変更",
      auth_login: "ログイン",
      auth_logout: "ログアウト",
      auth_recovered: "アカウント復旧",
      billing_session_started: "課金セッション開始",
      billing_session_ended: "課金セッション終了",
      epoch_viewed: "Epoch閲覧",
      attachment_added: "添付追加",
      profile_updated: "プロフィール更新",
      operator_data_export: "運営: データ開示",
      operator_account_review: "運営: アカウント監査",
      operator_system_maintenance: "運営: システム保守",
    }
    return labels[action] || action
  }

  const filteredLog = mockAuditLog.filter((entry) => {
    if (filter === "all") return true
    return entry.actor === filter
  })

  const renderEntry = (entry: AuditEntry) => (
    <div
      key={entry.id}
      className={`flex items-start gap-4 py-3 border-b border-border last:border-0 ${
        entry.actor === "operator" ? "bg-secondary/30" : ""
      }`}
    >
      <span className="text-xs font-mono text-muted-foreground shrink-0 w-32">
        {formatTimestamp(entry.timestamp)}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {entry.actor === "operator" ? (
          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <User className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-foreground">{getActionLabel(entry.action)}</span>
        {entry.details && (
          <span className="text-xs text-muted-foreground ml-2 font-mono">{entry.details}</span>
        )}
        {entry.actor === "operator" && entry.operatorReason && (
          <div className="mt-1 text-xs text-muted-foreground">
            <span className="font-mono">理由: {entry.operatorReason}</span>
            {entry.operatorId && (
              <span className="ml-2 font-mono">操作者: {entry.operatorId}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">監査ログ</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="all" className="text-xs">すべて</TabsTrigger>
            <TabsTrigger value="user" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              ユーザー操作
            </TabsTrigger>
            <TabsTrigger value="operator" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              運営者操作
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-96">
          <div className="space-y-1">
            {filteredLog.map(renderEntry)}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>すべての操作は監査ログに記録されます。</p>
          <p>運営者の操作も同一形式で記録され、理由と操作者IDが付与されます。</p>
          <p className="flex items-center gap-2">
            <Shield className="h-3 w-3" />
            <span>運営者の操作は背景色で区別されます。</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
