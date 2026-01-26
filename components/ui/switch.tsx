import * as React from "react"
import { cn } from "@/lib/utils"

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  checked?: boolean
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <label className={cn("inline-flex items-center gap-2", className)}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="h-5 w-9 rounded-full border border-border bg-muted transition-colors peer-checked:bg-foreground" />
    </label>
  ),
)

Switch.displayName = "Switch"
