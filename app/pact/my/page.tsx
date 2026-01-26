"use client"

import { useMemo } from "react"
import Link from "next/link"
import { 
  TrendingUp, 
  Minus,
  AlertTriangle,
  AlertCircle,
  LogOut,
  Target,
  FileText,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Info
} from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePactStore } from "@/lib/pact/store"

// For demo purposes, we're viewing as this employee
const CURRENT_USER_ID = "emp-1"

const stateConfig = {
  growth: { 
    icon: TrendingUp, 
    color: "text-green-500", 
    bg: "bg-green-500/10", 
    label: "Growth", 
    description: "昇給候補 - 上位達成閾値を達成しています",
  },
  stable: { 
    icon: Minus, 
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
    label: "Stable",
    description: "維持 - 最低維持閾値を満たしています",
  },
  warning: { 
    icon: AlertTriangle, 
    color: "text-yellow-500", 
    bg: "bg-yellow-500/10", 
    label: "Warning",
    description: "警告 - 一部の指標が閾値を下回っています",
  },
  critical: { 
    icon: AlertCircle, 
    color: "text-orange-500", 
    bg: "bg-orange-500/10", 
    label: "Critical",
    description: "危機 - 改善が必要です",
  },
  exit: { 
    icon: LogOut, 
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    label: "Exit",
    description: "契約終了 - Pact Reportが発行されます",
  },
}

