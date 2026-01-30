"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  User,
  Calendar,
  Target,
  TrendingDown,
  Lightbulb,
  ArrowRight
} from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

// Mock employees in Critical/Exit state
const eligibleEmployees = [
  { id: "emp-004", name: "田中美咲", role: "Sales Representative", state: "Critical", daysInState: 45 },
  { id: "emp-005", name: "高橋健太", role: "Customer Success", state: "Exit", daysInState: 90 },
]

// Report sections as per spec
const reportSections = [
  { id: "role_definition", title: "役割定義と評価期間", icon: User },
  { id: "continuation_conditions", title: "継続雇用が成立していた条件", icon: CheckCircle2 },
  { id: "cost_effectiveness", title: "費用対効果がマイナスに転じた時点", icon: TrendingDown },
  { id: "unmet_metrics", title: "未達だった指標と閾値", icon: Target },
  { id: "improvement_path", title: "改善によって継続可能だった条件", icon: ArrowRight },
  { id: "strengths", title: "他環境で強みとなり得る要素", icon: Lightbulb },
  { id: "summary", title: "再就職時に利用可能な要約", icon: FileText },
]

export default function GenerateReportPage() {
  const router = useRouter()
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)

  const employee = eligibleEmployees.find(e => e.id === selectedEmployee)

  const handleGenerate = () => {
    setGenerating(true)
    // Simulate generation
    setTimeout(() => {
      router.push("/pact/reports/rpt-new")
    }, 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pact Report 生成</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          契約終了レポートを生成します
        </p>
      </div>

      {/* Warning */}
      <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-500">重要な確認事項</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Pact Reportは契約終了の公式文書です。生成前に以下を確認してください：
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>被雇用者が Critical または Exit 状態であること</li>
            <li>すべての指標データが最新であること</li>
            <li>法務部門への事前確認が完了していること</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Step 1: Select Employee */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 1: 対象者の選択</CardTitle>
            <CardDescription>
              Critical または Exit 状態の被雇用者のみ選択可能です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>対象者</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="被雇用者を選択" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      <div className="flex items-center gap-2">
                        <span>{emp.name}</span>
                        <Badge 
                          variant="outline" 
                          className={emp.state === "Exit" ? "text-gray-500" : "text-red-500"}
                        >
                          {emp.state}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {employee && (
              <div className="p-4 rounded-md bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">役割</span>
                  <span className="text-sm">{employee.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">現在の状態</span>
                  <Badge variant="outline" className={employee.state === "Exit" ? "text-gray-500" : "text-red-500"}>
                    {employee.state}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">状態継続日数</span>
                  <span className="text-sm">{employee.daysInState}日</span>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedEmployee}
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                次へ
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review Sections */}
      {step === 2 && employee && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 2: レポート構成の確認</CardTitle>
            <CardDescription>
              以下のセクションが自動生成されます（仕様に基づく必須項目）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {reportSections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div 
                    key={section.id}
                    className="flex items-center gap-3 p-3 rounded-md border border-border"
                  >
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <Icon className="h-4 w-4 text-violet-500" />
                    <span className="text-sm">{section.title}</span>
                    <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
                  </div>
                )
              })}
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>禁止事項</AlertTitle>
              <AlertDescription className="text-sm">
                レポートには以下を含めることが禁止されています：
                人格評価、断定的非難、感情的表現、主語が「あなた」の文章
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>追加メモ（任意、社内用）</Label>
              <Textarea 
                placeholder="法務確認済み、HR承認済みなどの社内メモを入力..."
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                このメモはレポートには含まれず、社内記録としてのみ保存されます
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                戻る
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={generating}
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                {generating ? "生成中..." : "レポートを生成"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Principles reminder */}
      <Card className="border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-base">Pact Report の原則</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pact Reportは、安全確保と未来提示を目的とした公式文書です。
            目的は納得させることではなく、世界が連続していると理解させることです。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
