import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertDialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null)

export function AlertDialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen
  const setOpen = (value: boolean) => {
    onOpenChange?.(value)
    setInternalOpen(value)
  }

  return <AlertDialogContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>{children}</AlertDialogContext.Provider>
}

export function AlertDialogTrigger({ asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(AlertDialogContext)
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

export function AlertDialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(AlertDialogContext)
  if (!context?.open) return null
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/40", className)}>
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground" {...props} />
    </div>
  )
}

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />
}

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />
}

export function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />
}

export function AlertDialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function AlertDialogAction(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} />
}

export function AlertDialogCancel(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(AlertDialogContext)
  return <button type="button" onClick={() => context?.onOpenChange(false)} {...props} />
}
