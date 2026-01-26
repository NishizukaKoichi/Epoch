"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ArrowLeft, CheckCircle2, XCircle, Building2, Briefcase, User } from "@/components/icons"
import Link from "next/link"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isSystem?: boolean
}

interface ScoutConversation {
  id: string
  status: "pending" | "accepted" | "declined" | "in_discussion" | "completed" | "withdrawn"
  initiatorId: string
  initiatorName: string
  initiatorInfo: {
    organization?: string
    role?: string
    projectSummary?: string
  }
  targetId: string
  targetName: string
  messages: Message[]
  createdAt: string
  acceptedAt?: string
  completedAt?: string
}

const mockConversation: ScoutConversation = {
  id: "scout_conv_001",
  status: "in_discussion",
  initiatorId: "user_abc123",
  initiatorName: "田中 太郎",
  initiatorInfo: {
    organization: "株式会社テクノロジー",
    role: "エンジニアリングマネージャー",
    projectSummary: "新規プロダクト開発チームのテックリード募集",
  },
  targetId: "user_me",
  targetName: "自分",
  messages: [
    {
      id: "msg_001",
      senderId: "system",
      senderName: "システム",
      content: "スカウトが送信されました: 「一回来て、仕事を一緒にやってみませんか？」",
      timestamp: "2024-01-15T10:00:00Z",
      isSystem: true,
    },
    {
      id: "msg_002",
      senderId: "system",
      senderName: "システム",
      content: "スカウトが承諾されました。詳細の擦り合わせを開始できます。",
      timestamp: "2024-01-15T11:00:00Z",
      isSystem: true,
    },
    {
      id: "msg_003",
      senderId: "user_abc123",
      senderName: "田中 太郎",
      content: "承諾いただきありがとうございます。弊社では現在、新規プロダクトの立ち上げを進めており、テックリードを探しています。まずはカジュアルにお話しできればと思いますが、ご都合はいかがでしょうか？",
      timestamp: "2024-01-15T11:05:00Z",
    },
    {
      id: "msg_004",
      senderId: "user_me",
      senderName: "自分",
      content: "ご連絡ありがとうございます。興味があります。来週であれば火曜日か木曜日の午後が空いています。",
      timestamp: "2024-01-15T14:30:00Z",
    },
    {
      id: "msg_005",
      senderId: "user_abc123",
      senderName: "田中 太郎",
      content: "ありがとうございます。では火曜日の14時はいかがでしょうか？オンラインでも対面でも対応可能です。",
      timestamp: "2024-01-15T15:00:00Z",
    },
  ],
  createdAt: "2024-01-15T10:00:00Z",
  acceptedAt: "2024-01-15T11:00:00Z",
}

interface EpochScoutConversationProps {
  conversationId: string
  isInitiator?: boolean
}

export function EpochScoutConversation({ conversationId, isInitiator = false }: EpochScoutConversationProps) {
  const [conversation, setConversation] = useState<ScoutConversation>(mockConversation)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation.messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: "user_me",
      senderName: "自分",
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))
    setNewMessage("")
    setIsSending(false)
  }

  const handleComplete = async () => {
    setConversation((prev) => ({
      ...prev,
      status: "completed",
      completedAt: new Date().toISOString(),
      messages: [
        ...prev.messages,
        {
          id: `msg_${Date.now()}`,
          senderId: "system",
          senderName: "システム",
          content: "この会話は完了としてマークされました。",
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ],
    }))
  }

  const handleWithdraw = async () => {
    setConversation((prev) => ({
      ...prev,
      status: "withdrawn",
      messages: [
        ...prev.messages,
        {
          id: `msg_${Date.now()}`,
          senderId: "system",
          senderName: "システム",
          content: "この会話は取り下げられました。",
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ],
    }))
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: ScoutConversation["status"]) => {
    const statusConfig = {
      pending: { label: "承諾待ち", className: "border-amber-500/30 text-amber-400" },
      accepted: { label: "承諾済み", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      declined: { label: "辞退", className: "border-border text-muted-foreground" },
      in_discussion: { label: "擦り合わせ中", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      completed: { label: "完了", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      withdrawn: { label: "取り下げ", className: "border-border text-muted-foreground" },
    }
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const isConversationActive = ["accepted", "in_discussion"].includes(conversation.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/scout">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {isInitiator ? conversation.targetName : conversation.initiatorName}
          </h1>
          <p className="text-sm text-muted-foreground">スカウト会話</p>
        </div>
        {getStatusBadge(conversation.status)}
      </div>

      {/* Initiator Info Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            {isInitiator ? "あなたの情報" : "スカウト送信者情報"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {conversation.initiatorInfo.organization && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{conversation.initiatorInfo.organization}</span>
            </div>
          )}
          {conversation.initiatorInfo.role && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{conversation.initiatorInfo.role}</span>
            </div>
          )}
          {conversation.initiatorInfo.projectSummary && (
            <div className="flex items-start gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-foreground">{conversation.initiatorInfo.projectSummary}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "user_me" ? "justify-end" : "justify-start"}`}
                >
                  {message.isSystem ? (
                    <div className="w-full text-center py-2">
                      <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        {message.content}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.senderId === "user_me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === "user_me" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          {isConversationActive && (
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="bg-secondary border-border text-foreground resize-none min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isConversationActive && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleWithdraw}
            className="flex-1 border-border text-muted-foreground hover:text-foreground bg-transparent"
          >
            <XCircle className="h-4 w-4 mr-2" />
            取り下げる
          </Button>
          <Button onClick={handleComplete} className="flex-1 bg-green-600 text-white hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            完了にする
          </Button>
        </div>
      )}

      {/* Status Messages */}
      {conversation.status === "completed" && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-400">この会話は完了しました</p>
          <p className="text-xs text-muted-foreground mt-1">
            完了日時: {formatDate(conversation.completedAt || "")}
          </p>
        </div>
      )}

      {conversation.status === "withdrawn" && (
        <div className="p-4 bg-secondary border border-border rounded-lg text-center">
          <XCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">この会話は取り下げられました</p>
        </div>
      )}

      <div className="p-4 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
        <p>この会話の内容はEpochには記録されません。</p>
        <p className="mt-1">記録されるのは: スカウト送信、承諾/辞退、完了/取り下げの事実のみです。</p>
      </div>
    </div>
  )
}
