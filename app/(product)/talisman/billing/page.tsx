"use client"

import { useEffect, useState } from "react"
import { 
  CreditCard, 
  Plus, 
  Check, 
  Trash2,
  Shield,
  Clock,
  Sparkles,
  FileSignature,
  AlertTriangle,
  Zap
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { ensurePersonId } from "@/lib/talisman/client"

// Unified plans - all products included
const unifiedPlans = [
  { 
    id: "free", 
    name: "Free", 
    price: 0, 
    priceDisplay: "$0",
    description: "基本機能を無料で",
    features: [
      "Epoch: 自分のRecordの書き込み・閲覧",
      "Sigil: 3つまでのSpace作成",
      "Pact: 基本的な契約閲覧",
      "Talisman: 基本認証手段",
    ],
    limitations: [
      "他人のEpoch閲覧は別途課金",
      "Sigil公開Space制限あり",
    ]
  },
  { 
    id: "standard", 
    name: "Standard", 
    price: 3, 
    priceDisplay: "$3",
    description: "個人利用に最適",
    features: [
      "Freeの全機能",
      "Epoch: スカウト受信可能",
      "Sigil: 10個までのSpace作成",
      "Pact: レポート機能",
      "優先サポート",
    ],
    limitations: []
  },
  { 
    id: "pro", 
    name: "Pro", 
    price: 9, 
    priceDisplay: "$9",
    description: "プロフェッショナル向け",
    popular: true,
    features: [
      "Standardの全機能",
      "Epoch: 組織Epochの作成",
      "Sigil: 無制限のSpace作成",
      "Pact: 高度な分析・API連携",
      "監査ログ",
      "カスタム認証ポリシー",
    ],
    limitations: []
  },
  { 
    id: "enterprise", 
    name: "Enterprise", 
    price: 27, 
    priceDisplay: "$27",
    description: "組織・チーム向け",
    features: [
      "Proの全機能",
      "マルチメンバー管理",
      "組織全体の統合ダッシュボード",
      "専用サポート",
      "SLA保証",
      "カスタムインテグレーション",
    ],
    limitations: []
  },
]

type PaymentMethod = {
  id: string
  normalizedHash: string
  issuer: string
  issuedAt: string
}

export default function TalismanBillingPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [currentPlan, setCurrentPlan] = useState("free")
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [defaultCardId, setDefaultCardId] = useState<string | null>(null)
  const [personId, setPersonId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardholder, setCardholder] = useState("")

  const currentPlanData = unifiedPlans.find(p => p.id === currentPlan) ?? unifiedPlans[0]
  const monthlyPrice = currentPlanData?.price || 0

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const id = await ensurePersonId()
        if (!active) return
        setPersonId(id)

        const [credRes, subRes] = await Promise.all([
          fetch(`/api/v1/talisman/credentials?person_id=${encodeURIComponent(id)}`),
          fetch(`/api/v1/talisman/subscription?person_id=${encodeURIComponent(id)}`),
        ])

        if (!credRes.ok || !subRes.ok) {
          const payload = await credRes.json().catch(() => null)
          throw new Error(payload?.error || "課金情報の取得に失敗しました")
        }

        const credJson = (await credRes.json()) as {
          credentials: Array<{
            credential_id: string
            type: string
            normalized_hash: string
            issuer: string
            issued_at: string
            revoked_at: string | null
          }>
        }
        const subscriptionJson = (await subRes.json()) as {
          subscription: { plan_id: string } | null
        }

        if (!active) return
        const cards = credJson.credentials
          .filter((cred) => cred.type === "payment_card" && !cred.revoked_at)
          .map((cred) => ({
            id: cred.credential_id,
            normalizedHash: cred.normalized_hash,
            issuer: cred.issuer,
            issuedAt: cred.issued_at,
          }))
        setPaymentMethods(cards)
        setDefaultCardId(cards[0]?.id ?? null)
        setCurrentPlan(subscriptionJson.subscription?.plan_id ?? "free")
        setError(null)
      } catch (err) {
        if (!active) return
        const message = err instanceof Error ? err.message : "課金情報の取得に失敗しました"
        setError(message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!defaultCardId && paymentMethods.length > 0) {
      setDefaultCardId(paymentMethods[0].id)
    }
  }, [defaultCardId, paymentMethods])

  const handleAddCard = async () => {
    if (!personId) return
    const digits = cardNumber.replace(/\D/g, "")
    const last4 = digits.slice(-4)
    if (!last4) {
      setError("カード番号を入力してください")
      return
    }
    setIsSubmitting(true)
    try {
      const rawValue = `card:${last4}:${Date.now()}`
      const response = await fetch("/api/v1/talisman/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_id: personId,
          type: "payment_card",
          raw_value: rawValue,
          issuer: "billing-ui",
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "カードの登録に失敗しました")
      }
      const data = (await response.json()) as {
        credential_id: string
        normalized_hash: string
        issuer: string
        issued_at: string
      }
      const newCard: PaymentMethod = {
        id: data.credential_id,
        normalizedHash: data.normalized_hash,
        issuer: data.issuer,
        issuedAt: data.issued_at,
      }
      setPaymentMethods((prev) => [newCard, ...prev])
      setDefaultCardId((prev) => prev ?? newCard.id)
      setAddCardOpen(false)
      setCardNumber("")
      setExpiry("")
      setCvc("")
      setCardholder("")
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "カードの登録に失敗しました"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCard = async () => {
    if (!deleteCardId) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/v1/talisman/credentials/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential_id: deleteCardId, actor: "user" }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "カードの削除に失敗しました")
      }
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== deleteCardId))
      setDefaultCardId((prev) => (prev === deleteCardId ? null : prev))
      setDeleteCardId(null)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "カードの削除に失敗しました"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetDefault = (id: string) => {
    setDefaultCardId(id)
  }

  const handleChangePlan = async () => {
    if (!selectedPlan || !personId) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/v1/talisman/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person_id: personId, plan_id: selectedPlan }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "プラン更新に失敗しました")
      }
      setCurrentPlan(selectedPlan)
      setSelectedPlan(null)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "プラン更新に失敗しました"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">課金管理</h1>
        <p className="text-muted-foreground">
          支払い方法とプロダクトのサブスクリプションを管理
        </p>
      </div>

      {/* Current Plan & Monthly Total */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">現在のプラン</CardTitle>
            <Badge variant="outline" className="text-cyan-500 border-cyan-500">
              {currentPlanData?.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-light">
            ${monthlyPrice}
            <span className="text-lg text-muted-foreground ml-2">/月</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Epoch, Sigil, Pact, Talisman すべてのサービスを含む
          </p>
        </CardContent>
      </Card>

      {/* Included Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">含まれるサービス</CardTitle>
          <CardDescription>すべてのプランで以下のサービスにアクセスできます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-sm">Epoch</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-sm">Sigil</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <FileSignature className="h-5 w-5 text-violet-500" />
              <span className="font-medium text-sm">Pact</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Shield className="h-5 w-5 text-cyan-500" />
              <span className="font-medium text-sm">Talisman</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">支払い方法</CardTitle>
              <CardDescription>クレジットカード・デビットカード</CardDescription>
            </div>
            <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-white">
                  <Plus className="h-4 w-4" />
                  カードを追加
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>カードを追加</DialogTitle>
                  <DialogDescription>
                    新しいクレジットカードまたはデビットカードを登録します
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>カード番号</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>有効期限</Label>
                      <Input
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(event) => setExpiry(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>セキュリティコード</Label>
                      <Input
                        placeholder="CVC"
                        value={cvc}
                        onChange={(event) => setCvc(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>カード名義</Label>
                    <Input
                      placeholder="TARO YAMADA"
                      value={cardholder}
                      onChange={(event) => setCardholder(event.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddCardOpen(false)} className="bg-transparent">
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleAddCard}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "追加中..." : "追加"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                支払い方法が登録されていません
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div 
                  key={pm.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm capitalize">card</span>
                        <span className="text-sm text-muted-foreground">
                          •••• {pm.normalizedHash.slice(-4)}
                        </span>
                        {defaultCardId === pm.id && (
                          <Badge variant="secondary" className="text-xs">デフォルト</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        issuer: {pm.issuer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {defaultCardId !== pm.id && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSetDefault(pm.id)}
                      >
                        デフォルトに設定
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteCardId(pm.id)}
                      disabled={defaultCardId === pm.id && paymentMethods.length > 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unified Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">プラン変更</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {unifiedPlans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan
            return (
              <Card 
                key={plan.id}
                className={`relative ${
                  isCurrentPlan 
                    ? "border-cyan-500 border-2" 
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-cyan-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      人気
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="outline" className="text-xs">現在</Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-light">{plan.priceDisplay}</span>
                    <span className="text-sm text-muted-foreground">/月</span>
                  </div>
                  
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {!isCurrentPlan && (
                    <Button
                      variant={plan.price > monthlyPrice ? "default" : "outline"}
                      className={`w-full ${
                        plan.price > monthlyPrice 
                          ? "bg-cyan-500 hover:bg-cyan-600 text-white" 
                          : "bg-transparent"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                      disabled={isSubmitting || (paymentMethods.length === 0 && plan.price > 0)}
                      size="sm"
                    >
                      {plan.price > monthlyPrice ? "アップグレード" : plan.price < monthlyPrice ? "ダウングレード" : "変更"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* No Payment Method Warning */}
      {paymentMethods.length === 0 && !isLoading && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="flex items-start gap-4 pt-6">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">支払い方法が登録されていません</h4>
              <p className="text-sm text-muted-foreground">
                有料プランを利用するには、クレジットカードを登録してください。
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Card Dialog */}
      <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>カードを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              このカードを削除すると、支払いに使用できなくなります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "削除中..." : "削除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Plan Change Confirmation Dialog */}
      <AlertDialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>プランを変更しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPlan && (
                <>
                  <span className="font-medium">{currentPlanData?.name}</span> から{" "}
                  <span className="font-medium">{unifiedPlans.find(p => p.id === selectedPlan)?.name}</span> に変更します。
                  次回請求日から新しい料金が適用されます。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangePlan}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "更新中..." : "変更する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
