"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowRight, Shield, Clock, Eye, Ban, Database, FileX } from "@/components/icons"

interface EpochOnboardingProps {
  onComplete: () => void
}

const principles = [
  {
    icon: Ban,
    title: "評価の禁止",
    description: "Epochは記録するが、評価・要約・最適化提案は一切行わない。",
  },
  {
    icon: Shield,
    title: "不可逆性",
    description: "確定したEpochRecordは削除・改ざんできない。改訂は新規Recordとして追記される。",
  },
  {
    icon: Clock,
    title: "時間の正確性",
    description: "created_atはサーバー側UTCで記録。ユーザーによる時刻操作は不可能。",
  },
  {
    icon: Eye,
    title: "可視性の制御",
    description: "非公開・スカウト公開・公開の3段階。変更は追記Recordとして記録される。",
  },
  {
    icon: Database,
    title: "データの永続性",
    description: "サービス終了時も、全Recordは署名付きでエクスポート可能。",
  },
  {
    icon: FileX,
    title: "沈黙の記録",
    description: "何も記録しなかった期間も、period_of_silenceとして自動記録される。",
  },
]

export function EpochOnboarding({ onComplete }: EpochOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [acceptedPrinciples, setAcceptedPrinciples] = useState<boolean[]>(new Array(principles.length).fill(false))

  const handleAccept = (index: number, checked: boolean) => {
    const newAccepted = [...acceptedPrinciples]
    newAccepted[index] = checked
    setAcceptedPrinciples(newAccepted)
  }

  const allAccepted = acceptedPrinciples.every((p) => p)

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Epochへようこそ</h1>
            <p className="text-muted-foreground leading-relaxed">
              Epochは、あなたの判断と行動を不可逆的に記録するサービスです。
              評価や最適化は行いません。ただ、時間と事実を記録します。
            </p>
          </div>

          <div className="p-6 border border-border bg-card text-left space-y-4">
            <p className="text-sm text-foreground">
              始める前に、Epochの6つの原則を理解していただく必要があります。
              これらは単なる利用規約ではなく、Epochの存在理由そのものです。
            </p>
            <p className="text-xs text-muted-foreground">
              各原則を確認し、理解したことを示すチェックを入れてください。
            </p>
          </div>

          <Button onClick={() => setCurrentStep(1)} className="bg-foreground text-background hover:bg-foreground/90">
            原則を確認する
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Epochの6つの原則</h1>
          <p className="text-sm text-muted-foreground">各原則を確認し、理解したらチェックを入れてください</p>
        </div>

        <div className="space-y-4">
          {principles.map((principle, index) => {
            const Icon = principle.icon
            return (
              <div
                key={index}
                className={`border p-4 transition-colors ${
                  acceptedPrinciples[index] ? "border-foreground bg-card" : "border-border bg-card/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    id={`principle-${index}`}
                    checked={acceptedPrinciples[index]}
                    onCheckedChange={(checked) => handleAccept(index, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={`principle-${index}`} className="flex items-center gap-2 cursor-pointer">
                      <Icon className="h-4 w-4 text-foreground" />
                      <span className="font-medium text-foreground">{principle.title}</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 ml-6">{principle.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={onComplete}
            disabled={!allAccepted}
            className="bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
          >
            原則に同意して始める
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          {!allAccepted && <p className="text-xs text-muted-foreground">全ての原則にチェックを入れると続行できます</p>}
        </div>
      </div>
    </div>
  )
}