export default function MyPactPage() {
  const { employees, roleConfigs, ledgerEntries, transitions, reports } = usePactStore()
  
  // Get current user's data
  const employee = employees.find(e => e.id === CURRENT_USER_ID)
  const roleConfig = roleConfigs.find(r => r.id === employee?.roleId)
  
  // Get this user's ledger entries
  const myLedgerEntries = useMemo(() => {
    return ledgerEntries.filter(e => e.employeeId === CURRENT_USER_ID)
  }, [ledgerEntries])
  
  // Get this user's transitions
  const myTransitions = useMemo(() => {
    return transitions.filter(t => t.employeeId === CURRENT_USER_ID)
  }, [transitions])
  
  // Get this user's reports
  const myReports = useMemo(() => {
    return reports.filter(r => r.employeeId === CURRENT_USER_ID)
  }, [reports])
  
  // Calculate current metrics vs thresholds
  const metricsWithStatus = useMemo(() => {
    if (!roleConfig) return []
    
    return roleConfig.metrics.map(metric => {
      // Find the latest ledger entry for this metric
      const latestEntry = myLedgerEntries
        .filter(e => e.metric === metric.name)
        .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0]
      
      const currentValue = latestEntry?.value ?? null
      
      // Determine status based on thresholds
      let status: "growth" | "stable" | "warning" | "critical" | "no-data" = "no-data"
      let toGrowth: number | null = null
      let toWarning: number | null = null
      
      if (currentValue !== null) {
        // For metrics where higher is better
        if (metric.thresholds.growth > metric.thresholds.critical) {
          if (currentValue >= metric.thresholds.growth) {
            status = "growth"
          } else if (currentValue >= metric.thresholds.stable) {
            status = "stable"
            toGrowth = metric.thresholds.growth - currentValue
          } else if (currentValue >= metric.thresholds.warning) {
            status = "warning"
            toGrowth = metric.thresholds.growth - currentValue
          } else {
            status = "critical"
            toWarning = metric.thresholds.warning - currentValue
          }
        } else {
          // For metrics where lower is better (e.g., response time)
          if (currentValue <= metric.thresholds.growth) {
            status = "growth"
          } else if (currentValue <= metric.thresholds.stable) {
            status = "stable"
            toGrowth = currentValue - metric.thresholds.growth
          } else if (currentValue <= metric.thresholds.warning) {
            status = "warning"
            toGrowth = currentValue - metric.thresholds.growth
          } else {
            status = "critical"
            toWarning = currentValue - metric.thresholds.warning
          }
        }
      }
      
      return {
        ...metric,
        currentValue,
        status,
        toGrowth,
        toWarning,
        lastRecorded: latestEntry?.recordedAt,
      }
    })
  }, [roleConfig, myLedgerEntries])

  if (!employee || !roleConfig) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">データが見つかりません</p>
      </div>
    )
  }

  const state = stateConfig[employee.state]
  const StateIcon = state.icon

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">マイページ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          あなたの評価基準と現在の実績を確認できます
        </p>
      </div>

      {/* Current State - Hero Card */}
      <Card className={`border-2 ${state.color.replace("text-", "border-")}/30`}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${state.bg}`}>
                <StateIcon className={`h-8 w-8 ${state.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">現在の状態</p>
                <p className={`text-2xl font-bold ${state.color}`}>{state.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{state.description}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">役割</p>
              <p className="font-semibold">{employee.role}</p>
              <p className="text-sm text-muted-foreground">{employee.department}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics - What you need to do */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-500" />
            評価指標と閾値
          </CardTitle>
          <CardDescription>
            あなたの役割に定義された評価基準です。各指標を満たすことで状態が決まります。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metricsWithStatus.map((metric, index) => {
            const statusConfig = metric.status === "no-data" 
              ? { color: "text-muted-foreground", bg: "bg-muted", icon: Info }
              : stateConfig[metric.status]
            const StatusIcon = statusConfig.icon
            
            return (
              <div key={index} className="p-4 rounded-lg border border-border">
                {/* Metric Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metric.name}</span>
                      <Badge variant="outline" className="text-xs">
                        重み {metric.weight}%
                      </Badge>
                    </div>
                    {metric.lastRecorded && (
                      <p className="text-xs text-muted-foreground mt-1">
                        最終記録: {metric.lastRecorded}
                      </p>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                    <span className={`text-sm font-medium ${statusConfig.color}`}>
                      {metric.currentValue !== null ? metric.currentValue : "データなし"}
                    </span>
                  </div>
                </div>

                {/* Thresholds Visualization */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className={`p-2 rounded text-center ${metric.status === "growth" ? "bg-green-500/20 ring-2 ring-green-500" : "bg-muted"}`}>
                    <p className="text-xs text-muted-foreground">Growth</p>
                    <p className={`font-mono font-semibold ${metric.status === "growth" ? "text-green-500" : ""}`}>
                      {metric.thresholds.growth}
                    </p>
                  </div>
                  <div className={`p-2 rounded text-center ${metric.status === "stable" ? "bg-blue-500/20 ring-2 ring-blue-500" : "bg-muted"}`}>
                    <p className="text-xs text-muted-foreground">Stable</p>
                    <p className={`font-mono font-semibold ${metric.status === "stable" ? "text-blue-500" : ""}`}>
                      {metric.thresholds.stable}
                    </p>
                  </div>
                  <div className={`p-2 rounded text-center ${metric.status === "warning" ? "bg-yellow-500/20 ring-2 ring-yellow-500" : "bg-muted"}`}>
                    <p className="text-xs text-muted-foreground">Warning</p>
                    <p className={`font-mono font-semibold ${metric.status === "warning" ? "text-yellow-500" : ""}`}>
                      {metric.thresholds.warning}
                    </p>
                  </div>
                  <div className={`p-2 rounded text-center ${metric.status === "critical" ? "bg-orange-500/20 ring-2 ring-orange-500" : "bg-muted"}`}>
                    <p className="text-xs text-muted-foreground">Critical</p>
                    <p className={`font-mono font-semibold ${metric.status === "critical" ? "text-orange-500" : ""}`}>
                      {metric.thresholds.critical}
                    </p>
                  </div>
                </div>

                {/* Action Required */}
                {metric.status !== "no-data" && metric.status !== "growth" && (
                  <div className={`p-3 rounded-md ${
                    metric.status === "critical" || metric.status === "warning" 
                      ? "bg-yellow-500/10 border border-yellow-500/20" 
                      : "bg-violet-500/10 border border-violet-500/20"
                  }`}>
                    {metric.toGrowth !== null && metric.toGrowth > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span>
                          <span className="font-semibold text-green-500">+{metric.toGrowth.toFixed(1)}</span>
                          {" "}でGrowth（昇給候補）に到達
                        </span>
                      </div>
                    )}
                    {metric.toWarning !== null && metric.toWarning > 0 && (
                      <div className="flex items-center gap-2 text-sm text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>
                          <span className="font-semibold">+{metric.toWarning.toFixed(1)}</span>
                          {" "}でWarningを脱出
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {metric.status === "growth" && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/20 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>この指標はGrowth閾値を達成しています</span>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* What happens next - State Transitions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">状態遷移の条件</CardTitle>
          <CardDescription>
            評価期間終了時に、指標の達成状況に基づいて状態が決定されます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-md bg-green-500/5 border border-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-600">Growth（昇給候補）</p>
                <p className="text-sm text-muted-foreground">
                  すべての指標がGrowth閾値を達成 → 報酬改定通知（Salary Adjustment Notice）が発行されます
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md bg-blue-500/5 border border-blue-500/20">
              <Minus className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-600">Stable（維持）</p>
                <p className="text-sm text-muted-foreground">
                  すべての指標がStable閾値以上 → 役割維持通知（Role Continuation Notice）が発行されます
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md bg-yellow-500/5 border border-yellow-500/20">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-600">Warning（警告）</p>
                <p className="text-sm text-muted-foreground">
                  一部の指標がWarning閾値を下回る → 改善期間が設けられます
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-md bg-orange-500/5 border border-orange-500/20">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-600">Critical（危機）</p>
                <p className="text-sm text-muted-foreground">
                  複数の指標がCritical閾値を下回る → Pact Report（契約終了レポート）の準備が開始されます
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My State History */}
      {myTransitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">あなたの状態遷移履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myTransitions.map((transition) => {
                const fromConfig = stateConfig[transition.fromState]
                const toConfig = stateConfig[transition.toState]
                return (
                  <div key={transition.id} className="flex items-start gap-4 p-3 rounded-md border border-border">
                    <div className="text-sm text-muted-foreground w-24 shrink-0">
                      {transition.date}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className={fromConfig.color}>
                          {fromConfig.label}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="outline" className={toConfig.color}>
                          {toConfig.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{transition.reason}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Reports */}
      {myReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">あなたに発行されたレポート</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/pact/reports/${report.id}`}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:border-violet-500/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {report.type === "salary_adjustment" && "報酬改定通知"}
                        {report.type === "role_continuation" && "役割維持通知"}
                        {report.type === "pact_report" && "Pact Report"}
                      </p>
                      <p className="text-xs text-muted-foreground">{report.generatedAt}</p>
                    </div>
                  </div>
                  <Badge variant={report.status === "delivered" ? "default" : "secondary"}>
                    {report.status === "draft" && "下書き"}
                    {report.status === "finalized" && "確定"}
                    {report.status === "delivered" && "送付済"}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Note */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Pactの原則:</strong> このシステムは人格評価を行いません。表示されるデータはすべてLedger Layerに記録された客観的な実績データに基づいています。
          基準は事前に定義され、事後的に変更されることはありません。
        </p>
      </div>
    </div>
  )
}
