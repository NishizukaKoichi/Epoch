"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "@/components/icons"

interface BillingSession {
  id: string
  type: "time_window" | "read_session"
  targetUser: string
  startedAt: string
  endedAt?: string
  status: "active" | "expired" | "completed"
  amount: number
}

const mockSessions: BillingSession[] = [
  {
    id: "bs_001",
    type: "read_session",
    targetUser: "user_abc123",
    startedAt: "2024-01-15T10:00:00Z",
    endedAt: "2024-01-15T11:30:00Z",
    status: "completed",
    amount: 500,
  },
  {
    id: "bs_002",
    type: "time_window",
    targetUser: "user_def456",
    startedAt: "2024-01-14T09:00:00Z",
    status: "active",
    amount: 2000,
  },
  {
    id: "bs_003",
    type: "read_session",
    targetUser: "user_ghi789",
    startedAt: "2024-01-10T14:00:00Z",
    endedAt: "2024-01-10T14:45:00Z",
    status: "completed",
    amount: 500,
  },
]

export function EpochBillingHistory() {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: BillingSession["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">有効</Badge>
      case "expired":
        return (
          <Badge variant="outline" className="border-border text-muted-foreground">
            期限切れ
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-border text-muted-foreground">
            完了
          </Badge>
        )
    }
  }

  const getTypeLabel = (type: BillingSession["type"]) => {
    return type === "time_window" ? "Time Window" : "Read Session"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">課金履歴</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSessions.map((session) => (
            <div key={session.id} className="p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {session.type === "time_window" ? (
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">{getTypeLabel(session.type)}</span>
                </div>
                {getStatusBadge(session.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">対象ユーザー</span>
                  <span className="font-mono text-xs text-foreground">{session.targetUser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">開始</span>
                  <span className="text-foreground">{formatDate(session.startedAt)}</span>
                </div>
                {session.endedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">終了</span>
                    <span className="text-foreground">{formatDate(session.endedAt)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">金額</span>
                  <span className="text-foreground font-medium">¥{session.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
          <p>課金は「他人のEpochを判断材料として読む行為」にのみ発生します</p>
          <p className="mt-1">Record単体課金・評価連動課金は存在しません</p>
        </div>
      </CardContent>
    </Card>
  )
}
