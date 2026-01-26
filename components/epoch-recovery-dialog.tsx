"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Mail, CheckCircle2 } from "@/components/icons"

interface EpochRecoveryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EpochRecoveryDialog({ open, onOpenChange }: EpochRecoveryDialogProps) {
  const [step, setStep] = useState<"email" | "sent" | "complete">("email")
  const [email, setEmail] = useState("")

  const handleSendRecovery = () => {
    if (email) {
      setStep("sent")
    }
  }

  const handleComplete = () => {
    setStep("complete")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">アカウント復旧</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "email" && "登録済みのメールアドレスを入力してください"}
            {step === "sent" && "復旧リンクを送信しました"}
            {step === "complete" && "復旧が完了しました"}
          </DialogDescription>
        </DialogHeader>

        {step === "email" && (
          <div className="space-y-6">
            <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">重要な注意事項</p>
                  <p>復旧が行われた事実は、EpochRecordとして記録されます。</p>
                  <p className="mt-1">この記録は削除できません。</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-email" className="text-foreground">
                メールアドレス
              </Label>
              <Input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-background border-border text-foreground"
              />
            </div>

            <Button
              onClick={handleSendRecovery}
              disabled={!email}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              <Mail className="h-4 w-4 mr-2" />
              復旧リンクを送信
            </Button>
          </div>
        )}

        {step === "sent" && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">{email} に復旧リンクを送信しました。</p>
              <p className="text-sm text-muted-foreground mt-2">
                メール内のリンクをクリックして復旧を完了してください。
              </p>
            </div>

            <Button
              onClick={handleComplete}
              variant="outline"
              className="w-full border-border text-foreground bg-transparent"
            >
              復旧を完了（デモ）
            </Button>
          </div>
        )}

        {step === "complete" && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-sm text-foreground font-medium">アカウント復旧が完了しました</p>
              <p className="text-sm text-muted-foreground mt-2">auth_recovered レコードが記録されました。</p>
            </div>

            <div className="p-3 border border-border rounded-lg bg-muted/30 font-mono text-xs">
              <div className="text-muted-foreground">
                <span className="text-foreground">record_type:</span> auth_recovered
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground">recorded_at:</span> {new Date().toISOString()}
              </div>
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              閉じる
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
