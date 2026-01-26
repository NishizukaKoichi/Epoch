import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(({ className, pressed, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-pressed={pressed}
    className={cn("inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm", className)}
    {...props}
  />
))

Toggle.displayName = "Toggle"
