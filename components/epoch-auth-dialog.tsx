"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Fingerprint, Mail } from "@/components/icons"
import { useI18n } from "@/lib/i18n/context"

interface EpochAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EpochAuthDialog({ open, onOpenChange }: EpochAuthDialogProps) {
  const [mode, setMode] = useState<"passkey" | "email">("passkey")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { t } = useI18n()

  const handlePasskeyAuth = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleEmailAuth = async () => {
    if (!email) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setEmailSent(true)
  }

  const resetState = () => {
    setMode("passkey")
    setEmail("")
    setEmailSent(false)
    setIsLoading(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetState()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("auth.title")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{t("auth.passkey_desc")}</DialogDescription>
        </DialogHeader>

        {mode === "passkey" && !emailSent && (
          <div className="space-y-4 pt-4">
            <Button
              onClick={handlePasskeyAuth}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              <Fingerprint className="h-5 w-5 mr-2" />
              {isLoading ? t("common.loading") : t("auth.passkey_button")}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {t("auth.recommended")} WebAuthn / Face ID / Touch ID
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">{t("auth.backup")}</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setMode("email")}
              className="w-full border-border text-foreground hover:bg-secondary"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t("auth.magiclink_label")}
            </Button>
          </div>
        )}

        {mode === "email" && !emailSent && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={t("auth.magiclink_label")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              onClick={handleEmailAuth}
              disabled={!email || isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? t("common.loading") : t("auth.magiclink_button")}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setMode("passkey")}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              {t("common.back")}
            </Button>
          </div>
        )}

        {emailSent && (
          <div className="space-y-4 pt-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Mail className="h-6 w-6 text-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground">{t("auth.magiclink_sent")}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setEmailSent(false)
                setEmail("")
              }}
              className="border-border text-foreground"
            >
              {t("auth.magiclink_button")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
