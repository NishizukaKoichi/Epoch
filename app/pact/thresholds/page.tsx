"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, AlertTriangle } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useI18n } from "@/lib/i18n/context"
import { usePactStore, dataSourceLabels } from "@/lib/pact/store"

export default function PactThresholdsPage() {
  const { t } = useI18n()
  const { roleConfigs, employees, deleteRoleConfig } = usePactStore()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const getEmployeeCount = (roleId: string) => {
    return employees.filter(e => e.roleId === roleId).length
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteRoleConfig(deleteTarget)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("pact.thresholds")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            役割ごとの閾値と状態遷移条件を設定
          </p>
        </div>
        <Link href="/pact/thresholds/new">
          <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
            <Plus className="h-4 w-4" />
            役割を追加
          </Button>
        </Link>
      </div>

      {/* Threshold Legend */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Growth（上位達成）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Stable（標準）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Warning（警告）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Critical（危機）</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Configurations */}
      <div className="space-y-4">
        {roleConfigs.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{role.roleName}</CardTitle>
                  <CardDescription>
                    {role.department} · {getEmployeeCount(role.id)}名が該当
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/pact/thresholds/${role.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 bg-transparent"
                    >
                      <Edit className="h-3 w-3" />
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(role.id)}
                    disabled={getEmployeeCount(role.id) > 0}
                    title={getEmployeeCount(role.id) > 0 ? "紐づく被雇用者がいるため削除できません" : "削除"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Metrics */}
              <div className="space-y-4">
                {role.metrics.map((metric, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{metric.name}</span>
                        <Badge variant="outline" className="text-xs">{metric.unit}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          {dataSourceLabels[metric.dataSourceType]}
                        </Badge>
                      </div>
                      <Badge variant="secondary">{metric.weight}%</Badge>
                    </div>
                    {metric.description && (
                      <p className="text-xs text-muted-foreground mb-2">{metric.description}</p>
                    )}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center p-2 rounded bg-green-500/10">
                        <span className="text-green-500 font-medium">Growth</span>
                        <p className="text-foreground mt-1">{metric.thresholds.growth}{metric.unit}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-blue-500/10">
                        <span className="text-blue-500 font-medium">Stable</span>
                        <p className="text-foreground mt-1">{metric.thresholds.stable}{metric.unit}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-yellow-500/10">
                        <span className="text-yellow-500 font-medium">Warning</span>
                        <p className="text-foreground mt-1">{metric.thresholds.warning}{metric.unit}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-orange-500/10">
                        <span className="text-orange-500 font-medium">Critical</span>
                        <p className="text-foreground mt-1">{metric.thresholds.critical}{metric.unit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roleConfigs.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">役割が定義されていません</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              被雇用者を追加する前に、まず役割と評価基準を定義してください。
              役割には評価指標、閾値、データソース（誰が数値を入力するか）を設定します。
            </p>
            <Link href="/pact/thresholds/new">
              <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
                <Plus className="h-4 w-4" />
                最初の役割を作成
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>役割を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。役割に紐づく評価指標と閾値設定も削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
