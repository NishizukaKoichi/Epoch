"use client"

import { Button } from "@/components/ui/button"
import { Check, Clock, Calendar, ArrowRight } from "@/components/icons"

interface EpochPlanComparisonProps {
  onSelectPlan: (plan: "time_window" | "read_session") => void
}

export function EpochPlanComparison({ onSelectPlan }: EpochPlanComparisonProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">閲覧プランを選択</h2>
        <p className="text-sm text-muted-foreground">用途に合わせて最適なプランをお選びください</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Time Window */}
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <Calendar className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Time Window</h3>
              <p className="text-xs text-muted-foreground">特定期間のRecordを閲覧</p>
            </div>
          </div>

          <div className="py-4 border-t border-b border-border">
            <div className="text-2xl font-semibold text-foreground">
              ¥500 <span className="text-sm font-normal text-muted-foreground">/ 月</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">指定した1ヶ月分のRecordを永続的に閲覧可能</p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">特定期間のRecordに永続アクセス</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">購入後の新規Recordは含まれない</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">採用・評価の参考に最適</span>
            </li>
          </ul>

          <div className="text-xs text-muted-foreground p-3 bg-muted/30 border border-border">
            <strong>適したユースケース:</strong> 候補者の過去の判断履歴を確認したい場合、
            特定のプロジェクト期間の記録を参照したい場合
          </div>

          <Button
            onClick={() => onSelectPlan("time_window")}
            className="w-full bg-foreground text-background hover:bg-foreground/90"
          >
            Time Windowを選択
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Read Session */}
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <Clock className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Read Session</h3>
              <p className="text-xs text-muted-foreground">時間制限付きで全Record閲覧</p>
            </div>
          </div>

          <div className="py-4 border-t border-b border-border">
            <div className="text-2xl font-semibold text-foreground">
              ¥1,000 <span className="text-sm font-normal text-muted-foreground">/ 24時間</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">24時間以内に全ての公開Recordを閲覧可能</p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">全期間のRecordにアクセス</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">24時間の時間制限あり</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">全体像を把握したい場合に最適</span>
            </li>
          </ul>

          <div className="text-xs text-muted-foreground p-3 bg-muted/30 border border-border">
            <strong>適したユースケース:</strong> 初めてその人のEpochを閲覧する場合、
            全体の判断パターンを短期間で把握したい場合
          </div>

          <Button
            onClick={() => onSelectPlan("read_session")}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-muted"
          >
            Read Sessionを選択
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        ※ Record単体での課金はサポートしていません。文脈を無視した閲覧を防ぐためです。
      </p>
    </div>
  )
}
