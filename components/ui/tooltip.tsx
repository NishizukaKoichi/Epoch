import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>
}

export function TooltipTrigger({ asChild, ...props }: React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }) {
  const context = React.useContext(TooltipContext)
  if (!context) return null
  const handleEnter = () => context.setOpen(true)
  const handleLeave = () => context.setOpen(false)
  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      onMouseEnter: handleEnter,
      onMouseLeave: handleLeave,
    })
  }
  return (
    <span onMouseEnter={handleEnter} onMouseLeave={handleLeave} {...props}>
      {props.children}
    </span>
  )
}

export function TooltipContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(TooltipContext)
  if (!context?.open) return null
  return <div className={cn("mt-2 rounded-md border border-border bg-card px-2 py-1 text-xs", className)} {...props} />
}
