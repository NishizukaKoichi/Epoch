"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Save, Trash2, ArrowUp, ArrowDown } from "@/components/icons"
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
import { usePactStore, type DataSourceType, dataSourceLabels } from "@/lib/pact/store"

interface MetricInput {
  name: string
  unit: string
  description: string
  dataSourceType: DataSourceType
  dataSourceName: string
  weight: number
  thresholds: { growth: number; stable: number; warning: number; critical: number }
  direction: "higher_is_better" | "lower_is_better"
}

export default function NewRolePage() {
  const router = useRouter()
  const { addRoleConfig } = usePactStore()
  
  const [roleName, setRoleName] = useState("")
  const [department, setDepartment] = useState("")
  const [description, setDescription] = useState("")
  const [evaluationPeriodDays, setEvaluationPeriodDays] = useState(30)
  const [metrics, setMetrics] = useState<MetricInput[]>([
    { 
      name: "", 
      unit: "",
      description: "",
      dataSourceType: "manual_admin",
      dataSourceName: "",
      weight: 100,
      thresholds: { growth: 100, stable: 80, warning: 60, critical: 40 },
      direction: "higher_is_better",
    },
  ])
  const [saving, setSaving] = useState(false)

  const addMetric = () => {
    setMetrics([...metrics, { 
      name: "", 
      unit: "",
      description: "",
      dataSourceType: "manual_admin",
      dataSourceName: "",
      weight: 0,
      thresholds: { growth: 100, stable: 80, warning: 60, critical: 40 },
      direction: "higher_is_better",
    }])
  }

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index))
  }

  const updateMetric = <K extends keyof MetricInput>(index: number, field: K, value: MetricInput[K]) => {
    const updated = [...metrics]
    updated[index] = { ...updated[index], [field]: value }
    setMetrics(updated)
  }

  const updateThreshold = (index: number, key: keyof MetricInput["thresholds"], value: number) => {
    const updated = [...metrics]
    updated[index] = { 
      ...updated[index], 
      thresholds: { ...updated[index].thresholds, [key]: value } 
    }
    setMetrics(updated)
  }

  const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0)

  const handleSave = () => {
    setSaving(true)
    addRoleConfig({
      roleName,
      department,
      description,
      evaluationPeriodDays,
      metrics: metrics
        .filter(m => m.name)
        .map(m => ({
          id: `metric-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          ...m,
        })),
    })
    router.push("/pact/thresholds")
  }

  const isValid = roleName && department && metrics.some(m => m.name) && totalWeight === 100

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">役割を追加</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          新しい役割の評価基準を作成します。どんな業種・職種でも使える汎用的な指標を設定できます。
        </p>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>役割名</Label>
              <Input
                placeholder="例: 営業マネージャー、製造ライン担当、..."
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>部署・チーム</Label>
              <Input
                placeholder="例: 営業部、製造部、..."
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>役割の説明（任意）</Label>
            <Textarea
              placeholder="この役割の責任範囲や期待される成果について"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>評価期間（日数）</Label>
            <Input
              type="number"
              value={evaluationPeriodDays}
              onChange={(e) => setEvaluationPeriodDays(Number(e.target.value))}
              min={7}
              max={365}
            />
            <p className="text-xs text-muted-foreground">
              この期間の実績データを集計して状態を判定します（例: 30日 = 月次評価）
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">評価指標</CardTitle>
          <CardDescription>
            重み付けの合計が100%になるように設定してください（現在: {totalWeight}%）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">指標 {index + 1}</span>
                {metrics.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMetric(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* 指標名と単位 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs">指標名</Label>
                  <Input
                    placeholder="例: 売上金額、生産数、顧客満足度、..."
                    value={metric.name}
                    onChange={(e) => updateMetric(index, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">単位</Label>
                  <Input
                    placeholder="例: 円、件、%、点"
                    value={metric.unit}
                    onChange={(e) => updateMetric(index, "unit", e.target.value)}
                  />
                </div>
              </div>

              {/* 説明 */}
              <div className="space-y-2">
                <Label className="text-xs">説明（任意）</Label>
                <Input
                  placeholder="この指標の測定方法や定義について"
                  value={metric.description}
                  onChange={(e) => updateMetric(index, "description", e.target.value)}
                />
              </div>

              {/* データソース */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">データ入力者</Label>
                  <Select 
                    value={metric.dataSourceType} 
                    onValueChange={(v) => updateMetric(index, "dataSourceType", v as DataSourceType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dataSourceLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">データソース名（任意）</Label>
                  <Input
                    placeholder="例: Salesforce、Jira、上長名、..."
                    value={metric.dataSourceName}
                    onChange={(e) => updateMetric(index, "dataSourceName", e.target.value)}
                  />
                </div>
              </div>

              {/* 重みと方向 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">重み (%)</Label>
                  <Input
                    type="number"
                    value={metric.weight}
                    onChange={(e) => updateMetric(index, "weight", Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">評価の方向</Label>
                  <Select 
                    value={metric.direction} 
                    onValueChange={(v) => updateMetric(index, "direction", v as "higher_is_better" | "lower_is_better")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="higher_is_better">
                        <span className="flex items-center gap-2">
                          <ArrowUp className="h-3 w-3 text-green-500" />
                          数値が高いほど良い
                        </span>
                      </SelectItem>
                      <SelectItem value="lower_is_better">
                        <span className="flex items-center gap-2">
                          <ArrowDown className="h-3 w-3 text-green-500" />
                          数値が低いほど良い
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* 閾値設定 */}
              <div className="space-y-2">
                <Label className="text-xs">
                  閾値設定（{metric.direction === "higher_is_better" ? "この値以上で各状態" : "この値以下で各状態"}）
                </Label>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                  <div className="space-y-1">
                    <span className="text-xs text-green-500">Growth（昇給候補）</span>
                    <Input
                      type="number"
                      value={metric.thresholds.growth}
                      onChange={(e) => updateThreshold(index, "growth", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-blue-500">Stable（維持）</span>
                    <Input
                      type="number"
                      value={metric.thresholds.stable}
                      onChange={(e) => updateThreshold(index, "stable", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-yellow-500">Warning（警告）</span>
                    <Input
                      type="number"
                      value={metric.thresholds.warning}
                      onChange={(e) => updateThreshold(index, "warning", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-orange-500">Critical（危機）</span>
                    <Input
                      type="number"
                      value={metric.thresholds.critical}
                      onChange={(e) => updateThreshold(index, "critical", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addMetric}
            className="w-full gap-2 bg-transparent"
          >
            <Plus className="h-4 w-4" />
            指標を追加
          </Button>
          {totalWeight !== 100 && (
            <p className="text-sm text-destructive">
              重み付けの合計は100%にしてください
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
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
          {saving ? "保存中..." : "作成する"}
        </Button>
      </div>
    </div>
  )
}
