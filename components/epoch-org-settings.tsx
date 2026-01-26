"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EpochHeader } from "@/components/epoch-header"
import { EpochFooter } from "@/components/epoch-footer"
import { ArrowLeft, Building2, Shield, Trash2, AlertTriangle } from "@/components/icons"
import type { Organization } from "@/lib/types/organization"

interface EpochOrgSettingsProps {
  orgId: string
}

const mockOrg: Organization = {
  id: "org_001",
  name: "株式会社サンプル",
  slug: "sample-corp",
  createdAt: "2024-01-01T00:00:00Z",
  ownerId: "user_001",
  settings: {
    allowMemberEpochAccess: true,
    requireApprovalForJoin: true,
  },
}

export function EpochOrgSettings({ orgId }: EpochOrgSettingsProps) {
  const [orgName, setOrgName] = useState(mockOrg.name)
  const [orgSlug, setOrgSlug] = useState(mockOrg.slug)
  const [allowMemberAccess, setAllowMemberAccess] = useState(mockOrg.settings.allowMemberEpochAccess)
  const [requireApproval, setRequireApproval] = useState(mockOrg.settings.requireApprovalForJoin)

  const handleSave = () => {
    console.log("Saving org settings:", {
      name: orgName,
      slug: orgSlug,
      settings: {
        allowMemberEpochAccess: allowMemberAccess,
        requireApprovalForJoin: requireApproval,
      },
    })
  }

  const handleDeleteOrg = () => {
    console.log("Deleting organization:", orgId)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EpochHeader />

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/org/${orgId}`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            組織ダッシュボードに戻る
          </Link>
        </div>

        <h1 className="text-xl font-semibold text-foreground mb-6">組織設定</h1>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name" className="text-foreground">組織名</Label>
                <Input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-slug" className="text-foreground">スラッグ（URL用）</Label>
                <Input
                  id="org-slug"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  className="bg-secondary border-border text-foreground font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  URL: epoch.app/org/{orgSlug}
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  作成日: {new Date(mockOrg.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Access Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                アクセス設定
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                組織内でのEpoch閲覧権限を設定します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="member-access" className="text-foreground">
                    メンバー間のEpoch閲覧
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    有効にすると、組織メンバーは互いのEpochを閲覧できます（課金不要）
                  </p>
                </div>
                <Switch
                  id="member-access"
                  checked={allowMemberAccess}
                  onCheckedChange={setAllowMemberAccess}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-approval" className="text-foreground">
                    参加承認制
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    有効にすると、招待を受けたユーザーの参加に管理者の承認が必要になります
                  </p>
                </div>
                <Switch
                  id="require-approval"
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                />
              </div>

              <div className="p-3 bg-secondary/50 border border-border rounded-md">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  注意: 組織設定を変更しても、過去のRecordには影響しません。
                  すべてのRecordは不可逆であり、設定変更によって削除・編集されることはありません。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              変更を保存
            </Button>
          </div>

          {/* Danger Zone */}
          <Card className="bg-card border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                危険な操作
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm text-foreground">組織を削除</p>
                  <p className="text-xs text-muted-foreground">
                    組織を削除すると、メンバーの組織への所属は解除されます。
                    ただし、各メンバーのEpochは削除されません。
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      削除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">
                        組織を削除しますか？
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        この操作は取り消せません。組織「{orgName}」を削除すると：
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>すべてのメンバーの組織への所属が解除されます</li>
                          <li>部門構造が削除されます</li>
                          <li>組織内の閲覧権限が無効になります</li>
                        </ul>
                        <p className="mt-2">
                          ただし、各メンバーのEpochは削除されず、個人として継続利用できます。
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-border bg-transparent">
                        キャンセル
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteOrg}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <EpochFooter />
    </div>
  )
}
