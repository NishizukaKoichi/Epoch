import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
type ButtonSize = "default" | "sm" | "lg" | "icon"

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-foreground text-background hover:bg-foreground/90",
  outline: "border border-border bg-transparent hover:bg-secondary",
  ghost: "bg-transparent hover:bg-secondary",
  secondary: "bg-secondary text-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "h-9 w-9",
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
)

Button.displayName = "Button"
