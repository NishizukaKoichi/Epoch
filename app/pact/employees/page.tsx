"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, TrendingUp, Minus, AlertTriangle, AlertCircle, LogOut, Filter, Eye, Plus, Trash2 } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { usePactStore } from "@/lib/pact/store"

const stateConfig = {
  growth: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", label: "Growth" },
  stable: { icon: Minus, color: "text-blue-500", bg: "bg-blue-500/10", label: "Stable" },
  warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Warning" },
  critical: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10", label: "Critical" },
  exit: { icon: LogOut, color: "text-red-500", bg: "bg-red-500/10", label: "Exit" },
}

export default function PactEmployeesPage() {
  const { t } = useI18n()
  const { employees, deleteEmployee, roleConfigs } = usePactStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [stateFilter, setStateFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEmployee(deleteTarget)
      setDeleteTarget(null)
    }
  }

  const departments = [...new Set(employees.map(e => e.department))]

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = stateFilter === "all" || emp.state === stateFilter
    const matchesDept = departmentFilter === "all" || emp.department === departmentFilter
    return matchesSearch && matchesState && matchesDept
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("pact.employees")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {employees.length}名の被雇用者
          </p>
        </div>
        <Link href="/pact/employees/new">
          <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
            <Plus className="h-4 w-4" />
            被雇用者を追加
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
            placeholder="名前または役割で検索..."
            className="pl-9"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="状態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての状態</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="stable">Stable</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="exit">Exit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="部門" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての部門</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employee List */}
      <div className="space-y-3">
        {filteredEmployees.map((employee) => {
          const config = stateConfig[employee.state]
          const Icon = config.icon
          
          return (
            <Card key={employee.id} className="hover:border-violet-500/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* State indicator */}
                  <div className={`p-2 rounded-md ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        href={`/pact/employees/${employee.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {employee.name}
                      </Link>
                      <Badge variant="secondary">{config.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {employee.role} · {employee.department}
                    </p>
                  </div>
                  
                  {/* Last evaluated */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">最終評価日</p>
                    <p className="text-sm">{employee.lastEvaluated}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Link href={`/pact/employees/${employee.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEmployees.length === 0 && employees.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">被雇用者がいません</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              {roleConfigs.length === 0 
                ? "まず「役割・評価基準」で役割を定義してから、被雇用者を追加してください。"
                : "「被雇用者を追加」から新しい被雇用者を登録してください。"
              }
            </p>
            {roleConfigs.length === 0 ? (
              <Link href="/pact/thresholds/new">
                <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
                  <Plus className="h-4 w-4" />
                  役割を定義する
                </Button>
              </Link>
            ) : (
              <Link href="/pact/employees/new">
                <Button className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
                  <Plus className="h-4 w-4" />
                  被雇用者を追加
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {filteredEmployees.length === 0 && employees.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          該当する被雇用者が見つかりません
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>被雇用者を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。この被雇用者に紐づくLedger記録や状態遷移履歴も参照できなくなります。
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
