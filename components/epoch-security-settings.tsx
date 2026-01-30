"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, Smartphone, Mail, Plus, Trash2 } from "@/components/icons"
import { EpochRecoveryDialog } from "./epoch-recovery-dialog"
import { useAuth } from "@/lib/auth/context"

export function EpochSecuritySettings() {
  const { credentials } = useAuth()
  const [showRecovery, setShowRecovery] = useState(false)

  const passkeys = credentials.filter((cred) => cred.type === "passkey")
  const emailCredential = credentials.find((cred) => cred.type === "email")

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Key className="h-5 w-5" />
            Passkey
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Passkeyは第一優先の認証方式です。Face ID、Touch ID、Windows Helloなどを使用できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passkeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">登録済みのPasskeyはありません。</p>
          ) : (
            passkeys.map((passkey) => (
              <div
                key={passkey.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20"
              >
                <div className="flex items-center gap-4">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{passkey.label}</p>
                    <p className="text-xs text-muted-foreground">
                      作成: {formatDate(passkey.verifiedAt)} / 最終使用: {formatDate(passkey.verifiedAt)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}

          <Button
            variant="outline"
            className="w-full border-dashed border-border text-muted-foreground hover:text-foreground bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Passkeyを追加
          </Button>

          <p className="text-xs text-muted-foreground">Passkeyの追加はログイン状態でのみ可能です。</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5" />
            メール認証
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Magic Linkは補助的な認証方式として使用されます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{emailCredential?.label ?? "未登録"}</p>
                <p className="text-xs text-muted-foreground">復旧用メールアドレス</p>
              </div>
            </div>
            <Badge variant="outline" className="border-green-500/30 text-green-400">
              {emailCredential ? "確認済み" : "未登録"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">アカウント復旧</CardTitle>
          <CardDescription className="text-muted-foreground">
            ログインできなくなった場合は、メールによる復旧が可能です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">
              復旧が行われた事実は <code className="text-foreground">auth_recovered</code>{" "}
              としてEpochRecordに記録されます。 この記録は削除できません。
            </p>
          </div>

          <Button variant="outline" onClick={() => setShowRecovery(true)} className="border-border text-foreground">
            復旧手続きを開始
          </Button>
        </CardContent>
      </Card>

      <EpochRecoveryDialog open={showRecovery} onOpenChange={setShowRecovery} />
    </div>
  )
}
