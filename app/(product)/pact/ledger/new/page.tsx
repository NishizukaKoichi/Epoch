"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Database, Save, AlertCircle } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "@/components/ui/alert"
import { usePactStore, type DataSourceType, dataSourceLabels } from "@/lib/pact/store"

export default function NewLedgerEntryPage() {
  const router = useRouter()
  const { employees, roleConfigs, addLedgerEntry } = usePactStore()
  const [employeeId, setEmployeeId] = useState("")
  const [metricId, setMetricId] = useState("")
  const [value, setValue] = useState("")
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7))
  const [sourceType, setSourceType] = useState<DataSourceType>("manual_admin")
  const [sourceName, setSourceName] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  const selectedEmployee = employees.find(e => e.id === employeeId)
  const selectedRole = roleConfigs.find(r => r.id === selectedEmployee?.roleId)
  
  // Get available metrics for the selected employee's role
  const availableMetrics = useMemo(() => {
    if (!selectedRole) return []
    return selectedRole.metrics
  }, [selectedRole])

  const selectedMetric = availableMetrics.find(m => m.id === metricId)

  const handleSave = () => {
    if (!selectedEmployee || !selectedMetric) return
    
    setSaving(true)
    addLedgerEntry({
      employeeId,
      employeeName: selectedEmployee.name,
      metric: selectedMetric.name,
      value: Number(value),
      unit: selectedMetric.unit,
      period,
      sourceType,
      sourceName: sourceName || dataSourceLabels[sourceType],
      recordedBy: "管理者",
      note: note || undefined,
    })
    router.push("/pact/ledger")
  }

  const isValid = employeeId && metricId && value && period

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">実績を記録</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          数値データのみを記録します。人格評価や感情的表現は含めません。
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Ledgerに記録されたデータは、閾値エンジンによって自動的に評価され、状態遷移の判定に使用されます。
        </AlertDescription>
      </Alert>

      {employees.length === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            記録を追加する前に、被雇用者を登録してください。
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            新規記録
          </CardTitle>
          <CardDescription>
            測定可能な数値データを入力してください。指標は被雇用者の役割に紐づいた項目から選択します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee */}
          <div className="space-y-2">
            <Label>被雇用者</Label>
            <Select value={employeeId} onValueChange={(v) => { setEmployeeId(v); setMetricId(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="被雇用者を選択" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}（{emp.role}）
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {employees.length === 0 && (
              <p className="text-xs text-destructive">被雇用者が登録されていません</p>
            )}
          </div>

          {/* Metric - based on employee's role */}
          <div className="space-y-2">
            <Label>指標</Label>
            <Select 
              value={metricId} 
              onValueChange={setMetricId}
              disabled={!employeeId || availableMetrics.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={employeeId ? "指標を選択" : "先に被雇用者を選択"} />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics.map((metric) => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name}（{metric.unit}）
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {employeeId && availableMetrics.length === 0 && (
              <p className="text-xs text-destructive">
                この被雇用者の役割には評価指標が設定されていません
              </p>
            )}
            {selectedMetric?.description && (
              <p className="text-xs text-muted-foreground">{selectedMetric.description}</p>
            )}
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label>値</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="数値を入力"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1"
              />
              {selectedMetric && (
                <span className="text-sm text-muted-foreground w-20">
                  {selectedMetric.unit}
                </span>
              )}
            </div>
            {selectedMetric && (
              <p className="text-xs text-muted-foreground">
                閾値: Growth {selectedMetric.thresholds.growth}{selectedMetric.unit} / 
                Stable {selectedMetric.thresholds.stable}{selectedMetric.unit} / 
                Warning {selectedMetric.thresholds.warning}{selectedMetric.unit} / 
                Critical {selectedMetric.thresholds.critical}{selectedMetric.unit}
              </p>
            )}
          </div>

          {/* Period */}
          <div className="space-y-2">
            <Label>評価期間</Label>
            <Input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              この実績が対象とする期間
            </p>
          </div>

          {/* Data Source Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>データ入力者</Label>
              <Select value={sourceType} onValueChange={(v) => setSourceType(v as DataSourceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dataSourceLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>データソース名（任意）</Label>
              <Input
                placeholder="例: Salesforce、上長名、..."
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>メモ（任意）</Label>
            <Textarea
              placeholder="この記録に関する補足情報"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-transparent"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid || saving}
              className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "保存中..." : "記録する"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
