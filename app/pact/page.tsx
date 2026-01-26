"use client"

import Link from "next/link"
import { TrendingUp, Minus, AlertTriangle, AlertCircle, LogOut, Users, ArrowRight, Plus, Settings, Database, FileText } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"
import { usePactStore } from "@/lib/pact/store"

const stateConfig = {
  growth: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", label: "Growth" },
  stable: { icon: Minus, color: "text-blue-500", bg: "bg-blue-500/10", label: "Stable" },
  warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Warning" },
  critical: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10", label: "Critical" },
  exit: { icon: LogOut, color: "text-red-500", bg: "bg-red-500/10", label: "Exit" },
}

export default function PactDashboardPage() {
  const { t } = useI18n()
  const { employees, transitions, roleConfigs, ledgerEntries } = usePactStore()
  
  const stateCounts = {
    growth: employees.filter(e => e.state === "growth").length,
    stable: employees.filter(e => e.state === "stable").length,
    warning: employees.filter(e => e.state === "warning").length,
    critical: employees.filter(e => e.state === "critical").length,
    exit: employees.filter(e => e.state === "exit").length,
  }
  
  const totalEmployees = employees.length
  
  // Show employees sorted by last evaluated date
  const recentlyEvaluated = employees
    .sort((a, b) => new Date(b.lastEvaluated).getTime() - new Date(a.lastEvaluated).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("pact.dashboard")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            契約状態の概要と最近の遷移
          </p>
        </div>
        <Link href="/pact/employees">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Users className="h-4 w-4" />
            全被雇用者を見る
          </Button>
        </Link>
      </div>

      {/* Setup Guide - shown when nothing is configured */}
      {roleConfigs.length === 0 && (
        <Card className="border-violet-500/50 bg-violet-500/5">
          <CardHeader>
            <CardTitle className="text-base">Pactを始めましょう</CardTitle>
            <CardDescription>
              以下のステップでセットアップを完了してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-md bg-muted/50">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-violet-500 text-white text-sm font-bold shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">役割と評価基準を定義</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    どんな業種・職種でも使える汎用的な評価指標と閾値を設定します。
                    「誰がデータを入力するか」も指定できます。
                  </p>
                  <Link href="/pact/thresholds/new">
                    <Button size="sm" className="mt-2 gap-2 bg-violet-500 hover:bg-violet-600 text-white">
                      <Settings className="h-3 w-3" />
                      役割を作成
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-md bg-muted/30 opacity-60">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground text-sm font-bold shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">被雇用者を登録</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    役割を作成後、被雇用者を登録できます。初期状態は「Stable」から開始します。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-md bg-muted/30 opacity-60">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground text-sm font-bold shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">実績データを記録</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ledgerに数値データを記録します。管理者手動入力、本人申告、システム連携など様々な方法に対応。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* State Overview */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        {(Object.keys(stateConfig) as Array<keyof typeof stateConfig>).map((state) => {
          const config = stateConfig[state]
          const Icon = config.icon
          const count = stateCounts[state]
          
          return (
            <Card key={state}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${config.bg}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Total */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>合計 {totalEmployees} 名の被雇用者</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent State Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近の状態遷移</CardTitle>
            <CardDescription>過去7日間の状態変更</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transitions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  まだ状態遷移がありません
                </div>
              )}
              {transitions.slice(0, 5).map((change) => {
                const prevConfig = stateConfig[change.fromState]
                const currConfig = stateConfig[change.toState]
                const PrevIcon = prevConfig.icon
                const CurrIcon = currConfig.icon
                
                return (
                  <div key={change.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link 
                          href={`/pact/employees/${change.employeeId}`}
                          className="font-medium text-sm text-foreground hover:underline"
                        >
                          {change.employeeName}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className={`gap-1 ${prevConfig.color}`}>
                          <PrevIcon className="h-3 w-3" />
                          {prevConfig.label}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className={`gap-1 ${currConfig.color}`}>
                          <CurrIcon className="h-3 w-3" />
                          {currConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{change.reason}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{change.date}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recently Evaluated */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最近評価された被雇用者</CardTitle>
            <CardDescription>直近で状態評価が行われた被雇用者</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyEvaluated.map((employee) => {
                const config = stateConfig[employee.state]
                const Icon = config.icon
                return (
                  <div 
                    key={employee.id} 
                    className="flex items-center justify-between p-3 rounded-md border border-border hover:border-violet-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${config.bg}`}>
                        <Icon className={`h-3 w-3 ${config.color}`} />
                      </div>
                      <div>
                        <Link 
                          href={`/pact/employees/${employee.id}`}
                          className="font-medium text-sm text-foreground hover:underline"
                        >
                          {employee.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{employee.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={config.color}>{config.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{employee.lastEvaluated}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {recentlyEvaluated.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                被雇用者が登録されていません
              </div>
            )}
            {recentlyEvaluated.length > 0 && (
              <Link href="/pact/employees" className="block mt-4">
                <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                  すべて見る
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
