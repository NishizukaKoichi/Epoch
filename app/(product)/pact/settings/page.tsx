"use client"

import { useState } from "react"
import { Settings, Shield, Bell, Database, Users, Lock, FileText, AlertTriangle } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18n } from "@/lib/i18n/context"

export default function PactSettingsPage() {
  const { t } = useI18n()
  const [notifyOnStateChange, setNotifyOnStateChange] = useState(true)
  const [notifyOnReportGenerated, setNotifyOnReportGenerated] = useState(true)
  const [notifyUpcomingReviews, setNotifyUpcomingReviews] = useState(true)
  const [autoGenerateReports, setAutoGenerateReports] = useState(false)
  const [employeeAccess, setEmployeeAccess] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {t("pact.settings")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pactシステムの設定と権限管理
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            通知設定
          </CardTitle>
          <CardDescription>
            状態遷移やレポート生成時の通知
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">状態遷移時に通知</Label>
              <p className="text-sm text-muted-foreground">
                被雇用者の状態が変化した時にメールで通知
              </p>
            </div>
            <Switch
              checked={notifyOnStateChange}
              onCheckedChange={setNotifyOnStateChange}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">レポート生成時に通知</Label>
              <p className="text-sm text-muted-foreground">
                レポートが自動生成された時に通知
              </p>
            </div>
            <Switch
              checked={notifyOnReportGenerated}
              onCheckedChange={setNotifyOnReportGenerated}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">評価期間終了の事前通知</Label>
              <p className="text-sm text-muted-foreground">
                評価期間終了の7日前に通知
              </p>
            </div>
            <Switch
              checked={notifyUpcomingReviews}
              onCheckedChange={setNotifyUpcomingReviews}
            />
          </div>
        </CardContent>
      </Card>

      {/* Report Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            レポート設定
          </CardTitle>
          <CardDescription>
            Decision Output Layerの動作設定
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">レポートの自動生成</Label>
              <p className="text-sm text-muted-foreground">
                状態遷移時にレポートを自動生成（手動承認は別途必要）
              </p>
            </div>
            <Switch
              checked={autoGenerateReports}
              onCheckedChange={setAutoGenerateReports}
            />
          </div>
          <Separator />
          <div>
            <Label className="font-medium mb-2 block">デフォルトの評価期間</Label>
            <Select defaultValue="90">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30日</SelectItem>
                <SelectItem value="60">60日</SelectItem>
                <SelectItem value="90">90日</SelectItem>
                <SelectItem value="180">180日</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            アクセス制御
          </CardTitle>
          <CardDescription>
            被雇用者の閲覧権限設定
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">被雇用者本人の閲覧権</Label>
              <p className="text-sm text-muted-foreground">
                被雇用者は自身のデータとレポートを閲覧可能
              </p>
            </div>
            <Switch
              checked={employeeAccess}
              onCheckedChange={setEmployeeAccess}
              disabled
            />
          </div>
          <p className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            Pact仕様により、被雇用者本人の閲覧権は常に保証されます。この設定は無効化できません。
          </p>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            セキュリティ
          </CardTitle>
          <CardDescription>
            データ保護と監査設定
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-medium">監査ログ保持期間</Label>
            <Select defaultValue="7years">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3years">3年</SelectItem>
                <SelectItem value="5years">5年</SelectItem>
                <SelectItem value="7years">7年</SelectItem>
                <SelectItem value="10years">10年</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="bg-muted/50 p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">データ改ざん防止</span>
            </div>
            <p className="text-xs text-muted-foreground">
              すべてのログは改ざん不可として保存されます。この設定は変更できません。
            </p>
          </div>
          <div className="bg-muted/50 p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ledger Layer</span>
            </div>
            <p className="text-xs text-muted-foreground">
              実績ログは不可逆な時系列データとして保存されます。削除や修正はできません。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            統合設定
          </CardTitle>
          <CardDescription>
            外部システムとの連携
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium mb-2 block">Epoch連携</Label>
            <p className="text-sm text-muted-foreground mb-2">
              状態遷移をEpochに不可逆な履歴として記録
            </p>
            <Button variant="outline" className="bg-transparent">
              Epochに接続
            </Button>
          </div>
          <Separator />
          <div>
            <Label className="font-medium mb-2 block">HRIS連携</Label>
            <p className="text-sm text-muted-foreground mb-2">
              人事システムから被雇用者データを同期
            </p>
            <Button variant="outline" className="bg-transparent">
              HRISを設定
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            注意が必要な操作
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">全データのエクスポート</Label>
              <p className="text-sm text-muted-foreground">
                すべての被雇用者データとレポートをエクスポート
              </p>
            </div>
            <Button variant="outline" className="bg-transparent">
              エクスポート
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          設定を保存
        </Button>
      </div>
    </div>
  )
}
