import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

export function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen
  const setOpen = (value: boolean) => {
    onOpenChange?.(value)
    setInternalOpen(value)
  }

  return <DialogContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(DialogContext)
  if (!context) return null
  const handleClick = () => context.onOpenChange(true)
  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, { onClick: handleClick })
  }
  return (
    <button type="button" onClick={handleClick} {...props}>
      {props.children}
    </button>
  )
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DialogContext)
  if (!context?.open) return null
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/40", className)}>
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground" {...props} />
    </div>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}
