"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EpochScoutDialog } from "./epoch-scout-dialog"
import { Send, Inbox, CheckCircle2, MessageSquare, Building2, Briefcase } from "@/components/icons"
import Link from "next/link"

interface ScoutInitiatorInfo {
  organization?: string
  role?: string
  projectSummary?: string
}

interface ScoutMessage {
  id: string
  fromUserId?: string
  fromDisplayName?: string
  toUserId?: string
  toDisplayName?: string
  status: "pending" | "accepted" | "declined" | "in_discussion" | "completed" | "withdrawn"
  sentAt: string
  respondedAt?: string
  initiatorInfo?: ScoutInitiatorInfo
  hasConversation?: boolean
}

const mockReceived: ScoutMessage[] = [
  {
    id: "scout_001",
    fromUserId: "user_abc123",
    fromDisplayName: "田中 太郎",
    status: "pending",
    sentAt: "2024-01-15T10:00:00Z",
    initiatorInfo: {
      organization: "株式会社テクノロジー",
      role: "エンジニアリングマネージャー",
      projectSummary: "新規プロダクト開発チームのテックリード募集",
    },
  },
  {
    id: "scout_002",
    fromUserId: "user_def456",
    fromDisplayName: "佐藤 花子",
    status: "in_discussion",
    sentAt: "2024-01-10T14:00:00Z",
    respondedAt: "2024-01-10T15:00:00Z",
    hasConversation: true,
    initiatorInfo: {
      organization: "スタートアップ株式会社",
      role: "CEO",
    },
  },
  {
    id: "scout_005",
    fromUserId: "user_xyz999",
    fromDisplayName: "山田 次郎",
    status: "completed",
    sentAt: "2024-01-05T09:00:00Z",
    respondedAt: "2024-01-05T10:00:00Z",
    hasConversation: true,
    initiatorInfo: {
      organization: "大手企業株式会社",
    },
  },
]

const mockSent: ScoutMessage[] = [
  {
    id: "scout_003",
    toUserId: "user_ghi789",
    toDisplayName: "鈴木 一郎",
    status: "pending",
    sentAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "scout_004",
    toUserId: "user_jkl012",
    toDisplayName: "高橋 美咲",
    status: "declined",
    sentAt: "2024-01-08T11:00:00Z",
    respondedAt: "2024-01-09T10:00:00Z",
  },
  {
    id: "scout_006",
    toUserId: "user_mno345",
    toDisplayName: "伊藤 健太",
    status: "in_discussion",
    sentAt: "2024-01-12T15:00:00Z",
    respondedAt: "2024-01-12T16:00:00Z",
    hasConversation: true,
  },
]

export function EpochScoutInbox() {
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"send" | "receive">("send")
  const [selectedUser, setSelectedUser] = useState<{ displayName: string; userId: string } | null>(null)

  const handleOpenSendDialog = () => {
    setDialogMode("send")
    setSelectedUser({ displayName: "", userId: "" })
    setShowDialog(true)
  }

  const handleOpenReceiveDialog = (scout: ScoutMessage) => {
    setDialogMode("receive")
    setSelectedUser({
      displayName: scout.fromDisplayName || scout.fromUserId || "Unknown",
      userId: scout.fromUserId || "",
    })
    setShowDialog(true)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: ScoutMessage["status"]) => {
    const statusConfig: Record<
      ScoutMessage["status"],
      { label: string; className: string }
    > = {
      pending: { label: "未応答", className: "border-amber-500/30 text-amber-400" },
      accepted: {
        label: "承諾",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      declined: { label: "辞退", className: "border-border text-muted-foreground" },
      in_discussion: {
        label: "擦り合わせ中",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
      completed: {
        label: "完了",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      withdrawn: { label: "取り下げ", className: "border-border text-muted-foreground" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const ScoutCard = ({ scout, type }: { scout: ScoutMessage; type: "received" | "sent" }) => (
    <div className="p-4 border border-border rounded-lg bg-muted/20">
      <div className="flex items-start justify-between mb-3">
        <div className="font-mono text-xs text-muted-foreground">
          {type === "received"
            ? `from: ${scout.fromDisplayName || scout.fromUserId}`
            : `to: ${scout.toDisplayName || scout.toUserId}`}
        </div>
        {getStatusBadge(scout.status)}
      </div>

      {/* Initiator Info */}
      {type === "received" && scout.initiatorInfo && (
        <div className="mb-3 p-2 bg-muted/30 border border-border rounded text-xs space-y-1">
          {scout.initiatorInfo.organization && (
            <div className="flex items-center gap-2 text-foreground">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              {scout.initiatorInfo.organization}
            </div>
          )}
          {scout.initiatorInfo.role && (
            <div className="flex items-center gap-2 text-foreground">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              {scout.initiatorInfo.role}
            </div>
          )}
          {scout.initiatorInfo.projectSummary && (
            <p className="text-muted-foreground mt-1">{scout.initiatorInfo.projectSummary}</p>
          )}
        </div>
      )}

      <div className="p-3 border border-border rounded bg-card mb-3">
        <p className="text-sm text-foreground">「一回来て、仕事を一緒にやってみませんか？」</p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>送信: {formatDate(scout.sentAt)}</span>
        {scout.respondedAt && <span>応答: {formatDate(scout.respondedAt)}</span>}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        {type === "received" && scout.status === "pending" && (
          <Button
            size="sm"
            className="flex-1 bg-foreground text-background hover:bg-foreground/90"
            onClick={() => handleOpenReceiveDialog(scout)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            応答する
          </Button>
        )}

        {scout.hasConversation && ["accepted", "in_discussion", "completed"].includes(scout.status) && (
          <Link href={`/scout/${scout.id}`} className="flex-1">
            <Button
              size="sm"
              variant={scout.status === "in_discussion" ? "default" : "outline"}
              className={`w-full ${
                scout.status === "in_discussion"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border-border text-foreground bg-transparent"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {scout.status === "in_discussion" ? "会話を続ける" : "会話を見る"}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">スカウト</h1>
        <Button onClick={handleOpenSendDialog} className="bg-foreground text-background hover:bg-foreground/90">
          <Send className="h-4 w-4 mr-2" />
          スカウトを送る
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-normal text-muted-foreground">固定文言</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">「一回来て、仕事を一緒にやってみませんか？」</p>
          <p className="text-xs text-muted-foreground mt-2">
            スカウトではこの文言のみ送信可能です。自由記述は禁止されています。
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="received" className="space-y-4">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="received" className="data-[state=active]:bg-background gap-2">
            <Inbox className="h-4 w-4" />
            受信 ({mockReceived.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="data-[state=active]:bg-background gap-2">
            <Send className="h-4 w-4" />
            送信 ({mockSent.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {mockReceived.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">受信したスカウトはありません</div>
          ) : (
            mockReceived.map((scout) => <ScoutCard key={scout.id} scout={scout} type="received" />)
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {mockSent.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">送信したスカウトはありません</div>
          ) : (
            mockSent.map((scout) => <ScoutCard key={scout.id} scout={scout} type="sent" />)
          )}
        </TabsContent>
      </Tabs>

      <div className="p-4 border border-dashed border-border rounded-lg text-sm text-muted-foreground">
        <p>送信、受信、承諾、辞退はすべて双方のEpochに事実として記録されます。</p>
        <p className="mt-1">スカウトはEpoch外部イベントとして扱われます。</p>
      </div>

      {selectedUser && (
        <EpochScoutDialog open={showDialog} onOpenChange={setShowDialog} targetUser={selectedUser} mode={dialogMode} />
      )}
    </div>
  )
}
