"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, Check, ArrowRight, Shield } from "@/components/icons"

interface EpochRecordConfirmedProps {
  record: {
    id: string
    hash: string
    timestamp: string
    type: string
  }
  onContinue: () => void
}

export function EpochRecordConfirmed({ record, onContinue }: EpochRecordConfirmedProps) {
  const [copied, setCopied] = useState(false)
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(record.hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso)
    return (
      new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      }).format(date) + " UTC"
    )
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Success icon with animation */}
        <div className={`transition-transform duration-500 ${showAnimation ? "scale-110" : "scale-100"}`}>
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">記録が確定しました</h2>
          <p className="text-sm text-muted-foreground">このRecordは不可逆的にあなたのEpochに刻まれました</p>
        </div>

        {/* Record details */}
        <div className="border border-border bg-card p-6 text-left space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>不可逆記録</span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Record ID</span>
              <p className="font-mono text-xs text-foreground break-all mt-1">{record.id}</p>
            </div>

            <div>
              <span className="text-xs text-muted-foreground">タイムスタンプ</span>
              <p className="font-mono text-sm text-foreground mt-1">{formatTimestamp(record.timestamp)}</p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">record_hash</span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      コピー済
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      コピー
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-foreground break-all mt-1 p-2 bg-muted/30 border border-border">
                {record.hash}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          このハッシュ値は、Recordの内容・時刻・順序の整合性を検証するために使用されます。
          必要に応じて保存してください。
        </p>

        <Button onClick={onContinue} className="bg-foreground text-background hover:bg-foreground/90">
          タイムラインに戻る
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
