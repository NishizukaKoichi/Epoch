"use client"

import { useState } from "react"
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
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"

// Mock data
const mockPaymentMethods = [
  { id: "pm-1", type: "card", brand: "visa", last4: "4242", expMonth: 12, expYear: 2027, isDefault: true },
]

const mockSubscriptions = [
  { productId: "product-1", planId: "free" },
]

const products = [
  {
    id: "product-1",
    name: "Product 1",
    description: "Description for Product 1",
    icon: Shield,
    bgColor: "bg-blue-500",
    color: "text-white",
    plans: [
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
    ],
  },
  // Additional products can be added here
];

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

// Current subscription (mock)
const mockCurrentPlan = "free"

function getCurrentPlan(productId: string): string {
  const subscription = mockSubscriptions.find(s => s.productId === productId);
  return subscription ? subscription.planId : "";
}

function handleUpgrade(upgradePlan: { productId: string, planId: string }) {
  // Mock: upgrade plan
  console.log(`Upgrading to plan ${upgradePlan.planId} for product ${upgradePlan.productId}`);
}

export default function TalismanBillingPage() {
  const { t } = useI18n()
  const { addCredential } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [currentPlan, setCurrentPlan] = useState(mockCurrentPlan)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [upgradePlanState, setUpgradePlan] = useState<{ productId: string, planId: string } | null>(null)
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)
  const [totalMonthly, setTotalMonthly] = useState<number>(0)

  const currentPlanData = unifiedPlans.find(p => p.id === currentPlan)
  const monthlyPrice = currentPlanData?.price || 0

  const handleAddCard = () => {
    const cardId = `pm-${Date.now()}`
    const last4 = "8888" // 実際はフォームから取得
    const brand = "mastercard" // 実際はフォームから取得
    
    // 支払い方法を追加
    setPaymentMethods([
      ...paymentMethods,
      { id: cardId, type: "card", brand, last4, expMonth: 6, expYear: 2028, isDefault: false }
    ])
    
    // クレジットカードもCredentialとして追加（支払い能力の証明）
    addCredential({
      id: `cred-card-${cardId}`,
      type: "recovery", // カードは"recovery"タイプとして扱う（バックアップ的な認証手段）
      label: `${brand.toUpperCase()} •••• ${last4}`,
      verifiedAt: new Date().toISOString(),
    })
    
    setAddCardOpen(false)
  }

  const handleDeleteCard = () => {
    if (deleteCardId) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== deleteCardId))
      setDeleteCardId(null)
    }
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })))
  }

  const handleChangePlan = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan)
      setSelectedPlan(null)
    }
  }

  const handleUpgrade = () => {
    if (upgradePlanState) {
      console.log(`Upgrading to plan ${upgradePlanState.planId} for product ${upgradePlanState.productId}`);
      setUpgradePlan(null);
    }
  }

  return (
    <div className="space-y-6">
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
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>有効期限</Label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label>セキュリティコード</Label>
                      <Input placeholder="CVC" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>カード名義</Label>
                    <Input placeholder="TARO YAMADA" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddCardOpen(false)} className="bg-transparent">
                    キャンセル
                  </Button>
                  <Button onClick={handleAddCard} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    追加
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
                        <span className="font-medium text-sm capitalize">{pm.brand}</span>
                        <span className="text-sm text-muted-foreground">•••• {pm.last4}</span>
                        {pm.isDefault && (
                          <Badge variant="secondary" className="text-xs">デフォルト</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        有効期限: {pm.expMonth.toString().padStart(2, '0')}/{pm.expYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!pm.isDefault && (
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
                      disabled={pm.isDefault && paymentMethods.length > 1}
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
                      disabled={paymentMethods.length === 0 && plan.price > 0}
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
      {paymentMethods.length === 0 && (
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
            >
              削除
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
            >
              変更する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
