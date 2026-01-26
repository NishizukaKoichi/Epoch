"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Save, AlertCircle } from "@/components/icons"
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
import { useI18n } from "@/lib/i18n/context"
import { usePactStore } from "@/lib/pact/store"



export default function NewEmployeePage() {
  const { t } = useI18n()
  const router = useRouter()
  const { addEmployee, roleConfigs } = usePactStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [contractTerms, setContractTerms] = useState("")
  const [saving, setSaving] = useState(false)

  const selectedRole = roleConfigs.find(r => r.id === roleId)

  const handleSave = () => {
    if (!selectedRole) return
    setSaving(true)
    addEmployee({
      name,
      email,
      role: selectedRole.roleName,
      roleId: roleId,
      department: selectedRole.department,
      hireDate: startDate,
    })
    router.push("/pact/employees")
  }

  const isValid = name && email && roleId && startDate

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">被雇用者を追加</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          新しい被雇用者をPactに登録します。初期状態は「Stable」から開始します。
        </p>
      </div>

      {roleConfigs.length === 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            被雇用者を登録する前に、まず「役割・評価基準」で役割を定義してください。
            役割がないと評価基準が設定できません。
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            登録された被雇用者は、閾値設定に基づいて自動的に状態遷移が評価されます。
            人格評価ではなく、測定可能な実績データのみで判定されます。
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            基本情報
          </CardTitle>
          <CardDescription>
            被雇用者の基本的な情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label>氏名</Label>
            <Input
              placeholder="山田太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>メールアドレス</Label>
            <Input
              type="email"
              placeholder="yamada@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>役割（閾値設定）</Label>
            <Select value={roleId} onValueChange={setRoleId} disabled={roleConfigs.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={roleConfigs.length === 0 ? "役割を先に定義してください" : "役割を選択"} />
              </SelectTrigger>
              <SelectContent>
                {roleConfigs.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.roleName} ({r.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {roleConfigs.length === 0 && (
              <p className="text-xs text-destructive">
                役割が定義されていません。「役割・評価基準」から作成してください。
              </p>
            )}
            {selectedRole && (
              <p className="text-xs text-muted-foreground">
                部署: {selectedRole.department} - 閾値設定はこの役割に基づいて適用されます
              </p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>契約開始日</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Contract Terms */}
          <div className="space-y-2">
            <Label>契約条件メモ（任意）</Label>
            <Textarea
              placeholder="特記事項があれば記載..."
              value={contractTerms}
              onChange={(e) => setContractTerms(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              状態遷移の判定には使用されません
            </p>
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
              {saving ? "保存中..." : "登録する"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
