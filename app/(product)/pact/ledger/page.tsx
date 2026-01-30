"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Database, 
  Plus, 
  Search, 
  Calendar,
  User,
  TrendingUp,
  Clock,
  FileText,
  Filter,
  Trash2,
  AlertTriangle
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

export default function PactLedgerPage() {
  const { t } = useI18n()
  const { ledgerEntries, deleteLedgerEntry, employees } = usePactStore()
  const [search, setSearch] = useState("")
  const [metricFilter, setMetricFilter] = useState("all")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const uniqueMetrics = [...new Set(ledgerEntries.map(e => e.metric))]

  const filteredEntries = ledgerEntries.filter((entry) => {
    const matchesSearch = 
      entry.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      entry.metric.toLowerCase().includes(search.toLowerCase())
    const matchesMetric = metricFilter === "all" || entry.metric === metricFilter
    return matchesSearch && matchesMetric
  })

  const handleDelete = () => {
    if (deleteTarget) {
      deleteLedgerEntry(deleteTarget)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Ledger</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            実績ログ - 数値、期間、測定方法のみを継続的に記録
          </p>
        </div>
        <Link href="/pact/ledger/new">
          <Button className="bg-violet-500 hover:bg-violet-600 text-white gap-2">
            <Plus className="h-4 w-4" />
            記録を追加
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-violet-500/10">
                <Database className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ledgerEntries.length}</p>
                <p className="text-xs text-muted-foreground">総記録数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-500/10">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(ledgerEntries.map(e => e.employeeId)).size}
                </p>
                <p className="text-xs text-muted-foreground">被雇用者</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(ledgerEntries.map(e => e.metric)).size}
                </p>
                <p className="text-xs text-muted-foreground">指標種別</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2026-01</p>
                <p className="text-xs text-muted-foreground">現在の期間</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="名前または指標で検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={metricFilter} onValueChange={setMetricFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="指標を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての指標</SelectItem>
                {uniqueMetrics.map((metric) => (
                  <SelectItem key={metric} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            実績記録
          </CardTitle>
          <CardDescription>
            人格評価や感情的表現を含まない、数値データのみを記録
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>被雇用者</TableHead>
                <TableHead>指標</TableHead>
                <TableHead className="text-right">値</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>入力者</TableHead>
                <TableHead>記録日時</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Link 
                      href={`/pact/employees/${entry.employeeId}`}
                      className="font-medium hover:text-violet-500 transition-colors"
                    >
                      {entry.employeeName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.metric}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {entry.value.toLocaleString()}{entry.unit}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {entry.period}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {dataSourceLabels[entry.sourceType] || entry.sourceType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {entry.recordedAt}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredEntries.length === 0 && ledgerEntries.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              該当する記録がありません
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {ledgerEntries.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">記録がありません</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              {employees.length === 0 
                ? "まず被雇用者を追加してから、実績データを記録してください。"
                : "「記録を追加」から実績データを入力してください。データは手動入力またはシステム連携で取得できます。"
              }
            </p>
            <Link href={employees.length === 0 ? "/pact/employees/new" : "/pact/ledger/new"}>
              <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
                <Plus className="h-4 w-4" />
                {employees.length === 0 ? "被雇用者を追加" : "記録を追加"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>記録を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。削除した記録は状態評価の計算から除外されます。
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
