"use client"

import { useParams } from "next/navigation"
import { FileText, Download, Send, Calendar, User, Briefcase, Target, AlertCircle, ArrowRight, ExternalLink } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/lib/i18n/context"

// Mock Pact Report data
const mockPactReport = {
  id: "report-3",
  type: "pact_report",
  status: "generated",
  generatedAt: "2026-01-15",
  
  // Employee info
  employee: {
    name: "Alex Thompson",
    role: "Marketing Specialist",
    department: "Marketing",
    hireDate: "2023-06-01",
  },
  
  // Report content (Pact Report specification)
  content: {
    roleDefinition: "Marketing Specialist は、マーケティング施策の企画・実行を通じて、リード獲得とブランド認知向上に貢献する役割である。",
    evaluationPeriod: "2025-07-15 〜 2026-01-15（6ヶ月）",
    
    continuationConditions: [
      "リード獲得数が月間目標の70%以上",
      "キャンペーン期限遵守率が80%以上",
      "コンテンツ品質スコアが75点以上",
    ],
    
    costEffectivenessNegativePoint: "2025-11-01",
    costEffectivenessReason: "リード獲得コストが業界平均の2.3倍に達し、費用対効果がマイナスに転じた。",
    
    unmetMetrics: [
      { name: "リード獲得数", threshold: "70%", actual: "45%", gap: "-25%" },
      { name: "キャンペーン期限遵守率", threshold: "80%", actual: "52%", gap: "-28%" },
      { name: "コンテンツ品質スコア", threshold: "75点", actual: "58点", gap: "-17点" },
    ],
    
    improvementConditions: [
      "リード獲得数を月間目標の70%に回復（現状+25%）",
      "キャンペーン期限遵守率を80%に改善（現状+28%）",
      "品質スコアを75点以上に向上（現状+17点）",
    ],
    
    strengths: [
      "SNSコンテンツの企画力（エンゲージメント率は平均を上回る）",
      "クリエイティブブリーフの作成能力",
      "ステークホルダーとのコミュニケーション能力",
    ],
    
    reemploymentSummary: "SNSマーケティングに特化した環境、または少量のキャンペーンを深く掘り下げる役割において、強みを発揮できる可能性がある。大量のキャンペーンを並行管理する環境よりも、集中型の業務形態が適している。",
  },
}

export default function PactReportDetailPage() {
  const params = useParams()
  const reportId = params.reportId as string
  const { t } = useI18n()

  const report = mockPactReport

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-red-500">
              Pact Report
            </Badge>
            <Badge variant="outline">
              {report.status === "generated" ? "生成済み" : "送信済み"}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            契約終了レポート
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            生成日: {report.generatedAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            PDF出力
          </Button>
          <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
            <Send className="h-4 w-4" />
            送信
          </Button>
        </div>
      </div>

      {/* Employee Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">被雇用者</p>
                <p className="font-medium">{report.employee.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">役割</p>
                <p className="font-medium">{report.employee.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">部門</p>
                <p className="font-medium">{report.employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">入社日</p>
                <p className="font-medium">{report.employee.hireDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Definition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">役割定義と評価期間</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground">{report.content.roleDefinition}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>評価期間: {report.content.evaluationPeriod}</span>
          </div>
        </CardContent>
      </Card>

      {/* Continuation Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">継続雇用が成立していた条件</CardTitle>
          <CardDescription>以下の条件を満たしていれば、契約は継続されていた</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {report.content.continuationConditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">・</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Cost Effectiveness */}
      <Card className="border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            費用対効果がマイナスに転じた時点
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium mb-2">{report.content.costEffectivenessNegativePoint}</p>
          <p className="text-sm text-muted-foreground">{report.content.costEffectivenessReason}</p>
        </CardContent>
      </Card>

      {/* Unmet Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">未達だった指標と閾値</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">指標</th>
                  <th className="text-right py-2 font-medium">閾値</th>
                  <th className="text-right py-2 font-medium">実績</th>
                  <th className="text-right py-2 font-medium text-red-500">差分</th>
                </tr>
              </thead>
              <tbody>
                {report.content.unmetMetrics.map((metric, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3">{metric.name}</td>
                    <td className="py-3 text-right text-muted-foreground">{metric.threshold}</td>
                    <td className="py-3 text-right">{metric.actual}</td>
                    <td className="py-3 text-right text-red-500">{metric.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">改善によって継続可能だった条件</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {report.content.improvementConditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">・</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator />

      {/* Strengths - Next World Line */}
      <Card className="border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-blue-500" />
            他環境で強みとなり得る要素
          </CardTitle>
          <CardDescription>次の世界線への提示</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-6">
            {report.content.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-blue-500">・</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Reemployment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">再就職時に利用可能な要約</CardTitle>
          <CardDescription>被雇用者本人が外部に提示できる内容</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">
            {report.content.reemploymentSummary}
          </p>
        </CardContent>
      </Card>

      {/* Footer note */}
      <div className="text-xs text-muted-foreground border-t border-border pt-6">
        <p className="mb-2">
          本レポートはPact仕様に基づいて自動生成されました。人格評価、断定的非難、感情的表現は含まれていません。
        </p>
        <p>
          被雇用者本人は、本レポートの全内容への閲覧権を持ちます。
        </p>
      </div>
    </div>
  )
}
