import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectContextValue {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>{children}</SelectContext.Provider>
  )
}

export function SelectTrigger({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext)
  if (!context) return null
  return (
    <button
      type="button"
      className={cn("flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-sm", className)}
      onClick={() => context.setOpen(!context.open)}
      {...props}
    />
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  return <span>{context?.value ?? placeholder}</span>
}

export function SelectContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SelectContext)
  if (!context?.open) return null
  return (
    <div className={cn("mt-1 rounded-md border border-border bg-card p-1 shadow-lg", className)} {...props}>
      {children}
    </div>
  )
}

export function SelectItem({ value, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(SelectContext)
  return (
    <div
      className={cn("cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-secondary", className)}
      onClick={() => {
        context?.onValueChange?.(value)
        context?.setOpen(false)
      }}
      {...props}
    >
      {children}
    </div>
  )
}
