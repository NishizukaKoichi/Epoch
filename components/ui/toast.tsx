import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pointer-events-auto w-full max-w-sm rounded-md border border-border bg-card p-4 shadow", className)} {...props} />
))
Toast.displayName = "Toast"

export const ToastTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium", className)} {...props} />
  ),
)
ToastTitle.displayName = "ToastTitle"

export const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
ToastDescription.displayName = "ToastDescription"

export const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("text-sm font-medium underline-offset-4 hover:underline", className)} {...props} />
  ),
)
ToastAction.displayName = "ToastAction"

export type ToastActionElement = React.ReactElement<typeof ToastAction>

export const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("text-sm text-muted-foreground hover:text-foreground", className)} {...props} />
  ),
)
ToastClose.displayName = "ToastClose"

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fixed bottom-4 right-4 z-50 flex flex-col gap-2", className)} {...props} />
}
