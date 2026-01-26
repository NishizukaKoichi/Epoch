"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowRight, 
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  XCircle
} from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock transitions data
const mockTransitions = [
  {
    id: "tr-001",
    employeeId: "emp-001",
    employeeName: "山田太郎",
    role: "Senior Engineer",
    from: "Stable",
    to: "Growth",
    date: "2026-01-20",
    triggeredBy: "上位達成閾値を3ヶ月継続達成",
    metrics: ["コード品質スコア: 92", "期限遵守率: 95"],
  },
  {
    id: "tr-002",
    employeeId: "emp-002",
    employeeName: "佐藤花子",
    role: "Product Manager",
    from: "Warning",
    to: "Stable",
    date: "2026-01-18",
    triggeredBy: "最低維持閾値を回復",
    metrics: ["プロジェクト完了率: 82"],
  },
  {
    id: "tr-003",
    employeeId: "emp-003",
    employeeName: "鈴木一郎",
    role: "Designer",
    from: "Stable",
    to: "Warning",
    date: "2026-01-15",
    triggeredBy: "最低維持閾値を下回る",
    metrics: ["デザインレビュー承認率: 58"],
  },
  {
    id: "tr-004",
    employeeId: "emp-004",
    employeeName: "田中美咲",
    role: "Sales Representative",
    from: "Warning",
    to: "Critical",
    date: "2026-01-10",
    triggeredBy: "警告状態が60日継続",
    metrics: ["成約率: 45", "商談進捗率: 52"],
  },
  {
    id: "tr-005",
    employeeId: "emp-005",
    employeeName: "高橋健太",
    role: "Customer Success",
    from: "Critical",
    to: "Exit",
    date: "2026-01-05",
    triggeredBy: "危機状態が90日継続、改善なし",
    metrics: ["顧客満足度: 42", "チャーン率: 15%"],
  },
  {
    id: "tr-006",
    employeeId: "emp-006",
    employeeName: "伊藤直樹",
    role: "Engineer",
    from: "Growth",
    to: "Stable",
    date: "2026-01-03",
    triggeredBy: "評価期間リセット",
    metrics: [],
  },
]

const stateConfig = {
  Growth: { color: "text-green-500", bg: "bg-green-500/10", icon: TrendingUp },
  Stable: { color: "text-blue-500", bg: "bg-blue-500/10", icon: Minus },
  Warning: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: AlertTriangle },
  Critical: { color: "text-red-500", bg: "bg-red-500/10", icon: TrendingDown },
  Exit: { color: "text-gray-500", bg: "bg-gray-500/10", icon: XCircle },
}

type TransitionType = "all" | "positive" | "negative"

export default function TransitionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<TransitionType>("all")

  const filteredTransitions = mockTransitions.filter((tr) => {
    const matchesSearch = 
      tr.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.role.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    if (typeFilter === "positive") {
      return (
        (tr.from === "Stable" && tr.to === "Growth") ||
        (tr.from === "Warning" && tr.to === "Stable") ||
        (tr.from === "Critical" && tr.to === "Warning")
      )
    }
    if (typeFilter === "negative") {
      return (
        (tr.from === "Growth" && tr.to === "Stable") ||
        (tr.from === "Stable" && tr.to === "Warning") ||
        (tr.from === "Warning" && tr.to === "Critical") ||
        (tr.from === "Critical" && tr.to === "Exit")
      )
    }
    return true
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">状態遷移履歴</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          すべての状態遷移の記録
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="名前または役割で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransitionType)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="種類" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="positive">上昇遷移</SelectItem>
            <SelectItem value="negative">下降遷移</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transitions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">遷移履歴</CardTitle>
          <CardDescription>
            {filteredTransitions.length}件の遷移
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransitions.map((transition) => {
              const fromState = stateConfig[transition.from as keyof typeof stateConfig]
              const toState = stateConfig[transition.to as keyof typeof stateConfig]
              const FromIcon = fromState.icon
              const ToIcon = toState.icon

              return (
                <div 
                  key={transition.id}
                  className="p-4 rounded-md border border-border hover:border-violet-500/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="text-sm text-muted-foreground w-24 shrink-0">
                        {transition.date}
                      </div>
                      <div>
                        <Link 
                          href={`/pact/employees/${transition.employeeId}`}
                          className="font-medium hover:text-violet-500 transition-colors"
                        >
                          {transition.employeeName}
                        </Link>
                        <p className="text-sm text-muted-foreground">{transition.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`gap-1 ${fromState.color}`}>
                        <FromIcon className="h-3 w-3" />
                        {transition.from}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className={`gap-1 ${toState.color}`}>
                        <ToIcon className="h-3 w-3" />
                        {transition.to}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 pl-28 sm:pl-28">
                    <p className="text-sm text-muted-foreground">
                      {transition.triggeredBy}
                    </p>
                    {transition.metrics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {transition.metrics.map((metric, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
