"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Shield, 
  ChevronLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  User, 
  Building2,
  AlertTriangle,
  RefreshCw
} from "@/components/icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"

// Mock credential data
const mockCredential = {
  id: "cred-1",
  type: "did:web",
  identifier: "did:web:example.com:users:alice",
  status: "active" as const,
  score: 92,
  issuedAt: "2025-06-15T10:00:00Z",
  expiresAt: "2026-06-15T10:00:00Z",
  issuer: {
    name: "Talisman Authority",
    did: "did:web:talisman.koichinishizuka.com",
  },
  subject: {
    name: "Alice",
    email: "alice@example.com",
  },
  flags: ["email_verified", "phone_verified", "kyc_completed"],
  verificationHistory: [
    { date: "2025-06-15", event: "Credential issued", status: "success" },
    { date: "2025-08-20", event: "Email re-verified", status: "success" },
    { date: "2025-12-01", event: "KYC renewal", status: "success" },
    { date: "2026-01-10", event: "Periodic verification", status: "success" },
  ],
}

export default function CredentialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const credentialId = params.credentialId as string

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "expired":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "revoked":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            資格証明の詳細
          </h1>
          <p className="text-sm text-muted-foreground">{credentialId}</p>
        </div>
        <Badge className={getStatusColor(mockCredential.status)}>
          {mockCredential.status === "active" ? "有効" : 
           mockCredential.status === "expired" ? "期限切れ" : "失効"}
        </Badge>
      </div>

      {/* Score Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">信頼スコア</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${mockCredential.score}, 100`}
                  className="text-cyan-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-foreground">{mockCredential.score}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                この資格証明の信頼スコアは高い状態です。
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {mockCredential.flags.map((flag) => (
                  <Badge key={flag} variant="secondary" className="text-xs">
                    {flag.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identifier */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            識別子
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">DID</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-muted px-3 py-2 rounded-md font-mono break-all">
                {mockCredential.identifier}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(mockCredential.identifier)}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">タイプ</p>
              <p className="text-sm font-medium">{mockCredential.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">発行日</p>
              <p className="text-sm font-medium">
                {new Date(mockCredential.issuedAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject & Issuer */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              対象者
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">名前</p>
              <p className="text-sm font-medium">{mockCredential.subject.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">メール</p>
              <p className="text-sm font-medium">{mockCredential.subject.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              発行者
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">名前</p>
              <p className="text-sm font-medium">{mockCredential.issuer.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">DID</p>
              <p className="text-sm font-mono text-xs break-all">{mockCredential.issuer.did}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            検証履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCredential.verificationHistory.map((event, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground w-24">
                  {new Date(event.date).toLocaleDateString("ja-JP")}
                </span>
                <span className="flex-1">{event.event}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          再検証
        </Button>
        <Button variant="outline" className="gap-2 text-destructive hover:text-destructive bg-transparent">
          <AlertTriangle className="h-4 w-4" />
          失効
        </Button>
      </div>
    </div>
  )
}
