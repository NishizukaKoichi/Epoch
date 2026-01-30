"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, TrendingUp, Minus, LogOut, Eye, Download, Filter, Search, Plus } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18n } from "@/lib/i18n/context"

// Mock reports data
const mockReports = [
  {
    id: "report-1",
    type: "salary_adjustment" as const,
    employeeName: "John Smith",
    employeeId: "emp-1",
    role: "Senior Engineer",
    generatedAt: "2026-01-22",
    status: "generated" as const,
    summary: "上位達成閾値を3ヶ月連続で達成。報酬レンジの切り替え対象。",
  },
  {
    id: "report-2",
    type: "role_continuation" as const,
    employeeName: "Sarah Johnson",
    employeeId: "emp-2",
    role: "Product Manager",
    generatedAt: "2026-01-20",
    status: "sent" as const,
    summary: "すべての指標が最低維持閾値を上回り、役割を維持。",
  },
  {
    id: "report-3",
    type: "pact_report" as const,
    employeeName: "Alex Thompson",
    employeeId: "emp-7",
    role: "Marketing Specialist",
    generatedAt: "2026-01-15",
    status: "sent" as const,
    summary: "危機状態が90日継続。契約終了レポートを生成。",
  },
  {
    id: "report-4",
    type: "salary_adjustment" as const,
    employeeName: "Lisa Anderson",
    employeeId: "emp-6",
    role: "Marketing Lead",
    generatedAt: "2026-01-10",
    status: "sent" as const,
    summary: "上位達成閾値を達成。報酬レンジ切り替え完了。",
  },
]

const reportTypeConfig = {
  salary_adjustment: { 
    icon: TrendingUp, 
    color: "text-green-500", 
    bg: "bg-green-500/10", 
    label: "Salary Adjustment Notice" 
  },
  role_continuation: { 
    icon: Minus, 
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
    label: "Role Continuation Notice" 
  },
  pact_report: { 
    icon: LogOut, 
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    label: "Pact Report" 
  },
}

const statusConfig = {
  generated: { label: "生成済み", color: "text-yellow-500" },
  sent: { label: "送信済み", color: "text-green-500" },
  archived: { label: "アーカイブ", color: "text-muted-foreground" },
}

export default function PactReportsPage() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("pact.reports")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Decision Output Layer - 自動生成されたレポート
          </p>
        </div>
        <Link href="/pact/reports/new">
          <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
            <Plus className="h-4 w-4" />
            レポート生成
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="被雇用者名で検索..."
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="レポート種別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのレポート</SelectItem>
            <SelectItem value="salary_adjustment">Salary Adjustment Notice</SelectItem>
            <SelectItem value="role_continuation">Role Continuation Notice</SelectItem>
            <SelectItem value="pact_report">Pact Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const typeConfig = reportTypeConfig[report.type]
          const Icon = typeConfig.icon
          const status = statusConfig[report.status]
          
          return (
            <Card key={report.id} className="hover:border-violet-500/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Type indicator */}
                  <div className={`p-2 rounded-md ${typeConfig.bg} shrink-0`}>
                    <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-foreground">{typeConfig.label}</span>
                      <Badge variant="secondary" className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {report.employeeName} · {report.role}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {report.summary}
                    </p>
                  </div>
                  
                  {/* Date */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">生成日</p>
                    <p className="text-sm">{report.generatedAt}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/pact/reports/${report.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          該当するレポートが見つかりません
        </div>
      )}

      {/* Report Types Info */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-4">レポート種別について</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Salary Adjustment Notice</span>
              </div>
              <p className="text-xs text-muted-foreground">
                上位達成閾値を一定期間継続達成した場合に生成。報酬レンジの切り替えを通知。
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Minus className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Role Continuation Notice</span>
              </div>
              <p className="text-xs text-muted-foreground">
                評価期間終了時に最低維持閾値を上回っている場合に生成。役割の維持を通知。
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LogOut className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Pact Report</span>
              </div>
              <p className="text-xs text-muted-foreground">
                危機状態が定義された期間継続した場合に生成。契約終了と次の世界線を提示。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
