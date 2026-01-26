import * as React from "react"
import { cn } from "@/lib/utils"

export interface CalendarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  mode?: "single" | "range"
}

export function Calendar({ className, selected, onSelect, ...props }: CalendarProps) {
  const value = selected ? selected.toISOString().slice(0, 10) : ""
  return (
    <input
      type="date"
      className={cn("h-9 rounded-md border border-border bg-background px-2 text-sm", className)}
      value={value}
      onChange={(event) => {
        const next = event.target.value ? new Date(`${event.target.value}T00:00:00Z`) : undefined
        onSelect?.(next)
      }}
      {...props}
    />
  )
}
