"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Minus, AlertTriangle, AlertCircle, LogOut, ArrowRight, FileText, Calendar, Target, Clock } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/lib/i18n/context"

// Mock employee data
const mockEmployeeData: Record<string, {
  name: string
  role: string
  department: string
  state: "growth" | "stable" | "warning" | "critical" | "exit"
  hireDate: string
  currentPeriodStart: string
  nextReview: string
  salaryRange: string
  metrics: {
    name: string
    current: number
    threshold: number
    upperThreshold: number
    trend: "up" | "down" | "stable"
  }[]
  stateHistory: {
    date: string
    from: string
    to: string
    reason: string
  }[]
  thresholds: {
    minimum: number
    warning: number
    critical: number
    upper: number
  }
}> = {
  "emp-1": {
    name: "John Smith",
    role: "Senior Engineer",
    department: "Engineering",
    state: "growth",
    hireDate: "2023-03-15",
    currentPeriodStart: "2025-11-15",
    nextReview: "2026-02-15",
    salaryRange: "$150,000 - $180,000",
    metrics: [
      { name: "アウトプット量", current: 95, threshold: 70, upperThreshold: 90, trend: "up" },
      { name: "品質指標", current: 92, threshold: 75, upperThreshold: 85, trend: "stable" },
      { name: "期限遵守率", current: 98, threshold: 80, upperThreshold: 95, trend: "up" },
      { name: "コスト効率", current: 88, threshold: 70, upperThreshold: 85, trend: "up" },
    ],
    stateHistory: [
      { date: "2026-01-22", from: "Stable", to: "Growth", reason: "上位達成閾値を3ヶ月連続で達成" },
      { date: "2025-08-15", from: "Warning", to: "Stable", reason: "品質指標が最低維持閾値を回復" },
      { date: "2025-05-01", from: "Stable", to: "Warning", reason: "期限遵守率が警告閾値を下回る" },
    ],
    thresholds: { minimum: 70, warning: 60, critical: 50, upper: 90 },
  },
  "emp-5": {
    name: "David Wilson",
    role: "Engineer",
    department: "Engineering",
    state: "critical",
    hireDate: "2024-05-01",
    currentPeriodStart: "2025-11-01",
    nextReview: "2026-02-01",
    salaryRange: "$90,000 - $110,000",
    metrics: [
      { name: "アウトプット量", current: 55, threshold: 70, upperThreshold: 90, trend: "down" },
      { name: "品質指標", current: 60, threshold: 75, upperThreshold: 85, trend: "down" },
      { name: "期限遵守率", current: 50, threshold: 80, upperThreshold: 95, trend: "down" },
      { name: "コスト効率", current: 65, threshold: 70, upperThreshold: 85, trend: "stable" },
    ],
    stateHistory: [
      { date: "2026-01-10", from: "Warning", to: "Critical", reason: "複数指標が危機閾値を下回る" },
      { date: "2025-12-01", from: "Stable", to: "Warning", reason: "期限遵守率が警告閾値を下回る" },
    ],
    thresholds: { minimum: 70, warning: 60, critical: 50, upper: 90 },
  },
}

const stateConfig = {
  growth: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", label: "Growth（昇給候補）" },
  stable: { icon: Minus, color: "text-blue-500", bg: "bg-blue-500/10", label: "Stable（維持）" },
  warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Warning（警告）" },
  critical: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10", label: "Critical（危機）" },
  exit: { icon: LogOut, color: "text-red-500", bg: "bg-red-500/10", label: "Exit（契約終了）" },
}

const defaultEmployee = mockEmployeeData["emp-1"]

export default function EmployeeDetailPage() {
  const params = useParams()
  const employeeId = params.employeeId as string
  const { t } = useI18n()
  
  const employee = mockEmployeeData[employeeId] || defaultEmployee
  const config = stateConfig[employee.state]
  const Icon = config.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-foreground">{employee.name}</h1>
            <Badge variant="secondary" className={`gap-1 ${config.color}`}>
              <Icon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">{employee.role} · {employee.department}</p>
        </div>
        <Link href={`/pact/reports/new?employee=${employeeId}`}>
          <Button variant="outline" className="gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            レポート生成
          </Button>
        </Link>
      </div>

      {/* Key Info */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">入社日</span>
            </div>
            <p className="font-medium">{employee.hireDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">評価期間開始</span>
            </div>
            <p className="font-medium">{employee.currentPeriodStart}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-xs">次回評価</span>
            </div>
            <p className="font-medium">{employee.nextReview}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="text-xs">現在の報酬レンジ</span>
            </div>
            <p className="font-medium">{employee.salaryRange}</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">指標（Ledger Layer）</CardTitle>
          <CardDescription>役割に定義された指標と現在値</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {employee.metrics.map((metric) => (
            <div key={metric.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{metric.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    metric.current >= metric.upperThreshold ? "text-green-500" :
                    metric.current >= metric.threshold ? "text-blue-500" :
                    metric.current >= employee.thresholds.warning ? "text-yellow-500" :
                    "text-orange-500"
                  }`}>
                    {metric.current}%
                  </span>
                  {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {metric.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                  {metric.trend === "stable" && <Minus className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
              <div className="relative">
                <Progress value={metric.current} className="h-2" />
                {/* Threshold markers */}
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-red-500" 
                  style={{ left: `${employee.thresholds.critical}%` }}
                  title={`危機閾値: ${employee.thresholds.critical}%`}
                />
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-yellow-500" 
                  style={{ left: `${employee.thresholds.warning}%` }}
                  title={`警告閾値: ${employee.thresholds.warning}%`}
                />
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-blue-500" 
                  style={{ left: `${metric.threshold}%` }}
                  title={`最低維持閾値: ${metric.threshold}%`}
                />
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-green-500" 
                  style={{ left: `${metric.upperThreshold}%` }}
                  title={`上位達成閾値: ${metric.upperThreshold}%`}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                <span>危機: {employee.thresholds.critical}%</span>
                <span>警告: {employee.thresholds.warning}%</span>
                <span>維持: {metric.threshold}%</span>
                <span>上位: {metric.upperThreshold}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* State History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">状態遷移履歴</CardTitle>
          <CardDescription>Threshold Engineによる状態変更の記録</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employee.stateHistory.map((history, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <span className="text-xs text-muted-foreground shrink-0 w-24">{history.date}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{history.from}</Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="secondary">{history.to}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{history.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions based on state */}
      {employee.state === "growth" && (
        <Card className="border-green-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">報酬改定の条件を満たしています</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  上位達成閾値を継続達成しているため、報酬レンジの切り替えが可能です。
                </p>
                <Button className="bg-green-500 hover:bg-green-600 text-background gap-2">
                  Salary Adjustment Notice を生成
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {employee.state === "critical" && (
        <Card className="border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-orange-500/10">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">危機状態が継続しています</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  複数の指標が危機閾値を下回っています。このまま改善がない場合、契約終了状態へ遷移します。
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    改善計画を確認
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent text-orange-500 border-orange-500/30">
                    Pact Report を準備
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
