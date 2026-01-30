"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EpochProfileSettings } from "./epoch-profile-settings"
import { EpochBillingHistory } from "./epoch-billing-history"
import { EpochAuditLog } from "./epoch-audit-log"
import { EpochSecuritySettings } from "./epoch-security-settings"
import { EpochExportDialog } from "./epoch-export-dialog"
import { EpochSilenceSettings } from "./epoch-silence-settings"
import { EpochScoutSettings } from "./epoch-scout-settings"
import { Button } from "@/components/ui/button"
import { Download } from "@/components/icons"

export function EpochSettingsPage() {
  const [showExport, setShowExport] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">設定</h1>
        <Button
          variant="outline"
          onClick={() => setShowExport(true)}
          className="border-border text-foreground hover:bg-muted"
        >
          <Download className="h-4 w-4 mr-2" />
          データエクスポート
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background">
            プロフィール
          </TabsTrigger>
          <TabsTrigger value="scout" className="data-[state=active]:bg-background">
            スカウト
          </TabsTrigger>
          <TabsTrigger value="silence" className="data-[state=active]:bg-background">
            沈黙設定
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background">
            セキュリティ
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-background">
            課金
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-background">
            監査ログ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <EpochProfileSettings />
        </TabsContent>

        <TabsContent value="scout">
          <EpochScoutSettings />
        </TabsContent>

        <TabsContent value="silence">
          <EpochSilenceSettings />
        </TabsContent>

        <TabsContent value="security">
          <EpochSecuritySettings />
        </TabsContent>

        <TabsContent value="billing">
          <EpochBillingHistory />
        </TabsContent>

        <TabsContent value="audit">
          <EpochAuditLog />
        </TabsContent>
      </Tabs>

      <EpochExportDialog open={showExport} onOpenChange={setShowExport} />
    </div>
  )
}
