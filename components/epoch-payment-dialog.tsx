"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "@/components/icons"
import { EpochPlanComparison } from "./epoch-plan-comparison"
import { useAuth } from "@/lib/auth/context"

interface EpochPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetUser: {
    displayName: string
    userId: string
  }
  onPaymentSuccess?: (grant: {
    type: "time_window" | "read_session"
    endsAt?: string
    windowEnd?: string
    windowStart?: string
    grantId: string
  }) => void
}

type PaymentOption = "time_window" | "read_session"

const paymentOptions: Record<PaymentOption, { label: string; price: string }> = {
  time_window: {
    label: "Time Window",
    price: "¥500",
  },
  read_session: {
    label: "Read Session",
    price: "¥1,000",
  },
}

export function EpochPaymentDialog({ open, onOpenChange, targetUser, onPaymentSuccess }: EpochPaymentDialogProps) {
  const { userId } = useAuth()
  const [selected, setSelected] = useState<PaymentOption | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectPlan = (plan: PaymentOption) => {
    setSelected(plan)
    setShowConfirmation(true)
  }

  const handlePayment = async () => {
    if (!selected) return

    setIsProcessing(true)
    setError(null)

    if (!userId) {
      setError("ログインが必要です")
      setIsProcessing(false)
      return
    }

    try {
      const response = await fetch("/api/billing/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          targetUserId: targetUser.userId,
          type: selected,
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "課金セッションの開始に失敗しました")
      }
      const data = (await response.json()) as {
        grant: {
          grantId: string
          type: PaymentOption
          endsAt?: string
          windowEnd?: string
          windowStart?: string
        }
      }
      setShowConfirmation(false)
      onOpenChange(false)
      if (data.grant) {
        onPaymentSuccess?.(data.grant)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "課金セッションの開始に失敗しました"
      setError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setShowConfirmation(false)
      setSelected(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">閲覧権限を取得</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {targetUser.displayName} のEpochを判断材料として読むには、閲覧権限が必要です。
          </DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="pt-4">
            <EpochPlanComparison onSelectPlan={handleSelectPlan} />
          </div>
        ) : (
          <div className="pt-4 space-y-4">
            <div className="p-4 border border-border bg-secondary/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">課金内容の確認</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selected && paymentOptions[selected].label}: {selected && paymentOptions[selected].price}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                この支払いは {targetUser.displayName} のEpoch閲覧権限に対するものです。
                閲覧期間中、対象者の公開・スカウト公開設定されたRecordをすべて閲覧できます。
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1 border-border">
                戻る
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
              >
                {isProcessing ? "処理中..." : "確定して支払う"}
              </Button>
            </div>

            {error && (
              <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
