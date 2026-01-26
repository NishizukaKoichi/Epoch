"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Clock, Info } from "@/components/icons"

interface EpochSilenceSettingsProps {
  currentDays: number
  autoGenerate: boolean
  onSave: (days: number, autoGenerate: boolean) => void
}

export function EpochSilenceSettings({ currentDays = 7, autoGenerate = true, onSave }: EpochSilenceSettingsProps) {
  const [days, setDays] = useState(currentDays)
  const [enabled, setEnabled] = useState(autoGenerate)
  const [hasChanges, setHasChanges] = useState(false)

  const handleDaysChange = (value: number[]) => {
    setDays(value[0])
    setHasChanges(true)
  }

  const handleEnabledChange = (value: boolean) => {
    setEnabled(value)
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave(days, enabled)
    setHasChanges(false)
  }

  return (
    <div className="border border-border bg-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-5 w-5 text-foreground" />
        <div>
          <h3 className="text-base font-medium text-foreground">沈黙期間の自動記録</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            一定期間Recordがない場合、自動でperiod_of_silenceを生成します
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-silence" className="text-sm text-foreground">
            自動生成を有効にする
          </Label>
          <Switch id="auto-silence" checked={enabled} onCheckedChange={handleEnabledChange} />
        </div>

        {/* Days slider */}
        <div className={`space-y-4 ${!enabled ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground">沈黙期間の閾値</Label>
            <span className="text-sm font-mono text-foreground">{days}日</span>
          </div>
          <Slider value={[days]} onValueChange={handleDaysChange} min={1} max={30} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1日</span>
            <span>30日</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">{days}日</strong>以上Recordが作成されない場合、
              自動的にperiod_of_silence Recordが生成されます。
            </p>
            <p>
              この設定は「何も記録しなかった」という事実自体を記録するためのものです。
              沈黙も履歴の一部として保存されます。
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          設定を保存
        </Button>
      </div>
    </div>
  )
}
