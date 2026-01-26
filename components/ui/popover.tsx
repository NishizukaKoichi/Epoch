import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>
}

export function PopoverTrigger({ asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(PopoverContext)
  if (!context) return null
  const handleClick = () => context.setOpen(!context.open)
  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, { onClick: handleClick })
  }
  return (
    <button type="button" onClick={handleClick} {...props}>
      {props.children}
    </button>
  )
}

export function PopoverContent({ className, align, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end" }) {
  const context = React.useContext(PopoverContext)
  if (!context?.open) return null
  return (
    <div className={cn("relative z-50 mt-2 rounded-md border border-border bg-card p-3 shadow-lg", className)} data-align={align} {...props} />
  )
}
